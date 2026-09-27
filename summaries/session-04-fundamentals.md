<div dir="rtl">

# Session 04 - Modern ES6+ & Async JavaScript (Destructuring, Spread, Callbacks & Event Loop)

> **ملخص شامل للمحاضرة الرابعة بالكامل (الأجزاء الأربعة: Part 1, Part 2, Part 3, Part 4)** — يدمج ملاحظات المحاضرة مع أمثلة الكود التفصيلية من المصدر الرسمي للمهندس مصطفى سقلي.

---

## 0. ليه بنستخدم كل ميزات الـ ES6+ والـ Async دي؟ وإيه الغرض الحقيقي منها في الشغل؟
لما بتشوف الـ Syntax الجديد لأول مرة (أقواس `{}` عالشمال، وتلات نقط `...`، وعلامة استفهام `?.` و `??`، وبعدها `setTimeout` و `Callbacks` و `Event Loop`) طبيعي تحس إنها حاجات كتير أو تلخبط، لكن الحقيقة إن كلهم اتعملوا لحل **4 مشاكل حقيقية بتواجهك يومياً في أي مشروع حقيقي (سواء Frontend بـ React أو Backend بـ Node.js):**

1. **استلام بيانات ضخمة من السيرفر (Unpacking Data):**
   لما بتكلم API أو قاعدة بيانات، بترجعلك Object كبير فيه 30 خاصية، وأنت محتاج منهم `name` و `score` بس. بدل ما تقعد تكتب `response.data.student.name` في كل سطر، الـ **Destructuring** بيسحبلك اللي محتاجه في ثانية على باب الدالة.
2. **تعديل البيانات من غير ما تبوظ الأصل (Immutability - عدم التعديل المباشر):**
   في الفريم ووركس الحديثة (زي React)، ممنوع تعدل الـ Array أو الـ Object الأصلي مباشرة (`push` أو `student.score = 95`)، لازم تاخد **نسخة جديدة** وتعدل فيها. الـ **Spread (`...`)** بيخليك تنسخ وتعدل وتدمج في سطر واحد من غير ما تلمس الأصل.
3. **حماية البرنامج من الكراش لما البيانات تيجي ناقصة (Safe Access):**
   في الحقيقة، مش كل الطلاب عندهم `address`، ومش كل البيانات كاملة. زمان لو كتبت `student.address.city` والطالب معندوش عنوان، البرنامج كله بيضرب (`TypeError`) ويقف! الـ **`?.`** والـ **`??`** بيخلوا الكود يكمل بأمان ويحط قيمة بديلة من غير ولا `if` statement.
4. **تحميل البيانات من السيرفر أو الهارد بدون تجميد الصفحة (Non-Blocking Async JS):**
   الجافاسكريبت شغالة على **مسار واحد فقط (Single Thread)**. لو طلبت بيانات من سيرفر بياخد ثانيتين والبرنامج وقف يستناها، الصفحة كلها هتتجمد والزراير مش هتستجيب! الـ **Async & Event Loop** بيخلوا الجافاسكريبت تبعت الطلب، وتكمل شغلها عادي، ولما الرد يجهز تتنادى بدالة **Callback**.

---

## الجزء الأول (Part 1): Template Literals & Destructuring

### 1. دمج النصوص والـ Template Literals
لو عندنا متغير `const part1name = "Mostafa"` وعايزين ندمجه جوه نص، عندنا **طريقتين**:

1. **الطريقة القديمة (String Concatenation باستخدام `+`):**
   مملة، وسهل تنسى مسافة أو علامة تنصيص (`'` أو `"`)، ومبتقبلش تنزل سطر جديد بسهولة.
2. **الطريقة الحديثة (Template Literals باستخدام الـ Backticks `` ` ` ``):**
   أسهل، بتقبل أي عملية حسابية أو شرط (Expression) جوه `${ }`، وبتحفظ الأسطر المتعددة (Multi-line) في متغير واحد بطريقة منظمة.

<div dir="ltr">

```javascript
const part1name = "Mostafa";
const templateStudent = { name: "Sara", score: 92 };

// 1. الطريقة القديمة (Concatenation with +)
const oldWay = "Hello " + part1name + ", student " + templateStudent.name + " scored " + templateStudent.score;

// 2. الطريقة الحديثة (Template Literals with Backticks ` `)
// تقبل المتغيرات، العمليات الحسابية، والشروط (Ternary) مباشرة جوه ${ }
const modernWay = `Hello ${part1name}, student ${templateStudent.name} scored ${templateStudent.score + 5} (${templateStudent.score >= 60 ? "PASS" : "FAIL"})`;

// ميزة تعدد الأسطر (Multi-line) في متغير واحد بدون \n:
const reportCard = `
Student Name: ${templateStudent.name}
Final Score:  ${templateStudent.score}
Status:       Passed
`;

console.log(modernWay);
console.log(reportCard);
```

