-- ============================================================================
-- نظام قاعدة بيانات المحادثات المتقدمة (Chato High-Performance Messaging Schema)
-- محرك قاعدة البيانات: PostgreSQL 14+
-- يشمل: الجداول، العلاقات، الفهارس الموجهة (Keyset Pagination)، الإجراءات التلقائية (Triggers)،
-- والعرض المسبق لصندوق الوارد (Inbox View).
-- ============================================================================

-- 0. تفعيل ملحقات UUID والتشفير
CREATE EXTENSION IF NOT EXISTS "citext";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. الأنواع المخصصة (ENUM Types)
-- ============================================================================
DO $$ BEGIN
    CREATE TYPE device_type_enum AS ENUM ('android', 'ios', 'web', 'desktop');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE chat_type_enum AS ENUM ('direct', 'group', 'broadcast');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE participant_role_enum AS ENUM ('owner', 'admin', 'member');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE message_type_enum AS ENUM (
        'text', 'image', 'video', 'audio', 'document', 
        'location', 'poll', 'sticker', 'contact', 'system'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE receipt_status_enum AS ENUM ('sent', 'delivered', 'read');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ============================================================================
-- 2. جداول الحسابات والأجهزة (users, user_devices)
-- ============================================================================

-- جدول المستخدمين الأساسي
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone_number VARCHAR(32) UNIQUE,
    email CITEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    username VARCHAR(50) UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    about VARCHAR(255) DEFAULT 'مرحباً! أنا أستخدم Chato',
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- جدول أجهزة المستخدمين (إشعارات الدفع FCM/APNs ومفاتيح التشفير الطرفي E2EE وجلسات الدخول التلقائي)
CREATE TABLE IF NOT EXISTS user_devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    device_id VARCHAR(128) NOT NULL,
    device_type device_type_enum NOT NULL,
    device_token TEXT,              -- رمز دفع الإشعارات (FCM / APNs)
    public_key TEXT,                -- المفتاح العام للتشفير الطرفي (E2EE Identity Key)
    refresh_token_hash TEXT,        -- تجديد الجلسة المشفر (Persistent Auto-login Session)
    expires_at TIMESTAMPTZ,         -- تاريخ انتهاء صلاحية الجلسة
    last_active_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_user_device UNIQUE (user_id, device_id)
);

-- جدول أكواد التحقق عبر الإيميل (OTP Codes)
CREATE TABLE IF NOT EXISTS email_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    email CITEXT NOT NULL,
    otp_hash TEXT NOT NULL,               -- الكود مشفر بـ SHA-256 أو bcrypt
    purpose VARCHAR(30) NOT NULL DEFAULT 'register', -- 'register' أو 'reset_password'
    attempts INT NOT NULL DEFAULT 0,      -- عدد المحاولات الخاطئة (الحد الأقصى 5)
    expires_at TIMESTAMPTZ NOT NULL,      -- ينتهي بعد 10 دقائق
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_email_verifications_user 
    ON email_verifications (user_id, purpose);

-- ============================================================================
-- 3. جهات الاتصال، المفضلة، والحظر (contacts)
-- ============================================================================
CREATE TABLE IF NOT EXISTS contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    contact_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    custom_name VARCHAR(100),       -- اسم مخصص يسجله المستخدم لجهة الاتصال
    is_favorite BOOLEAN DEFAULT FALSE,
    is_blocked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_user_contact UNIQUE (user_id, contact_user_id),
    CONSTRAINT chk_no_self_contact CHECK (user_id <> contact_user_id)
);

