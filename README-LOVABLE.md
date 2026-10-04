# רביד נחום — חבילת Lovable

## מה יש כאן
- `src/pages/Projects.tsx` — עמוד הפרויקטים (נתיב `/projects`): קשת, סינון לפי סוג, גריד כרטיסים
- `src/components/site/projects-data.tsx` — נתוני הפרויקטים וכרטיס הפרויקט, משותפים לדף הבית ולעמוד הפרויקטים
- `src/pages/Index.tsx` — דף הבית (React + Tailwind)
- `src/components/site/shared.tsx` — הדר, פוטר, אייקונים, פרטי קשר (`CONTACT`), נתיבים (`ROUTES`) ו-hooks לאפקטים
- `src/index.css` — פונטי Arfilit (+ Montserrat לספרות) וטוקני הצבע: `--petrol` #042a2b, `--terra` #a56332, `--stone` #e0e0cf
- `src/site-effects.css` — שכבת האנימציות (CSS רגיל, בלי ספריות), מכבדת `prefers-reduced-motion`
- `tailwind.config.snippet.ts` — צבעים ו-fontFamily למיזוג ל-`theme.extend`
- `index.head.snippet.html` — סקריפט הסקייל, title ו-meta ל-`<head>`
- `public/assets`, `public/fonts` — כל התמונות (דחוסות), הווידאו, הלוגואים והפונטים

## תצוגה מקדימה מקומית (בלי Node)
`bash build-preview.sh` ואז `serve.ps1` → http://localhost:5180

## הוראות שילוב (לסוכן של Lovable)
Integrate `src/pages/Index.tsx` as the home route and `src/components/site/shared.tsx` at the same path.
Copy `public/assets` and `public/fonts` as-is. Merge `src/index.css` (+ `site-effects.css`) into global CSS and
the theme from `tailwind.config.snippet.ts`. Add the snippet from `index.head.snippet.html` to `<head>`.
Keep markup, classes and measurements exactly as provided — don't rebuild from scratch.

## מסכים
עיצוב הדסקטופ בנוי על פריים פיגמה ברוחב 1325px. מ-1024px ומעלה כל הדף עובר zoom כך שהפריים ממלא את המסך
(מעל 1325 הגדילה מרוסנת ל-60%, עד פי 1.6). מתחת ל-1024 חלה פריסת מובייל/טאבלט רספונסיבית.

## אפקטים
- הירו: הכותרת עולה שורה-שורה מתוך מסכה, הקו נמתח, הבית עולה ונע בפרלקסה עדינה
- "אדריכלות / ועיצוב פנים / מאותו שולחן": כמוסות התמונה נפתחות לצדדים
- הקשת הטרקוטה נפתחת לרוחב מלא בגלילה
- פרויקטים: תמונת חוץ מלפנים; במעבר עכבר (או בהקשה ראשונה במובייל) נחשפת תמונת הפנים עם תיאור
- ארבעה שלבים: אקורדיון נעוץ שנפתח לפי הגלילה (לחיצה על עמודה קופצת אליה); האיורים משורטטים. במובייל רשימה
- שותפים: וידאו צל העץ ברקע (מתנגן רק כשבמסך), הקו המעוקל משורטט בגלילה
- הדר נעלם בגלילה למטה וחוזר בגלילה למעלה

## פתוח
- פרטי קשר בדמה (`CONTACT` ב-shared.tsx)
- הטופס לא מחובר לשליחה
- עמודי פרויקט, נגישות, פרטיות ותקנון טרם נבנו