</div>

---

### 2. تفكيك الكائنات (Object Destructuring)
**يعني إيه Object Destructuring؟**
يعني عندي Object شايل بيانات كتير، وبدل ما أعمل متغير لكل خاصية بالطريقة القديمة (`const name = student.name`)، بفتح `{ }` على شمال علامة `=` وأسحب الخصائص اللي عايزها مباشرة بأسمائها:

<div dir="ltr">

```javascript
const student = { name: "Sara", score: 92, city: "Cairo", attendance: 88 };

// الطريقة القديمة:
// const name = student.name;
// const score = student.score;

// الطريقة الحديثة (Object Destructuring):
// الترتيب هنا غير مهم لأننا بنسحب بالاسم (Key Name)
const { name, score } = student;
console.log(name, score); // Sara 92
```

</div>

---

### 3. إعادة التسمية والقيم الافتراضية (Renaming & Default Values)
أثناء التفكيك نقدر نعمل حاجتين مهمين جداً:
1. **تغيير اسم المتغير (Renaming باستخدام `:`):** لو الاسم متاخد قبل كده أو عايزين اسم أوضح (`city: hometown` معناها: هات قيمة `city` وخزنها في متغير جديد اسمه `hometown`).
2. **قيمة افتراضية (Default Value باستخدام `=`):** لو الخاصية مش موجودة في الأوبجكت الأصلي، ياخد القيمة الافتراضية (زي `Unknown` أو `0`).

> **قاعدة ذهبية (Undefined vs Null):**  
> القيمة الافتراضية (Default Value) بتشتغل **فقط** لو القيمة غير موجودة أصلاً (`undefined`).  
> لكن لو القيمة موجودة ومكتوبة `null`، الجافاسكريبت بتعتبر `null` قيمة حقيقية مقصودة فـ **مش بتعملها Override** وبتطبع `null` زي ما هي!

<div dir="ltr">

```javascript
const partialStudent = { name: "Omar", score: 68 };

// 1. إضافة خصائص مش موجودة بقيم افتراضية + تغيير الاسم
const {
  name,
  city = "Unknown",              // خاصية غير موجودة -> تاخد "Unknown"
  attendance = 0,                // خاصية غير موجودة -> تاخد 0
  level: tier = "Beginner"       // تغيير الاسم من level لـ tier + قيمة افتراضية معاً
} = partialStudent;

console.log(name, city, attendance, tier); // Omar Unknown 0 Beginner

// 2. الفرق الجوهري مع null:
const studentWithNull = { name: "Lina", city: null };
const { city: linaCity = "Unknown" } = studentWithNull;

console.log(linaCity); // null (لم تتحول إلى "Unknown" لأن null قيمة صريحة وليست undefined)
```

</div>

---

### 4. التفكيك المتداخل (Nested Destructuring)
لما يكون عندنا Object جواه Object تاني (زي `enrollment` جواه `student` وجواه `course`)، نقدر نوصل للخصائص الداخلية مباشرة:

<div dir="ltr">

```javascript
const enrollment = {
  student: { name: "Yusuf", score: 95 },
  course: { title: "JS Everywhere", track: 1 }
};

// سحب البيانات الداخلية مباشرة:
const {
  student: { name: studentName, score },
  course: { title }
} = enrollment;

console.log(studentName, score, title); // Yusuf 95 JS Everywhere

// تنبيه مهم: كلمة course هنا استخدمت كـ "مسار" فقط للوصول لـ title، فلو طبعت course لوحدها هتطلع ReferenceError
// لو عايز تاخد الـ course كأوبجكت وكمان تاخد الـ title اللي جواه مع بعض:
const {
  course,
  course: { title: courseTitle }
} = enrollment;

console.log(course);      // { title: 'JS Everywhere', track: 1 }
console.log(courseTitle); // JS Everywhere
```

</div>

---

### 5. باقي الكائن (Object Rest `...`)
بدل ما نبني Object جديد من الصفر عشان نشيل منه خاصية واحدة (زي `id`)، بنسحب الـ `id` لوحده ونجمع **"الباقي كله"** في أوبجكت جديد نظيف باستخدام `...rest`:

<div dir="ltr">

```javascript
const fullStudent = { id: "STU-101", name: "Ahmed", score: 95, city: "Qena" };

// سحب الـ id لوحده، وجمع باقي الخصائص في متغير withoutId
const { id, ...withoutId } = fullStudent;

console.log(id);        // STU-101
console.log(withoutId); // { name: 'Ahmed', score: 95, city: 'Qena' } (بدون الـ id!)
```

</div>

---

