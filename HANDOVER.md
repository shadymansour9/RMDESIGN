# RM Design Studio — מדריך מסירה לרשא

מסמך זה מסביר איך להפעיל את האתר, איך להפעיל את ה-CMS (Sanity) שדרכו רשא תנהל תוכן, ואיך לעלות online.

---

## 1. מה יש כאן

```
RASHAWEB/
├── src/                  ← קוד האתר (React)
│   ├── i18n/             ← קבצי תרגום English/עברית
│   ├── pages/            ← עמודי האתר
│   ├── components/       ← Navbar, ImageModal וכו'
│   └── lib/sanity.js     ← חיבור ל-CMS
└── studio/               ← Sanity Studio (ממשק הניהול של רשא)
    ├── schemas/          ← מבני הנתונים (פרויקטים, קורסים וכו')
    └── sanity.config.js
```

---

## 2. שפה — אנגלית ראשית, עברית כפתור

- ברירת המחדל באתר היא **אנגלית** (LTR)
- כפתור `EN · עב` בנאבבר (פינה ימנית/שמאלית עליונה) מחליף שפה
- הבחירה נשמרת ב-localStorage, ומחליפה אוטומטית בין `dir="ltr"` ל-`dir="rtl"`
- כל הטקסטים ב-UI נמצאים ב-`src/i18n/locales/en.json` וב-`src/i18n/locales/he.json`

---

## 3. הרצה מקומית של האתר

```powershell
npm install
npm start
```

האתר ייפתח ב-`http://localhost:3000`.

לבילד פרודקשן:
```powershell
npm run build
```

---

## 4. הקמת Sanity (CMS) — שלבי first-time setup

### שלב א — יצירת חשבון Sanity על שם רשא

1. רשא נכנסת ל-https://www.sanity.io/login עם המייל **rasha.m22048@gmail.com**
2. בוחרת "Create project"
3. שם הפרויקט: **RM Design Studio**
4. Dataset: **production**
5. שומרת את ה-`Project ID` שמופיע (משהו כמו `abc12def`)

### שלב ב — חיבור ה-Studio המקומי לפרויקט

```powershell
cd studio
npm install --legacy-peer-deps
```

ערוך את `studio/sanity.config.js` ו-`studio/sanity.cli.js` — החלף `REPLACE_WITH_PROJECT_ID` ב-Project ID האמיתי. (אפשר גם לשים אותו כמשתנה סביבה `SANITY_STUDIO_PROJECT_ID`.)

### שלב ג — הרצה מקומית של ה-Studio

```powershell
cd studio
npm run dev
```

ייפתח ב-`http://localhost:3333`. רשא יכולה להיכנס ולהוסיף תוכן.

### שלב ד — פריסת ה-Studio לשרת Sanity (כדי שרשא תיכנס מהדפדפן)

```powershell
cd studio
npm run deploy
```

ה-CLI ישאל איזה hostname לבחור — מציעים `rmdesignstudio` → ה-Studio יהיה זמין ב-`https://rmdesignstudio.sanity.studio`.

### שלב ה — חיבור ה-Studio ל-React app

צור קובץ `.env.local` בתיקיית הפרויקט הראשית (לא ב-studio):

```
REACT_APP_SANITY_PROJECT_ID=<ה-Project ID האמיתי>
REACT_APP_SANITY_DATASET=production
```

הפעל מחדש את `npm start`. כעת ה-React app יושך נתונים מ-Sanity. **כל עוד אין נתונים ב-Sanity, האתר חוזר לערכי ברירת המחדל מהקוד — שום דבר לא נשבר.**

### שלב ו — הזמנת רשא כ-Owner

ב-https://www.sanity.io/manage:
1. בחר את הפרויקט
2. Members → Invite Member
3. הזן `rasha.m22048@gmail.com` ובחר תפקיד **Administrator**
4. שינוי בעלות (Transfer ownership) אחרי שהיא מתחברת

---

## 5. עליית האתר אונליין (Vercel)

> בפרויקט יש כבר `vercel.json` עם הגדרות נכונות ל-CRA + SPA routing + cache headers.

### א. דחיפת הקוד ל-GitHub
```powershell
git add .
git commit -m "production-ready: cinematic redesign + sanity + i18n + seo"
git push
```

### ב. חיבור Vercel
1. כניסה ל-https://vercel.com → Sign up עם GitHub
2. **New Project** → בחר את ה-repo
3. Vercel יזהה אוטומטית את ה-CRA ויקרא את `vercel.json`
4. **Environment Variables** — הוסף 2:
   - `REACT_APP_SANITY_PROJECT_ID` = `3t85kpzl`
   - `REACT_APP_SANITY_DATASET` = `production`
   - (אל תוסיף את `SANITY_API_TOKEN` — הוא רק לסקריפטים מקומיים)
