# Chato

Chato chat interface with a small local Node.js API for the private account directory and friend-add notifications.

## Run locally

Double-click `فتح Chato.vbs` to start Chato without showing a command window, then open `http://127.0.0.1:4173/`.

## Publish preview

Deploy this as a Node.js application, because the account directory and notifications use the API in `work/server.mjs`. A static-only host such as Netlify's manual folder upload will not run that API.

## Before production

The included JSON database is appropriate only for local development. A public production version needs a managed database, real email delivery provider, authentication, file storage, and real-time messaging/call infrastructure.