### 6. تفكيك المصفوفات وتبديل القيم (Array Destructuring & Swapping)
المصفوفات مفيهاش أسماء مفاتيح (Keys)، فالتفكيك فيها بيمشي **بالترتيب والموقع (Position)** باستخدام الأقواس المربعة `[ ]`:

<div dir="ltr">

```javascript
const tracks = ["Web", "Mobile", "Desktop", "AI", "Cloud"];

// 1. سحب أول عنصرين بالترتيب:
const [first, second] = tracks;

// 2. تخطي عناصر باستخدام الفواصل الفارغة (Skip-commas):
const [, , , fourth] = tracks; // تخطى الأول والثاني والثالث وأخذ الرابع ("AI")

// 3. تقسيم المصفوفة لأول عنصر والباقي (Head & Tail):
const [head, ...tail] = tracks;
// head -> "Web"
// tail -> ["Mobile", "Desktop", "AI", "Cloud"]

// 4. تبديل قيم متغيرين (Swap Values) في سطر واحد بدون متغير ثالث temp:
let a = 10;
let b = 20;
[a, b] = [b, a];
console.log(a, b); // 20 10
```

</div>

---

## الجزء الثاني (Part 2): Spread, Rest & Modern ES6+ Features

### 1. التفكيك داخل معاملات الدالة (Destructuring in Function Parameters)
دي من أهم المهارات اللي بتخلي الكود أسرع وأنظف، لأن أول سطر في الدالة بيوضح بالظبط الدالة دي محتاجة إيه من الأوبجكت، مع تأمين الدالة بـ `= {}` في الآخر عشان لو حد استدعاها فاضية متضربش Error:

<div dir="ltr">

```javascript
// تفكيك الأوبجكت مباشرة على سطر الـ Parameter مع قيم افتراضية + (= {}) للحماية:
function describeStudent({ name = "Unknown", score = 0, city = "Unknown" } = {}) {
  return `${name} scored ${score} in ${city}`;
}

console.log(describeStudent({ name: "Sara", score: 92, city: "Cairo" })); // Sara scored 92 in Cairo
console.log(describeStudent({ name: "Omar" }));                           // Omar scored 0 in Unknown
console.log(describeStudent());                                           // Unknown scored 0 in Unknown
```

</div>

---

### 2. الـ Spread مع المصفوفات + الفرق بين النسخة والمؤشر (Spread with Arrays: Reference vs Copy)
لما بتكتب `const b = a` في المصفوفات أو الكائنات، أنت **معملتش نسخة جديدة**! أنت بس عملت اسم تاني بيشاور على نفس المكان في الذاكرة (Reference/Alias)، فلو عدلت في `b`، المصفوفة الأصلية `a` هتبوظ وتعدل معاها!
الحل هو أخذ **نسخة حقيقية (Copy)** باستخدام الـ **Spread (`...`)**:

<div dir="ltr">

```javascript
const original = ["HTML", "CSS"];

// 1. خطأ شائع (Reference / Alias): نفس المصفوفة باسمين
const alias = original;
alias.push("JS");
console.log(original); // ["HTML", "CSS", "JS"] -> الأصل اتغير!

// 2. الطريقة الصحيحة (Real Copy with Spread):
const copy = [...original];
copy.push("React");
console.log(original); // ["HTML", "CSS", "JS"] -> الأصل سليم متأثرش!

// 3. دمج مصفوفتين أو إضافة عناصر في البداية والنهاية بدون لمس الأصل:
const frontend = ["HTML", "CSS"];
const backend = ["Node", "SQL"];

const fullStack = [...frontend, ...backend];         // دمج مصفوفتين
const withExtra = ["Git", ...frontend, "TypeScript"]; // إضافة في الأول والآخر
```

</div>

---

### 3. الـ Spread مع الكائنات ودمجها (Spread with Objects & Merging)
نفس الفكرة بالظبط مع الـ Objects: بنقدر ناخد نسخة، أو نعدل خاصية، أو نضيف خاصية جديدة، أو ندمج أوبجكتين مع بعض.
> **قاعدة الدمج المهمة (Merge Order):**  
> الخصائص اللي بتيجي **في الآخر (على اليمين)** هي اللي بتكسب وتغطي على اللي قبلها!  
> عشان كده دايماً بنحط الـ `...defaults` الأول، وبعدين الـ `...custom` بعدها عشان تعديلات المستخدم هي اللي تكسب.

<div dir="ltr">

