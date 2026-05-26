# Firebase Setup — Admin Editor

This site uses Firebase for two things:
1. **Firestore** — stores the editable registration page content
2. **Authentication** — gates access to `/admin`

Public visitors can read the content (so the page renders). Only signed-in admins can edit. The form submission still goes through EmailJS + Google Apps Script — Firebase doesn't touch that.

---

## 1. Enable Email/Password sign-in

1. Go to https://console.firebase.google.com/project/rasha-web/authentication/providers
2. Click **Email/Password** → **Enable** → **Save**

## 2. Create Rasha's admin account

1. https://console.firebase.google.com/project/rasha-web/authentication/users
2. **Add user**
3. Email: `rasha.m22048@gmail.com` · Password: (choose a strong one and share securely with Rasha)
4. **Add user**

> She'll use these credentials at `/admin` on the live site.

## 3. Apply Firestore security rules

1. https://console.firebase.google.com/project/rasha-web/firestore/rules
2. Replace the rules with:

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // siteContent — anyone can read (so the public form page works),
    // only authenticated users can write.
    match /siteContent/{docId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    // Default: deny everything else.
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

3. **Publish**

## 4. Initialize the content document (optional but recommended)

Rasha can do this herself: visit `/admin`, log in, click **Save changes**. That writes `siteContent/formPage` with the defaults. From then on her edits replace it.

Alternatively, create the doc manually in the Firestore console (path `siteContent/formPage`, document ID `formPage`) — but it's easier to just save once from the admin UI.

## 5. Add Vercel environment variables

After confirming the site works locally, add these in Vercel → Project Settings → Environment Variables:

```
REACT_APP_FIREBASE_API_KEY
REACT_APP_FIREBASE_AUTH_DOMAIN
REACT_APP_FIREBASE_PROJECT_ID
REACT_APP_FIREBASE_STORAGE_BUCKET
REACT_APP_FIREBASE_MESSAGING_SENDER_ID
REACT_APP_FIREBASE_APP_ID
REACT_APP_FIREBASE_MEASUREMENT_ID
```

Copy the values from your local `.env.local`. Redeploy.

---

## What Rasha can edit at `/admin`

- **Hero** — title and subtitle (EN + HE)
- **Info heading** — the line above the four course tabs
- **Countdown timer** — enable/disable, target date and time, the label
- **For each of the 4 courses**:
  - Label (tab name)
  - Title
  - Intro paragraph
  - Sessions and duration meta (where applicable)
  - "What you'll learn" / "Who is it for" headings + bullets
  - Outro paragraph (where applicable)

Changes appear on the public site within seconds (live Firestore sync, no page reload needed).

---

## Troubleshooting

- **"Firebase not configured"** — `.env.local` not loaded. Make sure the file exists in the project root and restart `npm start`.
- **Can't sign in** — Email/Password provider isn't enabled yet, or the user doesn't exist in Firebase Auth. See steps 1-2 above.
- **"Missing or insufficient permissions"** when saving — security rules haven't been published, or you're not signed in. See step 3.
- **Countdown not showing** — make sure the checkbox is on AND the target date is in the future.
