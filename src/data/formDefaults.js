/**
 * DEFAULT_CONTENT for the registration page.
 * Seeded from src/i18n/locales/{en,he}.json — kept here as the source of truth
 * so the page renders correctly even before Firestore is populated.
 * Admin edits override these values via Firestore (siteContent/formPage).
 */
export const DEFAULT_CONTENT = {
  hero: {
    title: {
      en: "Professional Revit Course Registration",
      he: "הרשמה לקורסי Revit מקצועיים",
    },
    subtitle: {
      en: "Launch a career in design and architecture with hands-on courses and close professional guidance.",
      he: "פתח קריירה בעיצוב ואדריכלות עם קורסים מעשיים בליווי מקצועי צמוד.",
    },
  },
  infoHeading: {
    en: "Let's discover the course that fits you:",
    he: "בוא/י נגלה יחד מה הקורס שמתאים לך באמת:",
  },
  testimonials: [
    {
      id: "t-sarah",
      name: "Sarah Cohen",
      course: "Revit for Careers",
      quote: {
        en: "The course gave me both the confidence and the portfolio I needed to land my first interior design role.",
        he: "הקורס נתן לי גם את הביטחון וגם את תיק העבודות שאיתם השתלבתי בעבודה ראשונה בעיצוב פנים.",
      },
    },
    {
      id: "t-david",
      name: "David Levi",
      course: "Revit Reality",
      quote: {
        en: "I came in knowing the software — I left working like a studio. Phases, materials, presentation — everything changed.",
        he: "הגעתי כשידעתי את התוכנה — יצאתי עובד כמו במשרד. שלבים, חומרים, פרזנטציה — הכל השתנה.",
      },
    },
    {
      id: "t-maya",
      name: "Maya Rosen",
      course: "Revit Personal Project",
      quote: {
        en: "The personal mentorship was the difference between an okay final project and one I'm genuinely proud of.",
        he: "הליווי האישי הוא ההבדל בין פרויקט גמר בסדר לבין כזה שאני באמת גאה בו.",
      },
    },
  ],
  courses: {
    reality: {
      countdown: {
        enabled: false,
        targetISO: "",
        label: { en: "Next cohort starts in", he: "המחזור הבא מתחיל בעוד" },
      },
      label: { en: "Revit Reality", he: "Revit Reality" },
      title: {
        en: "Revit Reality — Studio-level practice",
        he: "קורס Revit Reality למתקדמים – עבודה כמו במשרד אמיתי",
      },
      intro: {
        en:
          "The course is built to teach professional work on real projects, similar to how design and architecture studios operate.",
        he:
          "הקורס בנוי כדי ללמד עבודה מקצועית על פרויקטים אמיתיים, בדומה לאופן העבודה במשרדי תכנון ואדריכלות.",
      },
      sessions: { en: "14 sessions", he: "14 מפגשים" },
      duration: { en: "Each session 2 hours long", he: "כל מפגש באורך שעתיים" },
      learnHeading: { en: "What you'll learn:", he: "מה תלמדו בקורס?" },
      learn: {
        en: [
          "Building a smart Revit model that serves the decision process",
          "Working correctly with phases, materials and details",
          "Connecting the model to Lumion as part of the workflow",
          "Creating renderings that explain the project clearly",
          "Convincing project presentation for clients and contractors",
          "Working with studio standards and methodology",
        ],
        he: [
          "בניית מודל Revit חכם שמשרת תהליך קבלת החלטות",
          "עבודה נכונה עם שלבים (Phases), חומרים ופרטים",
          "חיבור המודל ל-Lumion כחלק מתהליך העבודה",
          "יצירת הדמיות שמסבירות את הפרויקט בצורה ברורה",
          "הצגת פרויקט משכנעת ללקוחות, קבלנים וצוותים",
          "עבודה לפי חשיבה משרדית וסטנדרטים מקצועיים",
        ],
      },
      audienceHeading: { en: "Who is this course for?", he: "למי הקורס מתאים?" },
      audience: {
        en: [
          "Those who already master Revit and want to work at a higher level",
          "Graduates of Revit Career who want to deepen on a project",
          "People who want to bridge planning, rendering and decision-making",
          "Architects, interior architects and advanced students",
        ],
        he: [
          "למי שכבר שולט ב-Revit ורוצה לעבוד ברמה גבוהה יותר",
          "למי שעבר קורס Revit Career ומעוניין להעמיק בעבודה על פרויקט",
          "למי שרוצה לחבר בין תכנון, הדמיה וקבלת החלטות",
          "לאדריכלים, אדריכלי פנים וסטודנטים מתקדמים",
        ],
      },
    },
    officeDna: {
      countdown: {
        enabled: false,
        targetISO: "",
        label: { en: "Next implementation slot in", he: "ההטמעה הבאה מתחילה בעוד" },
      },
      label: { en: "Revit Office DNA", he: "Revit Office DNA" },
      title: {
        en: "Revit implementation service for studios",
        he: "שירות הטמעת Revit למשרדי אדריכלות",
      },
      intro: {
        en:
          "A service for architecture and interior architecture studios that want to work in <strong>Revit</strong> in a unified, organized and efficient way — adapted to the studio's character, projects and internal standards.",
        he:
          "השירות מיועד למשרדי אדריכלות ואדריכלות פנים המעוניינים לעבוד ב־<strong>Revit</strong> בצורה אחידה, מסודרת ויעילה, בהתאם לאופי המשרד, סוג הפרויקטים והסטנדרטים הפנימיים שלו.",
      },
      template: {
        en:
          "We build a <strong>custom Revit template</strong> that reflects how the studio actually works, allowing consistent and correct work throughout every project.",
        he:
          "במסגרת השירות נבנית למשרד <strong>תבנית Revit מותאמת אישית</strong>, המשקפת את שיטת העבודה האמיתית של המשרד ומאפשרת עבודה עקבית ונכונה לאורך כל הפרויקט.",
      },
      templateHeading: { en: "What's included:", he: "מה כולל השירות?" },
      items: {
        en: [
          "Building a custom office Revit template",
          "Creating dedicated Revit families based on studio needs",
          "Defining parameters, views, filters and standards",
          "Implementing a clear workflow for the team",
          "Streamlining processes, saving time and reducing errors",
        ],
        he: [
          "בניית תבנית Revit משרדית מותאמת אישית",
          "יצירת משפחות Revit ייעודיות לפי צורכי המשרד",
          "הגדרת פרמטרים, תצוגות, פילטרים וסטנדרטים",
          "הטמעת שיטת עבודה ברורה לצוות המשרד",
          "ייעול תהליכי עבודה, חיסכון בזמן וצמצום טעויות",
        ],
      },
      outro: {
        en:
          "The goal isn't only \"to build a template\" — it's to create a <strong>professional working infrastructure</strong> that the team can use correctly in every new project.",
        he:
          "המטרה אינה רק \"לבנות תבנית\", אלא ליצור <strong>תשתית עבודה מקצועית</strong> שהצוות יודע להשתמש בה נכון – בכל פרויקט מחדש.",
      },
    },
    careers: {
      countdown: {
        enabled: false,
        targetISO: "",
        label: { en: "Next cohort starts in", he: "המחזור הבא מתחיל בעוד" },
      },
      label: { en: "Revit for Careers", he: "Revit for Careers" },
      title: {
        en: "Revit for Careers",
        he: "Revit for Careers – רוויט לקריירה",
      },
      intro: {
        en:
          "The course that connects technical mastery with real planning thinking — preparing you for fieldwork or studio practice.",
        he:
          "זה הקורס שמחבר בין שליטה טכנית לחשיבה תכנונית אמיתית – ומכין אותך לעבודה בשטח או במשרד.",
      },
      sessions: { en: "12 sessions", he: "12 מפגשים" },
      duration: { en: "Each session lasts 2 hours", he: "כל מפגש נמשך שעתיים" },
      learnHeading: { en: "What you'll learn:", he: "מה נלמד בקורס?" },
      learn: {
        en: [
          "Opening a project from scratch: walls, openings, floors and ceilings",
          "Drafting furniture, flooring, ceiling, electrical and station plans",
          "Dimensions, tags, schedules and a professional plan set",
          "Working correctly with sheets, scale and studio-level graphics",
        ],
        he: [
          "פתיחת פרויקט מאפס: קירות, פתחים, רצפות ותקרות",
          "שרטוט ריהוט, תכניות ריצוף, תקרה, חשמל ועמדה",
          "מידות, תגיות, טבלאות וסט תכניות מקצועי",
          "עבודה נכונה עם גיליונות, קנ\"מ וגרפיקה ברמה משרדית",
        ],
      },
      outro: {
        en:
          "<strong>By the end of the course you'll have confidence, a portfolio, and the ability to work in the field.</strong>",
        he:
          "<strong>בסיום הקורס תצא עם ביטחון, תיק עבודות ויכולת להשתלב בעבודה בתחום.</strong>",
      },
    },
    personal: {
      countdown: {
        enabled: false,
        targetISO: "",
        label: { en: "Next mentorship round in", he: "מחזור הליווי הבא בעוד" },
      },
      label: { en: "Revit Personal Project", he: "Revit Personal Project" },
      title: {
        en: "Personal guidance for a final project",
        he: "ליווי אישי לפרויקט גמר",
      },
      intro: {
        en: "Personal guidance that ensures you finish your project with a result you're truly proud of.",
        he: "ליווי אישי שמוודא שתסיים את הפרויקט עם תוצאה שאתה באמת גאה בה.",
      },
      tracksHeading: { en: "Two tracks to choose from:", he: "שני מסלולים לבחירה:" },
      tracks: {
        en: ["Short track – 4 weeks of guidance", "Full track – 8 weeks of guidance"],
        he: ["מסלול קצר – 4 שבועות ליווי", "מסלול מלא – 8 שבועות ליווי"],
      },
      getHeading: { en: "What you'll get:", he: "מה תקבל?" },
      get: {
        en: [
          "Weekly personal meetings (Zoom or in-person)",
          "Help with planning, rendering, plan sets and presentation prep",
          "Corrections, refinements and full guidance up to submission",
          "Ongoing availability via WhatsApp",
        ],
        he: [
          "פגישות שבועיות אישיות (זום/פרונטלי)",
          "עזרה בתכנון, הדמיות, סט תכניות והכנה לפרזנטציה",
          "תיקונים, חידודים וליווי מלא עד ההגשה",
          "זמינות שוטפת בווטסאפ",
        ],
      },
      audienceHeading: { en: "Who is it for?", he: "למי זה מתאים?" },
      audience: {
        en: [
          "Students who want real support throughout — both in content and emotionally",
          "Anyone who wants to submit professional, confident and accurate work",
        ],
        he: [
          "לסטודנטים שרוצים תמיכה אמיתית לאורך כל הדרך – גם בתוכן וגם ברגש",
          "למי שרוצה להגיש עבודה מקצועית, בטוחה ומדויקת",
        ],
      },
    },
  },
};

/** Course IDs and their order on the page. Kept stable across content edits. */
export const COURSE_ORDER = ["reality", "officeDna", "careers", "personal"];

/** Maps the public-facing id (used in form submissions) to the content key. */
export const COURSE_ID_MAP = [
  { id: "revit-reality", key: "reality" },
  { id: "revit-office-dna", key: "officeDna" },
  { id: "revit-careers", key: "careers" },
  { id: "revit-personal-project", key: "personal" },
];

/** Pick the right locale value from a {en, he} field, with graceful fallback. */
export const pickLocale = (val, lang) => {
  if (val == null) return "";
  if (typeof val === "string") return val;
  return val[lang] || val.en || val.he || "";
};