```javascript
const student = { name: "Sara", score: 92 };

// 1. تعديل درجة الطالب في نسخة جديدة بدون تغيير الأصل:
const updatedStudent = { ...student, score: 95 };
console.log(student.score);        // 92 (الأصل سليم)
console.log(updatedStudent.score); // 95 (النسخة الجديدة)

// 2. إضافة خاصية جديدة:
const studentWithId = { ...student, id: "STU-01" };

// 3. دمج أوبجكتين (الإعدادات الافتراضية مع إعدادات المستخدم):
const defaults = { passMark: 60, theme: "light" };
const userCustom = { passMark: 75 };

const finalConfig = { ...defaults, ...userCustom }; // الصح: userCustom في الآخر فيكسب
console.log(finalConfig); // { passMark: 75, theme: 'light' }
```

</div>

---

### 4. تفكيك مصفوفة كمعاملات لدالة (Spread into Function Arguments)
بعض الدوال (زي `Math.max`) مبتقبلش مصفوفة `[10, 50, 30]`، بل عايزة أرقام مفردة جنب بعض `Math.max(10, 50, 30)`. الـ Spread بيفرط المصفوفة ويبعتها كمعاملات منفصلة:

<div dir="ltr">

```javascript
const scores = [70, 95, 82, 60];

console.log(Math.max(scores));    // NaN (لأن Math.max لا تفهم الـ Array مباشرة)
console.log(Math.max(...scores)); // 95  (فرطت المصفوفة إلى: 70, 95, 82, 60)
```

</div>

---

### 5. فخ النسخ السطحي (The Shallow Copy Trap)
الـ Spread (`{ ...obj }`) بينسخ **المستوى الأول فقط (One Level Deep)**!
يعني لو الأوبجكت جواه أوبجكت تاني متداخل (Nested Object)، المستوى الداخلي ده بيفضل مشترك (Shared Reference) بين النسخة والأصل!
وعشان تحل الفخ ده، لازم تعمل Spread للمستوى الداخلي كمان (أو تستخدم `structuredClone(obj)`):

<div dir="ltr">

```javascript
const originalUser = {
  name: "Sara",
  grades: { midterm: 90, final: 94 }
};

// نسخ سطحي (Shallow Copy):
const shallowCopy = { ...originalUser };
shallowCopy.grades.midterm = 0; // كارثة: ده هيغير originalUser.grades.midterm كمان لـ 0!

// الحل الصحيح (نسخ المستوى الداخلي أيضاً):
const safeCopy = {
  ...originalUser,
  grades: { ...originalUser.grades, midterm: 0 }
};
```

</div>

---

### 6. الفرق بين Rest و Spread (إزاي تفرق بينهم في ثانية؟)
هم الاتنين بيتكتبوا تلات نقط `...`، بس الفرق كله في **مكانهم**:
- **Rest (التجميع — Collects many into one):** بيجي **على شمال `=`** (في التفكيك) أو في **تعريف قوس الدالة** `function f(first, ...others)`، ووظيفته يلم الباقي في مصفوفة/أوبجكت، ولازم دايماً يكون **آخر عنصر**.
- **Spread (الفرط/التوزيع — Scatters one into many):** بيجي **على يمين `=`** (جوه `[...arr]` أو `{...obj}`) أو وقت **نداء الدالة** `Math.max(...nums)`، ووظيفته يفرط العناصر.

---

### 7. الوصول الآمن للبيانات والبديل الذكي (`?.` Optional Chaining & `??` Nullish Coalescing)
لما بتتعامل مع بيانات حقيقية فيها نواقص:
1. **`?.` (Optional Chaining):** بتسأل الأول: "هل الجزء اللي على الشمال موجود؟" لو موجود كمل، لو `null` أو `undefined` اقف بهدوء ورجع `undefined` من غير ما تضرب إيرور وتوقف البرنامج.
2. **`??` (Nullish Coalescing):** بتحط قيمة بديلة **فقط** لو القيمة `null` أو `undefined`، وميزتها الجبارة عن `||` إنها **بتحترم رقم `0`** وبتعتبره قيمة صحيحة مش Falsy!

<div dir="ltr">

```javascript
const studentA = { name: "Omar", attendance: 0 }; // معندوش address، وحضوره 0%

// 1. استخدام ?. مع ?? للوصول لـ city بأمان تام في سطر واحد:
const city = studentA.address?.city ?? "Unknown";
console.log(city); // "Unknown" (بدون أي Crash!)

// 2. ليه بنستخدم ?? بدل || مع الأرقام والدرجات؟
console.log(studentA.attendance || 100); // 100 (غلط! لأن || اعتبرت الـ 0 قيمة Falsy فاستبدلتها)
console.log(studentA.attendance ?? 100); // 0   (صح! لأن ?? بتستبدل null و undefined فقط)
```

</div>

---

