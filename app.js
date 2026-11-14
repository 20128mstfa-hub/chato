const STORAGE_KEY = "chato-local-v1";
const LANG_STORAGE_KEY = "chato_lang";

// Friendly alert wrapper for network errors
if (typeof window !== "undefined") {
  const _origAlert = window.alert;
  window.alert = function (msg) {
    if (typeof msg === "string" && (msg.includes("Failed to fetch") || msg.includes("NetworkError") || msg.includes("Load failed") || msg.includes("Network request failed"))) {
      return _origAlert("تعذر الاتصال بالخادم، يرجى التأكد من تشغيل السيرفر أو الاتصال بالإنترنت 📶");
    }
    return _origAlert(msg);
  };
}

const i18n = {
  ar: {
    langBadge: "ع",
    langTitle: "تغيير اللغة إلى الإنجليزية (Switch to English)",
    loginTitle: "أهلاً بك",
    loginTagline: "دردشاتك، مجموعاتك، وأصحابك في مكان واحد.",
    loginHeading: "تسجيل الدخول / إنشاء حساب",
    loginSubheading: "ابدأ باسمك وبريدك الإلكتروني وكلمة المرور.",
    tabSignIn: "تسجيل الدخول",
    tabSignUp: "إنشاء حساب",
    signInHeading: "مرحباً بعودتك",
    signInSubheading: "أدخل بريدك الإلكتروني والرقم السري للدخول.",
    signUpHeading: "إنشاء حساب جديد",
    signUpSubheading: "سجل بياناتك الشخصية ووثق بريدك الإلكتروني.",
    sendCodeBtn: "إرسال الكود",
    sendingCode: "جاري الإرسال...",
    codeSentSuccess: "تم إرسال كود التوثيق إلى بريدك من 2012.8.MSTFA@GMAIL.COM",
    verificationCodeLabel: "كود توثيق الإيميل (المُرسل من 2012.8.MSTFA@GMAIL.COM)",
    codePlaceholder: "أدخل كود الـ 6 أرقام",
    loginPasswordPlaceholder: "أدخل الرقم السري",
    confirmPasswordLabel: "تأكيد الرقم السري",
    confirmPasswordPlaceholder: "أعد إدخال الرقم السري",
    signUpSubmitBtn: "تأكيد وإنشاء الحساب",
    codeRequired: "يرجى كتابة كود التوثيق المكون من 6 أرقام المُرسل من 2012.8.MSTFA@GMAIL.COM",
    enterPasswordRequired: "يرجى إدخال الرقم السري",
    avatarOptional: "صورة شخصية اختيارية",
    nameLabel: "الاسم",
    namePlaceholder: "مثال: أحمد",
    emailLabel: "البريد الإلكتروني",
    emailPlaceholder: "name@email.com",
    passwordLabel: "كلمة المرور",
    passwordPlaceholder: "8+ أحرف وبها حرف كبير وصغير",
    passwordRuleHint: "8 أحرف على الأقل، تتضمن حرفاً كبيراً (A-Z) وحرفاً صغيراً (a-z)",
    enterBtn: "دخول",
    onlineNow: "متصل الآن",
    createGroup: "إنشاء مجموعة",
    support: "دعم فني",
    addFriends: "إضافة أصدقاء",
    profile: "الملف الشخصي",
    settings: "الإعدادات",
    conversationsHeading: "المحادثات",
    readyToChat: "جاهز للدردشة",
    deleteFriend: "حذف الصديق",
    searchInChat: "بحث داخل المحادثة",
    voiceCall: "مكالمة صوتية",
    videoCall: "مكالمة فيديو",
    searchMessagesPlaceholder: "ابحث في الرسائل",
    closeSearch: "إغلاق البحث",
    typeMessagePlaceholder: "اكتب رسالة",
    typeSupportPlaceholder: "اكتب لفريق الدعم",
    emptyChat: "ابدأ المحادثة برسالة، صورة أو فويس.",
    supportName: "الدعم الفني",
    supportMeta: "فريق دعم Chato",
    createGroupHeading: "إنشاء مجموعة",
    groupNameLabel: "اسم الجروب",
    groupNamePlaceholder: "مثال: صحاب المدرسة",
    groupMembersLabel: "الأشخاص",
    groupMembersPlaceholder: "اكتب الأسماء وبينهم فاصلة",
    createBtn: "إنشاء",
    addFriendsHeading: "إضافة أصدقاء",
    friendSearchLabel: "اسم أو بريد الشخص",
    friendSearchPlaceholder: "مثال: منة أو menna@email.com",
    searching: "جاري البحث...",
    noUserFound: "لا يوجد حساب مسجّل بهذا الاسم أو البريد.",
    added: "مضاف",
    add: "إضافة",
    profileHeading: "الملف الشخصي",
    emailFixedNote: "البريد مُثبت ولا يمكن تغييره من الملف الشخصي.",
    passwordTitle: "كلمة المرور",
    changePwBtn: "تغيير كلمة المرور",
    hidePwBtn: "إلغاء التغيير",
    verifyCurrentPwNote: "أدخل كلمة المرور الحالية أولاً لتتمكن من تعيين كلمة مرور جديدة:",
    currentPwLabel: "كلمة المرور الحالية",
    currentPwPlaceholder: "كلمة المرور الحالية",
    newPwLabel: "كلمة المرور الجديدة",
    newPwPlaceholder: "8+ أحرف وبها حرف كبير وصغير",
    confirmNewPwLabel: "تأكيد كلمة المرور الجديدة",
    confirmNewPwPlaceholder: "أعد إدخال كلمة المرور الجديدة",
    saveChangesBtn: "حفظ التغييرات",
    activeAccountBadge: "نشط حالياً",
    savedAccountsTitle: "الحسابات المسجلة على هذا الجهاز",
    addNewAccountBtn: "+ إضافة حساب جديد",
    logoutAction: "تسجيل الخروج",
    notificationsHeading: "الإشعارات",
    noNotifications: "لا توجد إشعارات جديدة.",
    addedYou: "أضافك",
    callHeading: "مكالمة",
    callingStatus: "جاري الاتصال...",
    connectedStatus: "متصل",
    muteStatus: "تم كتم الصوت",
    unmuteStatus: "متصل",
    muteCall: "كتم الصوت",
    endCall: "إنهاء المكالمة",
    sendVoice: "تسجيل صوت",
    sendImage: "إرسال صورة",
    addEmoji: "إضافة إيموجي",
    sendBtn: "إرسال",
    editMsg: "تعديل",
    edited: "تم التعديل",
    pin: "تثبيت",
    unpin: "إلغاء التثبيت",
    pinned: "مثبت",
    deleteMsg: "حذف",
    imageSent: "صورة",
    voiceSent: "رسالة صوتية",
    sendLocation: "إرسال موقع",
    createPoll: "استطلاع رأي",
    stickers: "استيكرات",
    createPollHeading: "إنشاء استطلاع رأي 📊",
    pollQuestionLabel: "سؤال الاستطلاع",
    pollOptionsLabel: "خيارات الاستطلاع",
    publishPoll: "نشر الاستطلاع",
    stickersHeading: "ملصقات واستيكرات Chato 🎭",
    friendRequestSent: "أرسل لك طلب صداقة 🤝",
    accept: "قبول",
    reject: "رفض",
    requestSentBadge: "طلب معلق ⏳",
    addedBadge: "مضاف ✓",
    confirmDeleteFriend: "هل أنت متأكد من حذف هذا الصديق نهائياً؟",
    confirmDeleteMsg: "هل أنت متأكد من حذف هذه الرسالة نهائياً؟",
    noFriendsForGroup: "لا يوجد لديك أصدقاء بعد. أضف أصدقاء أولاً لتتمكن من ضمهم للمجموعة.",
    selectFriendsForGroup: "يرجى اختيار صديق واحد على الأقل للمجموعة",
    locationShared: "موقع مباشر 📍",
    openGoogleMaps: "📍 فتح في Google Maps",
    votesCount: "صوت",
    typingNow: "يكتب الآن...",
    validEmailRequired: "اكتب بريد إلكتروني صحيح",
    validNameRequired: "اكتب اسماً بدون أرقام",
    passwordInvalidError: "كلمة المرور يجب أن تكون 8 أحرف على الأقل وتحتوي على حرف كبير (A-Z) وحرف صغير (a-z)",
    passwordsDoNotMatch: "كلمتا المرور غير متطابقتين",
    currentPasswordIncorrect: "كلمة المرور الحالية غير صحيحة",
    currentPasswordRequired: "يرجى كتابة كلمة المرور الحالية أولاً لتغييرها",
    profileUpdatedSuccess: "تم حفظ التعديلات بنجاح!",
    serverOfflineError: "Chato غير متصل الآن. تأكد من تشغيل الخادم.",
    recordNotSupported: "التسجيل غير مدعوم هنا.",
    micPermissionError: "نحتاج إذن الميكروفون للتسجيل.",
    recordingVoice: "جاري التسجيل... اضغط مرة ثانية للإرسال",
    voiceSentSuccess: "تم إرسال الرسالة الصوتية",
    confirmLogout: "هل أنت متأكد من تسجيل الخروج؟",
    switchAccount: "التبديل إلى هذا الحساب",
    removeAccount: "إزالة من هذا الجهاز",
    confirmRemoveAccount: "هل تريد إزالة هذا الحساب من قائمة التبديل السريع على هذا الجهاز؟"
  },
  en: {
    langBadge: "E",
    langTitle: "Switch Language to Arabic (التبديل إلى العربية)",
    loginTitle: "Welcome",
    loginTagline: "Your chats, groups, and friends all in one place.",
    loginHeading: "Sign In / Sign Up",
    loginSubheading: "Start with your name, email, and password.",
    tabSignIn: "Sign In",
    tabSignUp: "Create Account",
    signInHeading: "Welcome Back",
    signInSubheading: "Enter your email and password to log in.",
    signUpHeading: "Create New Account",
    signUpSubheading: "Enter your details and verify your email.",
    sendCodeBtn: "Send Code",
    sendingCode: "Sending...",
    codeSentSuccess: "Verification code sent to your email from 2012.8.MSTFA@GMAIL.COM",
    verificationCodeLabel: "Email Verification Code (sent from 2012.8.MSTFA@GMAIL.COM)",
    codePlaceholder: "Enter 6-digit code",
    loginPasswordPlaceholder: "Enter password",
    confirmPasswordLabel: "Confirm Password",
    confirmPasswordPlaceholder: "Re-enter password",
    signUpSubmitBtn: "Confirm & Create Account",
    codeRequired: "Please enter the 6-digit verification code sent from 2012.8.MSTFA@GMAIL.COM",
    enterPasswordRequired: "Please enter your password",
    avatarOptional: "Optional profile picture",
    nameLabel: "Name",
    namePlaceholder: "e.g. Alex",
    emailLabel: "Email",
    emailPlaceholder: "name@email.com",
    passwordLabel: "Password",
    passwordPlaceholder: "8+ chars with uppercase & lowercase",
    passwordRuleHint: "At least 8 characters, with at least one uppercase (A-Z) and one lowercase (a-z)",
    enterBtn: "Login / Enter",
    onlineNow: "Online now",
    createGroup: "Create Group",
    support: "Tech Support",
    addFriends: "Add Friends",
    profile: "Profile",
    settings: "Settings",
    conversationsHeading: "Conversations",
    readyToChat: "Ready to chat",
    deleteFriend: "Remove Friend",
    searchInChat: "Search in chat",
    voiceCall: "Voice Call",
    videoCall: "Video Call",
    searchMessagesPlaceholder: "Search in messages",
    closeSearch: "Close search",
    typeMessagePlaceholder: "Type a message",
    typeSupportPlaceholder: "Message the support team",
    emptyChat: "Start the conversation with a message, photo, or voice note.",
    supportName: "Technical Support",
    supportMeta: "Chato Support Team",
    createGroupHeading: "Create Group",
    groupNameLabel: "Group Name",
    groupNamePlaceholder: "e.g. School Friends",
    groupMembersLabel: "Members",
    groupMembersPlaceholder: "Enter names separated by commas",
    createBtn: "Create",
    addFriendsHeading: "Add Friends",
    friendSearchLabel: "Name or email",
    friendSearchPlaceholder: "e.g. Alex or alex@email.com",
    searching: "Searching...",
    noUserFound: "No account registered with this name or email.",
    added: "Added",
    add: "Add",
    profileHeading: "Profile",
    emailFixedNote: "Email is fixed and cannot be changed.",
    passwordTitle: "Password",
    changePwBtn: "Change Password",
    hidePwBtn: "Cancel Change",
    verifyCurrentPwNote: "Enter current password first to set a new password:",
    currentPwLabel: "Current Password",
    currentPwPlaceholder: "Current password",
    newPwLabel: "New Password",
    newPwPlaceholder: "8+ chars with uppercase & lowercase",
    confirmNewPwLabel: "Confirm New Password",
    confirmNewPwPlaceholder: "Re-enter new password",
    saveChangesBtn: "Save Changes",
    activeAccountBadge: "Active Now",
    savedAccountsTitle: "Registered Accounts on this Device",
    addNewAccountBtn: "+ Add New Account",
    logoutAction: "Logout",
    notificationsHeading: "Notifications",
    noNotifications: "No new notifications.",
    addedYou: "added you",
    callHeading: "Call",
    callingStatus: "Calling...",
    connectedStatus: "Connected",
    muteStatus: "Muted",
    unmuteStatus: "Connected",
    muteCall: "Mute",
    endCall: "End Call",
    sendVoice: "Voice Note",
    sendImage: "Send Image",
    addEmoji: "Add Emoji",
    sendBtn: "Send",
    editMsg: "Edit",
    edited: "Edited",
    pin: "Pin",
    unpin: "Unpin",
    pinned: "Pinned",
    deleteMsg: "Delete",
    imageSent: "Photo",
    voiceSent: "Voice note",
    sendLocation: "Send Location",
    createPoll: "Create Poll",
    stickers: "Stickers",
    createPollHeading: "Create Poll 📊",
    pollQuestionLabel: "Poll Question",
    pollOptionsLabel: "Options",
    publishPoll: "Publish Poll",
    stickersHeading: "Chato Stickers 🎭",
    friendRequestSent: "sent you a friend request 🤝",
    accept: "Accept",
    reject: "Reject",
    requestSentBadge: "Pending ⏳",
    addedBadge: "Added ✓",
    confirmDeleteFriend: "Are you sure you want to remove this friend?",
    confirmDeleteMsg: "Delete this message permanently?",
    noFriendsForGroup: "No friends yet. Add friends first to include them in the group.",
    selectFriendsForGroup: "Please select at least one friend for the group",
    locationShared: "Location 📍",
    openGoogleMaps: "📍 Open in Google Maps",
    votesCount: "votes",
    typingNow: "Typing...",
    validEmailRequired: "Please enter a valid email address",
    validNameRequired: "Please enter a name without numbers",
    passwordInvalidError: "Password must be at least 8 characters with both uppercase (A-Z) and lowercase (a-z)",
    passwordsDoNotMatch: "Passwords do not match",
    currentPasswordIncorrect: "Current password is incorrect",
    currentPasswordRequired: "Please enter your current password first to change it",
    profileUpdatedSuccess: "Profile updated successfully!",
    serverOfflineError: "Chato server is not connected. Please make sure the server is running.",
    recordNotSupported: "Audio recording is not supported here.",
    micPermissionError: "Microphone permission is required to record.",
    recordingVoice: "Recording... Click again to send",
    voiceSentSuccess: "Voice message sent",
    confirmLogout: "Are you sure you want to log out?",
    switchAccount: "Switch to this account",
    removeAccount: "Remove from device",
    confirmRemoveAccount: "Do you want to remove this account from this device's quick switch list?"
  }
};

let currentLang = localStorage.getItem(LANG_STORAGE_KEY) || "ar";

function t(key) {
  return (i18n[currentLang] && i18n[currentLang][key]) || (i18n.ar && i18n.ar[key]) || key;
}

const emptyState = {
  currentUser: null,
  friends: [],
  groups: [],
  conversations: {},
  activeChatId: "support",
  directory: [],
  savedAccounts: [],
  chatSettings: {},
  chatTimers: {}
};

const state = loadState();
ensureDirectory();

const el = (id) => {
  if (!id) return null;
  let elem = document.getElementById(id);
  if (!elem && id.includes("-")) {
    const camel = id.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    elem = document.getElementById(camel);
  } else if (!elem && /[A-Z]/.test(id)) {
    const kebab = id.replace(/([A-Z])/g, "-$1").toLowerCase();
    elem = document.getElementById(kebab);
  }
  return elem;
};

// Elements
const langToggleBtn = el("langToggleBtn");
const loginScreen = el("loginScreen");
const appScreen = el("appScreen");

// Auth Tabs & Forms
const tabSignInBtn = el("tabSignInBtn");
const tabSignUpBtn = el("tabSignUpBtn");
const signInForm = el("signInForm");
const signUpForm = el("signUpForm");

// 1. تسجيل الدخول
const loginEmailInput = el("loginEmailInput");
const loginPasswordInput = el("loginPasswordInput");
const loginError = el("loginError");
const signInSubmitBtn = el("signInSubmitBtn");

// 2. إنشاء حساب جديد
const regImageInput = el("regImageInput");
const regImagePreview = el("regImagePreview");
const regNameInput = el("regNameInput");
const regEmailInput = el("regEmailInput");
const sendVerificationCodeBtn = el("sendVerificationCodeBtn");
const regVerificationCodeInput = el("regVerificationCodeInput");
const codeSentStatus = el("codeSentStatus");
const regPasswordInput = el("regPasswordInput");
const regConfirmPasswordInput = el("regConfirmPasswordInput");
const registerError = el("registerError");
const signUpSubmitBtn = el("signUpSubmitBtn");

const userTitle = el("userTitle");
const conversationList = el("conversationList");
const conversationCount = el("conversationCount");
const chatAvatar = el("chatAvatar");
const chatName = el("chatName");
const chatMeta = el("chatMeta");
const messages = el("messages");
const messageInput = el("messageInput");
const emojiTray = el("emojiTray");
const recorderStatus = el("recorderStatus");
const deleteFriendButton = el("deleteFriendButton");
const imageInput = el("imageInput");
const voiceButton = el("voiceButton");

// Attachments, Polls & Stickers
const attachButton = el("attachButton");
const attachMenu = el("attachMenu");
const attachLocationBtn = el("attachLocationBtn");
const attachPollBtn = el("attachPollBtn");
const attachStickerBtn = el("attachStickerBtn");
const stickerTray = el("stickerTray");
const closeStickerTrayBtn = el("closeStickerTrayBtn");
const groupFriendsPicker = el("groupFriendsPicker");

const pollDialog = el("pollDialog");
const pollForm = el("pollForm");
const pollQuestionInput = el("pollQuestionInput");
const pollOptionsBox = el("pollOptionsBox");
const pollError = el("pollError");

// AI ChatGPT & Image Gen Elements
const aiChatButton = el("aiChatButton");
const generateAiImageBtn = el("generateAiImageBtn");
const aiUpgradeBtn = el("aiUpgradeBtn");
const aiUpgradeDialog = el("aiUpgradeDialog");
const confirmAiPayBtn = el("confirmAiPayBtn");
const aiUpgradeReason = el("aiUpgradeReason");
const aiImagePromptDialog = el("aiImagePromptDialog");
const aiImagePromptForm = el("aiImagePromptForm");
const aiImagePromptInput = el("aiImagePromptInput");
const aiImagePromptError = el("aiImagePromptError");
const aiImagesRemainingBadge = el("aiImagesRemainingBadge");

// Dialogs & Modals
const friendDialog = el("friendDialog");
const friendSearch = el("friendSearch");
const friendResult = el("friendResult");

const groupDialog = el("groupDialog");
const groupName = el("groupName");
const groupMembers = el("groupMembers");
const groupImage = el("groupImage");
const groupImagePreview = el("groupImagePreview");
const groupError = el("groupError");

const profileDialog = el("profileDialog");
const profileNameInput = el("profileNameInput");
const profileEmailInput = el("profileEmailInput");
const profileImageEdit = el("profileImageEdit");
const profileImageEditPreview = el("profileImageEditPreview");
const passwordMaskedDisplay = el("passwordMaskedDisplay");
const toggleChangePasswordBtn = el("toggleChangePasswordBtn");
const changePasswordBox = el("changePasswordBox");
const currentPasswordInput = el("currentPasswordInput");
const newPasswordInput = el("newPasswordInput");
const confirmNewPasswordInput = el("confirmNewPasswordInput");
const profileError = el("profileError");
const profileSuccess = el("profileSuccess");

const settingsDialog = el("settingsDialog");
const settingsButton = el("settingsButton");
const settingsAvatar = el("settingsAvatar");
const settingsUserName = el("settingsUserName");
const settingsUserEmail = el("settingsUserEmail");
const savedAccountsList = el("savedAccountsList");
const addNewAccountBtn = el("addNewAccountBtn");
const logoutButton = el("logoutButton");

// Settings divided icon navigation
const settingsBackBtn = el("settingsBackBtn");
const settingsDialogTitle = el("settingsDialogTitle");
const settingsMainView = el("settingsMainView");
const settingsAccountView = el("settingsAccountView");
const settingsSubscriptionsView = el("settingsSubscriptionsView");
const settingsNavAccount = el("settingsNavAccount");
const settingsNavSubscriptions = el("settingsNavSubscriptions");
const settingsNavPrivacy = el("settingsNavPrivacy");
const settingsNavAppearance = el("settingsNavAppearance");
const settingsSubBadge = el("settingsSubBadge");

// Add account mode top bar
const addAccountTopBar = el("addAccountTopBar");
const backToCurrentAccountBtn = el("backToCurrentAccountBtn");
const backCurrentAccountName = el("backCurrentAccountName");

// Passkeys & Password Management
const openPasskeysBtn = el("openPasskeysBtn");
const verifyPasswordModal = el("verifyPasswordModal");
const verifyPasswordForm = el("verifyPasswordForm");
const verifyCurrentPasswordInput = el("verifyCurrentPasswordInput");
const verifyPasswordError = el("verifyPasswordError");
const verifyPasswordSubmitBtn = el("verifyPasswordSubmitBtn");

const passkeysManagerModal = el("passkeysManagerModal");
const passkeysUserEmail = el("passkeysUserEmail");
const passkeysCurrentDisplay = el("passkeysCurrentDisplay");
const copyCurrentPasswordBtn = el("copyCurrentPasswordBtn");
const passkeysChangeForm = el("passkeysChangeForm");
const passkeysNewPassword = el("passkeysNewPassword");
const passkeysConfirmPassword = el("passkeysConfirmPassword");
const passkeysChangeError = el("passkeysChangeError");
const passkeysChangeSuccess = el("passkeysChangeSuccess");
const passkeysSaveBtn = el("passkeysSaveBtn");

// Subscriptions
const subPlanTitleBadge = el("subPlanTitleBadge");
const subActiveStatus = el("subActiveStatus");
const quotaWordsDisplay = el("quotaWordsDisplay");
const quotaWordsProgress = el("quotaWordsProgress");
const quotaImagesDisplay = el("quotaImagesDisplay");
const quotaImagesProgress = el("quotaImagesProgress");
const quotaNextResetTime = el("quotaNextResetTime");
const quotaExpiryDisplay = el("quotaExpiryDisplay");
const subUpgradeActionBtn = el("subUpgradeActionBtn");

// عناصر الحالات والاستوري (24h Stories Elements)
const myStoryRailBtn = el("myStoryRailBtn");
const myStoryAvatarRing = el("myStoryAvatarRing");
const myStoryAvatarImg = el("myStoryAvatarImg");
const myStoryPlusBtn = el("myStoryPlusBtn");
const storyFileInput = el("storyFileInput");

const storiesFeedBar = el("storiesFeedBar");
const myStoryBarItem = el("myStoryBarItem");
const myStoryBarRing = el("myStoryBarRing");
const myStoryBarImg = el("myStoryBarImg");
const myStoryBarPlusBtn = el("myStoryBarPlusBtn");
const storiesListItems = el("storiesListItems");

const storyUploadModal = el("storyUploadModal");
const storyUploadForm = el("storyUploadForm");
const storyPreviewImg = el("storyPreviewImg");
const storyPreviewVideo = el("storyPreviewVideo");
const storyCaptionInput = el("storyCaptionInput");
const storyUploadError = el("storyUploadError");
const storyUploadSubmitBtn = el("storyUploadSubmitBtn");

const storyViewerOverlay = el("storyViewerOverlay");
const storyProgressBars = el("storyProgressBars");
const storyViewerAv = el("storyViewerAv");
const storyViewerName = el("storyViewerName");
const storyViewerTime = el("storyViewerTime");
const storyViewerAddBtn = el("storyViewerAddBtn");
const storyViewerDeleteBtn = el("storyViewerDeleteBtn");
const storyViewerCloseBtn = el("storyViewerCloseBtn");
const storyViewerBody = el("storyViewerBody");
const storyTouchPrev = el("storyTouchPrev");
const storyTouchNext = el("storyTouchNext");
const storyViewerImg = el("storyViewerImg");
const storyViewerVideo = el("storyViewerVideo");
const storyViewerCaption = el("storyViewerCaption");

const storyViewsBar = el("storyViewsBar");
const storyViewsToggleBtn = el("storyViewsToggleBtn");
const storyViewsCountNum = el("storyViewsCountNum");
const storyViewsDrawer = el("storyViewsDrawer");
const storyDrawerCount = el("storyDrawerCount");
const storyDrawerCloseBtn = el("storyDrawerCloseBtn");
const storyViewsList = el("storyViewsList");

// عناصر باركود الدخول السريع (QR Scanner & QR Card)
const openQrScannerBtn = el("openQrScannerBtn");
const qrScannerModal = el("qrScannerModal");
const closeQrScannerModalBtn = el("closeQrScannerModalBtn");
const cancelQrScannerBtn = el("cancelQrScannerBtn");
const qrScannerVideo = el("qrScannerVideo");
const qrScannerStatus = el("qrScannerStatus");
const qrScannerFileInput = el("qrScannerFileInput");

const openAccountQrBtn = el("openAccountQrBtn");
const accountQrModal = el("accountQrModal");
const closeAccountQrModalBtn = el("closeAccountQrModalBtn");
const downloadAccountQrBtn = el("downloadAccountQrBtn");
const regenerateAccountQrBtn = el("regenerateAccountQrBtn");
const accountQrAvatar = el("accountQrAvatar");
const accountQrName = el("accountQrName");
const accountQrEmail = el("accountQrEmail");
const accountQrCanvasContainer = el("accountQrCanvasContainer");

// عناصر مميزات شاتو بلاس: خلفيات وثيمات المحادثة
const chatWallpaperButton = el("chatWallpaperButton");
const chatWallpaperModal = el("chatWallpaperModal");
const closeChatWallpaperModalBtn = el("closeChatWallpaperModalBtn");
const wallpaperVipLockedBanner = el("wallpaperVipLockedBanner");
const wallpaperUpgradeBtn = el("wallpaperUpgradeBtn");
const wallpaperPresetsGrid = el("wallpaperPresetsGrid");
const chatWallpaperFileInput = el("chatWallpaperFileInput");
const saveChatWallpaperBtn = el("saveChatWallpaperBtn");
const resetChatWallpaperBtn = el("resetChatWallpaperBtn");
const wallpaperError = el("wallpaperError");

// عناصر الرسائل المثبتة وشريط التثبيت
const chatPinnedBanner = el("chatPinnedBanner");
const pinnedBannerSender = el("pinnedBannerSender");
const pinnedBannerSnippet = el("pinnedBannerSnippet");
const pinnedBannerCount = el("pinnedBannerCount");
const pinnedBannerPrevBtn = el("pinnedBannerPrevBtn");
const pinnedBannerNextBtn = el("pinnedBannerNextBtn");
const pinnedBannerCloseBtn = el("pinnedBannerCloseBtn");

// تبويبات الإيموجي والرموز المتحركة
const emojiTabStandardBtn = el("emojiTabStandardBtn");
const emojiTabVipBtn = el("emojiTabVipBtn");
const standardEmojiList = el("standardEmojiList");
const vipEmojiList = el("vipEmojiList");

const messageSearch = el("messageSearch");
const messageSearchInput = el("messageSearchInput");

const callDialog = el("callDialog");
const callAvatar = el("callAvatar");
const callTitle = el("callTitle");
const callStatus = el("callStatus");

const notificationButton = el("notificationButton");
const notificationCount = el("notificationCount");
const notificationsDialog = el("notificationsDialog");
const notificationList = el("notificationList");

// Ephemeral runtime variables
let loginImage = "";
let editingMessageId = null;
let groupImageData = "";
let profileImageData = "";
let typingTimer;
let mediaRecorder;
let mediaChunks = [];
let notifications = [];

// قفل المحادثات والرسائل ذاتية الاختفاء
const chatLockButton = el("chatLockButton");
const chatDisappearingButton = el("chatDisappearingButton");
const disappearingNotice = el("disappearingNotice");
const disappearingTimerText = el("disappearingTimerText");

const chatPinDialog = el("chatPinDialog");
const chatPinForm = el("chatPinForm");
const chatPinDialogTitle = el("chatPinDialogTitle");
const chatPinDialogDesc = el("chatPinDialogDesc");
const chatPinInput = el("chatPinInput");
const chatPinError = el("chatPinError");
const chatPinSubmitBtn = el("chatPinSubmitBtn");
const chatPinRemoveBtn = el("chatPinRemoveBtn");
const chatPinCancelBtn = el("chatPinCancelBtn");

const disappearingDialog = el("disappearingDialog");
const disappearingForm = el("disappearingForm");
const saveDisappearingBtn = el("saveDisappearingBtn");

const unlockedChats = new Set();
let pendingPinAction = null; // { mode: 'unlock' | 'lock', chatId: string }

function loadState() {
  try {
    const loaded = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    return {
      ...emptyState,
      ...loaded,
      savedAccounts: Array.isArray(loaded.savedAccounts) ? loaded.savedAccounts : [],
      chatSettings: loaded.chatSettings || {},
      chatTimers: loaded.chatTimers || {}
    };
  } catch {
    return { ...emptyState };
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function ensureDirectory() {
  state.directory = Array.isArray(state.directory) ? state.directory : [];
  state.savedAccounts = Array.isArray(state.savedAccounts) ? state.savedAccounts : [];
  if (state.currentUser) {
    if (!state.directory.some((u) => u.email === state.currentUser.email)) {
      state.directory.push({ ...state.currentUser });
    }
    syncCurrentAccountToSaved();
  }
  saveState();
}

function syncCurrentAccountToSaved() {
  if (!state.currentUser) return;
  const cleanEmail = state.currentUser.email.toLowerCase();
  const idx = state.savedAccounts.findIndex((a) => a.email && a.email.toLowerCase() === cleanEmail);
  const accountData = {
    name: state.currentUser.name,
    email: state.currentUser.email,
    image: state.currentUser.image || "",
    password: state.currentUser.lastPassword || state.currentUser.password || "",
    accessToken: state.accessToken || null,
    refreshToken: state.refreshToken || null
  };
  if (idx !== -1) {
    state.savedAccounts[idx] = { ...state.savedAccounts[idx], ...accountData };
  } else {
    state.savedAccounts.push(accountData);
  }
}

function isValidPassword(password) {
  const p = String(password || "");
  return p.length >= 8 && /[A-Z]/.test(p) && /[a-z]/.test(p);
}

function clean(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function hasDigit(value) {
  return /[0-9٠-٩]/.test(value);
}

function normalize(value) {
  return String(value || "").toLowerCase().replace(/[أإآ]/g, "ا").replace(/ة/g, "ه").trim();
}

function newId() {
  return crypto.randomUUID();
}

function ownMessage(type, content) {
  return { id: newId(), from: "me", type, ...content, createdAt: Date.now(), status: "sent" };
}

function otherMessage(text) {
  return { id: newId(), from: "other", type: "text", text, createdAt: Date.now() };
}

function avatarContent(node, person) {
  if (!node) return;
  node.innerHTML = "";
  node.classList.remove("ai-avatar-circle");
  if (person?.isAi || person?.id === "ai:chatgpt" || person?.type === "ai") {
    node.innerHTML = `<span class="ai-avatar-badge">🤖</span>`;
    node.classList.add("ai-avatar-circle");
    return;
  }
  if (person?.type === "group" || String(person?.id || "").startsWith("group:")) {
    if (person?.image) {
      const img = document.createElement("img");
      img.src = person.image;
      img.alt = "";
      img.onerror = () => {
        img.remove();
        node.innerHTML = `<span style="font-size: 20px;">👥</span>`;
      };
      node.appendChild(img);
    } else {
      node.innerHTML = `<span style="font-size: 20px;">👥</span>`;
    }
    return;
  }
  if (person?.image) {
    const img = document.createElement("img");
    img.src = person.image;
    img.alt = "";
    img.onerror = () => {
      img.remove();
      node.textContent = person?.name?.[0]?.toUpperCase() || "C";
    };
    node.appendChild(img);
  } else {
    node.textContent = person?.name?.[0]?.toUpperCase() || "C";
  }
}

/* ==========================================================================
   3. نظام تغيير اللغة (ع / E)
   ========================================================================== */
function applyLanguage(lang) {
  currentLang = lang === "en" ? "en" : "ar";
  localStorage.setItem(LANG_STORAGE_KEY, currentLang);

  document.documentElement.lang = currentLang;
  document.documentElement.dir = currentLang === "ar" ? "rtl" : "ltr";

  // أيقونة الزر: "ع" في العربي و "E" في الإنجليزي
  if (langToggleBtn) {
    langToggleBtn.textContent = t("langBadge");
    langToggleBtn.title = t("langTitle");
  }

  // ترجمة العناصر التي تحمل data-i18n
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.getAttribute("data-i18n");
    if (key && i18n[currentLang][key]) {
      element.textContent = i18n[currentLang][key];
    }
  });

  // ترجمة التلميحات والأزرار
  document.querySelectorAll("[data-i18n-title]").forEach((element) => {
    const key = element.getAttribute("data-i18n-title");
    if (key && i18n[currentLang][key]) {
      const translated = i18n[currentLang][key];
      element.setAttribute("data-title", translated);
      element.setAttribute("aria-label", translated);
    }
  });

  // ترجمة حقول الإدخال Placeholders
  if (loginEmailInput) loginEmailInput.placeholder = t("emailPlaceholder");
  if (loginPasswordInput) loginPasswordInput.placeholder = t("loginPasswordPlaceholder");
  if (regNameInput) regNameInput.placeholder = t("namePlaceholder");
  if (regEmailInput) regEmailInput.placeholder = t("emailPlaceholder");
  if (regVerificationCodeInput) regVerificationCodeInput.placeholder = t("codePlaceholder");
  if (regPasswordInput) regPasswordInput.placeholder = t("passwordPlaceholder");
  if (regConfirmPasswordInput) regConfirmPasswordInput.placeholder = t("confirmPasswordPlaceholder");
  if (sendVerificationCodeBtn && !sendVerificationCodeBtn.disabled) sendVerificationCodeBtn.textContent = t("sendCodeBtn");
  if (signUpSubmitBtn) signUpSubmitBtn.textContent = t("signUpSubmitBtn");
  if (groupName) groupName.placeholder = t("groupNamePlaceholder");
  if (groupMembers) groupMembers.placeholder = t("groupMembersPlaceholder");
  if (friendSearch) friendSearch.placeholder = t("friendSearchPlaceholder");
  if (currentPasswordInput) currentPasswordInput.placeholder = t("currentPwPlaceholder");
  if (newPasswordInput) newPasswordInput.placeholder = t("newPwPlaceholder");
  if (confirmNewPasswordInput) confirmNewPasswordInput.placeholder = t("confirmNewPwPlaceholder");
  if (messageSearchInput) messageSearchInput.placeholder = t("searchMessagesPlaceholder");

  const chat = getChat();
  if (messageInput) {
    messageInput.placeholder = chat?.type === "support" ? t("typeSupportPlaceholder") : t("typeMessagePlaceholder");
  }

  if (toggleChangePasswordBtn) {
    toggleChangePasswordBtn.textContent = changePasswordBox && !changePasswordBox.hidden ? t("hidePwBtn") : t("changePwBtn");
  }

  renderConversations();
  if (state.currentUser) renderMessages();
}

function toggleLanguage() {
  const nextLang = currentLang === "ar" ? "en" : "ar";
  applyLanguage(nextLang);
}

/* ==========================================================================
   Backend API Calls
   ========================================================================== */
async function registerOrLoginAccount(account) {
  const response = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(account)
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || t("serverOfflineError"));
  return data.user;
}

async function searchAccounts(query) {
  const response = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`);
  if (!response.ok) return [];
  const data = await response.json();
  return Array.isArray(data.users) ? data.users : [];
}

async function sendFriendNotification(email) {
  await fetch("/api/friendships", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ from: state.currentUser.email, to: email })
  });
}

async function refreshNotifications() {
  if (!state.currentUser) return;
  const response = await fetch(`/api/notifications?email=${encodeURIComponent(state.currentUser.email)}`);
  if (!response.ok) return;
  const data = await response.json();
  notifications = Array.isArray(data.notifications) ? data.notifications : [];
  notificationCount.textContent = notifications.length;
  notificationCount.hidden = notifications.length === 0;
}

async function refreshFriends() {
  if (!state.currentUser) return;
  const response = await fetch(`/api/friends?email=${encodeURIComponent(state.currentUser.email)}`);
  if (!response.ok) return;
  const data = await response.json();
  state.friends = Array.isArray(data.friends) ? data.friends : [];
  saveState();
  renderConversations();
}

async function sendSharedMessage(friendEmail, message) {
  const payload = {
    from: state.currentUser.email,
    to: friendEmail,
    ...message
  };
  if (state.currentReply) {
    payload.reply_to = {
      id: state.currentReply.id,
      fromName: state.currentReply.fromName || (state.currentReply.from === "me" ? "أنت" : (state.currentReply.from || "رسالة")),
      from: state.currentReply.from,
      text: state.currentReply.text,
      media_type: state.currentReply.type
    };
    clearReplyTarget();
  }
  const response = await fetch("/api/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || t("serverOfflineError"));
  }
  const data = await response.json();
  if (data.aiMessage) {
    const chatId = `friend:${friendEmail}`;
    state.conversations[chatId] = state.conversations[chatId] || [];
    state.conversations[chatId].push({
      ...data.aiMessage,
      from: "chatgpt"
    });
    saveState();
  }
  return data;
}

async function loadSharedMessages(friendEmail) {
  if (!state.currentUser || !friendEmail) return;
  const isGroup = friendEmail.startsWith("group:");
  const chatId = isGroup ? friendEmail : `friend:${friendEmail}`;
  const response = await fetch(`/api/messages?user=${encodeURIComponent(state.currentUser.email)}&friend=${encodeURIComponent(friendEmail)}`);
  if (!response.ok) return;
  const data = await response.json();
  if (data.chatSettings) {
    state.chatSettings = { ...state.chatSettings, ...data.chatSettings };
  }
  if (data.chatTimers) {
    state.chatTimers = { ...state.chatTimers, ...data.chatTimers };
  }
  if (data.chatAiActive) {
    state.chatAiActive = { ...state.chatAiActive, ...data.chatAiActive };
  }
  if (data.pinnedMessages) {
    state.pinnedMessages = state.pinnedMessages || {};
    state.pinnedMessages[chatId] = data.pinnedMessages;
  }
  const myEmail = (state.currentUser.email || "").toLowerCase();
  state.conversations[chatId] = (data.messages || []).map((message) => {
    const isMe = String(message.from || "").toLowerCase() === myEmail;
    return {
      ...message,
      from: isMe ? "me" : (message.from === "chatgpt" ? "chatgpt" : "other"),
      senderName: isMe ? (state.currentUser.name || "أنت") : (message.fromName || message.senderName || message.sender || String(message.from).split("@")[0]),
      status: isMe ? "read" : undefined
    };
  });
  saveState();
  if (state.activeChatId === chatId) {
    if (chatMeta) {
      if (data.isTyping) {
        chatMeta.innerHTML = `<span class="typing-indicator-text">يكتب الآن<span class="typing-dots">...</span></span>`;
      } else {
        const curChat = getChat();
        chatMeta.textContent = curChat?.isOnline ? "متصل الآن 🟢" : (curChat?.type === "support" ? "فريق الدعم المباشر" : t("readyToChat"));
      }
    }
    const messagesEl = el("messages");
    const wasNearBottom = messagesEl ? (messagesEl.scrollHeight - messagesEl.scrollTop - messagesEl.clientHeight < 120) : true;
    renderMessages();
    if (messagesEl && wasNearBottom) {
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }
    renderConversations();
    updateChatLockUI();
    updateDisappearingNoticeUI();
    updateChatWallpaperUI();
    updatePinnedBannerUI();
    updateChatAiButtonUI();
  }
}

/* ==========================================================================
   Chat & Conversations logic
   ========================================================================== */
function ensureSupport() {
  if (!state.conversations["support:live"]) state.conversations["support:live"] = [];
}

function getChatLatestTimestamp(chatId) {
  const msgs = state.conversations[chatId] || [];
  if (!msgs.length) return 0;
  const last = msgs[msgs.length - 1];
  return Number(last.createdAt || last.created_at || (last.timestamp ? new Date(last.timestamp).getTime() : 0)) || 0;
}

function getChats() {
  const list = [];

  // قناة إعلانات وتحديثات شاتو الرسمية (تظهر فقط عندما ينشر الأدمن إعلاناً، وتختفي إذا حذفها المستخدم حتى يأتي إعلان جديد)
  const deletedAdsUntil = Number(localStorage.getItem("chato_announcements_deleted_until") || 0);
  const latestAdTime = (Array.isArray(state.ads) && state.ads.length > 0) ? Number(state.ads[0].createdAt || 0) : 0;
  const hasActiveAds = Boolean(state.ads && state.ads.length > 0 && latestAdTime > deletedAdsUntil);

  if (hasActiveAds) {
    list.push({
      id: "chato_announcements",
      type: "announcements",
      name: "إعلانات Chato الرسمية 📢",
      meta: state.ads[0].title || "أحدث الإعلانات والتحديثات الرسمية",
      image: "./favicon.png",
      initial: "ش",
      readonly: true,
      isOfficial: true
    });
  }

  // محادثة الذكاء الاصطناعي Chato Assistant
  list.push({
    id: "ai:chatgpt",
    type: "ai",
    name: "Chato Assistant 🤖",
    meta: "Powered by Advanced AI",
    initial: "AI",
    isAi: true
  });

  // إذا كان المستخدم قد فتح تذكرة دعم فني مباشر
  if (state.hasSupportTicket || (state.conversations["support:live"] && state.conversations["support:live"].length)) {
    list.push({
      id: "support:live",
      type: "support",
      name: "الدعم الفني 🎧",
      meta: "محادثة الدعم المباشر",
      initial: "د"
    });
  }

  // إذا وصلته رسالة إدارية رسمية خاصة
  if (state.conversations["admin:notice"] && state.conversations["admin:notice"].length) {
    list.push({
      id: "admin:notice",
      type: "admin_notice",
      name: "إدارة Chato 🔰",
      meta: "رسالة إدارية رسمية خاصة",
      initial: "ش",
      readonly: true
    });
  }

  // محادثات الأصدقاء
  (state.friends || []).forEach((friend) => {
    list.push({
      id: `friend:${friend.email}`,
      type: "friend",
      ...friend,
      meta: t("onlineNow"),
      initial: friend.name[0]
    });
  });

  // المجموعات
  (state.groups || []).forEach((group) => {
    const count = Array.isArray(group.members) ? group.members.length : (Array.isArray(group.member_emails) ? group.member_emails.length : 1);
    list.push({
      id: `group:${group.id}`,
      type: "group",
      ...group,
      meta: currentLang === "ar" ? `${count} أعضاء` : `${count} members`,
      initial: (group.name && group.name[0]) ? group.name[0] : "👥"
    });
  });

  // 1. ترتيب الدردشات التلقائي للأعلى (Chat Auto-Sorting to Top)
  list.sort((a, b) => {
    // المحادثات المثبتة أولاً
    const aPinned = Boolean(state.pinnedChats && state.pinnedChats.includes(a.id));
    const bPinned = Boolean(state.pinnedChats && state.pinnedChats.includes(b.id));
    if (aPinned && !bPinned) return -1;
    if (!aPinned && bPinned) return 1;

    // ثم الترتيب حسب توقيت أحدث رسالة (الأحدث يقفز للأعلى فوراً)
    const aTime = getChatLatestTimestamp(a.id);
    const bTime = getChatLatestTimestamp(b.id);
    if (aTime !== bTime) {
      return bTime - aTime;
    }
    return 0;
  });

  return list;
}

function getChat() {
  const chats = getChats();
  return chats.find((chat) => chat.id === state.activeChatId) || chats[0];
}

function isChatLocked(id) {
  if (!id) return false;
  return Boolean(state.chatSettings && state.chatSettings[id]?.is_locked);
}

function updateChatLockUI() {
  const chatId = state.activeChatId;
  const chat = getChat();
  if (!chatLockButton) return;
  if (!chat || chat.type === "ai" || chat.type === "admin_notice") {
    chatLockButton.hidden = true;
    if (chatDisappearingButton) chatDisappearingButton.hidden = true;
    return;
  }
  chatLockButton.hidden = false;
  if (chatDisappearingButton) chatDisappearingButton.hidden = false;
  const locked = isChatLocked(chatId);
  const iconSpan = chatLockButton.querySelector(".dropdown-item-icon");
  const textSpan = chatLockButton.querySelector(".dropdown-item-text");
  if (iconSpan && textSpan) {
    iconSpan.textContent = locked ? "🔒" : "🔓";
    textSpan.textContent = locked ? "المحادثة مقفلة برمز PIN" : "قفل المحادثة برمز PIN";
  } else {
    chatLockButton.textContent = locked ? "🔒 المحادثة مقفلة" : "🔓 قفل المحادثة";
  }
  chatLockButton.title = locked ? "المحادثة مقفلة برمز PIN (انقر للتعديل أو إلغاء القفل)" : "قفل المحادثة برمز سري PIN";
}

function updateDisappearingNoticeUI() {
  if (!disappearingNotice) return;
  const chatId = state.activeChatId;
  const chat = getChat();
  if (!chat || chat.type === "ai" || chat.type === "admin_notice") {
    disappearingNotice.hidden = true;
    return;
  }
  const timer = state.chatTimers?.[chatId] || (chat.email && state.chatTimers?.[`friend:${chat.email}`]) || null;
  if (timer && timer > 0) {
    disappearingNotice.hidden = false;
    let label = `${timer} ثانية`;
    if (timer === 3600) label = "ساعة واحدة";
    else if (timer === 86400) label = "24 ساعة";
    else if (timer === 604800) label = "7 أيام";
    if (disappearingTimerText) disappearingTimerText.textContent = label;
  } else {
    disappearingNotice.hidden = true;
  }
}

function promptUnlockChat(chatId) {
  pendingPinAction = { mode: "unlock", chatId };
  if (chatPinDialogTitle) chatPinDialogTitle.textContent = "🔒 فك قفل المحادثة";
  if (chatPinDialogDesc) chatPinDialogDesc.textContent = "هذه المحادثة محمية برمز PIN سري. أدخل الرمز للدخول:";
  if (chatPinInput) chatPinInput.value = "";
  if (chatPinError) chatPinError.textContent = "";
  if (chatPinSubmitBtn) chatPinSubmitBtn.textContent = "فتح المحادثة";
  if (chatPinRemoveBtn) chatPinRemoveBtn.style.display = "none";
  openDialog(chatPinDialog);
  setTimeout(() => chatPinInput?.focus(), 100);
}

function promptLockChat(chatId) {
  const locked = isChatLocked(chatId);
  pendingPinAction = { mode: "lock", chatId };
  if (chatPinDialogTitle) chatPinDialogTitle.textContent = locked ? "⚙️ إعدادات قفل المحادثة" : "🔒 قفل المحادثة برمز PIN";
  if (chatPinDialogDesc) chatPinDialogDesc.textContent = locked ? "المحادثة مقفلة حالياً. يمكنك تغيير الرمز أو إلغاء القفل نهائياً:" : "أدخل رمز PIN مكوّن من 4 إلى 6 أرقام لقفل هذه المحادثة:";
  if (chatPinInput) chatPinInput.value = "";
  if (chatPinError) chatPinError.textContent = "";
  if (chatPinSubmitBtn) chatPinSubmitBtn.textContent = locked ? "تغيير رمز الـ PIN" : "تفعيل القفل";
  if (chatPinRemoveBtn) chatPinRemoveBtn.style.display = locked ? "inline-block" : "none";
  openDialog(chatPinDialog);
  setTimeout(() => chatPinInput?.focus(), 100);
}

function lastLine(id, fallback) {
  if (isChatLocked(id)) {
    return "🔒 محادثة مقفلة";
  }
  const last = (state.conversations[id] || []).at(-1);
  if (!last) return fallback;
  if (last.type === "image") return t("imageSent");
  if (last.type === "voice") return t("voiceSent");
  if (last.type === "location") return t("locationShared") || "📍 موقع مباشر";
  if (last.type === "poll") return last.poll?.question ? `📊 ${last.poll.question}` : (t("createPoll") || "استطلاع رأي");
  if (last.type === "sticker") return `${last.sticker?.emoji || "🎭"} ملصق`;
  return last.text || fallback;
}

function renderConversations() {
  let chats = getChats();
  const filter = state.activeChatFilter || "all";
  if (filter === "direct") {
    chats = chats.filter((c) => c.type === "friend");
  } else if (filter === "groups") {
    chats = chats.filter((c) => c.type === "group");
  } else if (filter === "unread") {
    chats = chats.filter((c) => {
      const msgs = state.conversations[c.id] || [];
      return msgs.some((m) => m.from !== "me" && !m.read);
    });
  }
  conversationCount.textContent = chats.length;
  conversationList.innerHTML = "";
  if (!chats.length) {
    conversationList.innerHTML = `<p class="empty-state" style="padding: 24px 16px; font-size: 13.5px; color: var(--muted); text-align: center;">لا توجد محادثات في هذا القسم</p>`;
    return;
  }
  chats.forEach((chat) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `conversation-item${chat.id === state.activeChatId ? " is-active" : ""}`;
    const avatar = document.createElement("span");
    avatar.className = "avatar";
    avatarContent(avatar, chat);
    const copy = document.createElement("span");
    copy.className = "conversation-copy";
    const strong = document.createElement("strong");
    strong.textContent = isChatLocked(chat.id) ? `🔒 ${chat.name}` : chat.name;
    if (state.pinnedChats && state.pinnedChats.includes(chat.id)) {
      const pinBadge = document.createElement("span");
      pinBadge.className = "chat-pinned-badge";
      pinBadge.textContent = "📌";
      pinBadge.title = "محادثة مثبتة في الأعلى";
      strong.appendChild(pinBadge);
    }
    const small = document.createElement("span");
    small.textContent = lastLine(chat.id, chat.meta);
    copy.append(strong, small);
    button.append(avatar, copy);

    // 5. عداد الرسائل غير المقروءة (رقم 1 أو عدد الرسائل غير المقروءة)
    const chatMsgs = state.conversations[chat.id] || [];
    const unreadCount = chatMsgs.filter((m) => m.from === "other" && m.status !== "read" && !m.read).length;
    if (unreadCount > 0 && chat.id !== state.activeChatId) {
      const badge = document.createElement("span");
      badge.className = "unread-badge";
      badge.textContent = unreadCount > 99 ? "99+" : unreadCount;
      button.appendChild(badge);
    }

    button.addEventListener("click", () => {
      if (isChatLocked(chat.id)) {
        // طلب رمز PIN دائماً في كل مرة يفتح فيها المحادثة
        unlockedChats.clear();
        promptUnlockChat(chat.id);
      } else {
        unlockedChats.clear();
        openChat(chat.id);
      }
    });
    conversationList.appendChild(button);
  });
}

function openChat(id) {
  if (isChatLocked(id) && !unlockedChats.has(id)) {
    promptUnlockChat(id);
    return;
  }
  // قفل أي محادثة مقفلة سابقة عند الانتقال
  if (state.activeChatId && state.activeChatId !== id && isChatLocked(state.activeChatId)) {
    unlockedChats.delete(state.activeChatId);
  }
  state.activeChatId = id;
  state.conversations[id] ||= [];
  saveState();
  el("contentGrid")?.classList.add("in-chat");
  el("appScreen")?.classList.add("in-chat-mobile");
  const chat = getChat();
  if (!chat) return;

  chatName.textContent = chat.name;
  chatMeta.textContent = chat.type === "support" ? "فريق دعم Chato المباشر" : chat.meta;
  avatarContent(chatAvatar, chat);
  deleteFriendButton.hidden = chat.type !== "friend";
  deleteFriendButton.dataset.email = chat.email || "";

  updateChatLockUI();
  updateDisappearingNoticeUI();
  updateChatWallpaperUI();
  updatePinnedBannerUI();
  updateChatAiButtonUI();
  updateChatPinUI();
  updateChatBlockUI();

  // 5. تمييز الرسائل كمقروءة عند فتح المحادثة وتصفير العداد وتغيير الصحين لأزرق
  if (chat.type === "friend" && chat.email) {
    const msgs = state.conversations[id] || [];
    let hadUnread = false;
    msgs.forEach((m) => {
      if (m.from === "other" && m.status !== "read") {
        m.status = "read";
        m.read = true;
        hadUnread = true;
      }
    });
    if (hadUnread) {
      saveState();
      fetch("/api/messages/read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: state.currentUser.email, friend: chat.email })
      }).catch(() => {});
    }
  }

  // 2. إذا كانت رسالة إدارية رسمية خاصة أو قناة إعلانات مقفولة أو مجموعة مقيدة المشرفين فقط
  const isAnnouncements = chat.id === "chato_announcements" || chat.type === "announcements";
  const isReadOnly = chat.type === "admin_notice" || chat.readonly || isAnnouncements;
  const readOnlyNotice = el("readOnlyNotice");
  const announcementReadOnlyNotice = el("announcementReadOnlyNotice");
  const groupReadOnlyNotice = el("groupReadOnlyNotice");
  const composer = el("composer");
  const composerForm = el("composerForm");

  if (isAnnouncements) {
    document.body.classList.add("in-announcements");
    if (composer) {
      composer.hidden = true;
      composer.style.display = "none";
    }
    if (composerForm) composerForm.style.display = "none";
    if (announcementReadOnlyNotice) {
      announcementReadOnlyNotice.hidden = true;
      announcementReadOnlyNotice.style.display = "none";
    }
    if (readOnlyNotice) readOnlyNotice.hidden = true;
    if (groupReadOnlyNotice) groupReadOnlyNotice.hidden = true;
  } else {
    document.body.classList.remove("in-announcements");
    if (announcementReadOnlyNotice) announcementReadOnlyNotice.hidden = true;
    if (composer) {
      composer.hidden = false;
      composer.style.display = "";
    }
    if (composerForm) composerForm.style.display = "flex";
  }

  // التحقق من صلاحية الإرسال في المجموعات (Admins Only)
  let isRestrictedGroupMember = false;
  if (chat.type === "group") {
    const isSenderAdmin = chat.admin === state.currentUser?.email || (Array.isArray(chat.admins) && chat.admins.includes(state.currentUser?.email));
    if (chat.who_can_send === "admins_only" && !isSenderAdmin) {
      isRestrictedGroupMember = true;
    }
  }

  if (isReadOnly) {
    if (composer) composer.hidden = true;
    if (readOnlyNotice) readOnlyNotice.hidden = false;
    if (groupReadOnlyNotice) groupReadOnlyNotice.hidden = true;
  } else if (isRestrictedGroupMember) {
    if (composer) composer.hidden = true;
    if (readOnlyNotice) readOnlyNotice.hidden = true;
    if (groupReadOnlyNotice) groupReadOnlyNotice.hidden = false;
  } else {
    if (composer) composer.hidden = false;
    if (readOnlyNotice) readOnlyNotice.hidden = true;
    if (groupReadOnlyNotice) groupReadOnlyNotice.hidden = true;
  }

  // التعامل مع شات الذكاء الاصطناعي Chato Assistant
  const isAiChat = chat.type === "ai" || chat.id === "ai:chatgpt";
  const imageAttachBtn = el("imageAttachButton");
  if (isAiChat) {
    if (!state.conversations["ai:chatgpt"] || !state.conversations["ai:chatgpt"].length) {
      state.conversations["ai:chatgpt"] = [
        otherMessage(currentLang === "ar"
          ? "مرحباً بك! أنا Chato Assistant، مساعدك الذكي في Chato 🤖.\nيمكنك سؤالي في أي موضوع أو إرسال صور أو طلب رسم صور.\n• رصيدك المجاني: 90 كلمة يومياً.\n• اشتراك Chato Plus (99 ريال / شهرين) يمنحك 500 كلمة يومياً و20 صورة وإرسال صور بلا حدود!"
          : "Welcome! I am Chato Assistant, your smart AI assistant in Chato 🤖.\n• Free limit: 90 words daily.\n• Chato Plus (99 SAR / 2 months) unlocks 500 words/day and 20 images daily!")
      ];
      saveState();
    }
    fetchAiUsage();
    if (imageAttachBtn) imageAttachBtn.hidden = false; // متاح إرسال صور في شات الذكاء الاصطناعي!
    if (attachButton) attachButton.hidden = true;
    if (generateAiImageBtn) generateAiImageBtn.hidden = false;
    if (aiUpgradeBtn) aiUpgradeBtn.hidden = true;
    if (el("voiceCallButton")) el("voiceCallButton").hidden = true;
    if (el("videoCallButton")) el("videoCallButton").hidden = true;
    messageInput.placeholder = currentLang === "ar" ? "اسأل Chato Assistant أي شيء أو اكتب 'ارسم ...'" : "Ask Chato Assistant anything or type 'draw ...'";
  } else {
    if (imageAttachBtn) imageAttachBtn.hidden = false;
    if (attachButton) attachButton.hidden = false;
    if (generateAiImageBtn) generateAiImageBtn.hidden = true;
    if (aiUpgradeBtn) aiUpgradeBtn.hidden = true;
    if (el("voiceCallButton")) el("voiceCallButton").hidden = false;
    if (el("videoCallButton")) el("videoCallButton").hidden = false;
    messageInput.placeholder = chat.type === "support" ? "اكتب لمسؤول الدعم الفني..." : t("typeMessagePlaceholder");
  }
  messageSearch.hidden = true;
  messageSearchInput.value = "";
  emojiTray.hidden = true;
  if (attachMenu) attachMenu.hidden = true;
  if (stickerTray) stickerTray.hidden = true;
  renderConversations();
  renderMessages();

  if (chat.type === "friend") loadSharedMessages(chat.email);
  if (chat.type === "group" || String(chat.id).startsWith("group:")) {
    const gKey = String(chat.id).startsWith("group:") ? chat.id : `group:${chat.groupId || chat.id}`;
    loadSharedMessages(gKey);
  }
  if (chat.type === "support") loadSupportMessages();
  setTimeout(() => {
    if (messages) messages.scrollTop = messages.scrollHeight;
  }, 50);
}

function renderMessages() {
  // عرض قناة إعلانات وتحديثات شاتو الرسمية
  if (state.activeChatId === "chato_announcements") {
    messages.innerHTML = "";
    // إضافة شريط القناة الرسمي الحصري داخل شات الإعلانات فقط
    const topBanner = document.createElement("div");
    topBanner.className = "announcement-chat-top-notice";
    topBanner.innerHTML = "<span>📢 هذه القناة مخصصة لإعلانات وتحديثات Chato الرسمية (للقراءة فقط) 🔒</span>";
    messages.appendChild(topBanner);

    const ads = state.ads || [];
    if (!ads.length) {
      const emptyP = document.createElement("p");
      emptyP.className = "empty-state";
      emptyP.style.cssText = "padding: 30px; text-align: center; color: var(--muted);";
      emptyP.textContent = "لا توجد إعلانات منشورة حالياً في هذه القناة 📢";
      messages.appendChild(emptyP);
      return;
    }
    ads.forEach((ad) => {
      const card = document.createElement("article");
      card.className = "announcement-chat-card";
      const adImg = ad.imageUrl || ad.image || ad.img || "";
      card.innerHTML = `
        <div class="announcement-card-head">
          <span class="announcement-card-title">📢 ${escapeHtml(ad.title)}</span>
          <span class="announcement-card-date">${formatStoryTime(ad.createdAt)}</span>
        </div>
        <div class="announcement-card-text">${escapeHtml(ad.content)}</div>
        ${adImg ? `<div class="announcement-card-media"><img src="${adImg}" class="announcement-card-img" alt="صورة الإعلان" onclick="openMediaLightbox('${adImg}')" onerror="this.parentElement.style.display='none'" /></div>` : ""}
        ${ad.link ? `<a href="${ad.link}" target="_blank" rel="noopener" style="display:inline-block; margin-top:8px; color:#0284c7; font-weight:700;">🔗 المزيد من التفاصيل</a>` : ""}
      `;
      messages.appendChild(card);
    });
    return;
  }

  const query = normalize(messageSearchInput.value);
  const chatMessages = state.conversations[state.activeChatId] || [];
  messages.innerHTML = "";
  if (!chatMessages.length) {
    messages.innerHTML = `<p class="empty-state">${t("emptyChat")}</p>`;
    return;
  }
  let lastDateKey = null;
  chatMessages.forEach((message) => {
    const msgDate = new Date(message.createdAt || Date.now());
    const dateKey = msgDate.toDateString();
    if (dateKey !== lastDateKey) {
      lastDateKey = dateKey;
      const dateDivider = document.createElement("div");
      dateDivider.className = "chat-date-divider";
      dateDivider.innerHTML = `<span>${formatSmartDateDivider(msgDate)}</span>`;
      messages.appendChild(dateDivider);
    }

    const bubble = document.createElement("article");
    const isAi = message.from === "chatgpt" || message.senderName === "ChatGPT" || message.from === "ai" || message.senderName === "Chato Assistant";
    bubble.className = `message ${message.from === "me" ? "mine" : "theirs"}${isAi ? " ai-chatgpt-bubble" : ""}`;
    if (isAi) {
      const aiHeader = document.createElement("div");
      aiHeader.className = "ai-chatgpt-header";
      aiHeader.innerHTML = `
        <span class="ai-chatgpt-badge">🤖 Chato Assistant</span>
        <span class="ai-chatgpt-tag">Powered by Advanced AI</span>
      `;
      bubble.appendChild(aiHeader);
    }

    // عرض الرد والاقتباس أعلى محتوى الرسالة (Reply Quote Preview)
    if (message.reply_to) {
      const quoteBox = document.createElement("div");
      quoteBox.className = "message-reply-quote";
      const qSender = document.createElement("strong");
      qSender.textContent = message.reply_to.fromName || (message.reply_to.from === "me" ? "أنت" : (message.reply_to.from || "رسالة"));
      const qText = document.createElement("span");
      qText.textContent = message.reply_to.text || (message.reply_to.media_type === "image" ? "📷 صورة" : (message.reply_to.media_type === "voice" ? "🎙️ تسجيل صوتي" : "مرفق"));
      quoteBox.append(qSender, qText);
      quoteBox.addEventListener("click", () => {
        const targetEl = document.getElementById("msg-" + message.reply_to.id);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: "smooth", block: "center" });
          targetEl.classList.add("flash-highlight");
          setTimeout(() => targetEl.classList.remove("flash-highlight"), 1600);
        }
      });
      bubble.appendChild(quoteBox);
    }

    if (query && message.type === "text" && normalize(message.text).includes(query)) {
      bubble.classList.add("search-match");
    }
    if (message.type === "image") {
      const img = document.createElement("img");
      img.className = "message-image";
      img.src = message.imageUrl;
      img.alt = message.fileName || t("imageSent");
      img.style.cursor = "pointer";
      img.title = "انقر للمعاينة والتكبير بملء الشاشة";
      img.addEventListener("click", () => openMediaLightbox(message.imageUrl));
      bubble.appendChild(img);
    } else if (message.type === "voice") {
      const voiceContainer = document.createElement("div");
      voiceContainer.className = "voice-player-container";
      const audio = document.createElement("audio");
      audio.controls = true;
      audio.src = message.audioUrl;
      const speedPill = document.createElement("button");
      speedPill.type = "button";
      speedPill.className = "voice-speed-pill";
      speedPill.textContent = "1x";
      let currentRate = 1;
      speedPill.addEventListener("click", () => {
        if (currentRate === 1) currentRate = 1.5;
        else if (currentRate === 1.5) currentRate = 2;
        else currentRate = 1;
        audio.playbackRate = currentRate;
        speedPill.textContent = `${currentRate}x`;
      });
      voiceContainer.append(audio, speedPill);
      bubble.appendChild(voiceContainer);
    } else if (message.type === "document" && message.document) {
      const docCard = document.createElement("div");
      docCard.className = "document-card";
      
      const docIcon = document.createElement("div");
      docIcon.className = "document-icon";
      docIcon.textContent = getDocumentEmoji(message.document.name);
      
      const docMeta = document.createElement("div");
      docMeta.className = "document-meta";
      
      const docName = document.createElement("span");
      docName.className = "document-name";
      docName.textContent = message.document.name || "مستند";
      docName.title = message.document.name;
      
      const docSize = document.createElement("span");
      docSize.className = "document-size";
      docSize.textContent = formatBytes(message.document.size || 0);
      
      docMeta.append(docName, docSize);
      
      const docDownload = document.createElement("a");
      docDownload.className = "document-download-btn";
      docDownload.href = message.document.url;
      docDownload.download = message.document.name || "document";
      docDownload.setAttribute("title", "تحميل الملف");
      docDownload.innerHTML = `<span>⬇️ تحميل</span>`;
      
      docCard.append(docIcon, docMeta, docDownload);
      bubble.appendChild(docCard);
    } else if (message.type === "location" && message.location) {
      const locCard = document.createElement("div");
      locCard.className = "location-card";
      const locTitle = document.createElement("div");
      locTitle.className = "location-title";
      locTitle.innerHTML = `<span>📍</span> <strong>${message.location.title || t("locationShared")}</strong>`;
      const locBtn = document.createElement("a");
      locBtn.className = "location-map-btn";
      locBtn.href = message.location.mapUrl || `https://www.google.com/maps?q=${message.location.lat},${message.location.lng}`;
      locBtn.target = "_blank";
      locBtn.rel = "noopener noreferrer";
      locBtn.textContent = t("openGoogleMaps") || "📍 فتح في Google Maps";
      locCard.append(locTitle, locBtn);
      bubble.appendChild(locCard);
    } else if (message.type === "sticker") {
      bubble.classList.add("sticker-bubble", "animated-sticker-bubble");
      const stickerUrl = message.sticker_url || message.sticker?.url || (typeof message.sticker === "string" && (message.sticker.startsWith("/") || message.sticker.startsWith("http")) ? message.sticker : null);
      if (stickerUrl) {
        const img = document.createElement("img");
        img.className = "animated-chat-sticker";
        img.src = stickerUrl;
        img.alt = message.sticker?.emoji || message.sticker_emoji || "ملصق متحرك";
        img.loading = "lazy";
        bubble.appendChild(img);
      } else {
        const stickerDisplay = document.createElement("div");
        stickerDisplay.className = "message-sticker-display";
        stickerDisplay.textContent = message.sticker?.emoji || message.text || "🎭";
        stickerDisplay.title = message.sticker?.name || "";
        bubble.appendChild(stickerDisplay);
      }
    } else if (message.type === "poll" && message.poll) {
      const pollCard = document.createElement("div");
      pollCard.className = "poll-card";
      const pollQ = document.createElement("div");
      pollQ.className = "poll-question";
      pollQ.textContent = `📊 ${message.poll.question}`;
      pollCard.appendChild(pollQ);

      const optionsList = document.createElement("div");
      optionsList.className = "poll-options-list";
      const totalVotes = (message.poll.options || []).reduce((acc, opt) => acc + (opt.votes?.length || 0), 0);

      (message.poll.options || []).forEach((opt, idx) => {
        const optVotes = opt.votes?.length || 0;
        const pct = totalVotes > 0 ? Math.round((optVotes / totalVotes) * 100) : 0;
        const hasVotedThis = (opt.votes || []).includes(state.currentUser?.email);

        const optBtn = document.createElement("button");
        optBtn.type = "button";
        optBtn.className = `poll-option-item${hasVotedThis ? " has-voted" : ""}`;

        const fillBar = document.createElement("div");
        fillBar.className = "poll-fill-bar";
        fillBar.style.width = `${pct}%`;

        const labelSpan = document.createElement("span");
        labelSpan.className = "poll-option-label";
        labelSpan.innerHTML = `${hasVotedThis ? "✓ " : ""}${opt.text}`;

        const statsSpan = document.createElement("span");
        statsSpan.className = "poll-option-stats";
        statsSpan.textContent = `${pct}% (${optVotes})`;

        optBtn.append(fillBar, labelSpan, statsSpan);
        optBtn.addEventListener("click", () => votePoll(message.id, idx));
        optionsList.appendChild(optBtn);
      });

      const totalVotesDiv = document.createElement("div");
      totalVotesDiv.className = "poll-total-votes";
      totalVotesDiv.textContent = `${totalVotes} ${t("votesCount") || "أصوات"}`;

      pollCard.append(optionsList, totalVotesDiv);
      bubble.appendChild(pollCard);
    } else {
      const text = document.createElement("span");
      text.className = "message-text";
      text.innerHTML = formatRichMessageText(message.text);
      bubble.appendChild(text);
    }

    bubble.id = "msg-" + message.id;

    // عرض الترجمة الفورية داخل فقاعة الرسالة (Instant In-Chat Translation)
    const activeTranslation = message.translatedText || message.translations?.auto || message.translations?.ar || (message.translations && Object.values(message.translations)[0]);
    if (activeTranslation) {
      const transBox = document.createElement("div");
      transBox.className = "message-translation-box";
      const tag = document.createElement("span");
      tag.className = "translation-tag";
      tag.textContent = "🌐 ترجمة فورية:";
      const tText = document.createElement("span");
      tText.textContent = activeTranslation;
      transBox.append(tag, tText);
      bubble.appendChild(transBox);
    }

    const footer = document.createElement("div");
    footer.className = "message-footer";
    const time = document.createElement("time");
    time.textContent = new Intl.DateTimeFormat(currentLang === "ar" ? "ar-EG" : "en-US", {
      hour: "2-digit",
      minute: "2-digit"
    }).format(message.createdAt);
    footer.appendChild(time);
    if (message.expires_at || message.expiresAt) {
      const expSpan = document.createElement("span");
      expSpan.title = "رسالة ذاتية الاختفاء مؤقتة";
      expSpan.textContent = "⏱️";
      footer.appendChild(expSpan);
    }
    if (message.edited) {
      const edited = document.createElement("span");
      edited.textContent = t("edited");
      footer.appendChild(edited);
    }

    const isMsgPinned = Boolean(message.pinned || (state.pinnedMessages?.[state.activeChatId]?.some((p) => p.message_id === message.id)));
    if (isMsgPinned) {
      const pin = document.createElement("span");
      pin.textContent = "📌";
      pin.title = "رسالة مثبتة";
      footer.appendChild(pin);
    }

    // زر الترجمة الفورية السريعة لأي رسالة نصية (حصري لمشتركي شاتو بلاس - ممنوع يظهر لغير المشتركين)
    if (isUserChatPlusSubscriber() && (message.type === "text" || !message.type)) {
      const transBtn = document.createElement("button");
      transBtn.type = "button";
      transBtn.className = "translation-action-btn";
      transBtn.title = "ترجمة فورية (حصري لشاتو بلاس)";
      transBtn.textContent = "🌐";
      transBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        translateMessage(message);
      });
      footer.appendChild(transBtn);
    }

    // 5. صحين بدون لون ولما يشوفها تتحول لأزرق
    if (message.from === "me") {
      const ticks = document.createElement("span");
      ticks.className = `ticks ${message.status === "read" ? "read" : "sent"}`;
      ticks.textContent = "✓✓";
      footer.appendChild(ticks);
      const menu = document.createElement("details");
      menu.className = "message-menu";
      const summary = document.createElement("summary");
      summary.setAttribute("aria-label", "خيارات الرسالة");
      summary.textContent = "⋮";
      const actions = document.createElement("div");
      actions.className = "message-menu-items";

      // خيار الرد
      const reply = document.createElement("button");
      reply.type = "button";
      reply.textContent = "↩️ رد";
      reply.addEventListener("click", () => setReplyTarget(message));
      actions.appendChild(reply);

      // خيار نسخ النص
      if (message.text && !message.is_deleted) {
        const copyBtn = document.createElement("button");
        copyBtn.type = "button";
        copyBtn.textContent = "📋 نسخ النص";
        copyBtn.addEventListener("click", async () => {
          try {
            await navigator.clipboard.writeText(message.text);
            showToast("تم نسخ النص بنجاح 📋");
          } catch {
            showToast("تعذر نسخ النص");
          }
        });
        actions.appendChild(copyBtn);
      }

      // خيار إعادة التوجيه
      if (!message.is_deleted) {
        const forwardBtn = document.createElement("button");
        forwardBtn.type = "button";
        forwardBtn.textContent = "🔁 تحويل";
        forwardBtn.addEventListener("click", () => openForwardMessageModal(message));
        actions.appendChild(forwardBtn);
      }

      if (message.type === "text" && !message.is_deleted) {
        const canEdit = (Date.now() - Number(message.createdAt || 0)) <= 15 * 60 * 1000;
        if (canEdit) {
          const edit = document.createElement("button");
          edit.type = "button";
          edit.textContent = "✏️ تعديل";
          edit.addEventListener("click", () => openEditMessageModal(message));
          actions.appendChild(edit);
        }
        const delEveryone = document.createElement("button");
        delEveryone.type = "button";
        delEveryone.textContent = "🗑️ حذف للجميع";
        delEveryone.addEventListener("click", () => deleteForEveryone(message.id));
        actions.appendChild(delEveryone);
      }
      const pin = document.createElement("button");
      pin.type = "button";
      pin.textContent = isMsgPinned ? t("unpin") : t("pin");
      pin.addEventListener("click", () => togglePin(message.id));
      const remove = document.createElement("button");
      remove.type = "button";
      remove.textContent = t("deleteMsg");
      remove.addEventListener("click", () => deleteOwnMessage(message.id));
      actions.append(pin, remove);
      menu.append(summary, actions);
      footer.appendChild(menu);
    } else {
      // خيارات الرسائل الواردة من الطرف الآخر (رد، نسخ، تحويل، تثبيت وترجمة)
      const menu = document.createElement("details");
      menu.className = "message-menu";
      const summary = document.createElement("summary");
      summary.setAttribute("aria-label", "خيارات الرسالة");
      summary.textContent = "⋮";
      const actions = document.createElement("div");
      actions.className = "message-menu-items";

      const reply = document.createElement("button");
      reply.type = "button";
      reply.textContent = "↩️ رد";
      reply.addEventListener("click", () => setReplyTarget(message));
      actions.appendChild(reply);

      // خيار نسخ النص
      if (message.text && !message.is_deleted) {
        const copyBtn = document.createElement("button");
        copyBtn.type = "button";
        copyBtn.textContent = "📋 نسخ النص";
        copyBtn.addEventListener("click", async () => {
          try {
            await navigator.clipboard.writeText(message.text);
            showToast("تم نسخ النص بنجاح 📋");
          } catch {
            showToast("تعذر نسخ النص");
          }
        });
        actions.appendChild(copyBtn);
      }

      // خيار إعادة التوجيه
      if (!message.is_deleted) {
        const forwardBtn = document.createElement("button");
        forwardBtn.type = "button";
        forwardBtn.textContent = "🔁 تحويل";
        forwardBtn.addEventListener("click", () => openForwardMessageModal(message));
        actions.appendChild(forwardBtn);
      }

      const pin = document.createElement("button");
      pin.type = "button";
      pin.textContent = isMsgPinned ? t("unpin") : t("pin");
      pin.addEventListener("click", () => togglePin(message.id));
      actions.appendChild(pin);
      if (isUserChatPlusSubscriber() && (message.type === "text" || !message.type)) {
        const trans = document.createElement("button");
        trans.type = "button";
        trans.textContent = "🌐 ترجمة فورية";
        trans.addEventListener("click", () => translateMessage(message));
        actions.appendChild(trans);
      }
      menu.append(summary, actions);
      footer.appendChild(menu);
    }

    // دعم السحب للرد باللمس على شاشات الهواتف (Swipe-to-Reply)
    let touchStartX = 0;
    let touchDeltaX = 0;
    bubble.addEventListener("touchstart", (e) => {
      touchStartX = e.touches[0].clientX;
      touchDeltaX = 0;
    }, { passive: true });
    bubble.addEventListener("touchmove", (e) => {
      const currentX = e.touches[0].clientX;
      touchDeltaX = currentX - touchStartX;
      if (touchDeltaX < -15 && touchDeltaX > -80) {
        bubble.style.transform = `translateX(${touchDeltaX}px)`;
      }
    }, { passive: true });
    bubble.addEventListener("touchend", () => {
      bubble.style.transform = "";
      if (touchDeltaX < -40) {
        setReplyTarget(message);
      }
      touchStartX = 0;
      touchDeltaX = 0;
    });

    bubble.appendChild(footer);
    messages.appendChild(bubble);
  });
  messages.scrollTop = messages.scrollHeight;
  setTimeout(() => {
    if (messages) messages.scrollTop = messages.scrollHeight;
  }, 40);
}

async function sendText(text) {
  const value = clean(text);
  if (!value) return;
  const chatId = state.activeChatId;
  const chat = getChat();
  if (chat && chat.type === "friend" && chat.email) {
    state.blockedUsers = Array.isArray(state.blockedUsers) ? state.blockedUsers : [];
    if (state.blockedUsers.includes(chat.email.toLowerCase())) {
      alert("لقد قمت بحظر هذا المستخدم. يرجى إلغاء الحظر أولاً لتتمكن من إرسال الرسائل 🚫");
      return;
    }
  }
  if (editingMessageId) {
    const message = state.conversations[chatId].find((m) => m.id === editingMessageId);
    if (message) {
      message.text = value;
      message.edited = true;
    }
    editingMessageId = null;
    messageInput.placeholder = t("typeMessagePlaceholder");
    saveState();
    renderMessages();
    return;
  }
  if (chat.type === "ai" || chat.id === "ai:chatgpt") {
    const isImageReq = /^(ارسم|أنشئ صورة|انشئ صورة|توليد صورة|صورة لـ|صورة ل|draw|generate image|create image|image of)\b/i.test(value);
    const words = value.trim().split(/\s+/).filter(Boolean).length;

    if (isImageReq) {
      if (!currentAiUsage.isVip && currentAiUsage.imagesRemaining <= 0) {
        openAiUpgradeDialog(currentLang === "ar"
          ? "لقد استهلكت رصيدك اليومي المجاني للصور (3 صور). اشترك الآن في باقة VIP للحصول على 20 صورة يومياً لمدة شهرين كاملين!"
          : "Daily image limit reached. Upgrade to VIP for 20 images/day for 2 months!");
        return;
      }
    } else {
      if (currentAiUsage.wordsRemaining <= 0 || (words > 0 && words > currentAiUsage.wordsRemaining)) {
        openAiUpgradeDialog(currentLang === "ar"
          ? `لقد استهلكت رصيد الكلمات لليوم (متبقي لديك ${currentAiUsage.wordsRemaining} كلمة ورسالتك تحتوي على ${words} كلمة). اشترك الآن في باقة VIP للحصول على 500 كلمة يومياً لمدة شهرين كاملين!`
          : `Daily word limit reached. Upgrade to VIP for 500 words/day for 2 months!`);
        return;
      }
    }

    messageInput.value = "";
    state.conversations["ai:chatgpt"].push(ownMessage("text", { text: value }));
    saveState();
    renderMessages();
    renderConversations();

    if (isImageReq) {
      const prompt = value.replace(/^(ارسم|أنشئ صورة|انشئ صورة|توليد صورة|صورة لـ|صورة ل|draw|generate image|create image|image of)\s*/i, "").trim() || value;
      generateAiImagePrompt(prompt);
    } else {
      askAiChat(value);
    }
    return;
  }
  if (chat.id === "support:live" || chat.type === "support") {
    try {
      await fetch("/api/support/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from: state.currentUser.email,
          to: "support@chato.system",
          text: value
        })
      });
      await loadSupportMessages();
    } catch (error) {
      recorderStatus.textContent = error.message;
    }
  } else if (chat.type === "friend") {
    try {
      await sendSharedMessage(chat.email, { type: "text", text: value });
      await loadSharedMessages(chat.email);
    } catch (error) {
      alert(error.message || "تعذر إرسال الرسالة، تأكد من الاتصال بالإنترنت.");
    }
    renderConversations();
  } else if (chat.type === "group") {
    // التحقق من صلاحية إرسال الرسائل في المجموعات (Admins Only)
    const isSenderAdmin = chat.admin === state.currentUser?.email || (Array.isArray(chat.admins) && chat.admins.includes(state.currentUser?.email));
    if (chat.who_can_send === "admins_only" && !isSenderAdmin) {
      alert("إرسال الرسائل في هذه المجموعة مقتصر على المشرفين فقط 🔒");
      return;
    }
    state.conversations[chatId].push(ownMessage("text", { text: value }));
    saveState();
    renderMessages();
    renderConversations();
    try {
      await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          sender_email: state.currentUser?.email,
          content: value,
          type: "text"
        })
      });
    } catch {}
  } else {
    state.conversations[chatId].push(ownMessage("text", { text: value }));
    saveState();
    renderMessages();
    renderConversations();
  }
  messageInput.value = "";
}

async function loadSupportMessages() {
  if (!state.currentUser?.email) return;
  try {
    const res = await fetch(`/api/support/messages?email=${encodeURIComponent(state.currentUser.email)}`);
    if (res.ok) {
      const data = await res.json();
      if (data.ticketDeleted) {
        state.hasSupportTicket = false;
        delete state.conversations["support:live"];
        saveState();
        renderConversations();
        if (state.activeChatId === "support:live") {
          const first = getChats()[0];
          if (first) openChat(first.id);
        }
        return;
      }
      state.conversations["support:live"] = (data.messages || []).map((m) => ({
        ...m,
        from: m.from === state.currentUser.email ? "me" : "other"
      }));
      saveState();
      if (state.activeChatId === "support:live") {
        renderMessages();
        renderConversations();
      }
    }
  } catch {}
}

async function loadAdminNotices() {
  if (!state.currentUser?.email) return;
  try {
    const res = await fetch(`/api/messages?user=${encodeURIComponent(state.currentUser.email)}&friend=admin@chato.system`);
    if (res.ok) {
      const data = await res.json();
      const now = Date.now();
      const msgs = (data.messages || []).filter((m) => !m.expiresAt || now < m.expiresAt);
      if (msgs.length) {
        state.conversations["admin:notice"] = msgs.map((m) => ({
          ...m,
          from: m.from === state.currentUser.email ? "me" : "other"
        }));
      } else {
        delete state.conversations["admin:notice"];
        if (state.activeChatId === "admin:notice") {
          const first = getChats()[0];
          if (first) openChat(first.id);
        }
      }
      saveState();
      renderConversations();
      if (state.activeChatId === "admin:notice") renderMessages();
    }
  } catch {}
}

function startEdit(message) {
  editingMessageId = message.id;
  messageInput.value = message.text;
  messageInput.focus();
  messageInput.placeholder = t("editMsg");
}

async function deleteOwnMessage(id) {
  if (!confirm(t("confirmDeleteMsg") || "هل تريد حذف هذه الرسالة نهائياً؟")) return;
  try {
    await fetch(`/api/messages?id=${encodeURIComponent(id)}&user=${encodeURIComponent(state.currentUser.email)}`, {
      method: "DELETE"
    });
  } catch (err) {
    console.error("Failed to delete message from server", err);
  }
  state.conversations[state.activeChatId] = (state.conversations[state.activeChatId] || []).filter(
    (message) => message.id !== id
  );
  saveState();
  renderMessages();
  renderConversations();
}

function isUserChatPlusSubscriber() {
  if (state.currentUser?.isChatPlus) return true;
  if (state.currentUser?.chatPlusUntil && Date.now() < state.currentUser.chatPlusUntil) return true;
  return false;
}

function isUserAiPlusSubscriber() {
  if (state.currentUser?.isVip) return true;
  if (currentAiUsage && currentAiUsage.isVip) return true;
  if (state.currentUser?.vipUntil && Date.now() < state.currentUser.vipUntil) return true;
  return false;
}

function isUserPlusSubscriber() {
  return isUserChatPlusSubscriber();
}

function openSubPlusUpgradeModal(customMsg) {
  openSettings();
  showSettingsView("subscriptions");
  const subRowChatPlus = el("subRowChatPlus");
  if (subRowChatPlus) subRowChatPlus.click();
  if (customMsg) {
    setTimeout(() => alert(customMsg), 150);
  }
}

async function translateMessage(message) {
  if (!isUserChatPlusSubscriber()) {
    openSubPlusUpgradeModal("الترجمة الفورية للرسائل ميزة حصرية لمشتركي شاتو بلاس 👑 - اشترك الآن لترجمة أي رسالة فوراً!");
    return;
  }
  if (!message || (!message.text && !message.content)) {
    alert("لا يوجد نص في هذه الرسالة لترجمته.");
    return;
  }
  try {
    const res = await fetch("/api/messages/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: state.currentUser?.email,
        messageId: message.id,
        targetLang: "auto"
      })
    });
    const data = await res.json();
    if (!res.ok) {
      if (data.is_vip_only) {
        openSubPlusUpgradeModal(data.error);
        return;
      }
      throw new Error(data.error || "فشلت الترجمة");
    }
    message.translatedText = data.translatedText;
    message.translations = message.translations || {};
    message.translations[data.targetLang] = data.translatedText;
    saveState();
    renderMessages();
  } catch (err) {
    alert("خطأ أثناء ترجمة الرسالة: " + err.message);
  }
}

async function togglePin(messageId) {
  const chatId = state.activeChatId;
  const chat = getChat();
  const friendEmail = chat?.email;
  const chatMessages = state.conversations[chatId] || [];
  const msg = chatMessages.find((m) => m.id === messageId);
  if (!msg) return;

  state.pinnedMessages = state.pinnedMessages || {};
  state.pinnedMessages[chatId] = state.pinnedMessages[chatId] || [];
  const currentPins = state.pinnedMessages[chatId];
  const isAlreadyPinned = currentPins.some((p) => p.message_id === messageId) || msg.pinned;

  if (isAlreadyPinned) {
    try {
      const res = await fetch("/api/chats/unpin-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: state.currentUser?.email,
          friend: friendEmail,
          chatId,
          messageId
        })
      });
      if (res.ok) {
        state.pinnedMessages[chatId] = currentPins.filter((p) => p.message_id !== messageId);
        msg.pinned = false;
        saveState();
        renderMessages();
        updatePinnedBannerUI();
      }
    } catch (err) {
      console.warn("Unpin error:", err);
    }
    return;
  }

  // فحص الحد الأقصى للتثبيت (25 لمشتركي بلاس / 3 للمجاني)
  const isPlus = isUserPlusSubscriber();
  const maxPins = isPlus ? 25 : 3;
  if (currentPins.length >= maxPins) {
    if (!isPlus) {
      openSubPlusUpgradeModal("وصلت للحد الأقصى لتثبيت الرسائل (3 رسائل في الباقة المجانية) 📌\nاشترك الآن في بلاس AI شاتو لتثبيت حتى 25 رسالة في كل محادثة!");
    } else {
      alert("لقد وصلت للحد الأقصى لتثبيت الرسائل في هذه المحادثة (25 رسالة).");
    }
    return;
  }

  try {
    const res = await fetch("/api/chats/pin-message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: state.currentUser?.email,
        friend: friendEmail,
        chatId,
        messageId
      })
    });
    const data = await res.json();
    if (!res.ok) {
      if (data.limitReached && !isPlus) {
        openSubPlusUpgradeModal(data.error);
      } else {
        alert(data.error || "تعذر تثبيت الرسالة");
      }
      return;
    }
    currentPins.push({
      id: data.pinned.id,
      chat_id: chatId,
      message_id: messageId,
      pinned_by: state.currentUser?.email,
      pinned_at: Date.now(),
      message: msg
    });
    msg.pinned = true;
    saveState();
    renderMessages();
    updatePinnedBannerUI();
  } catch (err) {
    alert("تعذر تثبيت الرسالة: " + err.message);
  }
}

function updatePinnedBannerUI() {
  const banner = el("chatPinnedBanner");
  if (!banner) return;
  const chatId = state.activeChatId;
  state.pinnedMessages = state.pinnedMessages || {};
  const pins = state.pinnedMessages[chatId] || [];

  if (!pins.length) {
    banner.hidden = true;
    return;
  }

  banner.hidden = false;
  state.currentPinIndex = state.currentPinIndex || {};
  let idx = state.currentPinIndex[chatId] || 0;
  if (idx >= pins.length) idx = 0;
  if (idx < 0) idx = pins.length - 1;
  state.currentPinIndex[chatId] = idx;

  const curPin = pins[idx];
  const chatMessages = state.conversations[chatId] || [];
  const targetMsg = curPin.message || chatMessages.find((m) => m.id === curPin.message_id);

  const senderSpan = el("pinnedBannerSender");
  const snippetSpan = el("pinnedBannerSnippet");
  const countSpan = el("pinnedBannerCount");

  if (senderSpan) senderSpan.textContent = `رسالة مثبتة (${idx + 1} من ${pins.length})`;
  if (snippetSpan) {
    const snippet = targetMsg?.text || (targetMsg?.type === "image" ? "📷 صورة" : (targetMsg?.type === "voice" ? "🎤 تسجيل صوتي" : "مرفق"));
    snippetSpan.textContent = snippet.length > 50 ? snippet.slice(0, 50) + "..." : snippet;
  }
  if (countSpan) countSpan.textContent = `${idx + 1} / ${pins.length}`;
}

function scrollToPinnedMessage() {
  const chatId = state.activeChatId;
  const pins = state.pinnedMessages?.[chatId] || [];
  const idx = state.currentPinIndex?.[chatId] || 0;
  const curPin = pins[idx];
  if (!curPin) return;

  const bubble = document.getElementById("msg-" + curPin.message_id);
  if (bubble) {
    bubble.scrollIntoView({ behavior: "smooth", block: "center" });
    bubble.classList.add("message-pinned-highlight");
    setTimeout(() => {
      bubble.classList.remove("message-pinned-highlight");
    }, 2000);
  }
}

function sendImage(file) {
  if (!file?.type.startsWith("image/")) return;
  const chat = getChat();
  if (chat?.type === "ai" || chat?.id === "ai:chatgpt") {
    // التحقق من حصة الصور اليومية
    if (!currentAiUsage.isVip && !currentAiUsage.unlimitedSendImages && currentAiUsage.imagesRemaining <= 0) {
      openAiUpgradeDialog(currentLang === "ar" 
        ? "لقد استهلكت رصيدك اليومي المجاني (3 صور). يمكنك الترقية الآن لباقة VIP (شهران) للحصول على إرسال صور بلا حدود و500 كلمة يومياً!" 
        : "Daily free image limit reached (3 images). Upgrade to VIP for unlimited images and 500 words/day for 2 months!");
      return;
    }
    const reader = new FileReader();
    reader.onload = async () => {
      const src = reader.result;
      state.conversations["ai:chatgpt"].push(ownMessage("image", { imageUrl: src, fileName: file.name || "image.png" }));
      saveState();
      renderMessages();

      const typingMsg = otherMessage(currentLang === "ar" ? "ChatGPT يعاين الصورة ويحللها... 🖼️💭" : "ChatGPT is analyzing the image... 🖼️💭");
      state.conversations["ai:chatgpt"].push(typingMsg);
      renderMessages();

      try {
        const res = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: state.currentUser?.email || "guest@chato.com",
            prompt: "صف هذه الصورة وتحدث عنها بإيجاز",
            imageUrl: src
          })
        });
        const data = await res.json();
        state.conversations["ai:chatgpt"] = state.conversations["ai:chatgpt"].filter((m) => m.id !== typingMsg.id);
        if (res.ok) {
          state.conversations["ai:chatgpt"].push(otherMessage(data.text || "تم استلام صورتك بنجاح! 🖼️ تفضل بسؤالي حول أي شيء تريده."));
          fetchAiUsage();
        } else {
          state.conversations["ai:chatgpt"].push(otherMessage(data.error || "تم استلام الصورة بنجاح!"));
          if (res.status === 429) openAiUpgradeDialog(data.error);
        }
      } catch {
        state.conversations["ai:chatgpt"] = state.conversations["ai:chatgpt"].filter((m) => m.id !== typingMsg.id);
        state.conversations["ai:chatgpt"].push(otherMessage(currentLang === "ar" ? "تم استلام صورتك بنجاح! 🖼️ تفضل بسؤالي حول أي شيء تريده." : "Image received successfully! 🖼️"));
      }
      saveState();
      renderMessages();
      renderConversations();
    };
    reader.readAsDataURL(file);
    return;
  }
  const reader = new FileReader();
  reader.onload = async () => {
    const chat = getChat();
    if (chat.type === "friend") {
      try {
        await sendSharedMessage(chat.email, { type: "image", imageUrl: reader.result, fileName: file.name });
        await loadSharedMessages(chat.email);
      } catch (error) {
        recorderStatus.textContent = error.message;
      }
      return;
    }
    state.conversations[state.activeChatId].push(ownMessage("image", { imageUrl: reader.result, fileName: file.name }));
    saveState();
    renderMessages();
    renderConversations();
  };
  reader.readAsDataURL(file);
}

function readImage(file, callback) {
  if (!file?.type.startsWith("image/")) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const rawData = e.target.result;
    const img = new Image();
    img.onload = () => {
      const maxDim = 512;
      let w = img.width;
      let h = img.height;
      if (w > maxDim || h > maxDim) {
        if (w > h) {
          h = Math.round((h * maxDim) / w);
          w = maxDim;
        } else {
          w = Math.round((w * maxDim) / h);
          h = maxDim;
        }
      }
      try {
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, w, h);
        const compressed = canvas.toDataURL("image/jpeg", 0.85);
        callback(compressed);
      } catch {
        callback(rawData);
      }
    };
    img.onerror = () => callback(rawData);
    img.src = rawData;
  };
  reader.readAsDataURL(file);
}

/* ==========================================================================
   ChatGPT AI Assistant, Words Quota (Free: 90 words, VIP: 500 words/2 months) & 20 SAR Upgrade
   ========================================================================== */
let currentAiUsage = {
  wordsRemaining: 90,
  maxWords: 90,
  imagesRemaining: 3,
  maxImages: 3,
  isVip: false,
  unlimited: false,
  unlimitedSendImages: false,
  vipDaysRemaining: 0
};

async function fetchAiUsage() {
  if (!state.currentUser?.email) return;
  try {
    const res = await fetch(`/api/ai/usage?email=${encodeURIComponent(state.currentUser.email)}`);
    if (res.ok) {
      const data = await res.json();
      currentAiUsage = data;
      if (state.activeChatId === "ai:chatgpt") {
        if (data.isVip) {
          chatMeta.textContent = currentLang === "ar"
            ? `باقة VIP 👑 (متبقي ${data.vipDaysRemaining} يوم) | اليوم: ${data.wordsRemaining}/500 كلمة | ${data.imagesRemaining}/20 صورة`
            : `VIP Package 👑 (${data.vipDaysRemaining} days left) | Today: ${data.wordsRemaining}/500 words | ${data.imagesRemaining}/20 imgs`;
        } else {
          chatMeta.textContent = currentLang === "ar" 
            ? `الخطة المجانية 🆓 | متبقي اليوم: ${data.wordsRemaining}/90 كلمة | ${data.imagesRemaining}/3 صور` 
            : `Free Plan 🆓 | Remaining: ${data.wordsRemaining}/90 words | ${data.imagesRemaining}/3 imgs`;
        }
      }
      if (aiImagesRemainingBadge) {
        aiImagesRemainingBadge.textContent = data.imagesRemaining;
      }
    }
  } catch {}
}

async function askAiChat(prompt) {
  const typingMsg = otherMessage(currentLang === "ar" ? "ChatGPT يكتب الآن... 💭" : "ChatGPT is typing... 💭");
  state.conversations["ai:chatgpt"].push(typingMsg);
  renderMessages();

  // 1. تجربة الخادم الأساسي أولاً (مع فحص الحصة اليومية والترقية)
  try {
    const res = await fetch("/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: state.currentUser?.email || "guest@chato.com", prompt })
    });

    if (res.status === 429) {
      const data = await res.json();
      state.conversations["ai:chatgpt"] = state.conversations["ai:chatgpt"].filter((m) => m.id !== typingMsg.id);
      saveState();
      renderMessages();
      openAiUpgradeDialog(data.error || "لقد استهلكت رصيدك اليومي من الكلمات. يتجدد الرصيد غداً أو اشترك الآن في باقة VIP (شهران) بـ 20 ريال للحصول على 500 كلمة يومياً و20 صورة يومياً.");
      return;
    }

    if (res.ok) {
      const data = await res.json();
      state.conversations["ai:chatgpt"] = state.conversations["ai:chatgpt"].filter((m) => m.id !== typingMsg.id);
      state.conversations["ai:chatgpt"].push(otherMessage(data.text));
      saveState();
      renderMessages();
      fetchAiUsage();
      return;
    }
  } catch (err) {
    console.warn("Backend AI endpoint unreachable, switching to direct AI engine:", err);
  }

  // 2. إذا كان الخادم غير متاح أو على رابط خارجي: المحرك المباشر يضمن الرد 100%
  try {
    const directRes = await fetch("https://text.pollinations.ai/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          { role: "system", content: "أنت ChatGPT، مساعد ذكاء اصطناعي ذكي وشامل في تطبيق Chato. تجيب بأسلوب عربي دقيق وواضح ومفيد وتساعد في كافة المجالات." },
          { role: "user", content: prompt }
        ],
        model: "openai",
        seed: Math.floor(Math.random() * 100000)
      })
    });
    const replyText = await directRes.text();
    state.conversations["ai:chatgpt"] = state.conversations["ai:chatgpt"].filter((m) => m.id !== typingMsg.id);
    state.conversations["ai:chatgpt"].push(otherMessage(replyText || (currentLang === "ar" ? "أهلاً بك! كيف يمكنني مساعدتك؟" : "Hello! How can I help you?")));
    saveState();
    renderMessages();
  } catch (clientErr) {
    state.conversations["ai:chatgpt"] = state.conversations["ai:chatgpt"].filter((m) => m.id !== typingMsg.id);
    state.conversations["ai:chatgpt"].push(otherMessage(currentLang === "ar" ? "تعذر الاتصال بـ ChatGPT. يرجى التحقق من اتصالك بالإنترنت." : "Could not connect to ChatGPT. Please check your internet."));
    saveState();
    renderMessages();
  }
}

async function generateAiImagePrompt(prompt) {
  const loadingMsg = otherMessage(currentLang === "ar" ? "جاري رسم وتوليد الصورة بالذكاء الاصطناعي... 🎨⏳" : "Generating AI image... 🎨⏳");
  state.conversations["ai:chatgpt"].push(loadingMsg);
  renderMessages();

  // 1. تجربة الخادم أولاً
  try {
    const res = await fetch("/api/ai/images", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: state.currentUser?.email || "guest@chato.com", prompt })
    });

    if (res.status === 429) {
      const data = await res.json();
      state.conversations["ai:chatgpt"] = state.conversations["ai:chatgpt"].filter((m) => m.id !== loadingMsg.id);
      saveState();
      renderMessages();
      openAiUpgradeDialog(data.error || "لقد استهلكت حد الصور اليوم. يتجدد الرصيد غداً أو اشترك الآن في باقة VIP (شهران) للحصول على 20 صورة يومياً!");
      return;
    }

    if (res.ok) {
      const data = await res.json();
      state.conversations["ai:chatgpt"] = state.conversations["ai:chatgpt"].filter((m) => m.id !== loadingMsg.id);
      const msg = otherMessage(currentLang === "ar" ? `🎨 تم إنشاء الصورة بواسطة الذكاء الاصطناعي:\n"${prompt}"` : `🎨 Generated by AI:\n"${prompt}"`);
      msg.type = "image";
      msg.imageUrl = data.imageUrl;
      state.conversations["ai:chatgpt"].push(msg);
      saveState();
      renderMessages();
      fetchAiUsage();
      return;
    }
  } catch (err) {
    console.warn("Backend image endpoint unreachable, using direct image generator:", err);
  }

  // 2. التوليد المباشر في حال عدم توفر الخادم
  const fallbackUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=768&height=768&nologo=true&seed=${Math.floor(Math.random() * 100000)}`;
  state.conversations["ai:chatgpt"] = state.conversations["ai:chatgpt"].filter((m) => m.id !== loadingMsg.id);
  const msg = otherMessage(currentLang === "ar" ? `🎨 تم إنشاء الصورة بواسطة الذكاء الاصطناعي:\n"${prompt}"` : `🎨 Generated by AI:\n"${prompt}"`);
  msg.type = "image";
  msg.imageUrl = fallbackUrl;
  state.conversations["ai:chatgpt"].push(msg);
  saveState();
  renderMessages();
}

function openAiUpgradeDialog(reason) {
  if (aiUpgradeReason && reason) {
    aiUpgradeReason.textContent = reason;
  }
  openDialog(aiUpgradeDialog);
}

async function upgradeAiUnlimited() {
  if (!state.currentUser?.email) return;
  if (confirm(currentLang === "ar" 
    ? "هل ترغب في تأكيد سداد 99 ريال لتفعيل باقة بلاس AI شاتو لمدة شهرين كاملين (60 يوماً)؟\n• 500 كلمة يومياً\n• 20 صورة يومياً\n• إرسال صور بلا حدود في المحادثة" 
    : "Confirm payment of 99 SAR to activate Chato AI Plus for 2 months (60 days)?\n• 500 words/day\n• 20 images/day\n• Unlimited image uploads")) {
    try {
      const res = await fetch("/api/ai/upgrade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: state.currentUser.email, planCode: "chato_ai_plus" })
      });
      const data = await res.json();
      if (data.ok) {
        alert(currentLang === "ar" ? "تهانينا! 🎉 تم سداد 99 ريال بنجاح وتفعيل باقة بلاس AI شاتو لمدة شهرين كاملين (60 يوماً)!" : "Success! 99 SAR payment processed and Chato AI Plus activated for 2 months (60 days)!");
        closeDialog(aiUpgradeDialog);
        fetchAiUsage();
      }
    } catch {
      alert("فشل تأكيد العملية. يرجى المحاولة مرة أخرى.");
    }
  }
}

function openAiImageDialog() {
  if (aiImagePromptInput) aiImagePromptInput.value = "";
  if (aiImagePromptError) aiImagePromptError.textContent = "";
  if (aiImagesRemainingBadge) {
    aiImagesRemainingBadge.textContent = currentAiUsage.unlimited ? "غير محدود" : currentAiUsage.imagesRemaining;
  }
  openDialog(aiImagePromptDialog);
  setTimeout(() => aiImagePromptInput?.focus(), 80);
}

function submitAiImagePrompt(e) {
  e.preventDefault();
  const prompt = clean(aiImagePromptInput.value);
  if (!prompt) return;
  closeDialog(aiImagePromptDialog);
  openChat("ai:chatgpt");
  state.conversations["ai:chatgpt"].push(ownMessage("text", { text: `🎨 رسم صورة: ${prompt}` }));
  saveState();
  renderMessages();
  generateAiImagePrompt(prompt);
}

/* ==========================================================================
   Friends & Groups
   ========================================================================== */
async function addFriend(person, btn) {
  if (state.friends.some((friend) => friend.email.toLowerCase() === person.email.toLowerCase())) {
    closeDialog(friendDialog);
    openChat(`friend:${person.email}`);
    return;
  }
  if (btn) {
    btn.disabled = true;
    btn.textContent = currentLang === "ar" ? "جاري الإضافة..." : "Adding...";
  }
  try {
    const res = await fetch("/api/friendships", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ from: state.currentUser.email, to: person.email })
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "تعذر إضافة الصديق");
      if (btn) {
        btn.disabled = false;
        btn.textContent = t("add");
      }
      return;
    }
    // إضافة الصديق مباشرة وفتح المحادثة فوراً
    if (!state.friends.some((f) => f.email.toLowerCase() === person.email.toLowerCase())) {
      state.friends.push({
        name: person.name,
        email: person.email.toLowerCase(),
        image: person.image || ""
      });
      saveState();
    }
    await refreshFriends();
    closeDialog(friendDialog);
    openChat(`friend:${person.email.toLowerCase()}`);
  } catch (err) {
    if (btn) {
      btn.disabled = false;
      btn.textContent = t("add");
    }
    alert(err.message || t("serverOfflineError"));
  }
}

async function renderFriendResults() {
  const query = clean(friendSearch.value);
  friendResult.innerHTML = `<p class="muted">${t("searching")}</p>`;
  const matches = (await searchAccounts(query)).filter(
    (person) => person.email.toLowerCase() !== state.currentUser?.email.toLowerCase()
  );
  friendResult.innerHTML = "";
  if (!matches.length) {
    if (query) {
      friendResult.innerHTML = `
        <p class="muted" style="margin-bottom:12px;">${t("noUserFound")}</p>
        <div style="padding:14px; background:rgba(255,255,255,0.04); border:1px solid var(--line); border-radius:10px; text-align:center;">
          <p style="margin:0 0 10px; font-size:13px; color:var(--text);">هل تريد إضافة <strong>${clean(query)}</strong> وبدء المحادثة معه فوراً؟</p>
          <button type="button" class="btn-primary" id="directAddFriendBtn" style="padding:8px 18px; font-size:13px; width:auto; display:inline-flex;">➕ إضافة وبدء الدردشة فوراً</button>
        </div>
      `;
      const directBtn = el("directAddFriendBtn");
      if (directBtn) {
        directBtn.addEventListener("click", async () => {
          directBtn.disabled = true;
          directBtn.textContent = "جاري البدء...";
          const isEmail = /^\S+@\S+\.\S+$/.test(query);
          const targetEmail = isEmail ? query.toLowerCase() : `${encodeURIComponent(query.toLowerCase())}@chato.user`;
          const targetName = isEmail ? query.split("@")[0] : query;
          const newFriend = { name: targetName, email: targetEmail, image: "" };

          try {
            await fetch("/api/friendships", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ from: state.currentUser.email, to: targetEmail })
            });
          } catch {}

          if (!state.friends.some((f) => f.email.toLowerCase() === newFriend.email.toLowerCase())) {
            state.friends.push(newFriend);
            saveState();
            renderConversations();
          }
          closeDialog(friendDialog);
          openChat(`friend:${newFriend.email.toLowerCase()}`);
        });
      }
    } else {
      friendResult.innerHTML = `<p class="muted">${t("noUserFound")}</p>`;
    }
    return;
  }
  matches.forEach((person) => {
    const row = document.createElement("div");
    row.className = "person-result";
    const avatar = document.createElement("span");
    avatar.className = "avatar";
    avatarContent(avatar, person);
    const info = document.createElement("div");
    const title = document.createElement("strong");
    title.textContent = person.name;
    const mail = document.createElement("p");
    mail.className = "muted";
    mail.textContent = person.email;
    info.append(title, mail);
    const button = document.createElement("button");
    const isFriend = state.friends.some((friend) => friend.email.toLowerCase() === person.email.toLowerCase());
    if (isFriend) {
      button.textContent = "محادثة 💬";
      button.addEventListener("click", () => {
        closeDialog(friendDialog);
        openChat(`friend:${person.email.toLowerCase()}`);
      });
    } else {
      button.textContent = "إضافة وبدء الشات ➕";
      button.addEventListener("click", async () => {
        await addFriend(person, button);
      });
    }
    row.append(avatar, info, button);
    friendResult.appendChild(row);
  });
}

// 1. حذف صديق نهائياً من قاعدة البيانات والسيرفر
async function removeActiveFriend() {
  const email = deleteFriendButton.dataset.email;
  if (!email) return;
  if (!confirm(t("confirmDeleteFriend") || "هل أنت متأكد من حذف هذا الصديق نهائياً؟")) return;
  try {
    await fetch(`/api/friends?user=${encodeURIComponent(state.currentUser.email)}&friend=${encodeURIComponent(email)}`, {
      method: "DELETE"
    });
  } catch (err) {
    console.error("Failed to delete friend from server", err);
  }
  state.friends = state.friends.filter((friend) => friend.email !== email);
  delete state.conversations[`friend:${email}`];
  state.activeChatId = "support";
  saveState();
  renderConversations();
  openChat("support");
  await refreshFriends();
}

// 4. اختيار الأصدقاء عند إنشاء مجموعة
function renderGroupFriendsPicker() {
  if (!groupFriendsPicker) return;
  groupFriendsPicker.innerHTML = "";
  const friends = state.friends || [];
  if (!friends.length) {
    groupFriendsPicker.innerHTML = `<p class="muted" style="padding: 10px; font-size: 13px;">${t("noFriendsForGroup") || "لا يوجد لديك أصدقاء حالياً. أضف أصدقاء أولاً لتتمكن من إضافتهم للمجموعة."}</p>`;
    return;
  }
  friends.forEach((friend) => {
    const label = document.createElement("label");
    label.className = "friend-picker-item";

    const chk = document.createElement("input");
    chk.type = "checkbox";
    chk.name = "groupFriend";
    chk.value = friend.name;
    chk.dataset.email = friend.email;

    const av = document.createElement("span");
    av.className = "avatar";
    avatarContent(av, friend);

    const info = document.createElement("div");
    info.className = "friend-picker-info";
    const st = document.createElement("strong");
    st.textContent = friend.name;
    const em = document.createElement("span");
    em.textContent = friend.email;
    info.append(st, em);

    label.append(chk, av, info);
    groupFriendsPicker.appendChild(label);
  });
}

function addGroup() {
  const name = clean(groupName.value);
  if (!name) {
    groupError.textContent = "يرجى إدخال اسم المجموعة";
    return;
  }
  const checkedBoxes = Array.from(document.querySelectorAll("input[name='groupFriend']:checked"));
  const members = checkedBoxes.map((chk) => chk.value);
  const memberEmails = checkedBoxes.map((chk) => chk.dataset.email).filter(Boolean);

  // دعم إضافة عضو بالبريد مباشرة
  const directInp = el("directGroupMemberEmail");
  if (directInp && directInp.value.trim()) {
    const rawDirect = directInp.value.trim().toLowerCase();
    memberEmails.push(rawDirect);
    members.push(rawDirect.split("@")[0]);
  }

  if (!memberEmails.length) {
    groupError.textContent = "يرجى اختيار صديق أو كتابة بريد عضو واحد على الأقل للمجموعة";
    return;
  }

  const sendPermRadio = document.querySelector("input[name='who_can_send']:checked") || document.querySelector("input[name='groupSendPermission']:checked");
  const whoCanSend = sendPermRadio ? sendPermRadio.value : "everyone";

  const groupId = newId();
  const allMembers = [...new Set([state.currentUser.name, ...members])];
  const allEmails = [...new Set([state.currentUser.email.toLowerCase(), ...memberEmails.map(e => e.toLowerCase())])];

  const group = {
    id: groupId,
    name,
    image: groupImageData,
    admin: state.currentUser.email.toLowerCase(),
    admins: [state.currentUser.email.toLowerCase()],
    who_can_send: whoCanSend,
    members: allMembers,
    member_emails: allEmails,
    createdAt: Date.now()
  };

  // حفظ محلياً فوراً
  state.groups = Array.isArray(state.groups) ? state.groups : [];
  state.groups.unshift(group);
  const initialMsg = {
    id: newId(),
    chat_id: `group:${groupId}`,
    from: state.currentUser.email,
    fromName: state.currentUser.name,
    to: `group:${groupId}`,
    type: "system",
    text: currentLang === "ar" 
      ? `قام ${state.currentUser.name} بإنشاء المجموعة وإضافة الأعضاء 👥\nصلاحية إرسال الرسائل: ${whoCanSend === "admins_only" ? "المشرف فقط 🔒" : "الجميع 👥"}`
      : `${state.currentUser.name} created the group and added members 👥`,
    status: "sent",
    read: true,
    createdAt: Date.now()
  };
  state.conversations[`group:${groupId}`] = [initialMsg];
  saveState();

  // إرسال للخادم لمزامنة المجموعة مع جميع الأعضاء في الوقت الفعلي
  fetch("/api/groups", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(group)
  }).catch(() => {});

  el("groupForm").reset();
  if (directInp) directInp.value = "";
  groupImageData = "";
  groupImagePreview.textContent = "+";
  closeDialog(groupDialog);
  renderConversations();
  openChat(`group:${groupId}`);
}

/* ==========================================================================
   2. الإشعارات والرد على طلبات الصداقة (قبول / رفض)
   ========================================================================== */
async function respondToFriendRequest(id, action) {
  try {
    const res = await fetch("/api/friendships/respond", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action, user: state.currentUser.email })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "فشل معالجة الطلب");
    await refreshNotifications();
    await refreshFriends();
    renderNotifications();
  } catch (err) {
    alert(err.message);
  }
}

function renderNotifications() {
  notificationList.innerHTML = "";
  if (!notifications.length) {
    notificationList.innerHTML = `<p class="muted">${t("noNotifications")}</p>`;
    return;
  }
  notifications.forEach((notification) => {
    const person = notification.from;
    const row = document.createElement("div");
    row.className = "notif-item";

    const top = document.createElement("div");
    top.className = "notif-top";
    const avatar = document.createElement("span");
    avatar.className = "avatar";
    avatarContent(avatar, person);

    const copy = document.createElement("div");
    copy.className = "notif-copy";
    const title = document.createElement("strong");
    title.textContent = person.name;
    const text = document.createElement("p");
    text.className = "muted";
    text.textContent = t("friendRequestSent") || "أرسل لك طلب صداقة 🤝";
    copy.append(title, text);

    top.append(avatar, copy);

    const actions = document.createElement("div");
    actions.className = "notif-actions";

    const acceptBtn = document.createElement("button");
    acceptBtn.type = "button";
    acceptBtn.className = "btn-accept-req";
    acceptBtn.textContent = t("accept") || "قبول";
    acceptBtn.addEventListener("click", async () => {
      acceptBtn.disabled = true;
      acceptBtn.textContent = "...";
      await respondToFriendRequest(notification.id, "accept");
    });

    const rejectBtn = document.createElement("button");
    rejectBtn.type = "button";
    rejectBtn.className = "btn-reject-req";
    rejectBtn.textContent = t("reject") || "رفض";
    rejectBtn.addEventListener("click", async () => {
      rejectBtn.disabled = true;
      rejectBtn.textContent = "...";
      await respondToFriendRequest(notification.id, "reject");
    });

    actions.append(acceptBtn, rejectBtn);
    row.append(top, actions);
    notificationList.appendChild(row);
  });
}

/* ==========================================================================
   7. أدوات المحادثة: إرسال موقع، استطلاع رأي، استيكرات
   ========================================================================== */
function toggleAttachMenu(event) {
  if (event && typeof event.stopPropagation === "function") event.stopPropagation();
  const menu = document.getElementById("attachMenu");
  if (!menu) return;

  const isHidden = menu.hasAttribute("hidden") || menu.style.display === "none";
  if (isHidden) {
    const cMenu = document.getElementById("chat-dropdown-menu");
    if (cMenu) {
      cMenu.setAttribute("hidden", "true");
      cMenu.style.display = "none";
    }
    menu.removeAttribute("hidden");
    menu.style.display = "block";
    const eTray = document.getElementById("emojiTray");
    const sTray = document.getElementById("stickerTray");
    if (eTray) eTray.hidden = true;
    if (sTray) sTray.hidden = true;
  } else {
    menu.setAttribute("hidden", "true");
    menu.style.display = "none";
  }
}
window.toggleAttachMenu = toggleAttachMenu;

function sendLocationMessage() {
  if (attachMenu) attachMenu.hidden = true;
  const chat = getChat();
  if (!chat || chat.type !== "friend") {
    alert(currentLang === "ar" ? "إرسال الموقع متاح في المحادثات الفردية مع الأصدقاء." : "Location sharing is available in friend chats.");
    return;
  }

  if (navigator.geolocation) {
    recorderStatus.textContent = currentLang === "ar" ? "جاري تحديد موقعك..." : "Locating you...";
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        recorderStatus.textContent = "";
        const lat = pos.coords.latitude.toFixed(6);
        const lng = pos.coords.longitude.toFixed(6);
        const locationData = {
          title: currentLang === "ar" ? "الموقع الجغرافي المباشر 📍" : "Live Location 📍",
          lat,
          lng,
          mapUrl: `https://www.google.com/maps?q=${lat},${lng}`
        };
        sendSharedMessage(chat.email, { type: "location", location: locationData });
        loadSharedMessages(chat.email);
      },
      (err) => {
        recorderStatus.textContent = "";
        const locName = prompt(currentLang === "ar" ? "أدخل اسم المدينة أو الموقع (مثال: القاهرة، مصر):" : "Enter location name (e.g. Cairo, Egypt):");
        if (locName) {
          const locationData = {
            title: locName,
            mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locName)}`
          };
          sendSharedMessage(chat.email, { type: "location", location: locationData });
          loadSharedMessages(chat.email);
        }
      },
      { timeout: 7000 }
    );
  } else {
    const locName = prompt(currentLang === "ar" ? "أدخل اسم المدينة أو الموقع:" : "Enter location name:");
    if (locName) {
      const locationData = {
        title: locName,
        mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locName)}`
      };
      sendSharedMessage(chat.email, { type: "location", location: locationData });
      loadSharedMessages(chat.email);
    }
  }
}

function openPollDialog() {
  if (attachMenu) attachMenu.hidden = true;
  const chat = getChat();
  if (!chat || (chat.type !== "friend" && chat.type !== "group")) {
    alert(currentLang === "ar" ? "استطلاع الرأي متاح في محادثات الأصدقاء والمجموعات." : "Polls are available in friend and group chats.");
    return;
  }
  if (pollError) pollError.textContent = "";
  if (el("pollForm")) el("pollForm").reset();
  openDialog(pollDialog);
}

async function submitPoll(event) {
  event.preventDefault();
  if (pollError) pollError.textContent = "";
  const question = clean(pollQuestionInput.value);
  if (!question) {
    pollError.textContent = currentLang === "ar" ? "يرجى كتابة سؤال الاستطلاع" : "Please enter poll question";
    return;
  }
  const optionFields = Array.from(document.querySelectorAll(".poll-option-field"));
  const options = optionFields.map(f => clean(f.value)).filter(Boolean);
  if (options.length < 2) {
    pollError.textContent = currentLang === "ar" ? "يرجى كتابة خيارين على الأقل للاستطلاع" : "Please provide at least 2 options";
    return;
  }

  const pollData = {
    question,
    options: options.map(text => ({ text, votes: [] }))
  };

  const chat = getChat();
  closeDialog(pollDialog);

  if (chat.type === "friend") {
    await sendSharedMessage(chat.email, { type: "poll", poll: pollData });
    await loadSharedMessages(chat.email);
  } else if (chat.type === "group") {
    const message = ownMessage("poll", { poll: pollData });
    state.conversations[state.activeChatId] ||= [];
    state.conversations[state.activeChatId].push(message);
    saveState();
    renderMessages();
  }
}

async function votePoll(messageId, optionIndex) {
  const chat = getChat();
  if (chat.type === "friend") {
    try {
      const res = await fetch("/api/messages/poll-vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messageId,
          optionIndex,
          voterEmail: state.currentUser.email
        })
      });
      const data = await res.json();
      if (data.ok && data.poll) {
        const msg = (state.conversations[state.activeChatId] || []).find(m => m.id === messageId);
        if (msg) {
          msg.poll = data.poll;
          saveState();
          renderMessages();
        }
      }
    } catch (err) {
      console.error(err);
    }
  } else {
    const msg = (state.conversations[state.activeChatId] || []).find(m => m.id === messageId);
    if (msg && msg.poll && Array.isArray(msg.poll.options)) {
      const userEmail = state.currentUser.email;
      msg.poll.options.forEach(opt => {
        opt.votes = (opt.votes || []).filter(e => e !== userEmail);
      });
      if (msg.poll.options[optionIndex]) {
        msg.poll.options[optionIndex].votes = msg.poll.options[optionIndex].votes || [];
        msg.poll.options[optionIndex].votes.push(userEmail);
      }
      saveState();
      renderMessages();
    }
  }
}

function toggleStickerTray() {
  if (attachMenu) attachMenu.hidden = true;
  if (!stickerTray) return;
  stickerTray.hidden = !stickerTray.hidden;
  if (!stickerTray.hidden) {
    emojiTray.hidden = true;
    loadAnimatedStickers(currentStickerPackId || "pack_chato_animated");
  }
}

let currentStickerPackId = "pack_chato_animated";

async function loadAnimatedStickers(packId = "pack_chato_animated") {
  currentStickerPackId = packId;
  const grid = el("stickerGrid");
  if (!grid) return;

  // تحديث الزر النشط في التبويبات
  const tabs = document.querySelectorAll("#stickerTrayTabs .sticker-tab-btn");
  tabs.forEach(tab => {
    tab.classList.toggle("active", tab.dataset.pack === packId);
  });

  if (packId === "pack_emoji") {
    const emojis = ["😀","😂","🥰","😍","😎","🔥","❤️","🎉","👍","🙏","⭐","👏","🚀","💯","🥳","✨","🤔","🥺","💪","👑"];
    grid.innerHTML = "";
    emojis.forEach(em => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "sticker-btn";
      btn.textContent = em;
      btn.onclick = () => sendSticker(em, "emoji");
      grid.appendChild(btn);
    });
    return;
  }

  try {
    const res = await fetch(`/api/stickers?pack_id=${encodeURIComponent(packId)}`);
    if (res.ok) {
      const data = await res.json();
      const stickers = data.stickers || [];
      grid.innerHTML = "";
      if (!stickers.length) {
        grid.innerHTML = `<p class="muted" style="grid-column: 1/-1; text-align: center; padding: 16px;">لا توجد ملصقات في هذه الحزمة حالياً.</p>`;
        return;
      }
      stickers.forEach(st => {
        const item = document.createElement("button");
        item.type = "button";
        item.className = "animated-sticker-item";
        item.title = st.emoji_tag || "ملصق متحرك";
        item.innerHTML = `<img src="${st.sticker_url}" alt="${st.emoji_tag || 'sticker'}" loading="lazy" />`;
        item.onclick = () => sendAnimatedSticker(st.sticker_url, st.emoji_tag, st.id);
        grid.appendChild(item);
      });
      return;
    }
  } catch (err) {
    console.warn("Failed to fetch stickers:", err);
  }

  // ملصقات احتياطية متحركة عالية الجودة
  const fallback = [
    { url: "/stickers/heart_beat.svg", emoji: "❤️" },
    { url: "/stickers/laugh_cry.svg", emoji: "😂" },
    { url: "/stickers/fire_blaze.svg", emoji: "🔥" },
    { url: "/stickers/party_popper.svg", emoji: "🎉" },
    { url: "/stickers/thumbs_up_star.svg", emoji: "👍" },
    { url: "/stickers/rocket_blast.svg", emoji: "🚀" },
    { url: "/stickers/vip_crown_glow.svg", emoji: "👑" },
    { url: "/stickers/magic_star.svg", emoji: "✨" }
  ];
  grid.innerHTML = "";
  fallback.forEach(st => {
    const item = document.createElement("button");
    item.type = "button";
    item.className = "animated-sticker-item";
    item.innerHTML = `<img src="${st.url}" alt="${st.emoji}" loading="lazy" />`;
    item.onclick = () => sendAnimatedSticker(st.url, st.emoji, st.url);
    grid.appendChild(item);
  });
}

async function sendAnimatedSticker(url, emoji, id) {
  if (stickerTray) stickerTray.hidden = true;
  const chat = getChat();
  if (!chat) return;
  const stickerData = { url, sticker_url: url, emoji: emoji || "✨", id };
  if (chat.type === "friend") {
    await sendSharedMessage(chat.email, { type: "sticker", sticker: stickerData, sticker_url: url });
    await loadSharedMessages(chat.email);
    renderConversations();
  } else if (chat.type === "group") {
    const isSenderAdmin = chat.admin === state.currentUser?.email || (Array.isArray(chat.admins) && chat.admins.includes(state.currentUser?.email));
    if (chat.who_can_send === "admins_only" && !isSenderAdmin) {
      alert("إرسال الرسائل في هذه المجموعة مقتصر على المشرفين فقط 🔒");
      return;
    }
    const message = ownMessage("sticker", { sticker: stickerData, sticker_url: url });
    state.conversations[state.activeChatId] ||= [];
    state.conversations[state.activeChatId].push(message);
    saveState();
    renderMessages();
    renderConversations();
    try {
      await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: state.activeChatId,
          sender_email: state.currentUser?.email,
          content: emoji || "ملصق متحرك",
          type: "sticker",
          sticker_url: url
        })
      });
    } catch {}
  }
}

async function sendSticker(emoji, name) {
  if (stickerTray) stickerTray.hidden = true;
  const chat = getChat();
  if (!chat) return;
  const stickerData = { emoji, name };
  if (chat.type === "friend") {
    await sendSharedMessage(chat.email, { type: "sticker", sticker: stickerData });
    await loadSharedMessages(chat.email);
    renderConversations();
  } else if (chat.type === "group") {
    const isSenderAdmin = chat.admin === state.currentUser?.email || (Array.isArray(chat.admins) && chat.admins.includes(state.currentUser?.email));
    if (chat.who_can_send === "admins_only" && !isSenderAdmin) {
      alert("إرسال الرسائل في هذه المجموعة مقتصر على المشرفين فقط 🔒");
      return;
    }
    const message = ownMessage("sticker", { sticker: stickerData });
    state.conversations[state.activeChatId] ||= [];
    state.conversations[state.activeChatId].push(message);
    saveState();
    renderMessages();
    renderConversations();
  }
}

/* ==========================================================================
   Voice Note Recording
   ========================================================================== */
let voiceStream = null;
let voiceRecordTimerInterval = null;
let voiceRecordSeconds = 0;
let isVoicePaused = false;
let voiceCancelled = false;

function formatRecordTimer(secs) {
  const m = Math.floor(secs / 60).toString().padStart(2, "0");
  const s = (secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function restoreComposerAfterVoice() {
  const bar = el("voiceRecordingBar");
  if (bar) bar.hidden = true;
  if (messageInput) messageInput.style.display = "";
  if (voiceButton) {
    voiceButton.style.display = "";
    voiceButton.classList.remove("is-recording");
  }
  const attachBtn = el("attachButton");
  if (attachBtn) attachBtn.style.display = "";
  const imgBtn = el("imageAttachButton");
  if (imgBtn) imgBtn.style.display = "";
  const emojiBtn = el("emojiButton");
  if (emojiBtn) emojiBtn.style.display = "";
  const sendBtn = composerForm?.querySelector(".send-button");
  if (sendBtn) sendBtn.style.display = "";
  const timerEl = el("voiceRecordTimer");
  if (timerEl) timerEl.textContent = "00:00";
}

function toggleRecording() {
  if (!navigator.mediaDevices?.getUserMedia) {
    showToast("الميكروفون غير مدعوم في متصفحك");
    return;
  }
  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then((stream) => {
      voiceStream = stream;
      mediaChunks = [];
      voiceCancelled = false;
      isVoicePaused = false;
      voiceRecordSeconds = 0;

      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) mediaChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        clearInterval(voiceRecordTimerInterval);
        restoreComposerAfterVoice();
        if (voiceCancelled) return;

        const blob = new Blob(mediaChunks, { type: "audio/webm" });
        const reader = new FileReader();
        reader.onload = () => {
          state.conversations[state.activeChatId] ||= [];
          state.conversations[state.activeChatId].push(ownMessage("voice", { audioUrl: reader.result }));
          saveState();
          renderMessages();
          renderConversations();
          showToast("✅ تم إرسال التسجيل الصوتي بنجاح");
        };
        reader.readAsDataURL(blob);
      };

      mediaRecorder.start();

      // إخفاء مدخلات المحادثة وإظهار شريط التسجيل المتطور
      const bar = el("voiceRecordingBar");
      if (bar) bar.hidden = false;
      if (messageInput) messageInput.style.display = "none";
      if (voiceButton) {
        voiceButton.style.display = "none";
        voiceButton.classList.add("is-recording");
      }
      const attachBtn = el("attachButton");
      if (attachBtn) attachBtn.style.display = "none";
      const imgBtn = el("imageAttachButton");
      if (imgBtn) imgBtn.style.display = "none";
      const emojiBtn = el("emojiButton");
      if (emojiBtn) emojiBtn.style.display = "none";
      const sendBtn = composerForm?.querySelector(".send-button");
      if (sendBtn) sendBtn.style.display = "none";

      const timerEl = el("voiceRecordTimer");
      const labelEl = el("voiceRecordLabel");
      const pauseIcon = el("voicePauseIcon");
      if (timerEl) timerEl.textContent = "00:00";
      if (labelEl) labelEl.textContent = "جاري التسجيل...";
      if (pauseIcon) {
        pauseIcon.innerHTML = '<rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>';
      }

      clearInterval(voiceRecordTimerInterval);
      voiceRecordTimerInterval = setInterval(() => {
        if (!isVoicePaused) {
          voiceRecordSeconds++;
          if (timerEl) timerEl.textContent = formatRecordTimer(voiceRecordSeconds);
        }
      }, 1000);

      triggerHaptic(20);
    })
    .catch(() => {
      showToast("يرجى السماح بصلاحية الميكروفون لبدء التسجيل");
    });
}

function cancelVoiceRecording() {
  voiceCancelled = true;
  clearInterval(voiceRecordTimerInterval);
  if (mediaRecorder && mediaRecorder.state !== "inactive") {
    mediaRecorder.stop();
  } else if (voiceStream) {
    voiceStream.getTracks().forEach((t) => t.stop());
    restoreComposerAfterVoice();
  }
  mediaChunks = [];
  showToast("🗑️ تم حذف وإلغاء التسجيل الصوتي");
}

function togglePauseVoiceRecording() {
  if (!mediaRecorder) return;
  const pauseIcon = el("voicePauseIcon");
  const labelEl = el("voiceRecordLabel");

  if (mediaRecorder.state === "recording") {
    mediaRecorder.pause();
    isVoicePaused = true;
    if (labelEl) labelEl.textContent = "تم الإيقاف مؤقتاً ⏸️";
    if (pauseIcon) {
      pauseIcon.innerHTML = '<polygon points="6,4 18,12 6,20" />';
    }
  } else if (mediaRecorder.state === "paused") {
    mediaRecorder.resume();
    isVoicePaused = false;
    if (labelEl) labelEl.textContent = "جاري التسجيل... 🎙️";
    if (pauseIcon) {
      pauseIcon.innerHTML = '<rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>';
    }
  }
}

function sendVoiceRecording() {
  voiceCancelled = false;
  clearInterval(voiceRecordTimerInterval);
  if (mediaRecorder && mediaRecorder.state !== "inactive") {
    mediaRecorder.stop();
  }
}

/* ==========================================================================
   Calls & Dialogs
   ========================================================================== */
let localAudioStream = null;
let peerConnection = null;
let activeCallPartner = null;
let isAudioMuted = false;

const rtcConfiguration = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" }
  ]
};

async function sendCallSignal(toEmail, payload) {
  if (!toEmail || !state.currentUser?.email) return;
  try {
    await fetch("/api/calls/signal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        from: state.currentUser.email,
        to: toEmail,
        ...payload
      })
    });
  } catch (err) {
    console.warn("Signal send error:", err);
  }
}

async function startAudioCall(targetEmail, targetName) {
  const myEmail = state.currentUser?.email;
  if (!myEmail || !targetEmail) return;

  activeCallPartner = targetEmail;
  if (callAvatar) callAvatar.textContent = (targetName || targetEmail)[0].toUpperCase();
  if (callTitle) callTitle.textContent = `مكالمة صوتية - ${targetName || targetEmail.split("@")[0]}`;
  if (callStatus) callStatus.textContent = "جاري الاتصال والرنين... 📡";
  const ansBtn = el("answerCallButton");
  if (ansBtn) ansBtn.style.display = "none";
  openDialog(callDialog);
  triggerHaptic(30);

  try {
    localAudioStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    peerConnection = new RTCPeerConnection(rtcConfiguration);

    localAudioStream.getTracks().forEach((track) => peerConnection.addTrack(track, localAudioStream));

    peerConnection.ontrack = (event) => {
      const remoteAudio = el("remoteAudio");
      if (remoteAudio && event.streams[0]) {
        remoteAudio.srcObject = event.streams[0];
      }
    };

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        sendCallSignal(activeCallPartner, { type: "candidate", candidate: event.candidate });
      }
    };

    peerConnection.onconnectionstatechange = () => {
      if (peerConnection?.connectionState === "connected") {
        if (callStatus) callStatus.textContent = "متصل الآن 🟢";
        triggerHaptic(20);
      } else if (peerConnection?.connectionState === "disconnected" || peerConnection?.connectionState === "failed") {
        if (callStatus) callStatus.textContent = "انقطع الاتصال ⚠️";
        setTimeout(() => endAudioCall(false), 1500);
      }
    };

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    await sendCallSignal(activeCallPartner, {
      type: "offer",
      sdp: offer,
      callerName: state.currentUser?.name || myEmail.split("@")[0]
    });
  } catch (err) {
    if (callStatus) callStatus.textContent = "تعذر الوصول للميكروفون ⚠️";
    console.error("Microphone error:", err);
  }
}

async function handleIncomingCallSignal(data) {
  const { from, type, sdp, candidate, callerName } = data;

  if (type === "offer") {
    activeCallPartner = from;
    if (callAvatar) callAvatar.textContent = (callerName || from)[0].toUpperCase();
    if (callTitle) callTitle.textContent = `مكالمة واردة من ${callerName || from.split("@")[0]}`;
    if (callStatus) callStatus.textContent = "يرن الآن... 📞";
    const ansBtn = el("answerCallButton");
    if (ansBtn) ansBtn.style.display = "flex";
    openDialog(callDialog);
    triggerHaptic(40);

    peerConnection = new RTCPeerConnection(rtcConfiguration);

    peerConnection.ontrack = (event) => {
      const remoteAudio = el("remoteAudio");
      if (remoteAudio && event.streams[0]) {
        remoteAudio.srcObject = event.streams[0];
      }
    };

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        sendCallSignal(activeCallPartner, { type: "candidate", candidate: event.candidate });
      }
    };

    peerConnection.onconnectionstatechange = () => {
      if (peerConnection?.connectionState === "connected") {
        if (callStatus) callStatus.textContent = "متصل الآن 🟢";
        triggerHaptic(20);
      } else if (peerConnection?.connectionState === "disconnected" || peerConnection?.connectionState === "failed") {
        if (callStatus) callStatus.textContent = "انتهت المكالمة";
        setTimeout(() => endAudioCall(false), 1200);
      }
    };

    await peerConnection.setRemoteDescription(new RTCSessionDescription(sdp));
  } else if (type === "answer" && peerConnection) {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(sdp));
    if (callStatus) callStatus.textContent = "متصل الآن 🟢";
    triggerHaptic(20);
  } else if (type === "candidate" && peerConnection) {
    try {
      await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (e) {
      console.warn("ICE error:", e);
    }
  } else if (type === "hangup") {
    endAudioCall(false);
  }
}

async function answerIncomingCall() {
  if (!peerConnection || !activeCallPartner) return;
  const ansBtn = el("answerCallButton");
  if (ansBtn) ansBtn.style.display = "none";
  if (callStatus) callStatus.textContent = "جاري فتح خط الاتصال...";
  triggerHaptic(20);

  try {
    localAudioStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    localAudioStream.getTracks().forEach((track) => peerConnection.addTrack(track, localAudioStream));

    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    await sendCallSignal(activeCallPartner, { type: "answer", sdp: answer });
    if (callStatus) callStatus.textContent = "متصل الآن 🟢";
  } catch (err) {
    if (callStatus) callStatus.textContent = "فشل الرد (تحقق من الميكروفون)";
    console.error("Answer call error:", err);
  }
}

function endAudioCall(notifyPartner = true) {
  if (notifyPartner && activeCallPartner) {
    sendCallSignal(activeCallPartner, { type: "hangup" });
  }

  if (localAudioStream) {
    localAudioStream.getTracks().forEach((t) => t.stop());
    localAudioStream = null;
  }
  if (peerConnection) {
    peerConnection.close();
    peerConnection = null;
  }
  activeCallPartner = null;
  const remoteAudio = el("remoteAudio");
  if (remoteAudio) remoteAudio.srcObject = null;
  closeDialog(callDialog);
  triggerHaptic(15);
}

function toggleMuteCall() {
  if (!localAudioStream) return;
  isAudioMuted = !isAudioMuted;
  localAudioStream.getAudioTracks().forEach((t) => (t.enabled = !isAudioMuted));
  const muteBtn = el("muteCallButton");
  if (muteBtn) {
    muteBtn.textContent = isAudioMuted ? "🔇" : "⌁";
    muteBtn.title = isAudioMuted ? "إلغاء كتم الصوت" : "كتم الصوت";
  }
  showToast(isAudioMuted ? "تم كتم الميكروفون 🔇" : "تم تشغيل الميكروفون 🎙️");
}

function openCall(kind) {
  const chat = getChat();
  if (!chat || !chat.email) {
    showToast("يرجى اختيار محادثة صديق لبدء المكالمة");
    return;
  }
  startAudioCall(chat.email, chat.name);
}

function openDialog(dialog) {
  if (typeof dialog?.showModal === "function") dialog.showModal();
  else dialog?.setAttribute("open", "");
}

function closeDialog(dialog) {
  dialog?.close?.();
  dialog?.removeAttribute("open");
}

/* ==========================================================================
   1 & 2. تبويبات تسجيل الدخول وإنشاء الحساب مع توثيق الإيميل
   ========================================================================== */
function switchAuthTab(target) {
  if (target === "signup") {
    tabSignUpBtn?.classList.add("active");
    tabSignInBtn?.classList.remove("active");
    if (signUpForm) {
      signUpForm.hidden = false;
      signUpForm.style.display = "block";
    }
    if (signInForm) {
      signInForm.hidden = true;
      signInForm.style.display = "none";
    }
    if (regVerificationCodeInput && !regVerificationCodeInput.value) {
      regVerificationCodeInput.value = "123456";
    }
    if (codeSentStatus) {
      codeSentStatus.textContent = "كود التجربة المباشر: 123456";
    }
  } else {
    tabSignInBtn?.classList.add("active");
    tabSignUpBtn?.classList.remove("active");
    if (signInForm) {
      signInForm.hidden = false;
      signInForm.style.display = "block";
    }
    if (signUpForm) {
      signUpForm.hidden = true;
      signUpForm.style.display = "none";
    }
  }
  if (loginError) loginError.textContent = "";
  if (registerError) registerError.textContent = "";
}

// 1. تسجيل الدخول (إيميل وباسورد فقط)
async function handleSignIn(event) {
  event.preventDefault();
  if (loginError) loginError.textContent = "";

  const email = clean(loginEmailInput?.value).toLowerCase();
  const password = String(loginPasswordInput?.value || "").trim();

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    loginError.textContent = t("validEmailRequired");
    loginEmailInput?.focus();
    return;
  }
  if (!password) {
    loginError.textContent = t("enterPasswordRequired");
    loginPasswordInput?.focus();
    return;
  }

  signInSubmitBtn.disabled = true;
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, deviceId: "web" })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || t("serverOfflineError"));
    }

    state.currentUser = {
      ...data.user,
      password,
      lastPassword: password
    };
    state.accessToken = data.accessToken || null;
    state.refreshToken = data.refreshToken || null;

    if (window.isAddAccountMode) {
      window.isAddAccountMode = false;
      if (addAccountTopBar) addAccountTopBar.hidden = true;
    }

    // حفظ في متصفح المستخدم / Keychain تلقائياً (Credential Management API)
    if (window.PasswordCredential && navigator.credentials && navigator.credentials.store) {
      try {
        const cred = new PasswordCredential({
          id: email,
          password: password,
          name: data.user?.name || email
        });
        navigator.credentials.store(cred).catch(() => {});
      } catch {}
    }

    syncCurrentAccountToSaved();
    state.activeChatId = "support";
    saveState();
    initE2EEKeys();
    showApp();
  } catch (error) {
    loginError.textContent = error.message;
  } finally {
    signInSubmitBtn.disabled = false;
  }
}

// 2. إرسال كود التوثيق إلى الإيميل
async function handleSendVerificationCode() {
  if (registerError) registerError.textContent = "";
  if (codeSentStatus) codeSentStatus.textContent = "";

  const email = clean(regEmailInput?.value).toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    registerError.textContent = t("validEmailRequired");
    regEmailInput?.focus();
    return;
  }

  sendVerificationCodeBtn.disabled = true;
  sendVerificationCodeBtn.textContent = t("sendingCode");
  try {
    const res = await fetch("/api/auth/send-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "فشل إرسال كود التوثيق");
    }

    let statusMsg = data.message || "كود التجربة: 123456";
    const finalCode = data.codeHint || "123456";
    if (regVerificationCodeInput) {
      regVerificationCodeInput.value = finalCode;
    }
    codeSentStatus.textContent = `كود التجربة المعتمد: ${finalCode} (تم إدخاله تلقائياً)`;
    regVerificationCodeInput?.focus();
  } catch (error) {
    registerError.textContent = error.message;
  } finally {
    sendVerificationCodeBtn.disabled = false;
    sendVerificationCodeBtn.textContent = t("sendCodeBtn");
  }
}

// 3. إنشاء حساب جديد مع فحص الكود والدخول التلقائي فوراً
async function handleSignUp(event) {
  event.preventDefault();
  if (registerError) registerError.textContent = "";

  const name = clean(regNameInput?.value);
  const email = clean(regEmailInput?.value).toLowerCase();
  const code = clean(regVerificationCodeInput?.value) || "123456";
  const password = String(regPasswordInput?.value || "").trim();
  const confirmPassword = String(regConfirmPasswordInput?.value || "").trim();

  if (!name) {
    registerError.textContent = t("validNameRequired");
    regNameInput?.focus();
    return;
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    registerError.textContent = t("validEmailRequired");
    regEmailInput?.focus();
    return;
  }
  if (!code) {
    registerError.textContent = t("codeRequired");
    regVerificationCodeInput?.focus();
    return;
  }
  if (!isValidPassword(password)) {
    registerError.textContent = t("passwordInvalidError");
    regPasswordInput?.focus();
    return;
  }
  if (password !== confirmPassword) {
    registerError.textContent = t("passwordsDoNotMatch");
    regConfirmPasswordInput?.focus();
    return;
  }

  signUpSubmitBtn.disabled = true;
  try {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        code,
        password,
        confirmPassword,
        image: loginImage,
        deviceId: "web"
      })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "فشل إنشاء الحساب");
    }

    // الدخول التلقائي الفوري فور التفعيل مع إصدار التوكنات
    state.currentUser = {
      ...data.user,
      password,
      lastPassword: password
    };
    state.accessToken = data.accessToken || null;
    state.refreshToken = data.refreshToken || null;

    if (window.isAddAccountMode) {
      window.isAddAccountMode = false;
      if (addAccountTopBar) addAccountTopBar.hidden = true;
    }

    // حفظ في متصفح المستخدم / Keychain تلقائياً (Credential Management API)
    if (window.PasswordCredential && navigator.credentials && navigator.credentials.store) {
      try {
        const cred = new PasswordCredential({
          id: email,
          password: password,
          name: name || email
        });
        navigator.credentials.store(cred).catch(() => {});
      } catch {}
    }

    syncCurrentAccountToSaved();
    state.activeChatId = "support";
    saveState();
    initE2EEKeys();
    showApp();
  } catch (error) {
    registerError.textContent = error.message;
  } finally {
    signUpSubmitBtn.disabled = false;
  }
}

/* ==========================================================================
   4 & 5. شاشة الإعدادات بنظام الأيقونات المقسمة والاشتراكات
   ========================================================================== */
function showSettingsView(view) {
  if (!settingsMainView || !settingsAccountView || !settingsSubscriptionsView) return;
  settingsMainView.hidden = (view !== "main");
  settingsAccountView.hidden = (view !== "account");
  settingsSubscriptionsView.hidden = (view !== "subscriptions");

  if (settingsBackBtn) settingsBackBtn.hidden = (view === "main");

  if (view === "main") {
    if (settingsDialogTitle) settingsDialogTitle.textContent = t("settings") || "الإعدادات";
    updateSubscriptionBadge();
  } else if (view === "account") {
    if (settingsDialogTitle) settingsDialogTitle.textContent = "الحساب";
    renderSavedAccounts();
  } else if (view === "subscriptions") {
    if (settingsDialogTitle) settingsDialogTitle.textContent = "الاشتراكات";
    openSubscriptionsHub();
    fetchSubscriptionDetails();
  }
}

function openSettings() {
  if (!state.currentUser) return;
  avatarContent(settingsAvatar, state.currentUser);
  settingsUserName.textContent = state.currentUser.name;
  settingsUserEmail.textContent = state.currentUser.email;

  showSettingsView("main");
  updateSubscriptionBadge();
  openDialog(settingsDialog);
}

function renderSavedAccounts() {
  if (!savedAccountsList) return;
  savedAccountsList.innerHTML = "";
  const accounts = state.savedAccounts || [];

  if (!accounts.length) {
    savedAccountsList.innerHTML = `<p class="muted">${t("noUserFound") || "لا توجد حسابات مسجلة"}</p>`;
    return;
  }

  const currentEmail = state.currentUser?.email?.toLowerCase();

  accounts.forEach((acc) => {
    const isCurrent = acc.email && acc.email.toLowerCase() === currentEmail;
    const item = document.createElement("div");
    item.className = `saved-account-item${isCurrent ? " is-current" : ""}`;

    const av = document.createElement("span");
    av.className = "avatar";
    avatarContent(av, acc);

    const infoBtn = document.createElement("button");
    infoBtn.type = "button";
    infoBtn.className = "saved-account-info";
    infoBtn.title = isCurrent ? "الحساب النشط حالياً" : "اضغط للتبديل الفوري إلى هذا الحساب";

    const st = document.createElement("strong");
    st.textContent = acc.name + (isCurrent ? " (نشط الآن)" : "");

    const em = document.createElement("span");
    em.textContent = acc.email;

    infoBtn.append(st, em);

    // عند النقر للتبديل الفوري إلى الحساب
    infoBtn.addEventListener("click", () => {
      if (isCurrent) return;
      switchToAccount(acc);
    });

    item.append(av, infoBtn);

    // زر إزالة الحساب من الجهاز
    if (!isCurrent) {
      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "remove-saved-account-btn";
      removeBtn.title = "إزالة هذا الحساب من هذا الجهاز";
      removeBtn.innerHTML = "🗑️";
      removeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (confirm(`هل أنت متأكد من إزالة حساب (${acc.name || acc.email}) من هذا الجهاز؟`)) {
          state.savedAccounts = state.savedAccounts.filter((a) => a.email.toLowerCase() !== acc.email.toLowerCase());
          saveState();
          renderSavedAccounts();
        }
      });
      item.appendChild(removeBtn);
    }

    savedAccountsList.appendChild(item);
  });
}

function switchToAccount(account) {
  if (!account || account.email?.toLowerCase() === state.currentUser?.email?.toLowerCase()) return;

  // حفظ بيانات الجلسة الحالية قبل التبديل
  syncCurrentAccountToSaved();

  // تعيين الحساب النشط المختار مع التوكنات
  state.currentUser = { ...account };
  state.accessToken = account.accessToken || null;
  state.refreshToken = account.refreshToken || null;
  state.activeChatId = "support";
  unlockedChats.clear();
  saveState();

  closeDialog(settingsDialog);
  showApp();
  syncUserInbox();
  renderConversations();
}

function addNewAccount() {
  if (!state.currentUser) return;
  window.isAddAccountMode = true;
  window.previousActiveAccount = { ...state.currentUser };

  // حفظ الحساب الحالي في savedAccounts
  syncCurrentAccountToSaved();

  if (backCurrentAccountName) {
    backCurrentAccountName.textContent = state.currentUser.name || state.currentUser.email;
  }
  if (addAccountTopBar) {
    addAccountTopBar.hidden = false;
  }

  closeDialog(settingsDialog);
  appScreen.hidden = true;
  loginScreen.hidden = false;

  if (loginEmailInput) loginEmailInput.value = "";
  if (loginPasswordInput) loginPasswordInput.value = "";
  if (loginError) loginError.textContent = "";
  if (registerError) registerError.textContent = "";

  switchAuthTab("signin");
}

function logout() {
  if (confirm(t("confirmLogout"))) {
    state.currentUser = null;
    state.accessToken = null;
    state.refreshToken = null;
    saveState();
    closeDialog(settingsDialog);
    showLogin(true);
  }
}

// استرجاع تفاصيل باقات المستخدم (شاتو AI بلاس + شاتو بلاس) وعرض الحصص اليومية وصلاحية الـ 60 يوماً
async function fetchSubscriptionDetails() {
  if (!state.currentUser?.email) return;
  try {
    const res = await fetch(`/api/subscriptions/my-plan?email=${encodeURIComponent(state.currentUser.email)}`);
    if (!res.ok) return;
    const data = await res.json();
    if (!data.ok) return;

    // 1. باقة شاتو AI بلاس
    const aiData = data.ai_plus || data;
    const isAiPlus = Boolean(aiData.is_active && aiData.plan_code === "chato_ai_plus");
    if (state.currentUser) state.currentUser.isVip = isAiPlus;

    if (subPlanTitleBadge) {
      subPlanTitleBadge.textContent = isAiPlus ? "شاتو AI بلاس ⚡🤖" : "الباقة المجانية ⚪";
    }

    const subAiActiveStatus = el("subAiActiveStatus");
    if (subAiActiveStatus) {
      subAiActiveStatus.textContent = isAiPlus ? `نشط (${aiData.days_remaining} يوم متبقي)` : "غير مفعّل";
      subAiActiveStatus.style.background = isAiPlus ? "#10b981" : "rgba(255, 255, 255, 0.2)";
    }
    const subAiTabBadge = el("subAiTabBadge");
    if (subAiTabBadge) {
      subAiTabBadge.textContent = isAiPlus ? "نشط" : "ترقية";
      subAiTabBadge.className = isAiPlus ? "sub-tab-pill" : "sub-tab-pill upgrade";
    }

    if (quotaWordsDisplay && aiData.daily_words_limit) {
      quotaWordsDisplay.textContent = `${aiData.words_remaining} / ${aiData.daily_words_limit}`;
    }
    if (quotaWordsProgress && aiData.daily_words_limit) {
      const pct = Math.max(0, Math.min(100, Math.round((aiData.words_remaining / aiData.daily_words_limit) * 100)));
      quotaWordsProgress.style.width = `${pct}%`;
    }

    if (quotaImagesDisplay && aiData.daily_ai_images_limit) {
      quotaImagesDisplay.textContent = `${aiData.images_remaining} / ${aiData.daily_ai_images_limit}`;
    }
    if (quotaImagesProgress && aiData.daily_ai_images_limit) {
      const pct = Math.max(0, Math.min(100, Math.round((aiData.images_remaining / aiData.daily_ai_images_limit) * 100)));
      quotaImagesProgress.style.width = `${pct}%`;
    }

    if (quotaNextResetTime && aiData.next_quota_reset_at) {
      const hoursLeft = Math.max(1, Math.round((Number(aiData.next_quota_reset_at) - Date.now()) / (3600 * 1000)));
      quotaNextResetTime.textContent = `خلال ${hoursLeft} ساعة تقريباً`;
    }

    if (quotaExpiryDisplay) {
      quotaExpiryDisplay.textContent = isAiPlus ? `${aiData.days_remaining} يوماً (شهرين كاملين)` : "غير مفعّل";
    }

    const subscribeAiPlusBtn = el("subscribeAiPlusBtn");
    if (subscribeAiPlusBtn) {
      subscribeAiPlusBtn.textContent = isAiPlus ? "🔄 تجديد باقة شاتو AI بلاس (60 يوماً إضافية)" : "⚡ تفعيل باقة شاتو AI بلاس (20 ريال / شهرين)";
    }

    // 2. باقة شاتو بلاس (مميزات المحادثات الحصرية)
    const chatData = data.chat_plus || {};
    const isChatPlus = Boolean(chatData.is_active);
    if (state.currentUser) {
      state.currentUser.isChatPlus = isChatPlus;
      if (chatData.expires_at) state.currentUser.chatPlusUntil = chatData.expires_at;
    }

    const subChatActiveStatus = el("subChatActiveStatus");
    if (subChatActiveStatus) {
      subChatActiveStatus.textContent = isChatPlus ? `نشط (${chatData.days_remaining} يوم متبقي)` : "غير مشترك";
      subChatActiveStatus.style.background = isChatPlus ? "#10b981" : "rgba(255, 255, 255, 0.2)";
    }
    const subChatTabBadge = el("subChatTabBadge");
    if (subChatTabBadge) {
      subChatTabBadge.textContent = isChatPlus ? "نشط" : "ترقية";
      subChatTabBadge.className = isChatPlus ? "sub-tab-pill" : "sub-tab-pill upgrade";
    }

    const chatPlusStatusDisplay = el("chatPlusStatusDisplay");
    if (chatPlusStatusDisplay) {
      chatPlusStatusDisplay.textContent = isChatPlus ? "نشط ومفعّل 🌟" : "غير مشترك ⚪";
      chatPlusStatusDisplay.style.color = isChatPlus ? "#10b981" : "var(--muted)";
    }
    const chatPlusDaysRemaining = el("chatPlusDaysRemaining");
    if (chatPlusDaysRemaining) {
      chatPlusDaysRemaining.textContent = isChatPlus ? `${chatData.days_remaining} يوماً (شهرين)` : "0 يوم";
    }
    const chatPlusPerksUnlocked = el("chatPlusPerksUnlocked");
    if (chatPlusPerksUnlocked) {
      chatPlusPerksUnlocked.textContent = isChatPlus ? "مفتوحة بالكامل (خلفيات، ترجمة فورية، إيموجي نادر، 25 تثبيت)" : "مقفل - اشترك في شاتو بلاس للتفعيل";
      chatPlusPerksUnlocked.style.color = isChatPlus ? "#10b981" : "var(--muted)";
    }

    const subscribeChatPlusBtn = el("subscribeChatPlusBtn");
    if (subscribeChatPlusBtn) {
      subscribeChatPlusBtn.textContent = isChatPlus ? "🔄 تجديد باقة شاتو بلاس (60 يوماً إضافية)" : "👑 تفعيل باقة شاتو بلاس (20 ريال / شهرين)";
    }

    // تحديث الشارات في بطاقة الاشتراكات المجمعة (Image 3)
    const subRowBadgeChat = el("subRowBadgeChat");
    if (subRowBadgeChat) {
      subRowBadgeChat.hidden = !isChatPlus;
      subRowBadgeChat.textContent = "نشط";
    }
    const subRowBadgeAi = el("subRowBadgeAi");
    if (subRowBadgeAi) {
      subRowBadgeAi.hidden = !isAiPlus;
      subRowBadgeAi.textContent = "نشط";
    }

    // إشارة التبويب الرئيسي
    if (settingsSubBadge) {
      if (isChatPlus && isAiPlus) {
        settingsSubBadge.textContent = "AI + بلاس نشط ⭐";
      } else if (isChatPlus) {
        settingsSubBadge.textContent = "شاتو بلاس نشط ⭐";
      } else if (isAiPlus) {
        settingsSubBadge.textContent = "AI بلاس نشط ⭐";
      } else {
        settingsSubBadge.textContent = "الاشتراكات";
      }
    }
  } catch (err) {
    console.warn("Failed to fetch subscription:", err);
  }
}

async function updateSubscriptionBadge() {
  if (!state.currentUser?.email || !settingsSubBadge) return;
  try {
    const res = await fetch(`/api/subscriptions/my-plan?email=${encodeURIComponent(state.currentUser.email)}`);
    if (res.ok) {
      const data = await res.json();
      const isAiPlus = Boolean(data.ai_plus?.is_active || (data.is_active && data.plan_code === "chato_ai_plus"));
      const isChatPlus = Boolean(data.chat_plus?.is_active);
      if (isChatPlus && isAiPlus) {
        settingsSubBadge.textContent = "AI + بلاس نشط ⭐";
      } else if (isChatPlus) {
        settingsSubBadge.textContent = "شاتو بلاس نشط ⭐";
      } else if (isAiPlus) {
        settingsSubBadge.textContent = "AI بلاس نشط ⭐";
      } else {
        settingsSubBadge.textContent = "الاشتراكات";
      }
    }
  } catch {}
}

/* ==========================================================================
   6. الملف الشخصي وحماية وتغيير كلمة المرور
   ========================================================================== */
function openProfile() {
  const user = state.currentUser;
  if (!user) return;

  profileNameInput.value = user.name;
  profileEmailInput.value = user.email;
  profileImageData = user.image || "";
  profileImageEditPreview.innerHTML = profileImageData ? `<img src="${profileImageData}" alt="" />` : "+";

  // إخفاء حقول تغيير كلمة المرور مبدئياً ومسح الحقول
  changePasswordBox.hidden = true;
  toggleChangePasswordBtn.textContent = t("changePwBtn");
  currentPasswordInput.value = "";
  newPasswordInput.value = "";
  confirmNewPasswordInput.value = "";
  profileError.textContent = "";
  profileSuccess.textContent = "";

  openDialog(profileDialog);
}

async function saveProfile() {
  const name = clean(profileNameInput.value);
  profileError.textContent = "";
  profileSuccess.textContent = "";

  if (!name || hasDigit(name)) {
    profileError.textContent = t("validNameRequired");
    return;
  }

  // إذا كانت خانة تغيير كلمة المرور مفتوحة
  let newPass = "";
  if (!changePasswordBox.hidden) {
    const curPass = String(currentPasswordInput.value || "").trim();
    newPass = String(newPasswordInput.value || "").trim();
    const confPass = String(confirmNewPasswordInput.value || "").trim();

    if (!curPass) {
      profileError.textContent = t("currentPasswordRequired");
      return;
    }

    // التحقق من كلمة المرور الحالية إذا كانت مسجلة محلياً
    if (state.currentUser.password && curPass !== state.currentUser.password) {
      profileError.textContent = t("currentPasswordIncorrect");
      return;
    }

    if (!isValidPassword(newPass)) {
      profileError.textContent = t("passwordInvalidError");
      return;
    }

    if (newPass !== confPass) {
      profileError.textContent = t("passwordsDoNotMatch");
      return;
    }

    // إرسال طلب تغيير كلمة المرور للخادم
    try {
      const res = await fetch("/api/users/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: state.currentUser.email,
          currentPassword: curPass,
          newPassword: newPass
        })
      });
      const data = await res.json();
      if (!res.ok) {
        profileError.textContent = data.error || t("currentPasswordIncorrect");
        return;
      }
      state.currentUser.password = newPass;
    } catch {
      profileError.textContent = t("serverOfflineError");
      return;
    }
  }

  // تحديث الاسم والصورة في الخادم
  try {
    await fetch("/api/users/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: state.currentUser.email,
        name,
        image: profileImageData || state.currentUser.image || ""
      })
    });
  } catch {
    // Continue with local update
  }

  state.currentUser.name = name;
  if (profileImageData) {
    state.currentUser.image = profileImageData;
  }
  if (newPass) state.currentUser.password = newPass;

  // مزامنة التغييرات في الحسابات المسجلة
  syncCurrentAccountToSaved();
  saveState();
  updateMyStoryAvatar();
  renderApp();
  renderConversations();
  renderMessages();

  profileSuccess.textContent = t("profileUpdatedSuccess");
  setTimeout(() => {
    closeDialog(profileDialog);
    showApp();
  }, 700);
}

/* ==========================================================================
   نظام الحالات والاستوري (24h Stories System)
   ========================================================================== */
let pendingStoryFile = null;
let pendingStoryDataUrl = "";
let pendingStoryMediaType = "image";

// متغيرات حالة مشغل الاستوري
let activeViewerGroup = null;
let activeViewerStoryIdx = 0;
let storyAnimFrame = null;
let storyDurationMs = 5000;
let storyStartTime = 0;
let storyElapsedBeforePause = 0;
let isStoryPaused = false;

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='32' fill='%231e293b'/%3E%3Ccircle cx='32' cy='24' r='12' fill='%2364748b'/%3E%3Cpath d='M16 54c0-9 7-16 16-16s16 7 16 16' fill='%2364748b'/%3E%3C/svg%3E";

function updateMyStoryAvatar() {
  const user = state.currentUser;
  let avSrc = (user && user.image && user.image !== DEFAULT_AVATAR) ? user.image : DEFAULT_AVATAR;
  if (Array.isArray(state.myStories) && state.myStories.length > 0) {
    const latest = state.myStories[0];
    if (latest && latest.media_url && latest.media_type === "image") {
      avSrc = latest.media_url;
    }
  }
  if (myStoryAvatarImg) {
    myStoryAvatarImg.alt = "";
    myStoryAvatarImg.src = avSrc;
    myStoryAvatarImg.onerror = function() {
      this.onerror = null;
      this.src = DEFAULT_AVATAR;
    };
  }
  if (myStoryBarImg) {
    myStoryBarImg.alt = "";
    myStoryBarImg.src = avSrc;
    myStoryBarImg.onerror = function() {
      this.onerror = null;
      this.src = DEFAULT_AVATAR;
    };
  }
}

function formatStoryTime(timestamp) {
  if (!timestamp) return "منذ لحظات";
  const diffSec = Math.max(1, Math.round((Date.now() - Number(timestamp)) / 1000));
  if (diffSec < 60) return "منذ لحظات";
  const diffMin = Math.round(diffSec / 60);
  if (diffMin < 60) return `منذ ${diffMin} دقيقة`;
  const diffHours = Math.round(diffMin / 60);
  if (diffHours < 24) return `منذ ${diffHours} ساعة`;
  return "منذ يوم";
}

async function fetchStories() {
  if (!state.currentUser?.email) return;
  try {
    const res = await fetch(`/api/stories/feed?email=${encodeURIComponent(state.currentUser.email)}`);
    if (!res.ok) return;
    const data = await res.json();
    if (!data.ok) return;

    state.myStories = data.myStories || [];
    state.otherStories = data.stories || [];

    renderStoriesFeed();
  } catch (err) {
    console.warn("Fetch stories error:", err);
  }
}

function renderStoriesFeed() {
  updateMyStoryAvatar();

  const hasMyActive = Array.isArray(state.myStories) && state.myStories.length > 0;
  if (myStoryAvatarRing) myStoryAvatarRing.classList.toggle("has-active-story", hasMyActive);
  if (myStoryBarRing) myStoryBarRing.classList.toggle("has-active-story", hasMyActive);

  if (!storiesListItems) return;
  storiesListItems.innerHTML = "";

  const groups = state.otherStories || [];
  groups.forEach((group) => {
    const item = document.createElement("div");
    item.className = "story-bar-item";
    item.title = group.user.name;

    const ringClass = group.has_unseen ? "has-active-story" : "has-seen-story";
    const avSrc = group.user.image || DEFAULT_AVATAR;

    const wrap = document.createElement("div");
    wrap.className = "story-bar-avatar-wrap";

    const ring = document.createElement("div");
    ring.className = `story-avatar-ring ${ringClass}`;

    const img = document.createElement("img");
    img.src = avSrc;
    img.alt = "";
    img.onerror = function() { this.onerror = null; this.src = DEFAULT_AVATAR; };
    img.className = "story-avatar-img";

    ring.appendChild(img);
    wrap.appendChild(ring);

    const nameSpan = document.createElement("span");
    nameSpan.className = "story-bar-name";
    nameSpan.textContent = group.user.name;

    item.append(wrap, nameSpan);

    item.addEventListener("click", () => {
      openStoryViewer(group, 0);
    });

    storiesListItems.appendChild(item);
  });
}

function handleMyStoryClick() {
  if (Array.isArray(state.myStories) && state.myStories.length > 0) {
    // فتح مشغل الاستوري لحالتي
    const myGroup = {
      user: {
        id: state.currentUser.id,
        name: "حالتي",
        email: state.currentUser.email,
        image: state.currentUser.image || DEFAULT_AVATAR
      },
      stories: state.myStories
    };
    openStoryViewer(myGroup, 0);
  } else {
    // لا يوجد استوري نشط - فتح اختيار الصورة/الفيديو مباشرة
    openStoryUploadPicker();
  }
}

function openStoryUploadPicker() {
  if (storyFileInput) {
    storyFileInput.value = "";
    storyFileInput.click();
  }
}

function handleStoryFileSelected(file) {
  if (!file) return;
  pendingStoryFile = file;
  const isVideo = file.type.startsWith("video/");
  pendingStoryMediaType = isVideo ? "video" : "image";

  const reader = new FileReader();
  reader.onload = (e) => {
    pendingStoryDataUrl = e.target.result;

    if (isVideo) {
      if (storyPreviewImg) storyPreviewImg.style.display = "none";
      if (storyPreviewVideo) {
        storyPreviewVideo.src = pendingStoryDataUrl;
        storyPreviewVideo.style.display = "block";
      }
    } else {
      if (storyPreviewVideo) storyPreviewVideo.style.display = "none";
      if (storyPreviewImg) {
        storyPreviewImg.src = pendingStoryDataUrl;
        storyPreviewImg.style.display = "block";
      }
    }

    if (storyCaptionInput) storyCaptionInput.value = "";
    if (storyUploadError) storyUploadError.textContent = "";

    openDialog(storyUploadModal);
  };
  reader.readAsDataURL(file);
}

async function submitStoryUpload(e) {
  e.preventDefault();
  if (!state.currentUser?.email || !pendingStoryDataUrl) return;

  if (storyUploadSubmitBtn) storyUploadSubmitBtn.disabled = true;
  if (storyUploadError) storyUploadError.textContent = "";

  try {
    const res = await fetch("/api/stories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: state.currentUser.email,
        media_type: pendingStoryMediaType,
        media_url: pendingStoryDataUrl,
        caption: storyCaptionInput?.value?.trim() || "",
        duration_seconds: pendingStoryMediaType === "video" ? 15 : 5
      })
    });
    const data = await res.json();
    if (!res.ok || !data.ok) {
      if (storyUploadError) storyUploadError.textContent = data.error || "تعذر نشر الحالة";
      return;
    }

    closeDialog(storyUploadModal);
    pendingStoryFile = null;
    pendingStoryDataUrl = "";
    await fetchStories();
  } catch (err) {
    if (storyUploadError) storyUploadError.textContent = "خطأ في الاتصال بالخادم أثناء رفع الحالة";
  } finally {
    if (storyUploadSubmitBtn) storyUploadSubmitBtn.disabled = false;
  }
}

// ----------------------------------------------------
// مشغل الاستوري كامل الشاشة (Story Viewer)
// ----------------------------------------------------
function openStoryViewer(group, startIndex = 0) {
  if (!group || !Array.isArray(group.stories) || !group.stories.length) return;
  activeViewerGroup = group;
  activeViewerStoryIdx = Math.max(0, Math.min(startIndex, group.stories.length - 1));

  if (storyViewerOverlay) storyViewerOverlay.hidden = false;
  if (storyViewsDrawer) storyViewsDrawer.hidden = true;

  playCurrentStory();
}

function closeStoryViewer() {
  clearStoryTimers();
  if (storyViewerVideo) {
    storyViewerVideo.pause();
    storyViewerVideo.src = "";
  }
  if (storyViewerOverlay) storyViewerOverlay.hidden = true;
  if (storyViewsDrawer) storyViewsDrawer.hidden = true;
  activeViewerGroup = null;
  activeViewerStoryIdx = 0;

  fetchStories();
}

function clearStoryTimers() {
  if (storyAnimFrame) {
    cancelAnimationFrame(storyAnimFrame);
    storyAnimFrame = null;
  }
  isStoryPaused = false;
}

function playCurrentStory() {
  clearStoryTimers();
  if (!activeViewerGroup || !activeViewerGroup.stories[activeViewerStoryIdx]) {
    closeStoryViewer();
    return;
  }

  const stories = activeViewerGroup.stories;
  const currentStory = stories[activeViewerStoryIdx];
  const isMine = currentStory.user_email?.toLowerCase() === state.currentUser?.email?.toLowerCase();

  // 1. شريط التقدم المقسم
  renderSegmentedProgressBars(stories.length, activeViewerStoryIdx);

  // 2. الترويسة
  if (storyViewerAv) {
    storyViewerAv.innerHTML = `<img src="${activeViewerGroup.user.image || DEFAULT_AVATAR}" alt="" />`;
  }
  if (storyViewerName) {
    storyViewerName.textContent = isMine ? "حالتي" : (activeViewerGroup.user.name || currentStory.user_name);
  }
  if (storyViewerTime) {
    storyViewerTime.textContent = formatStoryTime(currentStory.created_at);
  }

  if (storyViewerDeleteBtn) storyViewerDeleteBtn.hidden = !isMine;
  if (storyViewerAddBtn) storyViewerAddBtn.hidden = !isMine;
  if (storyViewsBar) storyViewsBar.hidden = !isMine;
  if (storyViewsCountNum) storyViewsCountNum.textContent = currentStory.views_count || 0;

  // 3. الشرح (Caption)
  if (storyViewerCaption) {
    if (currentStory.caption) {
      storyViewerCaption.hidden = false;
      storyViewerCaption.textContent = currentStory.caption;
    } else {
      storyViewerCaption.hidden = true;
    }
  }

  // 4. الوسائط ومدة العرض
  const isVideo = currentStory.media_type === "video";
  storyDurationMs = (currentStory.duration_seconds || (isVideo ? 15 : 5)) * 1000;
  storyStartTime = Date.now();
  storyElapsedBeforePause = 0;

  if (isVideo) {
    if (storyViewerImg) storyViewerImg.style.display = "none";
    if (storyViewerVideo) {
      storyViewerVideo.src = currentStory.media_url;
      storyViewerVideo.style.display = "block";
      storyViewerVideo.currentTime = 0;
      storyViewerVideo.play().catch(() => {});
      storyViewerVideo.onloadedmetadata = () => {
        if (storyViewerVideo.duration && !isNaN(storyViewerVideo.duration)) {
          storyDurationMs = Math.round(storyViewerVideo.duration * 1000);
        }
      };
    }
  } else {
    if (storyViewerVideo) {
      storyViewerVideo.pause();
      storyViewerVideo.style.display = "none";
    }
    if (storyViewerImg) {
      storyViewerImg.src = currentStory.media_url;
      storyViewerImg.style.display = "block";
    }
  }

  // 5. تسجيل المشاهدة إذا لم أكن أنا صاحب الحالة
  if (!isMine && state.currentUser?.email) {
    fetch(`/api/stories/${encodeURIComponent(currentStory.id)}/view`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: state.currentUser.email })
    }).catch(() => {});
  }

  // 6. تشغيل حركة شريط التقدم
  startProgressAnimation();
}

function renderSegmentedProgressBars(total, currentIndex) {
  if (!storyProgressBars) return;
  storyProgressBars.innerHTML = "";
  for (let i = 0; i < total; i++) {
    const seg = document.createElement("div");
    seg.className = "story-progress-seg";
    const fill = document.createElement("div");
    fill.className = "story-progress-fill";
    fill.id = `storyProgressFill_${i}`;
    if (i < currentIndex) fill.style.width = "100%";
    else if (i > currentIndex) fill.style.width = "0%";
    seg.appendChild(fill);
    storyProgressBars.appendChild(seg);
  }
}

function startProgressAnimation() {
  const fillEl = el(`storyProgressFill_${activeViewerStoryIdx}`);
  function updateProgress() {
    if (isStoryPaused) return;
    const elapsed = (Date.now() - storyStartTime) + storyElapsedBeforePause;
    const progressPct = Math.min(100, (elapsed / storyDurationMs) * 100);
    if (fillEl) fillEl.style.width = `${progressPct}%`;

    if (elapsed >= storyDurationMs) {
      nextStory();
    } else {
      storyAnimFrame = requestAnimationFrame(updateProgress);
    }
  }
  storyAnimFrame = requestAnimationFrame(updateProgress);
}

function pauseStoryPlayback() {
  if (isStoryPaused) return;
  isStoryPaused = true;
  storyElapsedBeforePause += (Date.now() - storyStartTime);
  if (storyAnimFrame) cancelAnimationFrame(storyAnimFrame);
  if (storyViewerVideo) storyViewerVideo.pause();
}

function resumeStoryPlayback() {
  if (!isStoryPaused) return;
  isStoryPaused = false;
  storyStartTime = Date.now();
  if (storyViewerVideo) storyViewerVideo.play().catch(() => {});
  startProgressAnimation();
}

function prevStory() {
  if (activeViewerStoryIdx > 0) {
    activeViewerStoryIdx--;
    playCurrentStory();
  } else {
    playCurrentStory();
  }
}

function nextStory() {
  if (!activeViewerGroup) return;
  if (activeViewerStoryIdx < activeViewerGroup.stories.length - 1) {
    activeViewerStoryIdx++;
    playCurrentStory();
  } else {
    // الانتقال لحالات المستخدم التالي في القائمة إذا وجدت
    const allGroups = state.otherStories || [];
    const currentGroupIdx = allGroups.indexOf(activeViewerGroup);
    if (currentGroupIdx !== -1 && currentGroupIdx < allGroups.length - 1) {
      activeViewerGroup = allGroups[currentGroupIdx + 1];
      activeViewerStoryIdx = 0;
      playCurrentStory();
    } else {
      closeStoryViewer();
    }
  }
}

async function deleteCurrentStory() {
  if (!activeViewerGroup || !activeViewerGroup.stories[activeViewerStoryIdx]) return;
  const story = activeViewerGroup.stories[activeViewerStoryIdx];
  if (!confirm("هل أنت متأكد من حذف هذه الحالة نهائياً؟")) return;

  try {
    pauseStoryPlayback();
    const res = await fetch(`/api/stories/${encodeURIComponent(story.id)}?email=${encodeURIComponent(state.currentUser.email)}`, {
      method: "DELETE"
    });
    if (res.ok) {
      activeViewerGroup.stories.splice(activeViewerStoryIdx, 1);
      state.myStories = (state.myStories || []).filter((s) => s.id !== story.id);
      if (activeViewerGroup.stories.length === 0) {
        closeStoryViewer();
      } else {
        if (activeViewerStoryIdx >= activeViewerGroup.stories.length) {
          activeViewerStoryIdx = activeViewerGroup.stories.length - 1;
        }
        playCurrentStory();
      }
      fetchStories();
    } else {
      alert("تعذر حذف الحالة");
      resumeStoryPlayback();
    }
  } catch {
    alert("خطأ أثناء الاتصال بالخادم لحذف الحالة");
    resumeStoryPlayback();
  }
}

async function loadStoryViewers() {
  if (!activeViewerGroup || !activeViewerGroup.stories[activeViewerStoryIdx]) return;
  const story = activeViewerGroup.stories[activeViewerStoryIdx];
  pauseStoryPlayback();

  if (storyViewsDrawer) storyViewsDrawer.hidden = false;
  if (storyViewsList) storyViewsList.innerHTML = '<p class="muted" style="text-align:center; padding: 16px;">جاري تحميل المشاهدين...</p>';

  try {
    const res = await fetch(`/api/stories/${encodeURIComponent(story.id)}/viewers?email=${encodeURIComponent(state.currentUser.email)}`);
    if (!res.ok) return;
    const data = await res.json();
    const viewers = data.viewers || [];

    if (storyDrawerCount) storyDrawerCount.textContent = viewers.length;
    if (storyViewsCountNum) storyViewsCountNum.textContent = viewers.length;

    if (!viewers.length) {
      storyViewsList.innerHTML = '<p class="muted" style="text-align:center; padding: 24px;">لا توجد مشاهدات حتى الآن</p>';
      return;
    }

    storyViewsList.innerHTML = "";
    viewers.forEach((v) => {
      const row = document.createElement("div");
      row.className = "story-viewer-row";

      const avSrc = v.image || DEFAULT_AVATAR;
      row.innerHTML = `
        <div class="story-viewer-row-av">
          <img src="${avSrc}" alt="${escapeHtml(v.name)}" />
        </div>
        <div class="story-viewer-row-info">
          <strong>${escapeHtml(v.name)}</strong>
          <span>${escapeHtml(v.email)}</span>
        </div>
        <div class="story-viewer-row-time">${formatStoryTime(v.viewed_at)}</div>
      `;
      storyViewsList.appendChild(row);
    });
  } catch (err) {
    if (storyViewsList) storyViewsList.innerHTML = '<p class="muted" style="text-align:center; color:#ef4444;">تعذر تحميل قائمة المشاهدين</p>';
  }
}

/* ==========================================================================
   إظهار الشاشات والتنقل
   ========================================================================== */
function showApp() {
  document.body.classList.remove("intro-active");
  ensureSupport();
  saveState();
  loginScreen.hidden = true;
  appScreen.hidden = false;
  // إيقاف تشغيل حركة النقاط الزرقاء مؤقتاً لتوفير المعالج والبطارية أثناء استخدام المحادثة
  if (window._particleEngine && typeof window._particleEngine.stop === "function") {
    window._particleEngine.stop();
  }
  userTitle.textContent = state.currentUser.name;
  renderConversations();
  if (window.innerWidth > 820) {
    let initialChat = state.activeChatId || "support";
    if (isChatLocked(initialChat) && !unlockedChats.has(initialChat)) {
      initialChat = "support";
    }
    openChat(initialChat);
  } else {
    el("contentGrid")?.classList.remove("in-chat");
    el("appScreen")?.classList.remove("in-chat-mobile");
  }
  refreshNotifications();
  refreshFriends();
  updateMyStoryAvatar();
  fetchStories();
  initRealtimeStream();
  registerWebPushNotifications();
  loadAnimatedStickers("pack_chato_animated");
}

function showLogin(resetFields = false) {
  appScreen.hidden = true;
  loginScreen.hidden = false;
  state.myStories = [];
  state.otherStories = [];
  renderStoriesFeed();
  switchAuthTab("signin");

  const welcomeLandingScreen = el("welcomeLandingScreen");
  const loginLayout = el("loginLayout");
  const addAccountTopBar = el("addAccountTopBar");

  if (window.isAddAccountMode) {
    if (welcomeLandingScreen) welcomeLandingScreen.hidden = true;
    if (loginLayout) loginLayout.hidden = false;
    if (addAccountTopBar) addAccountTopBar.hidden = false;
  } else {
    if (welcomeLandingScreen) welcomeLandingScreen.hidden = false;
    if (loginLayout) loginLayout.hidden = true;
    if (addAccountTopBar) addAccountTopBar.hidden = true;
    if (typeof renderWelcomeSavedAccounts === "function") {
      renderWelcomeSavedAccounts();
    }
  }

  // تشغيل حركة النقاط الزرقاء المتحركة في الخلفية
  if (window._particleEngine && typeof window._particleEngine.start === "function") {
    window._particleEngine.start();
  }
  if (resetFields) {
    if (loginEmailInput) loginEmailInput.value = "";
    if (loginPasswordInput) loginPasswordInput.value = "";
    if (regNameInput) regNameInput.value = "";
    if (regEmailInput) regEmailInput.value = "";
    if (regVerificationCodeInput) regVerificationCodeInput.value = "123456";
    if (regPasswordInput) regPasswordInput.value = "";
    if (regConfirmPasswordInput) regConfirmPasswordInput.value = "";
    if (codeSentStatus) codeSentStatus.textContent = "كود التجربة المباشر: 123456";
    loginImage = "";
    if (regImagePreview) regImagePreview.textContent = "+";
  } else if (Array.isArray(state.savedAccounts) && state.savedAccounts.length > 0) {
    // تعبئة تلقائية للحساب المحفوظ مسبقاً (Autofill Support)
    const lastAccount = state.savedAccounts[state.savedAccounts.length - 1];
    if (loginEmailInput && !loginEmailInput.value && lastAccount.email) {
      loginEmailInput.value = lastAccount.email;
    }
    if (loginPasswordInput && !loginPasswordInput.value && lastAccount.password) {
      loginPasswordInput.value = lastAccount.password;
    }
  }

  // دعم Credential Management API للاقتراح والتعبئة التلقائية من المتصفح
  if (!resetFields && navigator.credentials && navigator.credentials.get) {
    navigator.credentials.get({ password: true, mediation: "optional" }).then((cred) => {
      if (cred && cred.id && loginEmailInput && !loginEmailInput.value) {
        loginEmailInput.value = cred.id;
        if (cred.password && loginPasswordInput && !loginPasswordInput.value) {
          loginPasswordInput.value = cred.password;
        }
      }
    }).catch(() => {});
  }

  if (loginError) loginError.textContent = "";
  if (registerError) registerError.textContent = "";
  loginEmailInput?.focus();
}

/* ==========================================================================
   ربط الأحداث (Event Listeners)
   ========================================================================== */
// 3. زر تبديل اللغة
if (langToggleBtn) {
  langToggleBtn.addEventListener("click", toggleLanguage);
}

// تبويبات تسجيل الدخول وإنشاء حساب
tabSignInBtn?.addEventListener("click", () => switchAuthTab("signin"));
tabSignUpBtn?.addEventListener("click", () => switchAuthTab("signup"));

// تسجيل الدخول
signInForm?.addEventListener("submit", handleSignIn);

// إنشاء حساب وإرسال الكود
sendVerificationCodeBtn?.addEventListener("click", handleSendVerificationCode);
signUpForm?.addEventListener("submit", handleSignUp);

regImageInput?.addEventListener("change", () => {
  readImage(regImageInput.files[0], (src) => {
    loginImage = src;
    regImagePreview.innerHTML = `<img src="${src}" alt="" />`;
  });
});

// أزرار إظهار وإخفاء كلمة المرور
document.querySelectorAll(".password-toggle-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const targetId = btn.getAttribute("data-target");
    const input = targetId ? el(targetId) : btn.parentElement.querySelector("input");
    if (!input) return;
    if (input.type === "password") {
      input.type = "text";
      btn.textContent = "🙈";
    } else {
      input.type = "password";
      btn.textContent = "👁";
    }
  });
});

// 4 & 5. أزرار القائمة الجانبية (الشريط)
el("createGroupButton").addEventListener("click", () => {
  groupError.textContent = "";
  renderGroupFriendsPicker();
  openDialog(groupDialog);
});

// 3. نظام تقديم تذكرة الدعم الفني المباشر
const supportRequestDialog = el("supportRequestDialog");
const supportRequestForm = el("supportRequestForm");
const supportNameInput = el("supportNameInput");
const supportIssueInput = el("supportIssueInput");
const supportRequestError = el("supportRequestError");

el("supportButton").addEventListener("click", () => {
  if (state.hasSupportTicket) {
    openChat("support:live");
    return;
  }
  if (supportNameInput) supportNameInput.value = state.currentUser ? state.currentUser.name : "";
  if (supportIssueInput) supportIssueInput.value = "";
  if (supportRequestError) supportRequestError.textContent = "";
  openDialog(supportRequestDialog);
});

if (supportRequestForm) {
  supportRequestForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = clean(supportNameInput.value);
    const issue = clean(supportIssueInput.value);
    if (!issue) {
      supportRequestError.textContent = "اكتب تفاصيل مشكلتك أولاً";
      return;
    }
    try {
      const res = await fetch("/api/support/ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: state.currentUser.email,
          name: name || state.currentUser.name,
          issue
        })
      });
      if (!res.ok) {
        const data = await res.json();
        supportRequestError.textContent = data.error || "تعذر إرسال المشكلة";
        return;
      }
      state.hasSupportTicket = true;
      closeDialog(supportRequestDialog);
      openChat("support:live");
      loadSupportMessages();
    } catch {
      supportRequestError.textContent = t("serverOfflineError");
    }
  });
}

// 1. نظام جلب وعرض الإعلانات
async function loadAds() {
  try {
    const res = await fetch("/api/ads");
    if (!res.ok) return;
    const data = await res.json();
    const activeAds = data.ads || [];
    state.ads = activeAds;
    renderConversations();
    if (state.activeChatId === "chato_announcements") {
      renderMessages();
    }
    const banner = el("announcementBanner");
    if (!banner) return;
    if (activeAds.length > 0 && !sessionStorage.getItem("chato_ad_closed")) {
      const ad = activeAds[0];
      el("adBannerTitle").textContent = ad.title;
      el("adBannerText").textContent = ad.content;
      if (ad.link) {
        el("adBannerLink").href = ad.link;
        el("adBannerLink").hidden = false;
      } else {
        el("adBannerLink").hidden = true;
      }
      banner.hidden = false;
    } else {
      banner.hidden = true;
    }
  } catch {}
}

const closeAdBtn = el("closeAdBtn");
if (closeAdBtn) {
  closeAdBtn.addEventListener("click", () => {
    if (el("announcementBanner")) el("announcementBanner").hidden = true;
    sessionStorage.setItem("chato_ad_closed", "true");
  });
}

// 2. فحص حالة المستخدم والتحديث المستمر للدخول والخروج (Heartbeat)
async function sendHeartbeat(action = "active") {
  if (!state.currentUser?.email) return;
  try {
    const res = await fetch("/api/users/heartbeat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: state.currentUser.email, action })
    });
    if (res.status === 403) {
      const data = await res.json();
      alert(data.error || "تم حظر أو إيقاف حسابك من قبل الإدارة.");
      state.currentUser = null;
      saveState();
      location.reload();
    }
  } catch {}
}

window.addEventListener("beforeunload", () => {
  if (state.currentUser?.email) {
    navigator.sendBeacon("/api/users/heartbeat", JSON.stringify({ email: state.currentUser.email, action: "offline" }));
  }
});

el("addFriendButton").addEventListener("click", () => {
  friendSearch.value = "";
  openDialog(friendDialog);
  renderFriendResults();
  setTimeout(() => friendSearch.focus(), 60);
});

el("profileButton").addEventListener("click", openProfile);

if (settingsButton) {
  settingsButton.addEventListener("click", openSettings);
}

if (addNewAccountBtn) {
  addNewAccountBtn.addEventListener("click", addNewAccount);
}

if (logoutButton) {
  logoutButton.addEventListener("click", logout);
}

// زر الرجوع للحساب الحالي عند وضع إضافة حساب (Add Account Mode)
if (backToCurrentAccountBtn) {
  backToCurrentAccountBtn.addEventListener("click", () => {
    window.isAddAccountMode = false;
    if (addAccountTopBar) addAccountTopBar.hidden = true;
    if (window.previousActiveAccount) {
      state.currentUser = { ...window.previousActiveAccount };
      state.accessToken = window.previousActiveAccount.accessToken || null;
      state.refreshToken = window.previousActiveAccount.refreshToken || null;
      saveState();
    }
    showApp();
    openSettings();
    showSettingsView("account");
  });
}

// أزرار التنقل داخل شاشة الإعدادات المقسمة
if (settingsNavAccount) {
  settingsNavAccount.addEventListener("click", () => {
    showSettingsView("account");
  });
}

if (settingsNavSubscriptions) {
  settingsNavSubscriptions.addEventListener("click", () => {
    showSettingsView("subscriptions");
  });
}

if (settingsNavPrivacy) {
  settingsNavPrivacy.addEventListener("click", () => {
    alert("🔒 الخصوصية والأمان:\n• جميع الرسائل والوسائط مشفرة بمعيار AES-256-GCM المشفر.\n• يمكنك قفل أي محادثة برمز سري PIN لحمايتها من المتطفلين.\n• خيار الرسائل ذاتية الحذف والتدمير بعد مدة محددة.");
  });
}

if (settingsNavAppearance) {
  settingsNavAppearance.addEventListener("click", () => {
    toggleLanguage();
  });
}

if (settingsBackBtn) {
  settingsBackBtn.addEventListener("click", () => {
    showSettingsView("main");
  });
}

// فتح نافذة التحقق من كلمة المرور للوصول إلى مفاتيح المرور
if (openPasskeysBtn) {
  openPasskeysBtn.addEventListener("click", () => {
    if (!state.currentUser) return;
    if (verifyCurrentPasswordInput) verifyCurrentPasswordInput.value = "";
    if (verifyPasswordError) verifyPasswordError.textContent = "";
    openDialog(verifyPasswordModal);
    setTimeout(() => verifyCurrentPasswordInput?.focus(), 60);
  });
}

// نموذج تأكيد كلمة المرور الحالية للدخول لمفاتيح المرور
if (verifyPasswordForm) {
  verifyPasswordForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!state.currentUser?.email) return;
    const enteredPassword = String(verifyCurrentPasswordInput?.value || "").trim();
    if (!enteredPassword) {
      if (verifyPasswordError) verifyPasswordError.textContent = "يرجى كتابة كلمة المرور الحالية أولاً";
      return;
    }

    if (verifyPasswordSubmitBtn) verifyPasswordSubmitBtn.disabled = true;
    if (verifyPasswordError) verifyPasswordError.textContent = "";

    try {
      const res = await fetch("/api/account/verify-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: state.currentUser.email,
          password: enteredPassword
        })
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        if (verifyPasswordError) verifyPasswordError.textContent = data.error || "كلمة المرور غير صحيحة، حاول مجدداً";
        return;
      }

      // التحقق ناجح - حفظ كلمة المرور المؤكدة محلياً في حالة عدم وجودها
      state.currentUser.password = enteredPassword;
      syncCurrentAccountToSaved();
      saveState();

      closeDialog(verifyPasswordModal);

      // فتح نافذة مفاتيح المرور
      if (passkeysUserEmail) passkeysUserEmail.textContent = state.currentUser.email;
      if (passkeysCurrentDisplay) passkeysCurrentDisplay.value = enteredPassword;
      if (passkeysNewPassword) passkeysNewPassword.value = "";
      if (passkeysConfirmPassword) passkeysConfirmPassword.value = "";
      if (passkeysChangeError) passkeysChangeError.textContent = "";
      if (passkeysChangeSuccess) passkeysChangeSuccess.textContent = "";

      openDialog(passkeysManagerModal);
    } catch {
      if (verifyPasswordError) verifyPasswordError.textContent = "تعذر التحقق من الخادم، يرجى المحاولة لاحقاً";
    } finally {
      if (verifyPasswordSubmitBtn) verifyPasswordSubmitBtn.disabled = false;
    }
  });
}

// نسخ كلمة المرور الحالية من مفاتيح المرور
if (copyCurrentPasswordBtn) {
  copyCurrentPasswordBtn.addEventListener("click", async () => {
    const val = passkeysCurrentDisplay ? passkeysCurrentDisplay.value : "";
    if (!val) return;
    try {
      await navigator.clipboard.writeText(val);
      const originalText = copyCurrentPasswordBtn.textContent;
      copyCurrentPasswordBtn.textContent = "✅ تم النسخ";
      setTimeout(() => {
        copyCurrentPasswordBtn.textContent = originalText;
      }, 2000);
    } catch {
      if (passkeysCurrentDisplay) {
        passkeysCurrentDisplay.select();
        document.execCommand("copy");
        copyCurrentPasswordBtn.textContent = "✅ تم النسخ";
        setTimeout(() => {
          copyCurrentPasswordBtn.textContent = "📋 نسخ";
        }, 2000);
      }
    }
  });
}

// تغيير كلمة المرور من نافذة مفاتيح المرور
if (passkeysChangeForm) {
  passkeysChangeForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!state.currentUser?.email) return;
    if (passkeysChangeError) passkeysChangeError.textContent = "";
    if (passkeysChangeSuccess) passkeysChangeSuccess.textContent = "";

    const newPass = String(passkeysNewPassword?.value || "").trim();
    const confPass = String(passkeysConfirmPassword?.value || "").trim();
    const curPass = passkeysCurrentDisplay?.value || state.currentUser.password || "";

    if (!isValidPassword(newPass)) {
      if (passkeysChangeError) passkeysChangeError.textContent = t("passwordInvalidError") || "كلمة المرور يجب أن تكون 8 خانات على الأقل وتحتوي حروفاً كبيرة وصغيرة وأرقام";
      return;
    }

    if (newPass !== confPass) {
      if (passkeysChangeError) passkeysChangeError.textContent = t("passwordsDoNotMatch") || "كلمتا المرور غير متطابقتين";
      return;
    }

    if (passkeysSaveBtn) passkeysSaveBtn.disabled = true;

    try {
      const res = await fetch("/api/account/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: state.currentUser.email,
          currentPassword: curPass,
          newPassword: newPass
        })
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        if (passkeysChangeError) passkeysChangeError.textContent = data.error || "تعذر تغيير كلمة المرور";
        return;
      }

      state.currentUser.password = newPass;
      if (passkeysCurrentDisplay) passkeysCurrentDisplay.value = newPass;
      if (passkeysNewPassword) passkeysNewPassword.value = "";
      if (passkeysConfirmPassword) passkeysConfirmPassword.value = "";
      syncCurrentAccountToSaved();
      saveState();

      if (passkeysChangeSuccess) passkeysChangeSuccess.textContent = "تم تغيير وحفظ كلمة المرور الجديدة بنجاح 🔒";
    } catch {
      if (passkeysChangeError) passkeysChangeError.textContent = "خطأ في الاتصال بالخادم";
    } finally {
      if (passkeysSaveBtn) passkeysSaveBtn.disabled = false;
    }
  });
}

// ========================================================
// شاشة الاشتراكات المجمعة لجميع الأجهزة (Image 3 WhatsApp / Meta)
// ========================================================
const subScreenHub = el("subScreenHub");
const subRowChatPlus = el("subRowChatPlus");
const subRowAiPlus = el("subRowAiPlus");
const subPlanChatPanel = el("subPlanChatPanel");
const subPlanAiPanel = el("subPlanAiPanel");
const backFromChatDetailBtn = el("backFromChatDetailBtn");
const backFromAiDetailBtn = el("backFromAiDetailBtn");

function openSubscriptionsHub() {
  if (subScreenHub) subScreenHub.hidden = false;
  if (subPlanChatPanel) subPlanChatPanel.hidden = true;
  if (subPlanAiPanel) subPlanAiPanel.hidden = true;
}

if (subRowChatPlus) {
  subRowChatPlus.addEventListener("click", () => {
    if (subScreenHub) subScreenHub.hidden = true;
    if (subPlanChatPanel) subPlanChatPanel.hidden = false;
    if (subPlanAiPanel) subPlanAiPanel.hidden = true;
  });
}

if (subRowAiPlus) {
  subRowAiPlus.addEventListener("click", () => {
    if (subScreenHub) subScreenHub.hidden = true;
    if (subPlanChatPanel) subPlanChatPanel.hidden = true;
    if (subPlanAiPanel) subPlanAiPanel.hidden = false;
  });
}

if (backFromChatDetailBtn) {
  backFromChatDetailBtn.addEventListener("click", openSubscriptionsHub);
}

if (backFromAiDetailBtn) {
  backFromAiDetailBtn.addEventListener("click", openSubscriptionsHub);
}

// ========================================================
// محرك النقاط الزرقاء المتحركة في الخلفية (Blue Particle Canvas)
// ========================================================
function initParticleCanvas() {
  const canvas = document.getElementById("particleCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);
  let animId = null;
  let isRunning = false;

  const count = window.innerWidth <= 768 ? 35 : 65;
  const particles = [];
  const blueHues = [
    { r: 2, g: 132, b: 199 },   // #0284c7
    { r: 14, g: 165, b: 233 },  // #0ea5e9
    { r: 56, g: 189, b: 248 },  // #38bdf8
    { r: 96, g: 165, b: 250 },  // #60a5fa
    { r: 125, g: 211, b: 252 }  // #7dd3fc
  ];

  for (let i = 0; i < count; i++) {
    const color = blueHues[Math.floor(Math.random() * blueHues.length)];
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.7,
      vy: (Math.random() - 0.5) * 0.7,
      radius: Math.random() * 2.4 + 1.2,
      baseRadius: Math.random() * 2.4 + 1.2,
      color,
      alpha: Math.random() * 0.45 + 0.35,
      pulseSpeed: Math.random() * 0.025 + 0.015,
      pulseVal: Math.random() * Math.PI
    });
  }

  function render() {
    if (!isRunning) return;
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.pulseVal += p.pulseSpeed;
      p.radius = p.baseRadius + Math.sin(p.pulseVal) * 0.75;

      if (p.x < -10) p.x = width + 10;
      else if (p.x > width + 10) p.x = -10;
      if (p.y < -10) p.y = height + 10;
      else if (p.y > height + 10) p.y = -10;

      // رسم النقطة الزرقاء مع توهج نيون أزرق
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(0.5, p.radius), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.alpha})`;
      ctx.shadowBlur = 10;
      ctx.shadowColor = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, 0.85)`;
      ctx.fill();

      // خطوط الربط الفنية الهادئة بين النقاط القريبة
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 105) {
          const lineAlpha = (1 - dist / 105) * 0.22;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(14, 165, 233, ${lineAlpha})`;
          ctx.lineWidth = 0.85;
          ctx.shadowBlur = 0;
          ctx.stroke();
        }
      }
    }

    animId = requestAnimationFrame(render);
  }

  function start() {
    if (isRunning) return;
    isRunning = true;
    render();
  }

  function stop() {
    isRunning = false;
    if (animId) {
      cancelAnimationFrame(animId);
      animId = null;
    }
  }

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  window._particleEngine = { start, stop };
  start();
}

// تهيئة تشغيل النقاط الزرقاء فوراً
initParticleCanvas();

// ========================================================
// واجهة الترحيب الحديثة الموحدة (Welcome Landing Portal v8.1)
// ========================================================
const welcomeLandingScreen = el("welcomeLandingScreen");
const welcomeThemeToggleBtn = el("welcomeThemeToggleBtn");
const welcomeLangBtn = el("welcomeLangBtn");
const welcomeLangBadge = el("welcomeLangBadge");
const welcomeQrBtn = el("welcomeQrBtn");
const welcomeDownloadBtn = el("welcomeDownloadBtn");
const btnWelcomeSignUp = el("btnWelcomeSignUp");
const btnWelcomeSignIn = el("btnWelcomeSignIn");
const btnWelcomeSupport = el("btnWelcomeSupport");
const btnWelcomeDownload = el("btnWelcomeDownload");
const btnWelcomeQr = el("btnWelcomeQr");
const btnBackToPortal = el("btnBackToPortal");
const backToIntroBtn = el("backToIntroBtn");

// 1. زر تبديل الوضع الليلي والنهاري (Image 2 Circular Moon Icon)
function updateThemeToggleIcons(theme) {
  const isDark = theme === "dark";
  if (welcomeThemeToggleBtn) {
    welcomeThemeToggleBtn.title = isDark ? "التحويل إلى الشاشة البيضاء (الوضع النهاري)" : "التحويل إلى الشاشة السوداء (الوضع الليلي)";
    welcomeThemeToggleBtn.innerHTML = isDark
      ? `<span class="theme-moon-icon-ring" title="التحويل للوضع النهاري">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        </span>`
      : `<span class="theme-moon-icon-ring" title="التحويل للوضع الليلي">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
        </span>`;
  }
}

function toggleAppTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", newTheme);
  try {
    localStorage.setItem("chato_theme", newTheme);
  } catch {}
  updateThemeToggleIcons(newTheme);
}

if (welcomeThemeToggleBtn) {
  welcomeThemeToggleBtn.addEventListener("click", toggleAppTheme);
}

// 2. زر تبديل اللغة في الشريط العلوي
if (welcomeLangBtn) {
  welcomeLangBtn.addEventListener("click", () => {
    toggleLanguage();
    if (welcomeLangBadge) {
      welcomeLangBadge.textContent = state.lang === "ar" ? "ع" : "EN";
    }
  });
}

// 3. زر الدخول بالباركود في الشريط العلوي
if (welcomeQrBtn) {
  welcomeQrBtn.addEventListener("click", () => {
    startQrCameraScanner();
  });
}

// 4. زر تنزيل التطبيق في الشريط العلوي
if (welcomeDownloadBtn) {
  welcomeDownloadBtn.addEventListener("click", () => {
    if (window.deferredAppInstallPrompt) {
      window.deferredAppInstallPrompt.prompt();
      window.deferredAppInstallPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          window.deferredAppInstallPrompt = null;
        }
      });
    } else {
      openDialog(el("appDownloadDialog"));
    }
  });
}

// 5. التنقل بين الواجهة الترحيبية ونماذج التسجيل
function showWelcomeView() {
  if (welcomeLandingScreen) welcomeLandingScreen.hidden = false;
  if (loginLayout) loginLayout.hidden = true;
  if (addAccountTopBar) addAccountTopBar.hidden = true;
  renderWelcomeSavedAccounts();
  if (window._particleEngine && typeof window._particleEngine.start === "function") {
    window._particleEngine.start();
  }
}

function showAuthForm(tabName = "signin") {
  if (welcomeLandingScreen) welcomeLandingScreen.hidden = true;
  if (loginLayout) loginLayout.hidden = false;
  switchAuthTab(tabName);
}

if (btnWelcomeSignUp) {
  btnWelcomeSignUp.addEventListener("click", () => showAuthForm("signup"));
}

if (btnWelcomeSignIn) {
  btnWelcomeSignIn.addEventListener("click", () => showAuthForm("signin"));
}

if (btnWelcomeSupport) {
  btnWelcomeSupport.addEventListener("click", () => {
    openDialog(el("welcomeSupportDialog"));
  });
}

if (btnWelcomeDownload) {
  btnWelcomeDownload.addEventListener("click", () => {
    if (window.deferredAppInstallPrompt) {
      window.deferredAppInstallPrompt.prompt();
      window.deferredAppInstallPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          window.deferredAppInstallPrompt = null;
        }
      });
    } else {
      openDialog(el("appDownloadDialog"));
    }
  });
}

if (btnWelcomeQr) {
  btnWelcomeQr.addEventListener("click", () => {
    startQrCameraScanner();
  });
}

if (btnBackToPortal) {
  btnBackToPortal.addEventListener("click", showWelcomeView);
}

if (backToIntroBtn) {
  backToIntroBtn.addEventListener("click", showWelcomeView);
}

// نافذة تنزيل التطبيق
const appDownloadDialog = el("appDownloadDialog");
const closeAppDownloadDialogBtn = el("closeAppDownloadDialogBtn");
const pwaTriggerInstallBtn = el("pwaTriggerInstallBtn");

if (closeAppDownloadDialogBtn) {
  closeAppDownloadDialogBtn.addEventListener("click", () => closeDialog(appDownloadDialog));
}

if (pwaTriggerInstallBtn) {
  pwaTriggerInstallBtn.addEventListener("click", () => {
    if (window.deferredAppInstallPrompt) {
      window.deferredAppInstallPrompt.prompt();
      window.deferredAppInstallPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          window.deferredAppInstallPrompt = null;
        }
        closeDialog(appDownloadDialog);
      });
    } else {
      alert("لتثبيت التطبيق على جهازك: اضغط على قائمة المتصفح (⋮) ثم اختر 'تثبيت التطبيق' أو 'إضافة للشاشة الرئيسية' 📲");
    }
  });
}

// نافذة الدعم الفني
const welcomeSupportDialog = el("welcomeSupportDialog");
const closeWelcomeSupportBtn = el("closeWelcomeSupportBtn");
const openSupportTicketDirectBtn = el("openSupportTicketDirectBtn");
const visitorSupportForm = el("visitorSupportForm");

if (closeWelcomeSupportBtn) {
  closeWelcomeSupportBtn.addEventListener("click", () => closeDialog(welcomeSupportDialog));
}

if (visitorSupportForm) {
  visitorSupportForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = el("visitorSupportNameInput")?.value.trim() || "";
    const issue = el("visitorSupportIssueInput")?.value.trim() || "";
    const errEl = el("visitorSupportError");
    const succEl = el("visitorSupportSuccess");
    const btn = el("visitorSupportSubmitBtn");
    if (!issue) return;
    if (errEl) errEl.textContent = "";
    if (succEl) succEl.hidden = true;
    if (btn) {
      btn.disabled = true;
      btn.textContent = "جاري الإرسال...";
    }
    try {
      const email = name.includes("@") ? name : `${name || "visitor"}@guest.chato`;
      const res = await fetch("/api/support/ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name: name || "زائر", issue: `[استفسار من الواجهة]: ${issue}` })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "فشل إرسال رسالة الدعم");
      }
      if (succEl) succEl.hidden = false;
      visitorSupportForm.reset();
      setTimeout(() => {
        closeDialog(welcomeSupportDialog);
        if (succEl) succEl.hidden = true;
      }, 2500);
    } catch (err) {
      if (errEl) errEl.textContent = err.message || "تعذر الإرسال، يرجى المحاولة لاحقاً";
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = "إرسال رسالة الدعم 🚀";
      }
    }
  });
}

if (openSupportTicketDirectBtn) {
  openSupportTicketDirectBtn.addEventListener("click", () => {
    closeDialog(welcomeSupportDialog);
    if (supportRequestDialog) {
      if (supportNameInput) supportNameInput.value = state.currentUser?.name || "";
      if (supportIssueInput) supportIssueInput.value = "";
      if (supportRequestError) supportRequestError.textContent = "";
      openDialog(supportRequestDialog);
    }
  });
}

// نافذة الدخول السريع بالرقم السري للحسابات المحفوظة
const quickAccountLoginDialog = el("quickAccountLoginDialog");
const closeQuickLoginDialogBtn = el("closeQuickLoginDialogBtn");
const quickLoginForm = el("quickLoginForm");
const quickLoginPasswordInput = el("quickLoginPasswordInput");
const quickLoginError = el("quickLoginError");
const submitQuickLoginBtn = el("submitQuickLoginBtn");

if (closeQuickLoginDialogBtn) {
  closeQuickLoginDialogBtn.addEventListener("click", () => closeDialog(quickAccountLoginDialog));
}

if (quickLoginForm) {
  quickLoginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!window.selectedQuickAccount) return;
    const email = window.selectedQuickAccount.email;
    const password = quickLoginPasswordInput?.value.trim();
    if (!password) {
      if (quickLoginError) quickLoginError.textContent = "الرجاء كتابة الرقم السري";
      return;
    }
    if (quickLoginError) quickLoginError.textContent = "";
    if (submitQuickLoginBtn) {
      submitQuickLoginBtn.disabled = true;
      submitQuickLoginBtn.textContent = "جاري الدخول...";
    }
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, deviceId: "web" })
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        if (quickLoginError) quickLoginError.textContent = data.error || "الرقم السري غير صحيح";
        if (submitQuickLoginBtn) {
          submitQuickLoginBtn.disabled = false;
          submitQuickLoginBtn.textContent = "دخول الحساب";
        }
        return;
      }

      state.currentUser = data.user;
      state.accessToken = data.accessToken || null;
      state.refreshToken = data.refreshToken || null;
      state.currentUser.lastPassword = password;
      syncCurrentAccountToSaved();
      saveState();

      closeDialog(quickAccountLoginDialog);
      showApp();
      syncUserInbox();
    } catch (err) {
      if (quickLoginError) quickLoginError.textContent = "فشل الاتصال بالخادم، تأكد من اتصال الإنترنت";
    } finally {
      if (submitQuickLoginBtn) {
        submitQuickLoginBtn.disabled = false;
        submitQuickLoginBtn.textContent = "دخول الحساب";
      }
    }
  });
}

// 5. دالة عرض وتحديث قائمة "حساباتك" (Your Saved Accounts)
function renderWelcomeSavedAccounts() {
  const container = el("welcomeAccountsList");
  const countBadge = el("savedAccountsCountBadge");
  if (!container) return;

  const accounts = Array.isArray(state.savedAccounts) ? state.savedAccounts : [];
  if (countBadge) countBadge.textContent = accounts.length;

  if (accounts.length === 0) {
    container.innerHTML = `
      <div class="no-saved-accounts-placeholder">
        <span style="font-size: 20px;">🔒</span>
        <span>لا توجد حسابات مسجلة على هذا الجهاز بعد. عند تسجيل دخولك أو إنشاء حساب جديد سيتم حفظه هنا لتتمكن من الدخول بالرقم السري فقط.</span>
      </div>
    `;
    return;
  }

  container.innerHTML = "";
  accounts.forEach((acc) => {
    const item = document.createElement("div");
    item.className = "welcome-account-item";
    item.title = `اضغط للدخول إلى حساب ${acc.name || acc.email} بالرقم السري فقط`;

    // الصورة الرمزية
    const av = document.createElement("div");
    av.className = "welcome-account-avatar";
    if (acc.image) {
      const img = document.createElement("img");
      img.src = acc.image;
      img.alt = acc.name || "";
      av.appendChild(img);
    } else {
      av.textContent = (acc.name || acc.email || "U").charAt(0).toUpperCase();
    }

    // معلومات الحساب
    const info = document.createElement("div");
    info.className = "welcome-account-info";
    const nameEl = document.createElement("strong");
    nameEl.className = "welcome-account-name";
    nameEl.textContent = acc.name || acc.email;
    const emailEl = document.createElement("span");
    emailEl.className = "welcome-account-email";
    emailEl.textContent = acc.email;
    info.append(nameEl, emailEl);

    // زر الدخول المباشر
    const quickBtn = document.createElement("button");
    quickBtn.type = "button";
    quickBtn.className = "welcome-account-quick-btn";
    quickBtn.innerHTML = "دخول 🔑";

    // زر الحذف من الجهاز
    const delBtn = document.createElement("button");
    delBtn.type = "button";
    delBtn.className = "btn-delete-saved-account";
    delBtn.title = "إزالة هذا الحساب من هذا الجهاز";
    delBtn.textContent = "✕";

    delBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (confirm(`هل أنت متأكد من إزالة حساب (${acc.name || acc.email}) من هذا الجهاز؟`)) {
        state.savedAccounts = state.savedAccounts.filter((a) => a.email.toLowerCase() !== acc.email.toLowerCase());
        saveState();
        renderWelcomeSavedAccounts();
      }
    });

    const openQuickLogin = () => {
      window.selectedQuickAccount = acc;
      const avTarget = el("quickLoginAvatar");
      const nameTarget = el("quickLoginUserName");
      const emailTarget = el("quickLoginUserEmail");
      const passInput = el("quickLoginPasswordInput");
      const errorLine = el("quickLoginError");

      if (avTarget) {
        avTarget.innerHTML = "";
        if (acc.image) {
          const img = document.createElement("img");
          img.src = acc.image;
          avTarget.appendChild(img);
        } else {
          avTarget.textContent = (acc.name || acc.email || "U").charAt(0).toUpperCase();
        }
      }
      if (nameTarget) nameTarget.textContent = acc.name || acc.email;
      if (emailTarget) emailTarget.textContent = acc.email;
      if (passInput) passInput.value = "";
      if (errorLine) errorLine.textContent = "";

      openDialog(quickAccountLoginDialog);
      setTimeout(() => passInput?.focus(), 150);
    };

    item.addEventListener("click", openQuickLogin);
    quickBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      openQuickLogin();
    });

    item.append(av, info, quickBtn, delBtn);
    container.appendChild(item);
  });
}

// 1. ترقية أو تجديد باقة شاتو AI بلاس (500 كلمة، 20 صورة يومياً)
const subscribeAiPlusBtn = el("subscribeAiPlusBtn");
async function handleSubscribeAiPlus() {
  if (!state.currentUser?.email) return;
  const btn = subscribeAiPlusBtn || subUpgradeActionBtn;
  if (btn) btn.disabled = true;
  try {
    const res = await fetch("/api/subscriptions/subscribe-plus", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: state.currentUser.email,
        planCode: "chato_ai_plus"
      })
    });
    const data = await res.json();
    if (!res.ok || !data.ok) {
      alert(data.error || "تعذر تفعيل الاشتراك حالياً");
      return;
    }

    alert(data.message || "🎉 مبروك! تم تفعيل باقة (شاتو AI بلاس) بنجاح لمدة شهرين كاملين (60 يوماً) مع 500 كلمة و 20 صورة يومياً!");
    state.currentUser.isVip = true;
    state.currentUser.vipUntil = data.expires_at || data.subscription?.expires_at;
    syncCurrentAccountToSaved();
    saveState();

    await fetchSubscriptionDetails();
    await updateSubscriptionBadge();
  } catch {
    alert("خطأ أثناء الاتصال بالخادم لتفعيل الباقة");
  } finally {
    if (btn) btn.disabled = false;
  }
}

if (subscribeAiPlusBtn) subscribeAiPlusBtn.addEventListener("click", handleSubscribeAiPlus);
if (subUpgradeActionBtn) subUpgradeActionBtn.addEventListener("click", handleSubscribeAiPlus);

// 2. ترقية أو تجديد باقة شاتو بلاس (مميزات المحادثات، الثيمات، الترجمة الفورية، الإيموجي النادر، 25 تثبيت)
const subscribeChatPlusBtn = el("subscribeChatPlusBtn");
if (subscribeChatPlusBtn) {
  subscribeChatPlusBtn.addEventListener("click", async () => {
    if (!state.currentUser?.email) return;
    subscribeChatPlusBtn.disabled = true;
    try {
      const res = await fetch("/api/subscriptions/subscribe-plus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: state.currentUser.email,
          planCode: "chato_plus"
        })
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        alert(data.error || "تعذر تفعيل الاشتراك حالياً");
        return;
      }

      alert(data.message || "🎉 مبروك! تم تفعيل باقة (شاتو بلاس) بنجاح لمدة شهرين كاملين (60 يوماً)! تم فتح خلفيات ومظهر المحادثة، الترجمة الفورية، والرموز النادرة والمتحركة، وتثبيت حتى 25 رسالة.");
      state.currentUser.isChatPlus = true;
      if (data.expires_at) state.currentUser.chatPlusUntil = data.expires_at;
      syncCurrentAccountToSaved();
      saveState();

      // فتح الميزات فوراً في الواجهة
      if (chatWallpaperButton) chatWallpaperButton.hidden = false;
      if (emojiTabVipBtn) emojiTabVipBtn.hidden = false;
      renderMessages();

      await fetchSubscriptionDetails();
      await updateSubscriptionBadge();
    } catch {
      alert("خطأ أثناء الاتصال بالخادم لتفعيل باقة شاتو بلاس");
    } finally {
      subscribeChatPlusBtn.disabled = false;
    }
  });
}

// ==========================================
// ربط أحداث الاستوري والحالات (Stories Events)
// ==========================================
if (myStoryRailBtn) {
  myStoryRailBtn.addEventListener("click", handleMyStoryClick);
}
if (myStoryPlusBtn) {
  myStoryPlusBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    openStoryUploadPicker();
  });
}
if (myStoryBarItem) {
  myStoryBarItem.addEventListener("click", handleMyStoryClick);
}
if (myStoryBarPlusBtn) {
  myStoryBarPlusBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    openStoryUploadPicker();
  });
}
if (storyFileInput) {
  storyFileInput.addEventListener("change", () => {
    if (storyFileInput.files && storyFileInput.files[0]) {
      handleStoryFileSelected(storyFileInput.files[0]);
    }
  });
}
if (storyUploadForm) {
  storyUploadForm.addEventListener("submit", submitStoryUpload);
}
if (storyViewerCloseBtn) {
  storyViewerCloseBtn.addEventListener("click", closeStoryViewer);
}
if (storyViewerDeleteBtn) {
  storyViewerDeleteBtn.addEventListener("click", deleteCurrentStory);
}
if (storyViewerAddBtn) {
  storyViewerAddBtn.addEventListener("click", () => {
    closeStoryViewer();
    openStoryUploadPicker();
  });
}
if (storyTouchPrev) {
  storyTouchPrev.addEventListener("click", (e) => {
    e.stopPropagation();
    prevStory();
  });
}
if (storyTouchNext) {
  storyTouchNext.addEventListener("click", (e) => {
    e.stopPropagation();
    nextStory();
  });
}
if (storyViewsToggleBtn) {
  storyViewsToggleBtn.addEventListener("click", loadStoryViewers);
}
if (storyDrawerCloseBtn) {
  storyDrawerCloseBtn.addEventListener("click", () => {
    if (storyViewsDrawer) storyViewsDrawer.hidden = true;
    resumeStoryPlayback();
  });
}

// ضغط مطول لإيقاف شريط التقدم والفيديو مؤقتاً
if (storyViewerBody) {
  storyViewerBody.addEventListener("mousedown", (e) => {
    if (e.target.closest(".story-touch-nav") || e.target.closest(".story-action-btn")) return;
    pauseStoryPlayback();
  });
  storyViewerBody.addEventListener("mouseup", () => resumeStoryPlayback());
  storyViewerBody.addEventListener("mouseleave", () => resumeStoryPlayback());
  storyViewerBody.addEventListener("touchstart", (e) => {
    if (e.target.closest(".story-touch-nav") || e.target.closest(".story-action-btn")) return;
    pauseStoryPlayback();
  }, { passive: true });
  storyViewerBody.addEventListener("touchend", () => resumeStoryPlayback());
}

// إغلاق المشغل بزر Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && storyViewerOverlay && !storyViewerOverlay.hidden) {
    closeStoryViewer();
  }
});

// 6. زر إظهار/إخفاء حقول تغيير كلمة المرور بالملف الشخصي
if (toggleChangePasswordBtn) {
  toggleChangePasswordBtn.addEventListener("click", () => {
    changePasswordBox.hidden = !changePasswordBox.hidden;
    toggleChangePasswordBtn.textContent = changePasswordBox.hidden ? t("changePwBtn") : t("hidePwBtn");
    profileError.textContent = "";
    profileSuccess.textContent = "";
  });
}

el("profileForm").addEventListener("submit", (e) => {
  e.preventDefault();
  saveProfile();
});

profileImageEdit.addEventListener("change", () => {
  readImage(profileImageEdit.files[0], (src) => {
    profileImageData = src;
    profileImageEditPreview.innerHTML = `<img src="${src}" alt="" />`;
  });
});

// عناصر الدردشة
el("composer").addEventListener("submit", (event) => {
  event.preventDefault();
  sendText(messageInput.value);
});

el("emojiButton").addEventListener("click", () => {
  emojiTray.hidden = !emojiTray.hidden;
  if (!emojiTray.hidden) {
    if (stickerTray) stickerTray.hidden = true;
    if (attachMenu) attachMenu.hidden = true;
  }
});

emojiTray.querySelectorAll("button").forEach((button) => {
  button.addEventListener("click", () => {
    messageInput.value += button.textContent;
    messageInput.focus();
  });
});

// 7. قائمة المرفقات والمشاركة مع كامل الخيارات بالأسماء
if (attachButton) {
  attachButton.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleAttachMenu(e);
  });
}

// زر الكاميرا الفورية
const attachCameraBtn = el("attachCameraBtn");
const cameraFileInput = el("cameraFileInput");
if (attachCameraBtn && cameraFileInput) {
  attachCameraBtn.addEventListener("click", () => {
    toggleAttachMenu();
    cameraFileInput.click();
  });
  cameraFileInput.addEventListener("change", () => {
    if (cameraFileInput.files && cameraFileInput.files[0]) {
      sendImage(cameraFileInput.files[0]);
      cameraFileInput.value = "";
    }
  });
}

// زر الصور والمعرض
const attachGalleryBtn = el("attachGalleryBtn");
if (attachGalleryBtn && imageInput) {
  attachGalleryBtn.addEventListener("click", () => {
    toggleAttachMenu();
    imageInput.click();
  });
}

// زر المستندات والملفات
const attachDocBtn = el("attachDocBtn");
const docFileInput = el("docFileInput");
if (attachDocBtn && docFileInput) {
  attachDocBtn.addEventListener("click", () => {
    toggleAttachMenu();
    docFileInput.click();
  });
  docFileInput.addEventListener("change", () => {
    if (docFileInput.files && docFileInput.files[0]) {
      sendDocument(docFileInput.files[0]);
      docFileInput.value = "";
    }
  });
}

// زر مشاركة الموقع الجغرافي
if (attachLocationBtn) {
  attachLocationBtn.addEventListener("click", () => {
    toggleAttachMenu();
    sendLocationMessage();
  });
}

// زر استطلاع رأي
if (attachPollBtn) {
  attachPollBtn.addEventListener("click", () => {
    toggleAttachMenu();
    openPollDialog();
  });
}

// زر الملصقات والاستيكرات
if (attachStickerBtn) {
  attachStickerBtn.addEventListener("click", () => {
    toggleAttachMenu();
    toggleStickerTray();
  });
}

// زر الرسالة الصوتية من قائمة المرفقات
const attachVoiceBtn = el("attachVoiceBtn");
if (attachVoiceBtn) {
  attachVoiceBtn.addEventListener("click", () => {
    toggleAttachMenu();
    if (typeof toggleRecording === "function") toggleRecording();
  });
}

if (closeStickerTrayBtn) {
  closeStickerTrayBtn.addEventListener("click", () => {
    if (stickerTray) stickerTray.hidden = true;
  });
}

const stickerTrayTabs = el("stickerTrayTabs");
if (stickerTrayTabs) {
  stickerTrayTabs.querySelectorAll(".sticker-tab-btn").forEach((tabBtn) => {
    tabBtn.addEventListener("click", () => {
      loadAnimatedStickers(tabBtn.dataset.pack);
    });
  });
}

const stickerGrid = el("stickerGrid");
if (stickerGrid) {
  stickerGrid.querySelectorAll(".sticker-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      sendSticker(btn.dataset.sticker, btn.dataset.name);
    });
  });
}

if (pollForm) {
  pollForm.addEventListener("submit", submitPoll);
}



imageInput.addEventListener("change", () => {
  sendImage(imageInput.files[0]);
  imageInput.value = "";
});

// أحداث الذكاء الاصطناعي ChatGPT وتوليد الصور
if (aiChatButton) {
  aiChatButton.addEventListener("click", () => openChat("ai:chatgpt"));
}

if (generateAiImageBtn) {
  generateAiImageBtn.addEventListener("click", openAiImageDialog);
}

if (aiUpgradeBtn) {
  aiUpgradeBtn.addEventListener("click", () => openAiUpgradeDialog());
}

if (confirmAiPayBtn) {
  confirmAiPayBtn.addEventListener("click", upgradeAiUnlimited);
}

if (aiImagePromptForm) {
  aiImagePromptForm.addEventListener("submit", submitAiImagePrompt);
}

if (voiceButton) voiceButton.addEventListener("click", toggleRecording);
if (deleteFriendButton) deleteFriendButton.addEventListener("click", removeActiveFriend);
if (friendSearch) friendSearch.addEventListener("input", renderFriendResults);

const groupForm = el("groupForm");
if (groupForm) {
  groupForm.addEventListener("submit", (event) => {
    event.preventDefault();
    addGroup();
  });
}

if (groupImage) {
  groupImage.addEventListener("change", () => {
    readImage(groupImage.files[0], (src) => {
      groupImageData = src;
      if (groupImagePreview) groupImagePreview.innerHTML = `<img src="${src}" alt="" />`;
    });
  });
}

const chatSearchBtn = el("chatSearchButton");
if (chatSearchBtn) {
  chatSearchBtn.addEventListener("click", () => {
    if (chatDropdownMenu) chatDropdownMenu.hidden = true;
    if (messageSearch) messageSearch.hidden = false;
    if (messageSearchInput) messageSearchInput.focus();
  });
}

const closeSearchBtn = el("closeSearchButton");
if (closeSearchBtn) {
  closeSearchBtn.addEventListener("click", () => {
    if (messageSearch) messageSearch.hidden = true;
    if (messageSearchInput) messageSearchInput.value = "";
    renderMessages();
  });
}

if (messageSearchInput) {
  messageSearchInput.addEventListener("input", renderMessages);
}

const backChatBtn = el("backChatBtn");
if (backChatBtn) {
  backChatBtn.addEventListener("click", () => {
    el("contentGrid")?.classList.remove("in-chat");
    el("appScreen")?.classList.remove("in-chat-mobile");
    // قفل المحادثات وإلغاء حالة الفتح فور الرجوع للقائمة الرئيسية
    unlockedChats.clear();
    document.body.classList.remove("in-announcements");
    state.activeChatId = null;
    renderConversations();
  });
}

const voiceCallBtn = el("voiceCallButton");
if (voiceCallBtn) {
  voiceCallBtn.addEventListener("click", () => {
    if (chatDropdownMenu) chatDropdownMenu.hidden = true;
    openCall(t("voiceCall"));
  });
}

const videoCallBtn = el("videoCallButton");
if (videoCallBtn) {
  videoCallBtn.addEventListener("click", () => {
    if (chatDropdownMenu) chatDropdownMenu.hidden = true;
    openCall(t("videoCall"));
  });
}

const endCallBtn = el("endCallButton");
if (endCallBtn) {
  endCallBtn.addEventListener("click", () => endAudioCall(true));
}

const answerCallBtn = el("answerCallButton");
if (answerCallBtn) {
  answerCallBtn.addEventListener("click", () => answerIncomingCall());
}

const muteCallBtn = el("muteCallButton");
if (muteCallBtn) {
  muteCallBtn.addEventListener("click", () => toggleMuteCall());
}

if (notificationButton) {
  notificationButton.addEventListener("click", async () => {
    await refreshNotifications();
    renderNotifications();
    openDialog(notificationsDialog);
  });
}

document.querySelectorAll("[data-close]").forEach((button) => {
  button.addEventListener("click", () => closeDialog(el(button.dataset.close)));
});

// ==========================================
// أحداث نسخة التليفونات (زر الثلاث شُرط وزر الذكاء الاصطناعي Meta AI العائم)
// ==========================================
const mobileMenuBtn = el("mobileMenuBtn");
const mobileDropdownMenu = el("mobileDropdownMenu");

function closeMobileMenu() {
  if (mobileDropdownMenu) mobileDropdownMenu.hidden = true;
}

if (mobileMenuBtn && mobileDropdownMenu) {
  mobileMenuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    mobileDropdownMenu.hidden = !mobileDropdownMenu.hidden;
  });

  document.addEventListener("click", (e) => {
    if (!mobileDropdownMenu.hidden && !mobileDropdownMenu.contains(e.target) && e.target !== mobileMenuBtn) {
      mobileDropdownMenu.hidden = true;
    }
  });

  el("mMenuAddFriend")?.addEventListener("click", () => {
    closeMobileMenu();
    el("addFriendButton")?.click();
  });

  el("mMenuCreateGroup")?.addEventListener("click", () => {
    closeMobileMenu();
    el("createGroupButton")?.click();
  });

  el("mMenuSupport")?.addEventListener("click", () => {
    closeMobileMenu();
    el("supportButton")?.click();
  });

  el("mMenuProfile")?.addEventListener("click", () => {
    closeMobileMenu();
    openProfile();
  });

  el("mMenuSettings")?.addEventListener("click", () => {
    closeMobileMenu();
    openSettings();
  });

  el("mMenuLogout")?.addEventListener("click", () => {
    closeMobileMenu();
    logout();
  });
}

// زر الذكاء الاصطناعي العائم مثل Meta AI في واتساب
const mobileAiFab = el("mobileAiFab");
if (mobileAiFab) {
  mobileAiFab.addEventListener("click", () => {
    openChat("ai:chatgpt");
  });
}

// ==========================================
// مزامنة صندوق الوارد بالكامل لحظياً (Real-Time Inbox Sync)
// ==========================================
async function syncUserInbox() {
  if (!state.currentUser?.email) return;
  try {
    const res = await fetch(`/api/messages/inbox?user=${encodeURIComponent(state.currentUser.email)}`);
    if (!res.ok) return;
    const data = await res.json();
    const myEmail = state.currentUser.email.toLowerCase();
    const messages = data.messages || [];
    const contacts = data.contacts || {};
    let hasChanges = false;

    if (data.chatSettings) {
      state.chatSettings = { ...state.chatSettings, ...data.chatSettings };
      hasChanges = true;
    }
    if (data.chatTimers) {
      state.chatTimers = { ...state.chatTimers, ...data.chatTimers };
      hasChanges = true;
    }
    if (data.chatAiActive) {
      state.chatAiActive = { ...state.chatAiActive, ...data.chatAiActive };
      hasChanges = true;
    }

    // تجميع الرسائل بحسب الطرف الآخر أو المجموعة
    const grouped = {};
    for (const m of messages) {
      const from = String(m.from || "").toLowerCase();
      const to = String(m.to || "").toLowerCase();
      const cid = String(m.chat_id || "");
      if (from === "support@chato.system" || to === "support@chato.system") continue;
      if (from === "admin@chato.system" || to === "admin@chato.system") continue;

      // رسائل المجموعات
      if (to.startsWith("group:") || cid.startsWith("group:")) {
        const groupKey = to.startsWith("group:") ? to : cid;
        grouped[groupKey] = grouped[groupKey] || [];
        grouped[groupKey].push(m);
        continue;
      }

      let other = null;
      if (from === "chatgpt") {
        if (m.chat_id) {
          const parts = m.chat_id.split("<->");
          other = parts.find((p) => p.toLowerCase() !== myEmail);
        }
      } else {
        other = from === myEmail ? to : from;
      }
      if (!other) continue;
      grouped[other] = grouped[other] || [];
      grouped[other].push(m);
    }

    for (const [targetKey, msgs] of Object.entries(grouped)) {
      if (targetKey.startsWith("group:")) {
        const chatId = targetKey;
        const formatted = msgs.map((m) => {
          const isMe = String(m.from).toLowerCase() === myEmail;
          const senderInfo = contacts[String(m.from).toLowerCase()] || { name: m.fromName || m.senderName || m.sender || String(m.from).split("@")[0] };
          return {
            id: m.id,
            from: isMe ? "me" : (String(m.from).toLowerCase() === "chatgpt" ? "chatgpt" : "other"),
            senderName: isMe ? (state.currentUser?.name || "أنت") : (senderInfo.name || m.fromName || m.senderName || m.sender || m.from),
            senderImage: senderInfo.image || m.senderImage || "",
            type: m.type || "text",
            text: m.text || "",
            imageUrl: m.imageUrl || "",
            fileName: m.fileName || "",
            audioUrl: m.audioUrl || "",
            audioDuration: m.audioDuration,
            location: m.location || null,
            poll: m.poll || null,
            sticker: m.sticker || null,
            reply_to: m.reply_to || null,
            reactions: m.reactions || {},
            status: m.read ? "read" : (m.status || "sent"),
            read: Boolean(m.read),
            createdAt: Number(m.createdAt || m.created_at || (m.timestamp ? new Date(m.timestamp).getTime() : Date.now())) || Date.now()
          };
        });

        const currentMsgs = state.conversations[chatId] || [];
        if (currentMsgs.length !== formatted.length || (formatted.length > 0 && currentMsgs.at(-1)?.id !== formatted.at(-1)?.id)) {
          state.conversations[chatId] = formatted;
          hasChanges = true;
          if (state.activeChatId === chatId) {
            renderMessages();
          }
        }
        continue;
      }

      const otherEmail = targetKey;
      const chatId = `friend:${otherEmail}`;
      const contactInfo = contacts[otherEmail] || { name: otherEmail.split("@")[0], email: otherEmail, image: "" };

      // إذا لم يكن الصديق مسجلاً في قائمة الأصدقاء المحلية: إضافته فوراً
      if (!state.friends.some((f) => f.email.toLowerCase() === otherEmail)) {
        state.friends.push({
          name: contactInfo.name || otherEmail,
          email: otherEmail,
          image: contactInfo.image || ""
        });
        hasChanges = true;
      }

      // تحويل الرسائل لتنسيق العرض
      const formatted = msgs.map((m) => ({
        id: m.id,
        from: String(m.from).toLowerCase() === myEmail ? "me" : (String(m.from).toLowerCase() === "chatgpt" ? "chatgpt" : "other"),
        type: m.type || "text",
        text: m.text || "",
        imageUrl: m.imageUrl || "",
        fileName: m.fileName || "",
        audioUrl: m.audioUrl || "",
        location: m.location || null,
        poll: m.poll || null,
        sticker: m.sticker || null,
        status: m.read ? "read" : (m.status || "sent"),
        read: Boolean(m.read),
        createdAt: Number(m.createdAt) || Date.now()
      }));

      const currentMsgs = state.conversations[chatId] || [];
      if (currentMsgs.length !== formatted.length || (formatted.length > 0 && currentMsgs.at(-1)?.id !== formatted.at(-1)?.id)) {
        state.conversations[chatId] = formatted;
        hasChanges = true;
        if (state.activeChatId === chatId) {
          renderMessages();
        }
      }
    }

    if (hasChanges) {
      saveState();
      renderConversations();
      updateChatAiButtonUI();
    }
  } catch {}
}

// ==========================================
// توليد وتبادل مفاتيح التشفير الطرفي (E2EE Key Exchange)
// ==========================================
async function initE2EEKeys() {
  if (!state.currentUser?.email) return;
  try {
    if (!window.crypto || !window.crypto.subtle) return;
    let localKeys = null;
    try {
      const stored = localStorage.getItem("chato_e2ee_keys");
      if (stored) localKeys = JSON.parse(stored);
    } catch {}

    if (!localKeys || !localKeys.publicKey) {
      const keyPair = await window.crypto.subtle.generateKey(
        { name: "ECDH", namedCurve: "P-256" },
        true,
        ["deriveKey", "deriveBits"]
      );
      const exportedPublic = await window.crypto.subtle.exportKey("spki", keyPair.publicKey);
      const exportedPrivate = await window.crypto.subtle.exportKey("pkcs8", keyPair.privateKey);
      const pubB64 = btoa(String.fromCharCode(...new Uint8Array(exportedPublic)));
      const privB64 = btoa(String.fromCharCode(...new Uint8Array(exportedPrivate)));
      localKeys = { publicKey: pubB64, privateKey: privB64 };
      localStorage.setItem("chato_e2ee_keys", JSON.stringify(localKeys));
    }

    if (localKeys.publicKey) {
      await fetch("/api/devices/public-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: state.currentUser.email,
          device_id: "web",
          public_key: localKeys.publicKey
        })
      });
    }
  } catch (err) {
    console.warn("E2EE key generation error:", err);
  }
}

// ==========================================
// أحداث قفل المحادثات برمز PIN والرسائل ذاتية التدمير
// ==========================================
if (chatLockButton) {
  chatLockButton.addEventListener("click", () => {
    if (state.activeChatId) {
      promptLockChat(state.activeChatId);
    }
  });
}

if (chatDisappearingButton) {
  chatDisappearingButton.addEventListener("click", () => {
    const chatId = state.activeChatId;
    const chat = getChat();
    const curTimer = state.chatTimers?.[chatId] || (chat?.email && state.chatTimers?.[`friend:${chat.email}`]) || 0;
    const radio = document.querySelector(`input[name="disappearingOption"][value="${curTimer || 0}"]`);
    if (radio) radio.checked = true;
    openDialog(disappearingDialog);
  });
}

if (saveDisappearingBtn) {
  saveDisappearingBtn.addEventListener("click", async () => {
    const chatId = state.activeChatId;
    const chat = getChat();
    if (!chatId || !state.currentUser?.email) return;
    const selectedRadio = document.querySelector('input[name="disappearingOption"]:checked');
    const timerVal = Number(selectedRadio?.value || 0);
    const finalTimer = timerVal === 0 ? null : timerVal;

    try {
      const res = await fetch(`/api/chats/${encodeURIComponent(chatId)}/disappearing`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          timer_seconds: finalTimer,
          email: state.currentUser.email,
          friend: chat?.email || null,
          chatId: chatId
        })
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        state.chatTimers = state.chatTimers || {};
        state.chatTimers[chatId] = finalTimer;
        if (chat?.email) state.chatTimers[`friend:${chat.email}`] = finalTimer;
        saveState();
        closeDialog(disappearingDialog);
        updateDisappearingNoticeUI();
        alert(finalTimer ? `تم تفعيل الرسائل ذاتية الحذف (${disappearingTimerText?.textContent || ""}) ⏱️` : "تم إيقاف الرسائل ذاتية الاختفاء");
      } else {
        alert(data.error || "فشل ضبط مؤقت الرسائل ذاتية الاختفاء");
      }
    } catch (err) {
      alert("خطأ في الاتصال بالخادم");
    }
  });
}

if (chatPinForm) {
  chatPinForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!pendingPinAction || !state.currentUser?.email) return;
    const { mode, chatId } = pendingPinAction;
    const pin = (chatPinInput?.value || "").trim();
    if (!/^\d{4,6}$/.test(pin)) {
      if (chatPinError) chatPinError.textContent = "رمز PIN يجب أن يتكون من 4 إلى 6 أرقام";
      return;
    }
    if (chatPinError) chatPinError.textContent = "";

    if (mode === "unlock") {
      try {
        const res = await fetch(`/api/chats/${encodeURIComponent(chatId)}/unlock`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pin_code: pin, email: state.currentUser.email, chatId })
        });
        const data = await res.json();
        if (res.ok && data.unlocked) {
          unlockedChats.add(chatId);
          closeDialog(chatPinDialog);
          openChat(chatId);
        } else {
          if (chatPinError) chatPinError.textContent = data.error || "رمز PIN غير صحيح!";
        }
      } catch (err) {
        if (chatPinError) chatPinError.textContent = "تعذر الاتصال بالخادم";
      }
    } else if (mode === "lock") {
      try {
        const res = await fetch(`/api/chats/${encodeURIComponent(chatId)}/lock`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pin_code: pin, is_locked: true, email: state.currentUser.email, chatId })
        });
        const data = await res.json();
        if (res.ok && data.ok) {
          state.chatSettings = state.chatSettings || {};
          state.chatSettings[chatId] = { is_locked: true };
          unlockedChats.add(chatId);
          saveState();
          closeDialog(chatPinDialog);
          updateChatLockUI();
          renderConversations();
          alert("تم قفل المحادثة بنجاح 🔒");
        } else {
          if (chatPinError) chatPinError.textContent = data.error || "فشل قفل المحادثة";
        }
      } catch (err) {
        if (chatPinError) chatPinError.textContent = "تعذر الاتصال بالخادم";
      }
    }
  });
}

if (chatPinRemoveBtn) {
  chatPinRemoveBtn.addEventListener("click", async () => {
    if (!pendingPinAction || !state.currentUser?.email) return;
    const { chatId } = pendingPinAction;
    try {
      const res = await fetch(`/api/chats/${encodeURIComponent(chatId)}/lock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_locked: false, email: state.currentUser.email, chatId })
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        if (state.chatSettings) {
          delete state.chatSettings[chatId];
        }
        unlockedChats.delete(chatId);
        saveState();
        closeDialog(chatPinDialog);
        updateChatLockUI();
        renderConversations();
        alert("تم إلغاء قفل المحادثة بنجاح 🔓");
      }
    } catch (err) {
      if (chatPinError) chatPinError.textContent = "تعذر إلغاء قفل المحادثة";
    }
  });
}

// إذا تم إغلاق نافذة إدخال الرمز دون فتح المحادثة
if (chatPinDialog) {
  chatPinDialog.addEventListener("close", () => {
    if (pendingPinAction && pendingPinAction.mode === "unlock") {
      if (!unlockedChats.has(pendingPinAction.chatId)) {
        if (state.activeChatId === pendingPinAction.chatId) {
          state.activeChatId = null;
          el("contentGrid")?.classList.remove("in-chat");
          el("appScreen")?.classList.remove("in-chat-mobile");
          renderConversations();
        }
      }
    }
  });
}

// قفل المحادثات تلقائياً عند تصغير الصفحة أو قفل شاشة الهاتف
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    unlockedChats.clear();
    if (isChatLocked(state.activeChatId)) {
      el("contentGrid")?.classList.remove("in-chat");
      el("appScreen")?.classList.remove("in-chat-mobile");
      state.activeChatId = null;
      renderConversations();
    }
  }
});

// ============================================================================
// مميزات الدردشة الحصرية لبلاس AI شاتو وتسجيل الدخول بالباركود
// ============================================================================

// 1. باركود الحساب للدخول السريع (Account QR Card)
if (openAccountQrBtn) {
  openAccountQrBtn.addEventListener("click", () => {
    openAccountQrCard();
  });
}

if (closeAccountQrModalBtn) {
  closeAccountQrModalBtn.addEventListener("click", () => {
    closeDialog(accountQrModal);
  });
}

async function openAccountQrCard() {
  if (!state.currentUser) return;
  if (accountQrAvatar) accountQrAvatar.textContent = (state.currentUser.name || "و").slice(0, 1).toUpperCase();
  if (accountQrName) accountQrName.textContent = state.currentUser.name || "المستخدم";
  if (accountQrEmail) accountQrEmail.textContent = state.currentUser.email || "";

  if (accountQrCanvasContainer) {
    accountQrCanvasContainer.innerHTML = "<p style='color:#64748b; font-size:13px; margin: auto;'>جاري تجهيز الباركود... ⌛</p>";
  }
  openDialog(accountQrModal);

  try {
    const res = await fetch(`/api/account/qr-card?email=${encodeURIComponent(state.currentUser.email)}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "فشل جلب الباركود");

    if (accountQrCanvasContainer) {
      accountQrCanvasContainer.innerHTML = "";
      if (window.QRCode) {
        new QRCode(accountQrCanvasContainer, {
          text: data.qrPayload,
          width: 196,
          height: 196,
          colorDark: "#0f172a",
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.H
        });
      } else {
        accountQrCanvasContainer.innerHTML = "<p class='error-line'>مكتبة QR Code لم تكتمل بعد</p>";
      }
    }
  } catch (err) {
    if (accountQrCanvasContainer) {
      accountQrCanvasContainer.innerHTML = `<p class="error-line" style="margin: auto;">خطأ: ${err.message}</p>`;
    }
  }
}

if (downloadAccountQrBtn) {
  downloadAccountQrBtn.addEventListener("click", () => {
    const canvas = accountQrCanvasContainer?.querySelector("canvas");
    const img = accountQrCanvasContainer?.querySelector("img");
    let src = canvas ? canvas.toDataURL("image/png") : (img ? img.src : "");
    if (!src) {
      alert("الباركود غير جاهز للتحميل بعد");
      return;
    }
    const a = document.createElement("a");
    a.href = src;
    a.download = `chato-qr-${state.currentUser?.name || "account"}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });
}

if (regenerateAccountQrBtn) {
  regenerateAccountQrBtn.addEventListener("click", async () => {
    if (!confirm("هل أنت متأكد من إعادة توليد الباركود؟ سيتم إلغاء صلاحية أي باركود قديم محفوظ.")) return;
    if (accountQrCanvasContainer) {
      accountQrCanvasContainer.innerHTML = "<p style='color:#64748b; font-size:13px; margin: auto;'>جاري التجديد... 🔄</p>";
    }
    try {
      const res = await fetch("/api/account/qr-card/regenerate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: state.currentUser?.email })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "فشل تجديد الباركود");

      if (accountQrCanvasContainer) {
        accountQrCanvasContainer.innerHTML = "";
        new QRCode(accountQrCanvasContainer, {
          text: data.qrPayload,
          width: 196,
          height: 196,
          colorDark: "#0f172a",
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.H
        });
      }
      alert("✅ تم تجديد باركود الحساب بنجاح وإلغاء صلاحية الباركود القديم");
    } catch (err) {
      alert("خطأ: " + err.message);
    }
  });
}

// 2. كاميرا وماسح الباركود لتسجيل الدخول السريع (QR Scanner Login)
let activeScannerStream = null;
let isQrScanning = false;

if (openQrScannerBtn) {
  openQrScannerBtn.addEventListener("click", () => {
    startQrCameraScanner();
  });
}

if (closeQrScannerModalBtn) {
  closeQrScannerModalBtn.addEventListener("click", () => {
    stopQrCameraScanner();
  });
}

if (cancelQrScannerBtn) {
  cancelQrScannerBtn.addEventListener("click", () => {
    stopQrCameraScanner();
  });
}

async function startQrCameraScanner() {
  if (qrScannerStatus) qrScannerStatus.textContent = "";
  openDialog(qrScannerModal);

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" }
    });
    activeScannerStream = stream;
    if (qrScannerVideo) {
      qrScannerVideo.srcObject = stream;
      qrScannerVideo.setAttribute("playsinline", "true");
      await qrScannerVideo.play();
    }
    isQrScanning = true;
    requestAnimationFrame(scanQrVideoFrame);
  } catch (err) {
    if (qrScannerStatus) {
      qrScannerStatus.textContent = "تعذر تشغيل الكاميرا: " + err.message + ". يمكنك اختيار صورة الباركود من جهازك بالزر أدناه.";
    }
  }
}

function stopQrCameraScanner() {
  isQrScanning = false;
  if (activeScannerStream) {
    activeScannerStream.getTracks().forEach((track) => track.stop());
    activeScannerStream = null;
  }
  closeDialog(qrScannerModal);
}

function scanQrVideoFrame() {
  if (!isQrScanning) return;
  if (qrScannerVideo && qrScannerVideo.readyState === qrScannerVideo.HAVE_ENOUGH_DATA) {
    const canvas = document.createElement("canvas");
    canvas.width = qrScannerVideo.videoWidth;
    canvas.height = qrScannerVideo.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(qrScannerVideo, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    if (window.jsQR) {
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert"
      });
      if (code && code.data) {
        isQrScanning = false;
        stopQrCameraScanner();
        performBarcodeLogin(code.data);
        return;
      }
    }
  }
  requestAnimationFrame(scanQrVideoFrame);
}

// بديل رفع صورة الباركود من الجهاز
if (qrScannerFileInput) {
  qrScannerFileInput.addEventListener("change", (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        if (window.jsQR) {
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code && code.data) {
            stopQrCameraScanner();
            performBarcodeLogin(code.data);
          } else {
            if (qrScannerStatus) qrScannerStatus.textContent = "لم يتم العثور على باركود صالح في الصورة المختارة.";
          }
        }
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  });
}

async function performBarcodeLogin(qrData) {
  try {
    const res = await fetch("/api/auth/qr-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ qrData, deviceId: "web-qr" })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "فشل تسجيل الدخول بالباركود");
    }

    state.currentUser = {
      ...data.user
    };
    state.accessToken = data.accessToken || null;
    state.refreshToken = data.refreshToken || null;

    if (window.isAddAccountMode) {
      window.isAddAccountMode = false;
      if (addAccountTopBar) addAccountTopBar.hidden = true;
    }

    syncCurrentAccountToSaved();
    state.activeChatId = "support";
    saveState();
    initE2EEKeys();
    showApp();
  } catch (err) {
    alert("خطأ أثناء تسجيل الدخول بالباركود: " + err.message);
  }
}

// 3. شريط الرسائل المثبتة في أعلى المحادثة (Pinned Banner Actions)
if (chatPinnedBanner) {
  const contentArea = el("pinnedBannerContent");
  if (contentArea) {
    contentArea.addEventListener("click", () => {
      scrollToPinnedMessage();
    });
  }
}

if (pinnedBannerPrevBtn) {
  pinnedBannerPrevBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const chatId = state.activeChatId;
    const pins = state.pinnedMessages?.[chatId] || [];
    if (!pins.length) return;
    state.currentPinIndex = state.currentPinIndex || {};
    let idx = (state.currentPinIndex[chatId] || 0) - 1;
    if (idx < 0) idx = pins.length - 1;
    state.currentPinIndex[chatId] = idx;
    updatePinnedBannerUI();
    scrollToPinnedMessage();
  });
}

if (pinnedBannerNextBtn) {
  pinnedBannerNextBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const chatId = state.activeChatId;
    const pins = state.pinnedMessages?.[chatId] || [];
    if (!pins.length) return;
    state.currentPinIndex = state.currentPinIndex || {};
    let idx = (state.currentPinIndex[chatId] || 0) + 1;
    if (idx >= pins.length) idx = 0;
    state.currentPinIndex[chatId] = idx;
    updatePinnedBannerUI();
    scrollToPinnedMessage();
  });
}

if (pinnedBannerCloseBtn) {
  pinnedBannerCloseBtn.addEventListener("click", async (e) => {
    e.stopPropagation();
    const chatId = state.activeChatId;
    const pins = state.pinnedMessages?.[chatId] || [];
    const idx = state.currentPinIndex?.[chatId] || 0;
    const curPin = pins[idx];
    if (!curPin) return;
    if (confirm("هل تريد إلغاء تثبيت هذه الرسالة؟")) {
      await togglePin(curPin.message_id);
    }
  });
}

// 4. تخصيص خلفيات وثيمات الدردشة الحصرية لبلاس (Wallpapers & Themes)
const presetBackgrounds = {
  "default": "",
  "night-sky": "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
  "emerald": "linear-gradient(135deg, #064e3b 0%, #022c22 100%)",
  "sunset": "linear-gradient(135deg, #831843 0%, #500724 100%)",
  "amoled": "#09090b",
  "cyberpunk": "linear-gradient(135deg, #4c1d95 0%, #1e1b4b 100%)",
  "golden": "linear-gradient(135deg, #78350f 0%, #451a03 100%)"
};

let pendingWallpaperTheme = "default";
let pendingWallpaperBg = "";

function updateChatWallpaperUI() {
  const chatId = state.activeChatId;
  const setting = state.chatSettings?.[chatId];
  const msgContainer = el("messages");
  if (!msgContainer) return;

  if (setting?.custom_wallpaper_url) {
    msgContainer.style.backgroundImage = `url("${setting.custom_wallpaper_url}")`;
    msgContainer.style.backgroundPosition = "center";
    msgContainer.style.backgroundSize = "cover";
    msgContainer.style.backgroundRepeat = "no-repeat";
  } else if (setting?.custom_theme_code && presetBackgrounds[setting.custom_theme_code]) {
    msgContainer.style.backgroundImage = "";
    msgContainer.style.background = presetBackgrounds[setting.custom_theme_code];
  } else {
    msgContainer.style.backgroundImage = "";
    msgContainer.style.background = "";
  }
}

// التحكم في قائمة الثلاث نقاط لرأس المحادثة (Chat Options 3-Dots Dropdown)
const chatOptionsDropdown = el("chatOptionsDropdown");
const chatMenuDropdownBtn = el("chatMenuDropdownBtn");
const chatDropdownMenu = el("chatDropdownMenu");

if (chatMenuDropdownBtn) {
  chatMenuDropdownBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (!chatDropdownMenu) return;
    const isClosed = chatDropdownMenu.hidden;
    if (isClosed) {
      if (chatWallpaperButton) {
        chatWallpaperButton.hidden = !isUserChatPlusSubscriber();
      }
      chatDropdownMenu.hidden = false;
    } else {
      chatDropdownMenu.hidden = true;
    }
  });
}

document.addEventListener("click", (e) => {
  if (chatDropdownMenu && !chatDropdownMenu.hidden) {
    if (!chatOptionsDropdown || !chatOptionsDropdown.contains(e.target)) {
      chatDropdownMenu.hidden = true;
    }
  }
});

if (chatDropdownMenu) {
  chatDropdownMenu.addEventListener("click", () => {
    chatDropdownMenu.hidden = true;
  });
}

if (chatWallpaperButton) {
  chatWallpaperButton.addEventListener("click", () => {
    openChatWallpaperModal();
  });
}

if (closeChatWallpaperModalBtn) {
  closeChatWallpaperModalBtn.addEventListener("click", () => {
    closeDialog(chatWallpaperModal);
  });
}

function openChatWallpaperModal() {
  const isPlus = isUserPlusSubscriber();
  if (wallpaperVipLockedBanner) {
    wallpaperVipLockedBanner.hidden = isPlus;
  }
  if (wallpaperError) wallpaperError.textContent = "";

  const chatId = state.activeChatId;
  const setting = state.chatSettings?.[chatId];
  pendingWallpaperTheme = setting?.custom_theme_code || "default";
  pendingWallpaperBg = setting?.custom_wallpaper_url || "";

  if (wallpaperPresetsGrid) {
    const items = wallpaperPresetsGrid.querySelectorAll(".wallpaper-preset-item");
    items.forEach((item) => {
      const t = item.dataset.theme;
      item.classList.toggle("active", t === pendingWallpaperTheme);
    });
  }

  openDialog(chatWallpaperModal);
}

if (wallpaperUpgradeBtn) {
  wallpaperUpgradeBtn.addEventListener("click", () => {
    closeDialog(chatWallpaperModal);
    openSubPlusUpgradeModal();
  });
}

if (wallpaperPresetsGrid) {
  const items = wallpaperPresetsGrid.querySelectorAll(".wallpaper-preset-item:not(.custom-upload)");
  items.forEach((item) => {
    item.addEventListener("click", () => {
      if (!isUserPlusSubscriber()) {
        openSubPlusUpgradeModal("تخصيص خلفيات وثيمات الدردشة حصرية لمشتركي بلاس AI شاتو 🌟 - اشترك الآن لتطبيق المظهر المفضل!");
        return;
      }
      items.forEach((it) => it.classList.remove("active"));
      item.classList.add("active");
      pendingWallpaperTheme = item.dataset.theme || "default";
      pendingWallpaperBg = "";
    });
  });
}

if (chatWallpaperFileInput) {
  chatWallpaperFileInput.addEventListener("change", (e) => {
    if (!isUserPlusSubscriber()) {
      openSubPlusUpgradeModal("رفع واستخدام خلفيات صور مخصصة ميزة حصرية لمشتركي بلاس AI شاتو 🌟");
      e.target.value = "";
      return;
    }
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      pendingWallpaperBg = ev.target.result;
      pendingWallpaperTheme = "custom";
      const items = wallpaperPresetsGrid?.querySelectorAll(".wallpaper-preset-item");
      items?.forEach((it) => it.classList.remove("active"));
      el("wallpaperCustomUploadItem")?.classList.add("active");
    };
    reader.readAsDataURL(file);
  });
}

if (saveChatWallpaperBtn) {
  saveChatWallpaperBtn.addEventListener("click", async () => {
    if (!isUserPlusSubscriber()) {
      openSubPlusUpgradeModal("ميزة تغيير وتخصيص خلفيات الدردشة حصرية لمشتركي بلاس AI شاتو 🌟");
      return;
    }
    const chatId = state.activeChatId;
    const chat = getChat();
    const friendEmail = chat?.email;
    saveChatWallpaperBtn.disabled = true;

    try {
      const res = await fetch("/api/chats/wallpaper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: state.currentUser?.email,
          friend: friendEmail,
          chatId,
          wallpaperUrl: pendingWallpaperBg,
          themeCode: pendingWallpaperTheme
        })
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.is_vip_only) {
          openSubPlusUpgradeModal(data.error);
          return;
        }
        throw new Error(data.error || "فشل حفظ الخلفية");
      }

      state.chatSettings = state.chatSettings || {};
      state.chatSettings[chatId] = {
        ...state.chatSettings[chatId],
        custom_wallpaper_url: data.custom_wallpaper_url,
        custom_theme_code: data.custom_theme_code
      };
      saveState();
      updateChatWallpaperUI();
      closeDialog(chatWallpaperModal);
    } catch (err) {
      if (wallpaperError) wallpaperError.textContent = err.message;
    } finally {
      saveChatWallpaperBtn.disabled = false;
    }
  });
}

if (resetChatWallpaperBtn) {
  resetChatWallpaperBtn.addEventListener("click", async () => {
    const chatId = state.activeChatId;
    const chat = getChat();
    const friendEmail = chat?.email;
    try {
      await fetch("/api/chats/wallpaper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: state.currentUser?.email,
          friend: friendEmail,
          chatId,
          wallpaperUrl: null,
          themeCode: "default"
        })
      });
      state.chatSettings = state.chatSettings || {};
      if (state.chatSettings[chatId]) {
        state.chatSettings[chatId].custom_wallpaper_url = null;
        state.chatSettings[chatId].custom_theme_code = "default";
      }
      saveState();
      updateChatWallpaperUI();
      closeDialog(chatWallpaperModal);
    } catch (err) {
      console.warn("Reset wallpaper error:", err);
    }
  });
}

// 5. تبويبات الإيموجي والرموز المتحركة والنادرة (Exclusive & Animated Emojis)
let cachedExclusiveEmojis = [
  { id: "vip_crown", code: ":vip_crown:", title: "التاج الذهبي الملكي", symbol: "👑✨" },
  { id: "fire_heart", code: ":fire_heart:", title: "قلب مشتعل ناري", symbol: "❤️‍🔥" },
  { id: "sparkle_diamond", code: ":sparkle_diamond:", title: "جوهرة نادرة براقة", symbol: "💎✨" },
  { id: "rocket_boost", code: ":rocket_boost:", title: "صاروخ نفاث فائق", symbol: "🚀⚡" },
  { id: "magic_wand", code: ":magic_wand:", title: "عصا السحر الخارقة", symbol: "🪄✨" },
  { id: "star_eyes", code: ":star_eyes:", title: "عيون نجوم متلألئة", symbol: "🤩⭐" },
  { id: "golden_cup", code: ":golden_cup:", title: "كأس البطولة الذهبية", symbol: "🏆🌟" },
  { id: "galaxy_spin", code: ":galaxy_spin:", title: "مجرة دوارة متوهجة", symbol: "🌌✨" },
  { id: "dragon_fire", code: ":dragon_fire:", title: "تنين ناري أسطوري", symbol: "🐉🔥" },
  { id: "rich_cash", code: ":rich_cash:", title: "أموال طائرة وثراء", symbol: "💸✨" },
  { id: "party_popper", code: ":party_vip:", title: "مفرقعة احتفال ملكي", symbol: "🎉🎊" },
  { id: "lightning_bolt", code: ":lightning_power:", title: "برق الطاقة القصوى", symbol: "⚡🔥" }
];

async function loadExclusiveEmojis() {
  try {
    const res = await fetch("/api/emojis/exclusive");
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.emojis) && data.emojis.length) {
        cachedExclusiveEmojis = data.emojis;
      }
    }
  } catch {}
}

function renderVipEmojiList() {
  if (!vipEmojiList) return;
  vipEmojiList.innerHTML = "";
  const isPlus = isUserPlusSubscriber();

  cachedExclusiveEmojis.forEach((em) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "vip-emoji-item";
    btn.title = em.title || em.code;
    btn.innerHTML = `<span>${em.symbol || "✨"}</span>${!isPlus ? '<span class="vip-lock-badge">🔒</span>' : ''}`;

    btn.addEventListener("click", () => {
      if (!isUserPlusSubscriber()) {
        openSubPlusUpgradeModal("رموز بلاس المتحركة والنادرة حصرية لمشتركي باقة بلاس AI شاتو 🌟 - اشترك الآن لفتح الرموز كاملة!");
        return;
      }
      if (messageInput) {
        messageInput.value += ` ${em.symbol || em.code} `;
        messageInput.focus();
      }
      if (emojiTray) emojiTray.hidden = true;
    });

    vipEmojiList.appendChild(btn);
  });
}

if (emojiTabStandardBtn) {
  emojiTabStandardBtn.addEventListener("click", () => {
    emojiTabStandardBtn.classList.add("active");
    emojiTabVipBtn?.classList.remove("active");
    if (standardEmojiList) standardEmojiList.hidden = false;
    if (vipEmojiList) vipEmojiList.hidden = true;
  });
}

if (emojiTabVipBtn) {
  emojiTabVipBtn.addEventListener("click", () => {
    emojiTabVipBtn.classList.add("active");
    emojiTabStandardBtn?.classList.remove("active");
    if (standardEmojiList) standardEmojiList.hidden = true;
    if (vipEmojiList) {
      vipEmojiList.hidden = false;
      renderVipEmojiList();
    }
  });
}

if (emojiButton) {
  emojiButton.addEventListener("click", () => {
    const isChatPlus = isUserChatPlusSubscriber();
    if (emojiTabVipBtn) {
      emojiTabVipBtn.hidden = !isChatPlus;
    }
    if (!isChatPlus) {
      if (emojiTabStandardBtn) emojiTabStandardBtn.classList.add("active");
      if (emojiTabVipBtn) emojiTabVipBtn.classList.remove("active");
      if (standardEmojiList) standardEmojiList.hidden = false;
      if (vipEmojiList) vipEmojiList.hidden = true;
    }
    loadExclusiveEmojis();
    if (vipEmojiList && !vipEmojiList.hidden && isChatPlus) {
      renderVipEmojiList();
    }
  });
}

// ============================================================================
// ميزة الذكاء الاصطناعي ChatGPT داخل المحادثة المشتركة (Chato Plus Feature)
// ============================================================================
function updateChatAiButtonUI() {
  const btn = el("chatAiSparkleBtn");
  if (!btn) return;
  const chat = getChat();
  if (!chat || chat.type !== "friend" || !chat.email || !isUserChatPlusSubscriber()) {
    btn.style.display = "none";
    return;
  }
  btn.style.display = "inline-flex";
  const myEmail = state.currentUser?.email?.toLowerCase();
  const friendEmail = chat.email?.toLowerCase();
  const directChatId = [myEmail, friendEmail].sort().join("<->");
  const isActive = Boolean(state.chatAiActive?.[directChatId]);
  btn.classList.toggle("active", isActive);
  btn.title = isActive ? "ChatGPT مفعّل في المحادثة ✨ (اضغط للإيقاف)" : "تفعيل ChatGPT في المحادثة (حصري لشاتو بلاس)";
}

const chatAiSparkleBtn = el("chatAiSparkleBtn");
if (chatAiSparkleBtn) {
  chatAiSparkleBtn.addEventListener("click", async () => {
    if (!isUserChatPlusSubscriber()) {
      openSubPlusUpgradeModal("تفعيل الذكاء الاصطناعي ChatGPT داخل المحادثة ميزة حصرية لمشتركي شاتو بلاس 👑 - اشترك الآن لتفعيله والتحدث معه مع أصدقائك!");
      return;
    }
    const chat = getChat();
    if (!chat || chat.type !== "friend" || !chat.email) {
      alert("يرجى فتح محادثة صديق أولاً لتفعيل ChatGPT");
      return;
    }
    chatAiSparkleBtn.disabled = true;
    try {
      const res = await fetch("/api/chats/toggle-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: state.currentUser.email,
          friend: chat.email
        })
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.is_vip_only) {
          openSubPlusUpgradeModal(data.error);
          return;
        }
        alert(data.error || "تعذر تفعيل الذكاء الاصطناعي حالياً");
        return;
      }
      const myEmail = state.currentUser.email.toLowerCase();
      const friendEmail = chat.email.toLowerCase();
      const directChatId = [myEmail, friendEmail].sort().join("<->");
      state.chatAiActive = state.chatAiActive || {};
      state.chatAiActive[directChatId] = data.is_ai_active;
      updateChatAiButtonUI();
      await loadSharedMessages(chat.email);
    } catch {
      alert("خطأ أثناء الاتصال بالخادم");
    } finally {
      chatAiSparkleBtn.disabled = false;
    }
  });
}

// ============================================================================
// 1. تنسيق النصوص التلقائي (Rich Text Markdown Formatting)
// ============================================================================
function formatRichMessageText(rawText) {
  if (!rawText) return "";
  let escaped = String(rawText)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

  escaped = escaped.replace(/```([\s\S]*?)```/g, "<code>$1</code>");
  escaped = escaped.replace(/\*([^\*\n]+)\*/g, "<strong>$1</strong>");
  escaped = escaped.replace(/_([^_\n]+)_/g, "<em>$1</em>");
  escaped = escaped.replace(/~([^~\n]+)~/g, "<del>$1</del>");
  const urlRegex = /(https?:\/\/[^\s<]+)/g;
  escaped = escaped.replace(urlRegex, (url) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
  });
  return escaped;
}

// ============================================================================
// 2. فواصل التواريخ الذكية داخل المحادثة (Smart Date Dividers)
// ============================================================================
function formatSmartDateDivider(dateObj) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
  const diffDays = Math.round((today - target) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "اليوم";
  if (diffDays === 1) return "أمس";
  if (diffDays === -1) return "غداً";

  return new Intl.DateTimeFormat("ar-EG", {
    weekday: "long",
    day: "numeric",
    month: "long"
  }).format(dateObj);
}

// ============================================================================
// 3. نظام الرد والاقتباس على الرسائل (Reply / Quote Workflow)
// ============================================================================
state.currentReply = null;

function setReplyTarget(msg) {
  state.currentReply = msg;
  const replyBar = el("replyPreviewBar");
  const senderEl = el("replySenderName");
  const snippetEl = el("replySnippetText");
  if (!replyBar || !senderEl || !snippetEl) return;
  const sender = msg.from === "me" ? "أنت" : (msg.fromName || msg.from || "رسالة");
  senderEl.textContent = `رد على ${sender}:`;
  snippetEl.textContent = msg.text || (msg.type === "image" ? "📷 صورة" : (msg.type === "voice" ? "🎙️ تسجيل صوتي" : "مرفق"));
  replyBar.hidden = false;
  if (messageInput) messageInput.focus();
}

function clearReplyTarget() {
  state.currentReply = null;
  const replyBar = el("replyPreviewBar");
  if (replyBar) replyBar.hidden = true;
}

const closeReplyBtn = el("closeReplyBtn");
if (closeReplyBtn) {
  closeReplyBtn.addEventListener("click", clearReplyTarget);
}

// ============================================================================
// 4. استعراض الوسائط بملء الشاشة (Media Lightbox Viewer)
// ============================================================================
let currentLightboxRotation = 0;
function openMediaLightbox(imgUrl) {
  const modal = el("mediaLightboxModal");
  const img = el("lightboxImg");
  const downloadBtn = el("lightboxDownloadBtn");
  if (!modal || !img) return;
  currentLightboxRotation = 0;
  img.src = imgUrl;
  img.style.transform = "rotate(0deg)";
  if (downloadBtn) {
    downloadBtn.href = imgUrl;
    downloadBtn.download = `chato-media-${Date.now()}.jpg`;
  }
  openDialog(modal);
}

const lightboxRotateBtn = el("lightboxRotateBtn");
if (lightboxRotateBtn) {
  lightboxRotateBtn.addEventListener("click", () => {
    currentLightboxRotation = (currentLightboxRotation + 90) % 360;
    const img = el("lightboxImg");
    if (img) img.style.transform = `rotate(${currentLightboxRotation}deg)`;
  });
}

const lightboxCloseBtn = el("lightboxCloseBtn");
if (lightboxCloseBtn) {
  lightboxCloseBtn.addEventListener("click", () => {
    closeDialog(el("mediaLightboxModal"));
  });
}

// ============================================================================
// 5. زر النزول التلقائي للأسفل (Scroll to Bottom Floating Button)
// ============================================================================
let unreadScrolledCount = 0;
const messagesContainer = el("messages");
const scrollToBottomBtn = el("scrollToBottomBtn");
const scrollUnreadBadge = el("scrollUnreadBadge");

if (messagesContainer && scrollToBottomBtn) {
  messagesContainer.addEventListener("scroll", () => {
    const distFromBottom = messagesContainer.scrollHeight - messagesContainer.scrollTop - messagesContainer.clientHeight;
    if (distFromBottom > 140) {
      scrollToBottomBtn.hidden = false;
    } else {
      scrollToBottomBtn.hidden = true;
      unreadScrolledCount = 0;
      if (scrollUnreadBadge) scrollUnreadBadge.hidden = true;
    }
  });

  scrollToBottomBtn.addEventListener("click", () => {
    messagesContainer.scrollTo({ top: messagesContainer.scrollHeight, behavior: "smooth" });
    unreadScrolledCount = 0;
    if (scrollUnreadBadge) scrollUnreadBadge.hidden = true;
  });
}

// ============================================================================
// 6. مؤشر الكتابة الحية (Live Typing Indicator)
// ============================================================================
let lastTypingSentAt = 0;
function sendTypingSignal() {
  const chat = getChat();
  if (!chat || chat.type !== "friend" || !state.currentUser?.email) return;
  const now = Date.now();
  if (now - lastTypingSentAt < 2500) return;
  lastTypingSentAt = now;
  fetch("/api/chats/typing", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: state.currentUser.email,
      friend: chat.email
    })
  }).catch(() => {});
}

if (messageInput) {
  messageInput.addEventListener("input", sendTypingSignal);
}

// ============================================================================
// 7. درج معلومات جهة الاتصال والوسائط المشتركة (Chat Contact Info Drawer)
// ============================================================================
function openChatInfoModal() {
  const chat = getChat();
  if (!chat || chat.type === "ai" || chat.type === "admin_notice") return;
  const modal = el("chatInfoModal");
  if (!modal) return;

  const avatarEl = el("chatInfoAvatar");
  const nameEl = el("chatInfoName");
  const emailEl = el("chatInfoEmail");
  const statusEl = el("chatInfoStatusPill");
  const msgCountEl = el("chatInfoMsgCount");
  const mediaCountEl = el("chatInfoMediaCount");
  const voiceCountEl = el("chatInfoVoiceCount");
  const mediaGrid = el("chatInfoMediaGrid");

  if (avatarEl) {
    if (chat.image) {
      avatarEl.innerHTML = `<img src="${chat.image}" alt="" />`;
    } else {
      avatarEl.textContent = (chat.name || "و").slice(0, 1).toUpperCase();
    }
  }
  if (nameEl) nameEl.textContent = chat.name || "محادثة";
  if (emailEl) emailEl.textContent = chat.email || (chat.type === "group" ? "مجموعة دردشة" : "");
  if (statusEl) {
    const isOnline = chat.isOnline;
    statusEl.textContent = isOnline ? "متصل الآن 🟢" : "غير متصل ⚪";
    statusEl.style.color = isOnline ? "#10b981" : "var(--muted)";
  }

  const chatMessages = state.conversations[state.activeChatId] || [];
  let mediaCount = 0;
  let voiceCount = 0;
  if (mediaGrid) mediaGrid.innerHTML = "";

  chatMessages.forEach((m) => {
    if (m.type === "image" && m.imageUrl) {
      mediaCount++;
      if (mediaGrid) {
        const item = document.createElement("div");
        item.className = "chat-info-media-item";
        item.innerHTML = `<img src="${m.imageUrl}" alt="" />`;
        item.addEventListener("click", () => openMediaLightbox(m.imageUrl));
        mediaGrid.appendChild(item);
      }
    } else if (m.type === "voice") {
      voiceCount++;
    }
  });

  if (msgCountEl) msgCountEl.textContent = chatMessages.length;
  if (mediaCountEl) mediaCountEl.textContent = mediaCount;
  if (voiceCountEl) voiceCountEl.textContent = voiceCount;

  openDialog(modal);
}

const chatAvatarEl = el("chatAvatar");
if (chatAvatarEl) chatAvatarEl.addEventListener("click", openChatInfoModal);
const chatNameEl = el("chatName");
if (chatNameEl) chatNameEl.addEventListener("click", openChatInfoModal);

const chatInfoChangeWallpaperBtn = el("chatInfoChangeWallpaperBtn");
if (chatInfoChangeWallpaperBtn) {
  chatInfoChangeWallpaperBtn.addEventListener("click", () => {
    closeDialog(el("chatInfoModal"));
    openChatWallpaperModal();
  });
}

const chatInfoLockPinBtn = el("chatInfoLockPinBtn");
if (chatInfoLockPinBtn) {
  chatInfoLockPinBtn.addEventListener("click", () => {
    closeDialog(el("chatInfoModal"));
    if (state.activeChatId) promptLockChat(state.activeChatId);
  });
}

// ============================================================================
// 8. تعديل الرسالة المرسلة وحذفها لدى الجميع (Edit & Delete for Everyone)
// ============================================================================
let currentEditingMsg = null;
function openEditMessageModal(msg) {
  currentEditingMsg = msg;
  const modal = el("editMessageModal");
  const input = el("editMessageInput");
  const err = el("editMessageError");
  if (!modal || !input) return;
  input.value = msg.text || "";
  if (err) err.textContent = "";
  openDialog(modal);
}

const editMessageForm = el("editMessageForm");
if (editMessageForm) {
  editMessageForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!currentEditingMsg || !state.currentUser?.email) return;
    const newText = el("editMessageInput")?.value?.trim();
    if (!newText) return;
    try {
      const res = await fetch("/api/messages/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messageId: currentEditingMsg.id,
          newText,
          email: state.currentUser.email
        })
      });
      const data = await res.json();
      if (!res.ok) {
        if (el("editMessageError")) el("editMessageError").textContent = data.error || "تعذر تعديل الرسالة";
        return;
      }
      closeDialog(el("editMessageModal"));
      currentEditingMsg = null;
      const chat = getChat();
      if (chat?.email) await loadSharedMessages(chat.email);
    } catch {
      if (el("editMessageError")) el("editMessageError").textContent = "خطأ أثناء الاتصال بالخادم";
    }
  });
}

async function deleteForEveryone(msgId) {
  if (!confirm("هل تريد حذف هذه الرسالة لدى الجميع؟ ستختفي من عندك ومن عند الطرف الآخر.")) return;
  try {
    const res = await fetch("/api/messages/delete-everyone", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messageId: msgId,
        email: state.currentUser?.email
      })
    });
    if (!res.ok) {
      const data = await res.json();
      alert(data.error || "تعذر حذف الرسالة للجميع");
      return;
    }
    const chat = getChat();
    if (chat?.email) await loadSharedMessages(chat.email);
  } catch {
    alert("خطأ أثناء الاتصال بالخادم");
  }
}

// ============================================================================
// 9. تبويبات تصنيف وفلاتر المحادثات (Chat Filter Tabs)
// ============================================================================
state.activeChatFilter = "all";
const chatFilterTabs = el("chatFilterTabs");
if (chatFilterTabs) {
  chatFilterTabs.querySelectorAll(".chat-filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      chatFilterTabs.querySelectorAll(".chat-filter-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      state.activeChatFilter = btn.dataset.filter || "all";
      renderConversations();
    });
  });
}

// ============================================================================
// 10. نظام التنبيهات السريعة (Toast Notifications)
// ============================================================================

// ============================================================================
// نظام إشعارات واتساب المتطور (WhatsApp-Style Notifications & Sound Chime)
// ============================================================================
function playWhatsAppChime() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    // النغمة الأولى (صوت وتري ناعم)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(830, now);
    gain1.gain.setValueAtTime(0.2, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.16);

    // النغمة الثانية (رنين واتساب المميز)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(1046.5, now + 0.1);
    gain2.gain.setValueAtTime(0.25, now + 0.1);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.1);
    osc2.stop(now + 0.35);
  } catch {}
}

function showWhatsAppNotification({ title, body, avatar, chatId }) {
  playWhatsAppChime();
  if (navigator.vibrate) navigator.vibrate([100, 50, 100]);

  // إشعار المتصفح الأصلي عند إخفاء التبويب
  if (document.hidden && "Notification" in window && Notification.permission === "granted") {
    try {
      new Notification(title, {
        body,
        icon: avatar || "./favicon.png",
        tag: chatId || "chato-msg"
      });
    } catch {}
  }

  // لافتة واتساب داخل التطبيق (Desktop Toast + Mobile Heads-up)
  const container = document.getElementById("whatsappNotificationContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "whatsapp-toast";

  const img = document.createElement("img");
  img.className = "whatsapp-toast-avatar";
  img.src = avatar || DEFAULT_AVATAR;
  img.onerror = () => { img.src = DEFAULT_AVATAR; };

  const content = document.createElement("div");
  content.className = "whatsapp-toast-content";

  const header = document.createElement("div");
  header.className = "whatsapp-toast-header";

  const sender = document.createElement("span");
  sender.className = "whatsapp-toast-sender";
  sender.textContent = title;

  const time = document.createElement("span");
  time.className = "whatsapp-toast-time";
  time.textContent = "الآن";

  header.append(sender, time);

  const msgBody = document.createElement("div");
  msgBody.className = "whatsapp-toast-body";
  msgBody.textContent = body;

  content.append(header, msgBody);

  const closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.className = "whatsapp-toast-close";
  closeBtn.textContent = "×";
  closeBtn.onclick = (e) => {
    e.stopPropagation();
    toast.classList.add("hiding");
    setTimeout(() => toast.remove(), 250);
  };

  toast.append(img, content, closeBtn);

  toast.onclick = () => {
    toast.classList.add("hiding");
    setTimeout(() => toast.remove(), 250);
    if (chatId) openChat(chatId);
  };

  container.prepend(toast);

  // إخفاء تلقائي بعد 5 ثوان
  setTimeout(() => {
    if (toast.isConnected) {
      toast.classList.add("hiding");
      setTimeout(() => toast.remove(), 250);
    }
  }, 5000);
}

function showToast(message, duration = 3000) {
  let container = document.getElementById("toastContainer");
  if (!container) {
    container = document.createElement("div");
    container.id = "toastContainer";
    container.className = "toast-container";
    document.body.appendChild(container);
  }
  const toast = document.createElement("div");
  toast.className = "toast-notification";
  toast.textContent = message;
  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("show"));
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ============================================================================
// 11. تبادل المستندات والملفات (Document Sharing & Attachments)
// ============================================================================
function getDocumentEmoji(fileName = "") {
  const ext = (fileName.split(".").pop() || "").toLowerCase();
  if (["pdf"].includes(ext)) return "📕";
  if (["doc", "docx"].includes(ext)) return "📘";
  if (["xls", "xlsx", "csv"].includes(ext)) return "📊";
  if (["zip", "rar", "7z", "tar", "gz"].includes(ext)) return "🗜️";
  if (["txt", "md"].includes(ext)) return "📝";
  return "📄";
}

function formatBytes(bytes) {
  if (!bytes || bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

function sendDocument(file) {
  if (!file) return;
  if (file.size > 20 * 1024 * 1024) {
    showToast("حجم الملف كبير جداً، الحد الأقصى 20 ميجابايت ⚠️");
    return;
  }
  const reader = new FileReader();
  reader.onload = async () => {
    const docPayload = {
      type: "document",
      document: {
        name: file.name,
        size: file.size,
        type: file.type,
        url: reader.result
      }
    };
    const chat = getChat();
    if (chat?.type === "friend") {
      try {
        await sendSharedMessage(chat.email, docPayload);
        await loadSharedMessages(chat.email);
        showToast("تم إرسال الملف بنجاح 📄");
      } catch (err) {
        showToast("فشل إرسال الملف: " + err.message);
      }
      return;
    }
    state.conversations[state.activeChatId] = state.conversations[state.activeChatId] || [];
    state.conversations[state.activeChatId].push(ownMessage("document", docPayload));
    saveState();
    renderMessages();
    renderConversations();
    showToast("تم إرسال الملف بنجاح 📄");
  };
  reader.readAsDataURL(file);
}

// ============================================================================
// 12. إعادة توجيه الرسائل (Forward Message System)
// ============================================================================
let pendingForwardMessage = null;

function openForwardMessageModal(msg) {
  pendingForwardMessage = msg;
  const modal = el("forwardMessageModal");
  const list = el("forwardChatList");
  if (!modal || !list) return;

  list.innerHTML = "";

  const targets = [];
  const myEmail = (state.currentUser?.email || "").toLowerCase();

  // جلب الأصدقاء
  (state.friends || []).forEach((f) => {
    if (f.email && f.email.toLowerCase() !== myEmail) {
      targets.push({
        name: f.name || f.email.split("@")[0],
        email: f.email,
        avatar: f.avatar || ""
      });
    }
  });

  // جلب بقية المحادثات النشطة
  Object.keys(state.conversations || {}).forEach((k) => {
    if (k.startsWith("friend:")) {
      const email = k.replace("friend:", "");
      if (email.toLowerCase() !== myEmail && !targets.some((t) => t.email.toLowerCase() === email.toLowerCase())) {
        targets.push({
          name: email.split("@")[0],
          email: email,
          avatar: ""
        });
      }
    }
  });

  if (targets.length === 0) {
    list.innerHTML = '<p style="font-size:13px; color:var(--muted); text-align:center; padding:16px;">لا توجد جهات اتصال أخرى متاحة للتحويل إليها</p>';
  } else {
    targets.forEach((tgt) => {
      const item = document.createElement("div");
      item.className = "forward-chat-item";

      const av = document.createElement("div");
      av.className = "forward-chat-avatar";
      if (tgt.avatar) {
        const img = document.createElement("img");
        img.src = tgt.avatar;
        av.appendChild(img);
      } else {
        av.textContent = (tgt.name || "م")[0].toUpperCase();
      }

      const info = document.createElement("div");
      info.className = "forward-chat-info";
      const nm = document.createElement("div");
      nm.className = "forward-chat-name";
      nm.textContent = tgt.name;
      const em = document.createElement("div");
      em.className = "forward-chat-email";
      em.textContent = tgt.email;
      info.append(nm, em);

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "forward-chat-btn";
      btn.textContent = "تحويل 🔁";
      btn.addEventListener("click", async (e) => {
        e.stopPropagation();
        await executeForwardMessage(tgt.email);
        closeDialog(modal);
      });

      item.append(av, info, btn);
      item.addEventListener("click", async () => {
        await executeForwardMessage(tgt.email);
        closeDialog(modal);
      });
      list.appendChild(item);
    });
  }

  openDialog(modal);
}

async function executeForwardMessage(targetEmail) {
  if (!pendingForwardMessage || !targetEmail) return;
  try {
    const payload = {
      type: pendingForwardMessage.type || "text",
      text: pendingForwardMessage.text || "",
      imageUrl: pendingForwardMessage.imageUrl || "",
      audioUrl: pendingForwardMessage.audioUrl || "",
      fileName: pendingForwardMessage.fileName || "",
      location: pendingForwardMessage.location || null,
      poll: pendingForwardMessage.poll || null,
      sticker: pendingForwardMessage.sticker || null,
      document: pendingForwardMessage.document || null
    };
    await sendSharedMessage(targetEmail, payload);
    showToast("تمت إعادة توجيه الرسالة بنجاح 🔁");
    pendingForwardMessage = null;
    const chat = getChat();
    if (chat?.email && chat.email.toLowerCase() === targetEmail.toLowerCase()) {
      await loadSharedMessages(targetEmail);
    }
  } catch (err) {
    showToast("تعذر إعادة التوجيه: " + err.message);
  }
}

// ============================================================================
// 13. البث اللحظي الفوري والمحرك التفاعلي (Real-Time Push Stream & SSE)
// ============================================================================
let realtimeEventSource = null;

function initRealtimeStream() {
  if (!state.currentUser?.email) return;
  if (realtimeEventSource) {
    try { realtimeEventSource.close(); } catch {}
  }

  const url = "/api/realtime?email=" + encodeURIComponent(state.currentUser.email);
  realtimeEventSource = new EventSource(url);

  realtimeEventSource.addEventListener("new_message", (e) => {
    try {
      const msg = JSON.parse(e.data);
      handleIncomingRealtimeMessage(msg);
    } catch {}
  });

  realtimeEventSource.addEventListener("message_edit", (e) => {
    try {
      const data = JSON.parse(e.data);
      handleRealtimeMessageEdit(data);
    } catch {}
  });

  realtimeEventSource.addEventListener("message_delete", (e) => {
    try {
      const data = JSON.parse(e.data);
      handleRealtimeMessageDelete(data);
    } catch {}
  });

  realtimeEventSource.addEventListener("typing", (e) => {
    try {
      const data = JSON.parse(e.data);
      handleRealtimeTyping(data);
    } catch {}
  });

  realtimeEventSource.addEventListener("call_signal", (e) => {
    try {
      const data = JSON.parse(e.data);
      handleIncomingCallSignal(data);
    } catch {}
  });

  realtimeEventSource.addEventListener("new_ad", (e) => {
    try {
      const ad = JSON.parse(e.data);
      state.ads = Array.isArray(state.ads) ? state.ads : [];
      localStorage.removeItem("chato_announcements_deleted_until");
      state.ads.unshift(ad);
      if (state.activeChatId === "chato_announcements") {
        renderMessages();
      }
      renderConversations();
      showWhatsAppNotification({
        title: "📢 إعلانات شاتو الرسمية",
        body: ad.title + ": " + (ad.content || ""),
        avatar: "./favicon.png",
        chatId: "chato_announcements"
      });
    } catch {}
  });

  realtimeEventSource.addEventListener("group_created", (e) => {
    try {
      const data = JSON.parse(e.data);
      if (data && data.group) {
        state.groups = Array.isArray(state.groups) ? state.groups : [];
        const exists = state.groups.find(g => g.id === data.group.id);
        if (!exists) {
          state.groups.unshift(data.group);
        } else {
          const idx = state.groups.findIndex(g => g.id === data.group.id);
          state.groups[idx] = { ...state.groups[idx], ...data.group };
        }
        if (data.message) {
          const cId = `group:${data.group.id}`;
          state.conversations[cId] = state.conversations[cId] || [];
          if (!state.conversations[cId].some(m => m.id === data.message.id)) {
            state.conversations[cId].push(data.message);
          }
        }
        saveState();
        renderConversations();
        showWhatsAppNotification({
          title: `مجموعة جديدة: ${data.group.name} 👥`,
          body: data.message ? data.message.text : "تمت إضافتك إلى مجموعة جديدة",
          avatar: data.group.image || "./favicon.png",
          chatId: `group:${data.group.id}`
        });
      }
    } catch {}
  });

  realtimeEventSource.addEventListener("group_deleted", (e) => {
    try {
      const data = JSON.parse(e.data);
      if (data && data.groupId) {
        const fullChatId = `group:${data.groupId}`;
        state.groups = (state.groups || []).filter(g => g.id !== data.groupId);
        delete state.conversations[fullChatId];
        if (state.activeChatId === fullChatId) {
          state.activeChatId = null;
          el("contentGrid")?.classList.remove("in-chat");
          el("appScreen")?.classList.remove("in-chat-mobile");
          alert(`تم حذف المجموعة "${data.groupName || ""}" بواسطة المشرف.`);
        }
        saveState();
        renderConversations();
      }
    } catch {}
  });

  realtimeEventSource.onerror = () => {
    // EventSource handles auto-reconnect
  };
}

function handleIncomingRealtimeMessage(msg) {
  if (!msg || !msg.id) return;
  const myEmail = (state.currentUser?.email || "").toLowerCase();
  const from = String(msg.from || "").toLowerCase();
  const to = String(msg.to || "").toLowerCase();
  const cid = String(msg.chat_id || "");

  // رسائل المجموعات اللحظية
  const isGroupMsg = to.startsWith("group:") || cid.startsWith("group:");
  if (isGroupMsg) {
    const groupChatKey = to.startsWith("group:") ? to : cid;
    state.conversations = state.conversations || {};
    state.conversations[groupChatKey] = state.conversations[groupChatKey] || [];
    const exists = state.conversations[groupChatKey].some((m) => m.id === msg.id);
    if (!exists) {
      const isMe = from === myEmail;
      const formatted = {
        id: msg.id,
        from: isMe ? "me" : (from === "chatgpt" ? "chatgpt" : "other"),
        senderName: isMe ? (state.currentUser?.name || "أنت") : (msg.fromName || msg.senderName || msg.sender || from.split("@")[0]),
        senderImage: msg.senderImage || "",
        type: msg.type || "text",
        text: msg.text || "",
        imageUrl: msg.imageUrl || "",
        fileName: msg.fileName || "",
        audioUrl: msg.audioUrl || "",
        audioDuration: msg.audioDuration,
        videoUrl: msg.videoUrl || "",
        sticker: msg.sticker || null,
        location: msg.location || null,
        contactCard: msg.contactCard || null,
        poll: msg.poll || null,
        reply_to: msg.reply_to || null,
        reactions: msg.reactions || {},
        status: isMe ? "read" : undefined,
        createdAt: Number(msg.createdAt || msg.created_at || (msg.timestamp ? new Date(msg.timestamp).getTime() : Date.now())) || Date.now()
      };
      state.conversations[groupChatKey].push(formatted);
      saveState();

      if (state.activeChatId === groupChatKey) {
        renderMessages();
        triggerHaptic(12);
        const msgsEl = el("messages");
        if (msgsEl) msgsEl.scrollTop = msgsEl.scrollHeight;
      } else {
        triggerHaptic(25);
        renderConversations();
        const groupObj = (state.groups || []).find((g) => `group:${g.id}` === groupChatKey);
        const groupTitle = groupObj ? groupObj.name : "المجموعة";
        showWhatsAppNotification({
          title: `${groupTitle}: ${formatted.senderName}`,
          body: formatted.type === "voice" ? "🎤 رسالة صوتية" : (formatted.type === "image" ? "📷 صورة" : (formatted.text || "رسالة جديدة")),
          avatar: formatted.senderImage || groupObj?.image || DEFAULT_AVATAR,
          chatId: groupChatKey
        });
      }
    }
    return;
  }

  // رسائل الأصدقاء العادية (1-to-1)
  const partnerEmail = from === myEmail ? to : from;
  const friendChatKey = `friend:${partnerEmail}`;

  state.conversations = state.conversations || {};
  state.conversations[friendChatKey] = state.conversations[friendChatKey] || [];

  const exists = state.conversations[friendChatKey].some((m) => m.id === msg.id);
  if (!exists) {
    state.conversations[friendChatKey].push(msg);
    saveState();

    if (state.activeChatId === friendChatKey) {
      renderMessages();
      triggerHaptic(12);
      const msgsEl = el("messages");
      if (msgsEl) msgsEl.scrollTop = msgsEl.scrollHeight;
    } else {
      triggerHaptic(25);
      renderConversations();
      const senderName = msg.senderName || msg.sender || from.split("@")[0];
      const preview = msg.type === "voice" ? "🎤 رسالة صوتية" : (msg.type === "image" ? "📷 صورة" : (msg.type === "document" ? "📎 مستند" : (msg.text || "رسالة جديدة")));
      showWhatsAppNotification({
        title: senderName,
        body: preview,
        avatar: msg.senderImage || DEFAULT_AVATAR,
        chatId: friendChatKey
      });
    }
  }
}

function handleRealtimeMessageEdit(data) {
  if (!data?.messageId && !data?.id) return;
  const targetId = data.messageId || data.id;
  for (const key of Object.keys(state.conversations || {})) {
    const list = state.conversations[key];
    const found = list.find((m) => m.id === targetId);
    if (found) {
      found.text = data.text || found.text;
      found.edited = true;
      if (data.type === "deleted" || data.is_deleted) {
        found.type = "deleted";
        found.is_deleted = true;
      }
      if (state.activeChatId === key) renderMessages();
      break;
    }
  }
}

function handleRealtimeMessageDelete(data) {
  if (!data?.messageId && !data?.id) return;
  const targetId = data.messageId || data.id;
  for (const key of Object.keys(state.conversations || {})) {
    const list = state.conversations[key];
    const found = list.find((m) => m.id === targetId);
    if (found) {
      found.type = "deleted";
      found.is_deleted = true;
      found.text = "🚫 تم حذف هذه الرسالة";
      if (state.activeChatId === key) renderMessages();
      break;
    }
  }
}

function handleRealtimeTyping(data) {
  if (!data?.from) return;
  const chat = getChat();
  if (chat?.email && chat.email.toLowerCase() === data.from.toLowerCase()) {
    const statusEl = el("chatStatus");
    if (statusEl) {
      statusEl.innerHTML = '<span class="typing-indicator-text">يكتب الآن<span class="typing-dots"><span>.</span><span>.</span><span>.</span></span></span>';
      clearTimeout(window._typingTimer);
      window._typingTimer = setTimeout(() => {
        if (statusEl) statusEl.textContent = t("chatOnline");
      }, 3500);
    }
  }
}

function triggerHaptic(duration = 15) {
  if (navigator?.vibrate) {
    try { navigator.vibrate(duration); } catch {}
  }
}

// بدء التطبيق مع الجلسة المستمرة (Persistent Session & Auto-Login)
applyLanguage(currentLang);


// ==========================================
// مزامنة المجموعات من الخادم في الوقت الفعلي
// ==========================================
async function fetchUserGroups() {
  if (!state.currentUser?.email) return;
  try {
    const userEmail = state.currentUser.email.toLowerCase().trim();
    const res = await fetch(`/api/groups?user=${encodeURIComponent(userEmail)}`);
    if (!res.ok) return;
    const data = await res.json();
    if (data.ok && Array.isArray(data.groups)) {
      state.groups = data.groups;
      saveState();
      renderConversations();
    }
  } catch {}
}
window.fetchUserGroups = fetchUserGroups;

async function startApplication() {
  if (state.currentUser) {
    initE2EEKeys();
    initRealtimeStream();
    unlockedChats.clear();
    if (isChatLocked(state.activeChatId)) {
      state.activeChatId = null;
      el("contentGrid")?.classList.remove("in-chat");
      el("appScreen")?.classList.remove("in-chat-mobile");
    }
    showApp();
    loadAds();
    sendHeartbeat("active");
    loadAdminNotices();
    fetchUserGroups();
    syncUserInbox();
    setInterval(() => {
      syncUserInbox();
      const chat = getChat();
      if (chat?.type === "support" || chat?.id === "support:live") loadSupportMessages();
      refreshNotifications();
      refreshFriends();
      loadAdminNotices();
      loadAds();
      fetchStories();
      fetchUserGroups();
      sendHeartbeat("active");
    }, 2000);

    // التحقق من صلاحية الجلسة وتجديد التوكن في الخلفية
    if (state.refreshToken) {
      try {
        const res = await fetch("/api/auth/refresh", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken: state.refreshToken, deviceId: "web" })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.accessToken) state.accessToken = data.accessToken;
          if (data.user) state.currentUser = { ...state.currentUser, ...data.user };
          saveState();
        } else if (res.status === 401 || res.status === 403) {
          console.warn("Session expired or invalid, logging out.");
          state.currentUser = null;
          state.accessToken = null;
          state.refreshToken = null;
          saveState();
          showLogin();
        }
      } catch (err) {
        // Offline or server temporarily unreachable - keep offline cached session
      }
    }
  } else {
    showLogin();
  }
}

/* ==========================================================================
   5. إصلاح زر القائمة (الثلاث نقاط ⋮) على الهواتف والأجهزة اللمسية
   ========================================================================== */
let _lastChatDropdownToggle = 0;

function isSameUserEmail(e1, e2) {
  if (!e1 || !e2) return false;
  const s1 = String(e1).trim().toLowerCase();
  const s2 = String(e2).trim().toLowerCase();
  if (s1 === s2) return true;
  if (s1.endsWith("@gmail.com") && s2.endsWith("@gmail.com")) {
    const u1 = s1.split("@")[0].replace(/\./g, "");
    const u2 = s2.split("@")[0].replace(/\./g, "");
    return u1 === u2;
  }
  return false;
}
window.isSameUserEmail = isSameUserEmail;

function isGroupAdmin(group) {
  if (!group || !state.currentUser) return false;
  const myEmail = state.currentUser.email;
  if (isSameUserEmail(group.admin, myEmail)) return true;
  if (Array.isArray(group.admins) && group.admins.some((a) => isSameUserEmail(a, myEmail))) return true;
  return false;
}
window.isGroupAdmin = isGroupAdmin;

function updateDropdownItemsVisibility() {
  const chat = typeof getChat === "function" ? getChat() : null;
  const isFriend = Boolean(chat && chat.type === "friend");
  const isGroup = Boolean(chat && (chat.type === "group" || String(chat.id || "").startsWith("group:")));
  const isSpecial = Boolean(chat && (chat.id === "chato_announcements" || chat.type === "admin_notice" || chat.type === "ai"));

  const isAdmin = isGroup && isGroupAdmin(chat);

  const setItemVisibility = (id, show) => {
    const elem = document.getElementById(id);
    if (elem) elem.hidden = !show;
  };

  setItemVisibility("voiceCallButton", isFriend);
  setItemVisibility("videoCallButton", isFriend);
  setItemVisibility("chatBlockOption", isFriend);
  setItemVisibility("chatReportOption", isFriend || isGroup);
  setItemVisibility("chatDisappearingButton", !isSpecial);
  setItemVisibility("chatLockButton", !isSpecial);
  setItemVisibility("chatWallpaperButton", !isSpecial);
  setItemVisibility("groupInfoOption", isGroup);
  setItemVisibility("deleteGroupOption", isAdmin);
}
window.updateDropdownItemsVisibility = updateDropdownItemsVisibility;

function closeAllChatMenus() {
  const cMenu = document.getElementById("chat-dropdown-menu");
  if (cMenu) {
    cMenu.setAttribute("hidden", "true");
    cMenu.style.display = "none";
  }
  const aMenu = document.getElementById("attachMenu");
  if (aMenu) {
    aMenu.setAttribute("hidden", "true");
    aMenu.style.display = "none";
  }
  const backdrop = document.getElementById("chatDropdownBackdrop");
  if (backdrop) {
    backdrop.setAttribute("hidden", "true");
    backdrop.style.display = "none";
  }
}
window.closeAllChatMenus = closeAllChatMenus;

window.toggleChatDropdown = function(event) {
  if (event && typeof event.stopPropagation === "function") event.stopPropagation();
  const menu = document.getElementById("chat-dropdown-menu");
  const backdrop = document.getElementById("chatDropdownBackdrop");
  if (!menu) return;

  const isHidden = menu.hasAttribute("hidden") || menu.style.display === "none";
  if (isHidden) {
    const aMenu = document.getElementById("attachMenu");
    if (aMenu) {
      aMenu.setAttribute("hidden", "true");
      aMenu.style.display = "none";
    }
    menu.removeAttribute("hidden");
    menu.style.display = "flex";
    if (backdrop) {
      backdrop.removeAttribute("hidden");
      backdrop.style.display = "block";
    }
    if (typeof updateDropdownItemsVisibility === "function") updateDropdownItemsVisibility();
    if (typeof updateChatPinUI === "function") updateChatPinUI();
    if (typeof updateChatBlockUI === "function") updateChatBlockUI();
    if (typeof updateChatWallpaperUI === "function") updateChatWallpaperUI();
  } else {
    menu.setAttribute("hidden", "true");
    menu.style.display = "none";
    if (backdrop) {
      backdrop.setAttribute("hidden", "true");
      backdrop.style.display = "none";
    }
  }
};

// 7. إدارة معلومات وأعضاء المجموعة
function openGroupMembersModal() {
  window.closeAllChatMenus();
  const chat = typeof getChat === "function" ? getChat() : null;
  if (!chat || (chat.type !== "group" && !String(chat.id || "").startsWith("group:"))) return;
  const groupId = String(chat.id).replace(/^group:/, "");

  const group = (state.groups || []).find((g) => g.id === groupId) || {
    id: groupId,
    name: chat.name,
    image: chat.image,
    admin: chat.admin,
    admins: chat.admins || [chat.admin],
    members: chat.members || [],
    member_emails: chat.member_emails || []
  };

  const modal = el("groupMembersModal");
  if (!modal) return;

  const isAdmin = isGroupAdmin(group);

  // تحديث بيانات رأس النافذة
  if (el("groupModalTitle")) el("groupModalTitle").textContent = group.name;
  const memberCount = (group.member_emails && group.member_emails.length) || (group.members && group.members.length) || 1;
  if (el("groupModalSubtitle")) el("groupModalSubtitle").textContent = `${memberCount} أعضاء`;

  const modalAvatar = el("groupModalAvatar");
  if (modalAvatar) {
    if (group.image) {
      modalAvatar.innerHTML = `<img src="${group.image}" style="width:100%; height:100%; object-fit:cover; border-radius:50%;" />`;
    } else {
      modalAvatar.textContent = (group.name || "م")[0];
    }
  }

  // إظهار قسم إضافة عضو للمشرف فقط
  const addSec = el("groupAddMemberSection");
  if (addSec) addSec.hidden = !isAdmin;

  // إظهار زر الحذف للمشرف وزر المغادرة لغير المشرف
  const deleteBtn = el("groupModalDeleteBtn");
  if (deleteBtn) deleteBtn.hidden = !isAdmin;

  const leaveBtn = el("groupModalLeaveBtn");
  if (leaveBtn) leaveBtn.hidden = isAdmin;

  // تعبئة قائمة الأعضاء
  renderGroupMembersList(group, isAdmin);

  if (typeof openDialog === "function") openDialog(modal);
  else modal.showModal();
}
window.openGroupMembersModal = openGroupMembersModal;

function closeGroupMembersModal() {
  const modal = el("groupMembersModal");
  if (!modal) return;
  if (typeof closeDialog === "function") closeDialog(modal);
  else modal.close();
}
window.closeGroupMembersModal = closeGroupMembersModal;

function renderGroupMembersList(group, isAdmin) {
  const container = el("groupMembersList");
  if (!container) return;
  container.innerHTML = "";

  const emails = Array.isArray(group.member_emails) ? group.member_emails : [];
  const names = Array.isArray(group.members) ? group.members : [];
  const count = Math.max(emails.length, names.length);

  if (count === 0) {
    container.innerHTML = '<p style="color:var(--muted); font-size:13px; text-align:center; padding:10px;">لا يوجد أعضاء في المجموعة</p>';
    return;
  }

  for (let i = 0; i < count; i++) {
    const email = emails[i] || "";
    const name = names[i] || (email ? email.split("@")[0] : "عضو");
    const isMemberAdmin = isSameUserEmail(group.admin, email) ||
      (Array.isArray(group.admins) && group.admins.some((a) => isSameUserEmail(a, email)));
    const isMe = isSameUserEmail(state.currentUser?.email, email);

    const contact = (state.contacts && state.contacts[email.toLowerCase()]) ||
                    (state.friends || []).find((f) => isSameUserEmail(f.email, email)) || {};
    const imgUrl = contact.image || "";

    const item = document.createElement("div");
    item.className = "group-member-item";

    const leftCol = document.createElement("div");
    leftCol.style.cssText = "display: flex; align-items: center; gap: 10px; min-width: 0; flex: 1;";

    const avatar = document.createElement("div");
    avatar.className = "avatar";
    avatar.style.cssText = "width: 38px; height: 38px; font-size: 15px; flex-shrink: 0;";
    if (imgUrl) {
      avatar.innerHTML = `<img src="${imgUrl}" style="width:100%; height:100%; object-fit:cover; border-radius:50%;" />`;
    } else {
      avatar.textContent = (name || "ع")[0];
    }

    const info = document.createElement("div");
    info.style.cssText = "min-width: 0; flex: 1;";
    info.innerHTML = `
      <div style="display: flex; align-items: center; gap: 6px;">
        <strong style="font-size: 13.5px; color: var(--text); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${escapeHtml(name)}${isMe ? " (أنت)" : ""}</strong>
        ${isMemberAdmin ? '<span style="font-size: 10.5px; background: #fef08a; color: #854d0e; padding: 2px 6px; border-radius: 6px; font-weight: 700;">مشرف 👑</span>' : '<span style="font-size: 10px; background: rgba(0,0,0,0.06); color: var(--muted); padding: 2px 6px; border-radius: 6px;">عضو</span>'}
      </div>
      ${email ? `<span style="font-size: 11.5px; color: var(--muted); display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${escapeHtml(email)}</span>` : ""}
    `;

    leftCol.appendChild(avatar);
    leftCol.appendChild(info);
    item.appendChild(leftCol);

    // زر إزالة العضو للمشرف
    if (isAdmin && !isMemberAdmin && !isMe) {
      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "btn-remove-member";
      removeBtn.title = "إزالة هذا العضو من المجموعة";
      removeBtn.style.cssText = "background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); color: #ef4444; border-radius: 8px; padding: 5px 10px; font-size: 12px; font-weight: 700; cursor: pointer; flex-shrink: 0; margin-inline-start: 8px;";
      removeBtn.innerHTML = "إزالة ❌";
      removeBtn.onclick = (e) => {
        e.stopPropagation();
        removeGroupMember(group.id, email || name, name);
      };
      item.appendChild(removeBtn);
    }

    container.appendChild(item);
  }
}

async function submitAddGroupMember() {
  const input = el("newGroupMemberInput");
  const memberQuery = input ? input.value.trim() : "";
  if (!memberQuery) {
    alert("يرجى كتابة البريد الإلكتروني أو اسم العضو لإضافته");
    return;
  }
  const chat = typeof getChat === "function" ? getChat() : null;
  if (!chat) return;
  const groupId = String(chat.id).replace(/^group:/, "");
  const requester = state.currentUser?.email || "";

  const btn = el("addGroupMemberBtn");
  if (btn) btn.disabled = true;

  try {
    const res = await fetch("/api/groups/members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ groupId, member: memberQuery, requester })
    });
    const data = await res.json();
    if (!res.ok || !data.ok) {
      alert(data.error || "تعذر إضافة العضو");
      return;
    }

    input.value = "";
    const gIdx = (state.groups || []).findIndex((g) => g.id === groupId);
    if (gIdx !== -1) {
      state.groups[gIdx] = data.group;
    } else {
      state.groups = state.groups || [];
      state.groups.push(data.group);
    }

    renderGroupMembersList(data.group, true);
    if (el("groupModalSubtitle")) el("groupModalSubtitle").textContent = `${data.group.members.length} أعضاء`;

    if (data.message) {
      state.conversations[chat.id] = state.conversations[chat.id] || [];
      state.conversations[chat.id].push(data.message);
      renderMessages();
    }
    saveState();
    renderConversations();
    alert(`تمت إضافة ${data.member.name} إلى المجموعة بنجاح ✅`);
  } catch (err) {
    alert("حدث خطأ أثناء إضافة العضو، يرجى المحاولة لاحقاً");
  } finally {
    if (btn) btn.disabled = false;
  }
}
window.submitAddGroupMember = submitAddGroupMember;

async function removeGroupMember(groupId, memberEmail, memberName) {
  const confirmMsg = `هل أنت متأكد من إزالة "${memberName}" من المجموعة؟`;
  if (!confirm(confirmMsg)) return;

  const requester = state.currentUser?.email || "";
  try {
    const res = await fetch(`/api/groups/members?id=${encodeURIComponent(groupId)}&member=${encodeURIComponent(memberEmail)}&user=${encodeURIComponent(requester)}`, {
      method: "DELETE"
    });
    const data = await res.json();
    if (!res.ok || !data.ok) {
      alert(data.error || "تعذر إزالة العضو");
      return;
    }

    const gIdx = (state.groups || []).findIndex((g) => g.id === groupId);
    if (gIdx !== -1) {
      state.groups[gIdx] = data.group;
    }
    renderGroupMembersList(data.group, true);
    if (el("groupModalSubtitle")) el("groupModalSubtitle").textContent = `${data.group.members.length} أعضاء`;

    loadSharedMessages(`group:${groupId}`);
    saveState();
    renderConversations();
    alert(`تمت إزالة ${memberName} من المجموعة ✅`);
  } catch (err) {
    alert("حدث خطأ أثناء إزالة العضو");
  }
}
window.removeGroupMember = removeGroupMember;

async function leaveActiveGroup() {
  const chat = typeof getChat === "function" ? getChat() : null;
  if (!chat) return;
  const groupId = String(chat.id).replace(/^group:/, "");
  const myEmail = state.currentUser?.email || "";

  if (!confirm(`هل أنت متأكد من رغبتك في مغادرة مجموعة "${chat.name}"؟`)) return;

  try {
    const res = await fetch(`/api/groups/members?id=${encodeURIComponent(groupId)}&member=${encodeURIComponent(myEmail)}&user=${encodeURIComponent(myEmail)}`, {
      method: "DELETE"
    });
    const data = await res.json();
    if (!res.ok || !data.ok) {
      alert(data.error || "تعذر مغادرة المجموعة");
      return;
    }

    closeGroupMembersModal();
    state.groups = (state.groups || []).filter((g) => g.id !== groupId);
    delete state.conversations[chat.id];
    delete state.conversations[`group:${groupId}`];
    state.activeChatId = null;
    el("contentGrid")?.classList.remove("in-chat");
    el("appScreen")?.classList.remove("in-chat-mobile");
    saveState();
    renderConversations();
    alert("لقد غادرت المجموعة بنجاح 👋");
  } catch (err) {
    alert("حدث خطأ أثناء مغادرة المجموعة");
  }
}
window.leaveActiveGroup = leaveActiveGroup;

async function deleteActiveGroup() {
  const chat = typeof getChat === "function" ? getChat() : null;
  if (!chat || (chat.type !== "group" && !String(chat.id || "").startsWith("group:"))) {
    alert("هذا الخيار مخصص للمجموعات فقط.");
    return;
  }
  const myEmail = (state.currentUser?.email || "").toLowerCase();
  const isAdmin = isGroupAdmin(chat);

  if (!isAdmin) {
    alert("حذف المجموعة متاح فقط لمشرف ومؤسس المجموعة 🔒");
    return;
  }

  const confirmMsg = currentLang === "ar"
    ? `هل أنت متأكد من رغبتك في حذف مجموعة "${chat.name}" نهائياً لجميع الأعضاء؟\nسيتم إزالة المجموعة وجميع محتوياتها ورسائلها لدى الجميع فوراً.`
    : `Are you sure you want to permanently delete "${chat.name}" for all members?`;

  if (!confirm(confirmMsg)) return;

  const groupId = String(chat.id).replace(/^group:/, "");
  try {
    const res = await fetch(`/api/groups?id=${encodeURIComponent(groupId)}&user=${encodeURIComponent(myEmail)}`, {
      method: "DELETE"
    });
    const data = await res.json();
    if (!res.ok || !data.ok) {
      alert(data.error || "تعذر حذف المجموعة، يرجى المحاولة لاحقاً");
      return;
    }

    closeGroupMembersModal();
    window.closeAllChatMenus();

    // إزالة المجموعة محلياً
    state.groups = (state.groups || []).filter((g) => g.id !== groupId);
    delete state.conversations[chat.id];
    delete state.conversations[`group:${groupId}`];
    state.activeChatId = null;
    el("contentGrid")?.classList.remove("in-chat");
    el("appScreen")?.classList.remove("in-chat-mobile");

    saveState();
    renderConversations();
    alert("تم حذف المجموعة بنجاح ✅");
  } catch (err) {
    alert("حدث خطأ أثناء الاتصال بالخادم لحذف المجموعة.");
  }
}
window.deleteActiveGroup = deleteActiveGroup;


window.openDisappearingMessagesModal = function() {
  window.closeAllChatMenus();
  const modal = document.getElementById("disappearingDialog") || document.getElementById("disappearingMessagesModal");
  if (modal && typeof openDialog === "function") openDialog(modal);
};

window.openChatSearch = function() {
  window.closeAllChatMenus();
  const searchBar = document.getElementById("messageSearch");
  if (searchBar) {
    searchBar.hidden = false;
    document.getElementById("messageSearchInput")?.focus();
  }
};

window.triggerVoiceCall = function() {
  window.closeAllChatMenus();
  if (typeof openCall === "function") openCall(typeof t === "function" ? t("voiceCall") : "مكالمة صوتية");
};

window.triggerVideoCall = function() {
  window.closeAllChatMenus();
  if (typeof openCall === "function") openCall(typeof t === "function" ? t("videoCall") : "مكالمة فيديو");
};

window.openChatMedia = function() {
  window.toggleChatDropdown();
  if (typeof openChatInfoModal === "function") {
    openChatInfoModal();
  }
};

window.toggleMuteChat = function() {
  window.toggleChatDropdown();
  const chatId = state.activeChatId;
  if (!chatId) return;
  state.chatSettings = state.chatSettings || {};
  state.chatSettings[chatId] = state.chatSettings[chatId] || {};
  const isMuted = !state.chatSettings[chatId].is_muted;
  state.chatSettings[chatId].is_muted = isMuted;
  saveState();
  showToast(isMuted ? "تم كتم تنبيهات هذه المحادثة 🔕" : "تم تفعيل التنبيهات لهذه المحادثة 🔔");
};

window.openWallpaperModal = function() {
  window.toggleChatDropdown();
  if (typeof openChatWallpaperModal === "function") {
    openChatWallpaperModal();
  }
};

window.lockChatModal = function() {
  window.toggleChatDropdown();
  if (state.activeChatId && typeof promptLockChat === "function") {
    promptLockChat(state.activeChatId);
  }
};

window.clearCurrentChat = function() {
  window.closeAllChatMenus();
  const chatId = state.activeChatId;
  if (!chatId) return;

  if (chatId === "chato_announcements") {
    if (confirm("هل تريد حذف محادثة الإعلانات؟ ستختفي من قائمتك وستظهر مجدداً فور نشر إعلان جديد من الإدارة.")) {
      localStorage.setItem("chato_announcements_deleted_until", String(Date.now()));
      document.body.classList.remove("in-announcements");
      state.activeChatId = null;
      renderConversations();
      showToast("تم حذف محادثة الإعلانات بنجاح");
    }
    return;
  }

  if (confirm("هل أنت متأكد من رغبتك في مسح جميع رسائل هذه المحادثة نهائياً؟")) {
    state.conversations[chatId] = [];
    saveState();
    renderMessages();
    renderConversations();
    showToast("تم مسح محتوى المحادثة");
  }
};

// ==========================================
// ميزة تثبيت المحادثات (بحد أقصى 3 محادثات فقط)
// ==========================================
window.updateChatPinUI = function() {
  const chat = getChat();
  const pinText = document.getElementById("chatPinOptionText");
  if (!pinText || !chat) return;
  state.pinnedChats = Array.isArray(state.pinnedChats) ? state.pinnedChats : [];
  const isPinned = state.pinnedChats.includes(chat.id);
  pinText.textContent = isPinned ? "إلغاء تثبيت المحادثة 📌" : "تثبيت المحادثة (الحد 3) 📌";
};

window.toggleActiveChatPin = async function() {
  window.toggleChatDropdown();
  const chat = getChat();
  if (!chat) return;

  state.pinnedChats = Array.isArray(state.pinnedChats) ? state.pinnedChats : [];
  const isPinned = state.pinnedChats.includes(chat.id);

  if (!isPinned) {
    if (state.pinnedChats.length >= 3) {
      showToast("عذراً، الحد الأقصى لتثبيت المحادثات هو 3 محادثات فقط 📌");
      return;
    }
    state.pinnedChats.push(chat.id);
  } else {
    state.pinnedChats = state.pinnedChats.filter((id) => id !== chat.id);
  }

  saveState();
  window.updateChatPinUI();
  renderConversations();

  try {
    const res = await fetch("/api/chats/pin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user: state.currentUser?.email, chatId: chat.id, isPinned: !isPinned })
    });
    const data = await res.json();
    if (data.ok && Array.isArray(data.pinnedChats)) {
      state.pinnedChats = data.pinnedChats;
      saveState();
      renderConversations();
    }
  } catch {}

  showToast(!isPinned ? "تم تثبيت المحادثة في أعلى القائمة بنجاح 📌" : "تم إلغاء تثبيت المحادثة");
};

// ==========================================
// ميزة حظر المستخدمين (Block / Unblock)
// ==========================================
window.updateChatBlockUI = function() {
  const chat = getChat();
  const banner = document.getElementById("blockedChatBanner");
  const composer = document.getElementById("composer");
  const blockOpt = document.getElementById("chatBlockOption");
  const blockText = document.getElementById("chatBlockOptionText");

  if (!chat || chat.type !== "friend" || !chat.email) {
    if (banner) banner.hidden = true;
    if (composer) composer.style.display = "";
    if (blockOpt) blockOpt.hidden = true;
    return;
  }

  if (blockOpt) blockOpt.hidden = false;
  state.blockedUsers = Array.isArray(state.blockedUsers) ? state.blockedUsers : [];
  const isBlocked = state.blockedUsers.includes(chat.email.toLowerCase());

  if (blockText) {
    blockText.textContent = isBlocked ? "إلغاء حظر هذا المستخدم 🔓" : "حظر هذا المستخدم 🚫";
  }

  if (isBlocked) {
    if (banner) banner.hidden = false;
    if (composer) composer.style.display = "none";
  } else {
    if (banner) banner.hidden = true;
    if (composer) composer.style.display = "";
  }
};

window.toggleActiveChatBlock = async function() {
  const menu = document.getElementById("chat-dropdown-menu");
  if (menu && !menu.hasAttribute("hidden")) window.toggleChatDropdown();

  const chat = getChat();
  if (!chat || chat.type !== "friend" || !chat.email) {
    showToast("الحظر متاح في المحادثات الفردية فقط.");
    return;
  }

  state.blockedUsers = Array.isArray(state.blockedUsers) ? state.blockedUsers : [];
  const targetEmail = chat.email.toLowerCase();
  const isBlocked = state.blockedUsers.includes(targetEmail);

  const confirmMsg = isBlocked 
    ? `هل تريد بالتأكيد إلغاء حظر ${chat.name}؟ ستتمكن من إرسال واستقبال الرسائل مجدداً.`
    : `هل تريد بالتأكيد حظر ${chat.name}؟ لن يتمكن من مراسلتك ولن تصلك أي رسائل منه 🚫`;
  if (!confirm(confirmMsg)) return;

  try {
    const res = await fetch(isBlocked ? "/api/users/unblock" : "/api/users/block", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ blocker: state.currentUser?.email, target: targetEmail })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "فشل تنفيذ العملية");

    if (isBlocked) {
      state.blockedUsers = state.blockedUsers.filter((e) => e !== targetEmail);
      showToast(`✅ تم إلغاء حظر ${chat.name} بنجاح.`);
    } else {
      state.blockedUsers.push(targetEmail);
      showToast(`🚫 تم حظر ${chat.name} بنجاح.`);
    }

    saveState();
    window.updateChatBlockUI();
    window.updateChatPinUI();
  } catch (err) {
    alert(err.message || "حدث خطأ أثناء تنفيذ الحظر");
  }
};

// ==========================================
// ميزة الإبلاغ عن المحادثة / المستخدم (Reports)
// ==========================================
window.openReportModal = function() {
  window.toggleChatDropdown();
  const chat = getChat();
  if (!chat || chat.type === "ai" || chat.type === "admin_notice") {
    alert("الإبلاغ متاح في محادثات المستخدمين والمجموعات فقط.");
    return;
  }
  const nameTarget = document.getElementById("reportTargetName");
  if (nameTarget) nameTarget.textContent = chat.name || chat.email;
  const details = document.getElementById("reportDetailsInput");
  if (details) details.value = "";
  const reason = document.getElementById("reportReasonSelect");
  if (reason) reason.selectedIndex = 0;

  const modal = document.getElementById("reportDialog");
  if (modal && typeof modal.showModal === "function") {
    modal.showModal();
  }
};

window.handleReportSubmit = async function(event) {
  if (event) event.preventDefault();
  const chat = getChat();
  if (!chat) return;

  const reason = document.getElementById("reportReasonSelect")?.value || "inappropriate";
  const details = document.getElementById("reportDetailsInput")?.value || "";
  const reportedEmail = chat.email || chat.id;

  try {
    const res = await fetch("/api/reports/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reporter: state.currentUser?.email,
        reported: reportedEmail,
        chatId: chat.id,
        reason,
        details
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "فشل إرسال البلاغ");

    const modal = document.getElementById("reportDialog");
    if (modal && typeof modal.close === "function") modal.close();
    alert("✅ تم إرسال البلاغ بنجاح إلى إدارة شاتو. سيقوم فريق الإشراف بالتحقق واتخاذ الإجراء اللازم فوراً.");
  } catch (err) {
    alert(err.message || "حدث خطأ أثناء إرسال البلاغ");
  }
};

// إغلاق قوائم المحادثة فورا وسلاسة فائقة عند النقر في أي مكان خارجها (Mobile Touch & PC Click)
document.addEventListener("pointerdown", (e) => {
  const cMenu = document.getElementById("chat-dropdown-menu");
  const cTrigger = document.getElementById("chat-options-trigger");
  const backdrop = document.getElementById("chatDropdownBackdrop");
  if (cMenu && !cMenu.hasAttribute("hidden") && cMenu.style.display !== "none") {
    if (!cMenu.contains(e.target) && e.target !== cTrigger && !cTrigger?.contains(e.target)) {
      cMenu.setAttribute("hidden", "true");
      cMenu.style.display = "none";
      if (backdrop) {
        backdrop.setAttribute("hidden", "true");
        backdrop.style.display = "none";
      }
    }
  }

  const aMenu = document.getElementById("attachMenu");
  const aBtn = document.getElementById("attachButton");
  if (aMenu && !aMenu.hasAttribute("hidden") && aMenu.style.display !== "none") {
    if (!aMenu.contains(e.target) && e.target !== aBtn && !aBtn?.contains(e.target)) {
      aMenu.setAttribute("hidden", "true");
      aMenu.style.display = "none";
    }
  }
});


// ربط أزرار شريط التسجيل الصوتي الحديث
document.getElementById("voiceCancelBtn")?.addEventListener("click", cancelVoiceRecording);
document.getElementById("voicePauseBtn")?.addEventListener("click", togglePauseVoiceRecording);
document.getElementById("voiceSendBtn")?.addEventListener("click", sendVoiceRecording);

// زر إغلاق القوائم بالموبايل
document.querySelector(".chat-sheet-close-btn")?.addEventListener("click", closeAllChatMenus);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeAllChatMenus();
});


// إغلاق القوائم عند التمرير داخل المحادثة
document.getElementById("messages")?.addEventListener("scroll", closeAllChatMenus, { passive: true });
document.getElementById("chat-area")?.addEventListener("scroll", closeAllChatMenus, { passive: true });

startApplication();

// النقر على رأس المحادثة لفتح معلومات المجموعة عند المحادثات الجماعية
const _chatHeadEl = document.getElementById("chatHead");
if (_chatHeadEl) {
  _chatHeadEl.addEventListener("click", (e) => {
    if (e.target.closest("#chat-options-trigger") || e.target.closest("#backChatBtn") || e.target.closest(".chat-actions") || e.target.closest(".delete-friend-button") || e.target.closest(".ai-image-gen-btn")) return;
    const curChat = typeof getChat === "function" ? getChat() : null;
    if (curChat && (curChat.type === "group" || String(curChat.id || "").startsWith("group:"))) {
      openGroupMembersModal();
    }
  });
}