5. **Deploy** — תוך 2-3 דקות תקבל URL זמני

### ג. חיבור הדומיין של רשא
1. ב-Vercel: **Settings → Domains → Add**
2. הזן את הדומיין שלך (למשל `rmdesignstudio.com`)
3. Vercel יראה לך 2 רשומות DNS להגדיר אצל ספק הדומיין:
   - **A record** (ל-apex domain)
   - **CNAME** (ל-`www.`)
4. הוסף אותם ב-Namecheap/GoDaddy/Cloudflare
5. תוך 5-30 דקות → SSL אוטומטי + הדומיין חי

### ד. עדכון URL ב-SEO files
לאחר שיש דומיין סופי, עדכן את הכתובת בשני מקומות:
- `src/components/SEO.jsx` → `DEFAULTS.baseUrl`
- `public/sitemap.xml` (כל הופעה של `https://rmdesignstudio.com`)
- `public/robots.txt` (שורת ה-Sitemap)

### ה. שלח ל-Google Search Console
1. https://search.google.com/search-console
2. **Add Property** → הזן את הדומיין
3. אמת בעלות (יש מספר אופציות; הקלה ביותר: TXT record)
4. **Submit Sitemap** → `https://rmdesignstudio.com/sitemap.xml`

---

## 5.5 — סקריפט אכלוס ראשוני (Seed)

יש בפרויקט סקריפט שמעלה את 6 הפרויקטים הקיימים ל-Sanity בלחיצה אחת — שימושי בהקמה ראשונית או אחרי איפוס dataset.

### א. השג Write Token

1. כנס ל-https://www.sanity.io/manage/project/3t85kpzl/api
2. לשונית **Tokens** → **Add API token**
3. שם: `Seed`, Permissions: **Editor**
4. **העתק מיד** את ה-token (מוצג פעם אחת בלבד)

### ב. הוסף את ה-Token ל-`.env.local` (לא ל-git!)

```
SANITY_API_TOKEN=skXXXXXXXXXXXXXXXXX...
```

### ג. הרץ את הסקריפט

```powershell
npm run seed:projects
```

הסקריפט מעלה את כל 6 הפרויקטים עם תמונות, כותרות, תיאורים וקטגוריות.

**מה הוא עושה:**
- בודק לכל פרויקט אם slug כבר קיים → מדלג עליו (`⏭ Skipped`)
- אם לא קיים → מעלה את התמונה ויוצר document (`✅ Created`)
- בסוף מדפיס סיכום: `Created / Skipped / Failed`

הסקריפט בטוח להרצה חוזרת — לא ייצור כפילויות.

---

## 6. מה רשא יכולה לערוך לבד מה-Studio

| מסך ב-Studio | מה אפשר לעדכן |
|---|---|
| **Site Settings** | שם הסטודיו, טאגליין, אימייל, טלפון, אינסטגרם, לינקדאין |
| **Home Page** | כותרת ה-Hero, תת-כותרת, תמונת רקע, מניפסט, שני עמודי תוכן, CTA |
| **About Page** | כותרת, תמונה, ציטוט, פסקאות אודות, פרטי המייסדת |
| **Projects** | להוסיף/לערוך/למחוק פרויקטים — כותרת, קטגוריה, שנה, שטח, גלריה |
| **Courses** | תוכן הקורסים, מספר מפגשים, נקודות "מה תלמדו", "למי מתאים" |

לכל שדה טקסט יש שני שדות: **English** ו-**עברית**. אם רשא ממלאת רק אחד — האתר מציג אותו בשתי השפות (עם fallback אוטומטי).

---

## 7. Checklist מסירה לרשא

- [ ] חשבון Sanity על שם רשא, ה-Studio עלה ל-`rmdesignstudio.sanity.studio`
- [ ] הקוד ב-GitHub בחשבון של רשא
- [ ] חשבון Vercel על שם רשא, האתר deployed עם metadata-vars
- [ ] הדומיין מחובר עם SSL
- [ ] רשא קיבלה הזמנה כ-Administrator/Owner ב-Sanity ובכל החשבונות
- [ ] וידאו 5–10 דק' שמראה לה איך להוסיף פרויקט, איך להעלות תמונות, איך לעבוד עם ה-Studio
- [ ] PDF עם הסיסמאות, הקישורים החשובים, ושמות החשבונות

---

## 8. דבר אחרון — תמיכה

אחרי המסירה, מומלץ להציע לרשא חבילת תמיכה (לדוגמה 2 שעות בחודש) כדי לעדכן עיצוב/באגים — מומלץ לשים את זה בכתב מראש כדי שהיא לא תצפה לתמיכה אינסופית.