### 8. اختصارات الكائنات والمفاتيح الديناميكية (Object Shorthand, Computed Keys & `Object.entries`)
1. **Object Shorthand:** لو اسم المتغير هو نفسه اسم الـ Key اللي عايز تحطه في الأوبجكت، اكتبه مرة واحدة بس `{ name, score }` بدل `{ name: name, score: score }`.
2. **Computed Property Names `[key]`:** لو اسم الـ Key متخزن جوه متغير وهيتحدد وقت التشغيل، حطه بين قوسين مربعين `{ [fieldName]: value }`.
3. **`Object.entries(obj)` مع الـ Destructuring:** بتحول الأوبجكت لمصفوفة أزواج `[key, value]` عشان تلف عليه بـ `for...of` بسهولة.

<div dir="ltr">

```javascript
const name = "Ahmed";
const score = 95;
const dynamicKey = "track";

// 1. Object Shorthand + 2. Computed Property Name [dynamicKey]:
const studentObj = {
  name,                  // بدل name: name
  score,                 // بدل score: score
  [dynamicKey]: "Web"    // هيتحول إلى track: "Web"
};

// 3. الدوران على الأوبجكت بـ Object.entries مع التفكيك:
const gradeCounts = { A: 3, B: 2, C: 1 };
for (const [grade, count] of Object.entries(gradeCounts)) {
  console.log(`Grade ${grade} -> ${count} students`);
}
```

</div>

---

## الجزء الثالث (Part 3): Async JS, Call Stack, Timers & The Event Loop

### 1. الكود المتزامن وتجميد المسار بـ `Date.now()` (Synchronous Code & Blocking the Thread)
في أول 3 أيام، كل كود كتبناه كان **متزامن (Synchronous)**؛ يعني بيمشي بالترتيب سطر ورا سطر، والسطر التاني مستحيل يشتغل غير لما السطر الأول يخلص.
المشكلة هنا إن الجافاسكريبت **Single-Threaded (ليها إيد واحدة بس تشتغل بيها)**!
فلو عملنا دالة بتسحب وقت طويل (مثلاً حلقة `while` بتطرح `Date.now() - start` لمدة 3 ثواني):
- في **Node.js**: التيرمينال هيقف تماماً لمدة 3 ثواني ومش هيطبع أي حاجة بعدها غير لما تخلص.
- في **المتصفح (Browser)**: الكارثة أكبر! الصفحة كلها **بتتجمد (Freezes)**، الزراير مبتدوسش، والعدادات بتقف، والمستخدم بيحس إن الموقع هنج.

<div dir="ltr">

```javascript
function blockFor(ms) {
  const start = Date.now();
  while (Date.now() - start < ms) {
    // حلقة مفرغة بتستهلك المعالج وتوقف الخيط الوحيد للجافاسكريبت
  }
}

console.log("1. Before blocking");
blockFor(3000); // البرنامج كله متجمد هنا لمدة 3 ثواني كاملة!
console.log("2. After blocking (appears 3 seconds later)");
```

</div>

---

### 2. الـ Call Stack والـ Stack Overflow (إزاي الجافاسكريبت بترتب تنفيذ الدوال؟)
لما دالة بتنادي دالة تانية، الجافاسكريبت بتحفظ مكانها في قائمة فوق بعضها اسمها **Call Stack** بنظام **LIFO (Last In, First Out — آخر دالة دخلت هي أول دالة تخلص وتخرج)**:
1. لما تنادي `describe("Sara", 92)` -> بتتحط في الـ Stack.
2. ولما `describe` تنادي `letterGrade(92)` -> بتتحط **فوقها** في الـ Stack.
3. لما `letterGrade` تعمل `return "A"` -> بتتشال من الـ Stack (`pop`)، ونرجع نكمل `describe`.

**يعني إيه Stack Overflow؟**
لو عملت دالة بتنادي نفسها للأبد بدون شرط توقف (Infinite Recursion)، الـ Call Stack هيفضل يتملي بدوال فوق بعض من غير ما أي واحدة تعمل `return`، لحد ما الذاكرة تفرقع ويطلع الإيرور الشهير:
`RangeError: Maximum call stack size exceeded`.

<div dir="ltr">

```javascript
function forever() {
  forever(); // بتنادي نفسها للأبد بدون خروج!
}
// forever(); -> RangeError: Maximum call stack size exceeded
```

</div>

---

### 3. المؤقتات: `setTimeout` و `setInterval` (أول كود غير متزامن Asynchronous)
عشان الجافاسكريبت متوقفش البرنامج وهي مستنية وقت يعدي، بتستخدم مؤقتات المتصفح أو Node:
1. **`setTimeout(fn, delayMs)`:** بتسجل الدالة `fn` عشان تشتغل **مرة واحدة فقط** بعد مرور `delayMs` مللي ثانية، وبتكمل الكود اللي بعدها فوراً من غير انتظار!
2. **`setInterval(fn, delayMs)`:** بتشغل الدالة `fn` **بشكل متكرر** كل `delayMs` مللي ثانية، وبترجع رقم `timerId` لازم نستخدمه مع `clearInterval(timerId)` عشان نوقف التكرار وإلا هتفضل شغالة للأبد!