-- ============================================================================
-- 4. المحادثات والمشاركون (chats, chat_participants)
-- ============================================================================
CREATE TABLE IF NOT EXISTS chats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type chat_type_enum NOT NULL DEFAULT 'direct',
    title VARCHAR(150),             -- عنوان المجموعة أو قناة البث (فارغ في المحادثة الثنائية)
    avatar_url TEXT,
    description TEXT,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    last_message_id UUID,           -- يتم تحديثه تلقائياً بواسطة Trigger فور وصول رسالة
    disappearing_timer_seconds INT, -- مؤقت التدمير الذاتي للرسائل (مثلاً 86400 لـ 24 ساعة، NULL = معطل)
    last_activity_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chat_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role participant_role_enum NOT NULL DEFAULT 'member',
    custom_nickname VARCHAR(100),
    is_muted BOOLEAN DEFAULT FALSE,
    muted_until TIMESTAMPTZ,
    is_archived BOOLEAN DEFAULT FALSE,
    is_pinned BOOLEAN DEFAULT FALSE,
    pinned_at TIMESTAMPTZ,
    is_locked BOOLEAN NOT NULL DEFAULT FALSE, -- قفل المحادثة برمز سري PIN
    lock_pin_hash TEXT,                      -- رمز PIN مشفر بـ bcrypt / scrypt
    last_read_message_id UUID,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_chat_participant UNIQUE (chat_id, user_id)
);

-- ============================================================================
-- 5. الرسائل والمرفقات (messages, message_attachments)
-- ============================================================================
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES users(id) ON DELETE SET NULL,
    type message_type_enum NOT NULL DEFAULT 'text',
    content TEXT,                   -- نص الرسالة (المشفر بـ AES-256-GCM)
    is_encrypted BOOLEAN NOT NULL DEFAULT TRUE, -- حالة التشفير
    encryption_iv VARCHAR(64),        -- متجه التهيئة (12-byte IV)
    encryption_auth_tag VARCHAR(64),  -- رمز التحقق من عدم التلاعب (16-byte GCM Auth Tag)
    sender_public_key TEXT,           -- المفتاح العام للمرسل (لـ E2EE)
    expires_at TIMESTAMPTZ,           -- وقت الحذف التلقائي للرسالة ذاتية التدمير
    reply_to_message_id UUID REFERENCES messages(id) ON DELETE SET NULL,
    forwarded_from_message_id UUID REFERENCES messages(id) ON DELETE SET NULL,
    is_forwarded BOOLEAN DEFAULT FALSE,
    is_edited BOOLEAN DEFAULT FALSE,
    metadata JSONB DEFAULT '{}'::jsonb, -- معاينة روابط، إحداثيات الموقع {lat, lng}، بيانات الاستطلاع
    deleted_at TIMESTAMPTZ,         -- الحذف لدى الجميع (Soft Delete لجميع الأطراف)
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_expires_at 
    ON messages (expires_at) 
    WHERE expires_at IS NOT NULL;

-- إضافة المفتاح الأجنبي لـ last_message_id في جدول chats بعد إنشاء messages
DO $$ BEGIN
    ALTER TABLE chats ADD CONSTRAINT fk_chats_last_message 
    FOREIGN KEY (last_message_id) REFERENCES messages(id) ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- جدول المرفقات المتعددة للرسالة (صور، فيديوهات، ملفات، تسجيلات صوتية)
CREATE TABLE IF NOT EXISTS message_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    file_type VARCHAR(100),         -- MIME type (image/png, audio/ogg, video/mp4, application/pdf)
    file_name VARCHAR(255),
    file_size_bytes BIGINT,
    thumbnail_url TEXT,
    duration_seconds INT,           -- للصوتيات والفيديوهات
    width INT,                      -- أبعاد الصورة/الفيديو
    height INT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 6. حالات التسليم والمقروئية (message_receipts) - Blue Ticks
-- ============================================================================
CREATE TABLE IF NOT EXISTS message_receipts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status receipt_status_enum NOT NULL DEFAULT 'sent',
    delivered_at TIMESTAMPTZ,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_message_recipient UNIQUE (message_id, user_id)
);

-- ============================================================================
-- 7. التفاعلات بالإيموجي والخصوصية (message_reactions, deleted_messages_for_user)
-- ============================================================================