> **حقيقة خطيرة (الوقت المكتوب هو الحد الأدنى فقط — Minimum Delay, Not Exact):**  
> لو كتبت `setTimeout(fn, 100)` وبعدها شغلت كود تقيل بياخد `1000ms` (زي `blockFor(1000)`)، الدالة **مش هتشتغل بعد 100ms**! هتستنى لحد ما الـ `1000ms` يخلصوا والـ Call Stack يفضى، فتشتغل بعد `1001ms`!  
> يعني `100ms` معناها: **"متشتغلش قبل 100ms، واشتغل أول ما المسار يفضى بعدها"**.

<div dir="ltr">

```javascript
console.log("1. Ordering coffee");

// تسجيل مؤقت يشتغل بعد ثانيتين (لا يوقف الكود!)
setTimeout(() => {
  console.log("3. Coffee is ready! (after 2 seconds)");
}, 2000);

console.log("2. Reading a book while waiting");
// الترتيب الفعلي للطباعة: 1 ثم 2 فوراً، وبعد ثانيتين يطبع 3!

// مثال عداد تنازلي بـ setInterval ويتوقف بـ clearInterval:
let count = 3;
const id = setInterval(() => {
  console.log(`Countdown: ${count}`);
  count--;
  if (count === 0) {
    clearInterval(id); // إيقاف التكرار!
    console.log("Lift off!");
  }
}, 1000);
```

</div>

---

### 4. الـ Event Loop — الصورة اللي بتفسر ترتيب تنفيذ أي كود في الجافاسكريبت!
عشان تفهم أي سؤال Interview أو أي كود Async في حياتك، احفظ الـ **4 أجزاء** دول وطريقة حركتهم:

1. **Call Stack (مسرح التنفيذ):** المكان الوحيد اللي الكود بيتنفذ فيه، بيشيل حاجة واحدة بس في اللحظة.
2. **Browser / Node APIs (المساعد الخارجي):** لما الجافاسكريبت تقابل `setTimeout` أو `fs.readFile` أو `fetch`، بتسلم المهمة للـ API الخارجي (بره خيط الجافاسكريبت) وتكمل هي باقي الكود المتزامن.
3. **طوابير الانتظار (Queues):** أول ما المؤقت يخلص أو الملف يتقري، الـ Callback **مبيدخلش يقاطع الكود اللي شغال**! بيقف في طابور انتظار، وعندنا طابورين:
   - **طابور الـ VIP السريع (`Microtask Queue`):** وده بيمشي فيه `queueMicrotask` والـ `Promises`. ليه الأولوية المطلقة!
   - **الطابور العادي (`Task Queue` / `Macrotask Queue`):** وده بيمشي فيه `setTimeout` و `setInterval` و `fs.readFile`.
4. **حارس المرور (`The Event Loop`):** بيبص على الـ Call Stack ويسأل سؤال واحد: **"هل الـ Call Stack فاضي تماماً؟"**
   - لو فاضي: بيدخل **كل اللي في طابور الـ VIP (`Microtask Queue`) بالكامل** الأول، وبعد ما يخلصهم كلهم يدخل **مهمة واحدة (`One Task`)** من الطابور العادي!

> **قاعدة الترتيب الذهبية (احفظها زي اسمك):**  
> **1. كل الكود العادي (`Synchronous`) أولاً**  
> **2. ثم كل طابور الـ VIP (`Microtasks` — مثل `queueMicrotask` و `Promises`)**  
> **3. ثم طابور المهام العادي (`Tasks` — مثل `setTimeout` حتى لو وقتها `0ms`!)**

<div dir="ltr">

```javascript
setTimeout(() => console.log("3. Task (setTimeout 0ms)"), 0);
queueMicrotask(() => console.log("2. Microtask (VIP lane)"));
console.log("1. Sync (runs first on Call Stack)");

// النتيجة الحتمية دائماً:
// 1. Sync (runs first on Call Stack)
// 2. Microtask (VIP lane)
// 3. Task (setTimeout 0ms)
```

</div>

---

## الجزء الرابع (Part 4): Callbacks, Error-First Convention, Callback Hell & Parallel Async

### 1. الفرق بين الـ Callback المتزامن وغير المتزامن، وليه مينفعش نستخدم `return` جوه `setTimeout`؟
- **Sync Callback:** دالة بتمررها لـ `forEach` أو `map`، بتشتغل **فوراً في نفس اللحظة** قبل السطر اللي تحتها.
- **Async Callback:** دالة بتمررها لـ `setTimeout` أو `fs.readFile`، بتشتغل **لاحقاً بعد ما السكريبت كله يخلص**.