-- تفاعلات الإيموجي على الرسائل
CREATE TABLE IF NOT EXISTS message_reactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    emoji VARCHAR(16) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_message_user_reaction UNIQUE (message_id, user_id, emoji)
);

-- الحذف لدي فقط (Delete for Me)
CREATE TABLE IF NOT EXISTS deleted_messages_for_user (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    deleted_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_deleted_message_user UNIQUE (message_id, user_id)
);

-- ============================================================================
-- 8. فهارس الأداء العالي والترقيم الموجه (High Performance & Keyset Pagination)
-- ============================================================================

-- فهرس الترقيم الموجه (Keyset Pagination Index): يضمن جلب الرسائل بلحظات حتى مع ملايين السجلات
CREATE INDEX IF NOT EXISTS idx_messages_chat_keyset 
ON messages (chat_id, created_at DESC, id DESC);

-- فهرس GIN للبحث السريع داخل الحقول الديناميكية (JSONB Metadata)
CREATE INDEX IF NOT EXISTS idx_messages_metadata_gin 
ON messages USING gin (metadata);

-- فهارس حالات التسليم والقراءة لحساب العدادات غير المقروءة بسرعة فائقة
CREATE INDEX IF NOT EXISTS idx_receipts_user_unread 
ON message_receipts (user_id, status) WHERE status <> 'read';

CREATE INDEX IF NOT EXISTS idx_receipts_message 
ON message_receipts (message_id, status);

-- فهرس المشاركين لترتيب المحادثات حسب التثبيت والأرشفة
CREATE INDEX IF NOT EXISTS idx_chat_participants_user_inbox 
ON chat_participants (user_id, is_pinned DESC, is_archived, chat_id);

-- فهارس جهات الاتصال المفضلة والمحظورة
CREATE INDEX IF NOT EXISTS idx_contacts_user_fav 
ON contacts (user_id) WHERE is_favorite = TRUE;

CREATE INDEX IF NOT EXISTS idx_contacts_user_blocked 
ON contacts (user_id) WHERE is_blocked = TRUE;

-- فهرس أجهزة المستخدمين للوصول الفوري لرموز الإشعارات
CREATE INDEX IF NOT EXISTS idx_user_devices_token 
ON user_devices (user_id, device_token);

-- ============================================================================
-- 9. الإجراءات التلقائية لتحديث نشاط المحادثات (Triggers)
-- ============================================================================

-- دالة لتحديث آخر رسالة وتاريخ النشاط في جدول المحادثات آلياً
CREATE OR REPLACE FUNCTION fn_update_chat_last_message()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE chats
    SET 
        last_message_id = NEW.id,
        last_activity_at = NEW.created_at,
        updated_at = NOW()
    WHERE id = NEW.chat_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_chat_last_message ON messages;
CREATE TRIGGER trg_update_chat_last_message
AFTER INSERT ON messages
FOR EACH ROW
EXECUTE FUNCTION fn_update_chat_last_message();

-- دالة عامة لتحديث حقل updated_at عند تعديل أي سجل
CREATE OR REPLACE FUNCTION fn_touch_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_touch_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION fn_touch_updated_at();
CREATE TRIGGER trg_chats_touch_updated_at BEFORE UPDATE ON chats FOR EACH ROW EXECUTE FUNCTION fn_touch_updated_at();
CREATE TRIGGER trg_messages_touch_updated_at BEFORE UPDATE ON messages FOR EACH ROW EXECUTE FUNCTION fn_touch_updated_at();