**ليه `return` جوه `setTimeout` دايماً بترجع `undefined`؟**
لأن الدالة الخارجية (`getScoreLater`) بتكون خلصت ورجعت `undefined` واتشالت من الـ Call Stack قبل ما المؤقت يرن أصلاً! فلما المؤقت يرن بعد 100ms ويعمل `return 92`، مفيش حد فاضل يستلم القيمة دي.
**الحل:** بدل ما تعمل `return`، بتستلم دالة `callback` في المعاملات، وأول ما النتيجة تجهز تناديها `callback(92)`.

<div dir="ltr">

```javascript
// غلط: محاولة عمل return من داخل مؤقت غير متزامن
function getScoreBroken() {
  setTimeout(() => {
    return 92; // بيرجع للهواء! لأن getScoreBroken خلصت من زمان
  }, 100);
}
console.log(getScoreBroken()); // undefined!

// صح: تمرير دالة callback لاستلام النتيجة أول ما تجهز
function getScoreWorking(callback) {
  setTimeout(() => {
    callback(92); // نبعت النتيجة للـ callback
  }, 100);
}

getScoreWorking((score) => {
  console.log(`Received score asynchronously: ${score}`); // 92
});
```

</div>

---

### 2. قاعدة Node القياسية للأخطاء (Error-First Callbacks `(err, data)`) وليه `try/catch` مبتشتغلش هنا؟
**ليه `try / catch` مبتقدرش تمسك إيرور حصل جوه `setTimeout`؟**
لأن `try / catch` بتمسك الأخطاء اللي بتحصل على الـ Call Stack **دلوقتي حالاً**. لما `setTimeout` بيرمي إيرور بعد 100ms، بلوك الـ `try` بيكون خلص واتشال من الـ Stack من زمان، فالإيرور بيضرب البرنامج كله!

**الحل القياسي في Node.js (Error-First Callback Pattern):**
أي دالة Async بتاخد `callback(err, result)` بحيث **أول معامل دايماً محجوز للخطأ (`err`)**:
- لو العملية **فشلت**: بنبعت `return callback(new Error("..."))`.
- لو العملية **نجحت**: بنبعت `callback(null, data)` (يعني مفيش إيرور `null`، ودي البيانات).

> **عادتين لازم تعملهم في كل Callback في حياتك:**
> 1. أول سطر جوه الـ Callback دايماً: `if (err) return handleError(err);` (كلمة `return` ضرورية عشان الكود ميكملش ويحاول يقرا من `undefined`).
> 2. لما تبلغ عن إيرور جوه دالتك: اكتب `return callback(new Error(...))` عشان الدالة تقف ومتناديش الـ callback مرتين (مرة بالإيرور ومرة بالنجاح!).

<div dir="ltr">

```javascript
function getStudent(id, callback) {
  setTimeout(() => {
    if (id !== 1) {
      // عادتنا الأولى: return قبل callback عند حدوث خطأ
      return callback(new Error(`No student found with id ${id}`));
    }
    // في حالة النجاح: المعامل الأول null، والمعامل الثاني هو البيانات
    callback(null, { id: 1, name: "Sara", score: 92 });
  }, 200);
}

getStudent(1, (err, student) => {
  // عادتنا الثانية: التحقق من الخطأ في أول سطر مع return
  if (err) return console.log("Error:", err.message);
  console.log("Success:", student.name); // Success: Sara
});
```

</div>

---

### 3. المشاكل الثلاثة للـ Callbacks (The Three Problems With Callbacks)
رغم إن الـ Callbacks شغلت Node.js لسنين، إلا إن فيها **3 عيوب قاتلة** (وهي السبب اللي خلى الجافاسكريبت تخترع الـ `Promises` و `async/await` اللي هناخدهم في المحاضرة الجاية):

1. **هرم الهلاك (Callback Hell / The Pyramid of Doom):**
   لما تكون الخطوة التانية معتمدة على نتيجة الخطوة الأولى (هات الطالب -> ثم هات درجاته -> ثم هات الكورس -> ثم هات المدرس)، بتضطر تكتب كل Callback جوه التاني، فالكود بيدخل لليمين على شكل هرم معقد صعب القراءة والتعديل.
2. **تكرار وتشتت معالجة الأخطاء (Scattered Error Handling):**
   في كل مستوى من الهرم لازم تكرر سطر `if (err) return ...`. لو نسيت سطر واحد في النص، الأخطاء هتضيع أو البرنامج هيضرب في حتة غريبة.