-- ============================================================================
-- 10. واجهة عرض صندوق الوارد المسبقة (view_user_inbox)
-- ============================================================================
CREATE OR REPLACE VIEW view_user_inbox AS
SELECT 
    cp.user_id,
    c.id AS chat_id,
    c.type AS chat_type,
    -- تحديد اسم المحادثة (اسم المجموعة أو اسم الطرف الآخر في المحادثة الثنائية)
    CASE 
        WHEN c.type = 'direct' THEN COALESCE(ct.custom_name, u_other.display_name, u_other.phone_number)
        ELSE c.title 
    END AS chat_title,
    -- صورة المحادثة
    CASE 
        WHEN c.type = 'direct' THEN u_other.avatar_url
        ELSE c.avatar_url 
    END AS chat_avatar,
    -- إعدادات المستخدم الخاصة بالمحادثة
    cp.is_pinned,
    cp.pinned_at,
    cp.is_archived,
    cp.is_muted,
    cp.muted_until,
    -- تفاصيل آخر رسالة
    m.id AS last_message_id,
    m.type AS last_message_type,
    CASE 
        WHEN m.deleted_at IS NOT NULL THEN 'تم حذف هذه الرسالة'
        WHEN m.type = 'text' THEN m.content
        WHEN m.type = 'image' THEN '📷 صورة'
        WHEN m.type = 'video' THEN '🎥 فيديو'
        WHEN m.type = 'audio' THEN '🎙️ تسجيل صوتي'
        WHEN m.type = 'document' THEN '📄 مستند'
        WHEN m.type = 'location' THEN '📍 موقع مباشر'
        WHEN m.type = 'poll' THEN '📊 استطلاع رأي'
        WHEN m.type = 'sticker' THEN '🎭 ملصق'
        ELSE 'رسالة'
    END AS last_message_preview,
    m.sender_id AS last_message_sender_id,
    u_sender.display_name AS last_message_sender_name,
    c.last_activity_at,
    -- حساب عدد الرسائل غير المقروءة بدقة
    COUNT(mr.id) FILTER (
        WHERE mr.user_id = cp.user_id 
          AND mr.status <> 'read' 
          AND dm.id IS NULL
    ) AS unread_count
FROM chat_participants cp
JOIN chats c ON c.id = cp.chat_id
LEFT JOIN messages m ON m.id = c.last_message_id
LEFT JOIN users u_sender ON u_sender.id = m.sender_id
-- للدردشة الثنائية: استخراج الطرف الآخر
LEFT JOIN chat_participants cp_other ON (c.type = 'direct' AND cp_other.chat_id = c.id AND cp_other.user_id <> cp.user_id)
LEFT JOIN users u_other ON u_other.id = cp_other.user_id
LEFT JOIN contacts ct ON (ct.user_id = cp.user_id AND ct.contact_user_id = cp_other.user_id)
-- حساب الإيصالات غير المقروءة مع استبعاد الرسائل المحذوفة لدى المستخدم
LEFT JOIN messages m_all ON m_all.chat_id = c.id AND m_all.deleted_at IS NULL
LEFT JOIN message_receipts mr ON mr.message_id = m_all.id AND mr.user_id = cp.user_id
LEFT JOIN deleted_messages_for_user dm ON dm.message_id = m_all.id AND dm.user_id = cp.user_id
GROUP BY 
    cp.user_id, c.id, c.type, c.title, c.avatar_url, 
    u_other.display_name, u_other.phone_number, u_other.avatar_url, ct.custom_name,
    cp.is_pinned, cp.pinned_at, cp.is_archived, cp.is_muted, cp.muted_until,
    m.id, m.type, m.content, m.deleted_at, m.sender_id, u_sender.display_name, c.last_activity_at;

-- ============================================================================
-- تعديلات قاعدة البيانات لتحديث الجداول الحالية (Migrations)
-- ============================================================================

-- 1. تحديث جدول المستخدمين لدعم الباسورد المشفر وجعل رقم الهاتف اختيارياً
ALTER TABLE users 
    ALTER COLUMN phone_number DROP NOT NULL,
    ALTER COLUMN email SET NOT NULL,
    ADD COLUMN IF NOT EXISTS password_hash TEXT NOT NULL;