3. **فقدان السيطرة (Inversion of Control):**
   لما بتسلم الـ Callback بتاعك لمكتبة خارجية، أنت تحت رحمتها: ممكن تنسى تناديه خالص، أو **تناديه مرتين بالغلط** (فتخصم الفلوس من كارت العميل مرتين!).
   - **إزاي بنحمي نفسنا من النداء المتكرر؟** بنعمل دالة حماية اسمها `once(fn)` باستخدام الـ **Closure (من Day 03)** والـ **Rest/Spread (من Part 2)** تخلي الـ Callback يشتغل **مرة واحدة فقط** مهما اتنادى!

<div dir="ltr">

```javascript
// دالة once لحماية الـ Callback من أن يتم استدعاؤه أكثر من مرة (Inversion of Control Defense)
function once(fn) {
  let called = false;
  return (...args) => {
    if (called) return; // لو اتنادى قبل كده، تجاهل النداء!
    called = true;
    fn(...args);
  };
}
```

</div>

---

### 4. إزاي نفك هرم الـ Callback Hell؟ + الفرق بين التتابع والتوازي (Sequential vs Parallel Async)

**أولاً: تسطيح الهرم (Flattening Callback Hell):**
بدل ما نكتب الدوال جوه بعضها، بنطلع كل خطوة في **دالة مستقلة ليها اسم واضح (Named Function)**، ونمرر دالة نهائية واحدة `done(err, result)` أي خطوة تفشل تبلغها فوراً بـ `if (err) return done(err)`.

**ثانياً: التتابع (Sequential) ضد التوازي (Parallel):**
- **Sequential (واحد ورا التاني):** بنستخدمه لما الخطوة 2 **محتاجة** نتيجة الخطوة 1. لو عندنا 3 طلبات كل واحد بياخد `300ms`، هياخدوا مع بعض `900ms`.
- **Parallel (كلهم مع بعض في نفس اللحظة):** لو عايزين نحمل بيانات 3 طلاب مستقلين عن بعض (`ids = [1, 2, 3]`)، مش منطقي نستنى الأول يخلص عشان نطلب التاني! بنطلق الـ 3 طلبات مع بعض في نفس اللحظة بـ `forEach`، فيخلصوا كلهم في `~300ms` بس!

> **تركتين مهمتين جداً في الكود المتوازي (Parallel Async Rules):**
> 1. **خزن النتيجة بالـ Index (`results[index] = ...`) وليس `results.push(...)`:** لأن الطلب رقم 3 ممكن يخلص أسرع من الطلب رقم 1! التخزين بـ `results[index]` بيحفظ ترتيبهم الأصلي.
> 2. **اعمل عداد (`finished++`) ومتعتدمش على `results.length === ids.length`:** لأن لو الطلب التالت (`index = 2`) خلص الأول، الجافاسكريبت هتخلي `results.length` يساوي `3` رغم إن أول مكانين لسه فاضيين!

<div dir="ltr">

```javascript
// تشغيل عدة طلبات غير متزامنة بالتوازي (Parallel Execution) مع حفظ الترتيب:
function loadAllStudentsParallel(ids, done) {
  const results = [];
  let finished = 0;

  ids.forEach((id, index) => {
    getStudent(id, (err, student) => {
      // 1. نحفظ بالـ index عشان الترتيب ميتلخبطش لو طالب رجع قبل التاني
      results[index] = err ? { id, error: err.message } : student;

      // 2. نزود عداد العمليات المكتملة
      finished++;
      if (finished === ids.length) {
        done(null, results); // كلهم خلصوا!
      }
    });
  });
}
```

</div>

---

### 5. قراءة الملفات الحقيقية في Node.js (`fs.readFile` vs `fs.readFileSync`)
المؤقتات (`setTimeout`) كانت للتدريب، لكن المثال الحقيقي في Node.js هو التعامل مع الملفات عن طريق موديول `fs`:
- **`fs.readFileSync("students.json", "utf8")`:** متزامنة (بتوقف البرنامج كله لحد ما الهارد يرد). مقبولة فقط لو بتقرأ ملف إعدادات صغير أول ما السكريبت يفتح.
- **`fs.readFile("students.json", "utf8", (err, text) => { ... })`:** غير متزامنة (بتشتغل بنظام Error-First Callback)، وهي الأساسية في السيرفرات عشان السيرفر ميقفش ويعطل مئات المستخدمين التانيين وهو بيقرأ ملف لمستخدم واحد.

<div dir="ltr">

```javascript
const fs = require("fs");

// الطريقة غير المتزامنة (Asynchronous Error-First Callback):
fs.readFile("students.json", "utf8", (err, text) => {
  if (err) return console.log(`Failed to read file: ${err.code}`);
  const students = JSON.parse(text);
  console.log(`Loaded ${students.length} students successfully!`);
});
```

</div>

</div>