-- 2. تحديث جدول الأجهزة لحفظ جلسة الدخول التلقائي (Refresh Token)
ALTER TABLE user_devices 
    ADD COLUMN IF NOT EXISTS refresh_token_hash TEXT,
    ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;

-- 3. جدول أكواد التحقق عبر الإيميل (OTP Codes)
CREATE TABLE IF NOT EXISTS email_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    email CITEXT NOT NULL,
    otp_hash TEXT NOT NULL,               -- الكود مشفر بـ SHA-256 أو bcrypt
    purpose VARCHAR(30) NOT NULL DEFAULT 'register', -- 'register' أو 'reset_password'
    attempts INT NOT NULL DEFAULT 0,      -- عدد المحاولات الخاطئة (الحد الأقصى 5)
    expires_at TIMESTAMPTZ NOT NULL,      -- ينتهي بعد 10 دقائق
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_email_verifications_user 
    ON email_verifications (user_id, purpose);

-- ============================================================================
-- 4. ترقيات الأمان والتشفير وقفل المحادثات (Chat Encryption & Privacy Migrations)
-- ============================================================================

-- 4.1 تحديث جدول الرسائل لدعم التشفير والرسائل ذاتية الحذف
ALTER TABLE messages
    ADD COLUMN IF NOT EXISTS is_encrypted BOOLEAN NOT NULL DEFAULT TRUE,
    ADD COLUMN IF NOT EXISTS encryption_iv VARCHAR(64),        -- متجه التهيئة (12-byte IV)
    ADD COLUMN IF NOT EXISTS encryption_auth_tag VARCHAR(64),  -- رمز التحقق من عدم التلاعب (16-byte GCM Auth Tag)
    ADD COLUMN IF NOT EXISTS sender_public_key TEXT,           -- المفتاح العام للمرسل (لـ E2EE)
    ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;           -- وقت الحذف التلقائي للرسالة

CREATE INDEX IF NOT EXISTS idx_messages_expires_at 
    ON messages (expires_at) 
    WHERE expires_at IS NOT NULL;

-- 4.2 تحديث جدول المحادثات لدعم مؤقت الحذف التلقائي
ALTER TABLE chats
    ADD COLUMN IF NOT EXISTS disappearing_timer_seconds INT;   -- مثلاً 86400 لـ 24 ساعة (NULL = معطل)

-- 4.3 تحديث جدول المشاركين لدعم قفل المحادثة برمز PIN
ALTER TABLE chat_participants
    ADD COLUMN IF NOT EXISTS is_locked BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS lock_pin_hash TEXT;               -- رمز PIN مشفر بـ bcrypt

-- ============================================================================
-- 5. جدول اشتراكات المستخدمين وحصص الذكاء الاصطناعي (Subscriptions & Daily Quotas)
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_code VARCHAR(50) NOT NULL DEFAULT 'chato_ai_plus', -- 'free' أو 'chato_ai_plus'
    plan_title VARCHAR(100) NOT NULL DEFAULT 'بلاس AI شاتو',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    
    -- الحدود اليومية وحالة الاستهلاك (تتجدد تلقائياً كل 24 ساعة)
    daily_words_limit INT NOT NULL DEFAULT 500,
    daily_words_used INT NOT NULL DEFAULT 0,
    daily_ai_images_limit INT NOT NULL DEFAULT 20,
    daily_ai_images_used INT NOT NULL DEFAULT 0,
    unlimited_media_sending BOOLEAN NOT NULL DEFAULT TRUE,
    last_quota_reset_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    next_quota_reset_at TIMESTAMPTZ NOT NULL DEFAULT (CURRENT_TIMESTAMP + INTERVAL '24 hours'),
    
    -- صلاحية الاشتراك (60 يوماً / شهرين كاملين)
    started_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (CURRENT_TIMESTAMP + INTERVAL '60 days'),
    auto_renew BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS idx_user_subscriptions_expires 
    ON user_subscriptions (expires_at, is_active);

-- ============================================================================
-- 10. جدول الحالات والاستوري ومشاهداتها لمدة 24 ساعة (User Stories & Views)
-- ============================================================================

-- 1. جدول الحالات / الاستوري (User Stories - 24 Hours)
CREATE TABLE IF NOT EXISTS user_stories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    media_type VARCHAR(20) NOT NULL CHECK (media_type IN ('image', 'video')),
    media_url TEXT NOT NULL,               -- رابط الصورة أو الفيديو
    thumbnail_url TEXT,                    -- صورة مصغرة للفيديو
    caption VARCHAR(500),                  -- نص اختياري أسفل الصورة/الفيديو
    duration_seconds INT NOT NULL DEFAULT 5, -- مدة العرض (5 ثوانٍ للصور أو مدة الفيديو)
    views_count INT NOT NULL DEFAULT 0,    -- عداد المشاهدات السريع
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (CURRENT_TIMESTAMP + INTERVAL '24 hours')
);

-- فهرس لجلب الحالات النشطة (أقل من 24 ساعة) بسرعة فائقة
CREATE INDEX IF NOT EXISTS idx_user_stories_active 
    ON user_stories (expires_at DESC, user_id);

-- 2. جدول مشاهدات الاستوري (Story Views Tracking)
CREATE TABLE IF NOT EXISTS story_views (
    story_id UUID NOT NULL REFERENCES user_stories(id) ON DELETE CASCADE,
    viewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    viewed_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (story_id, viewer_id)
);

CREATE INDEX IF NOT EXISTS idx_story_views_story 
    ON story_views (story_id, viewed_at DESC);

-- ============================================================================
-- 11. مميزات الدردشة الحصرية لـ بلاس AI شاتو والدخول السريع بالباركود QR
-- ============================================================================

-- 1. تحديث جدول المستخدمين لدعم رمز الدخول بالباركود (QR Login Secret)
ALTER TABLE users
    ADD COLUMN IF NOT EXISTS qr_login_token_hash TEXT UNIQUE,
    ADD COLUMN IF NOT EXISTS qr_token_generated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;

-- 2. تحديث جدول المشاركين في المحادثات لحفظ خلفية الدردشة المخصصة (حصري لبلاس)
ALTER TABLE chat_participants
    ADD COLUMN IF NOT EXISTS custom_wallpaper_url TEXT,
    ADD COLUMN IF NOT EXISTS custom_theme_code VARCHAR(50);

-- 3. جدول الرسائل المثبتة داخل المحادثات (Pinned Messages)
CREATE TABLE IF NOT EXISTS pinned_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
    message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    pinned_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    pinned_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(chat_id, message_id)
);

CREATE INDEX IF NOT EXISTS idx_pinned_messages_chat 
    ON pinned_messages (chat_id, pinned_at DESC);

-- 4. جدول الرموز المتحركة والنادرة الحصرية لـ بلاس (Rare & Animated Emojis)
CREATE TABLE IF NOT EXISTS exclusive_emojis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,          -- مثلاً ':fire_diamond:'
    title VARCHAR(100) NOT NULL,
    asset_url TEXT NOT NULL,                   -- رابط الرمز المتحرك (WebP/Lottie/GIF)
    rarity VARCHAR(20) NOT NULL DEFAULT 'rare', -- 'rare', 'epic', 'legendary'
    is_plus_only BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 5. حفظ الترجمات الفورية للرسائل لتسريع العرض (Message Translations Cache)
ALTER TABLE messages
    ADD COLUMN IF NOT EXISTS translations JSONB DEFAULT '{}'::jsonb; -- مثال: {"ar": "مرحباً", "en": "Hello"}

-- ============================================================================
-- نهاية مخطط قاعدة البيانات (End of Schema)
-- ============================================================================
