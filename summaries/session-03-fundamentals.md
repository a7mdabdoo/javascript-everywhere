<div dir="rtl">

# Session 03 - Functions, Scope & Hoisting

## 1. ما هي الدالة (Function) ولماذا نستخدمها؟
الدالة هي عبارة عن **كتلة برمجية (Block of Code)** قابلة لإعادة الاستخدام، بتاخد مدخلات (Inputs)، بتعمل عليها عمليات معينة، وبترجع مخرجات (Outputs).

### فوائد الدوال:
- **منع تكرار الكود (DRY - Don't Repeat Yourself):** بدل ما تكرر نفس اللوجيك في 3 أماكن، بتكتبه مرة واحدة وتستدعيه وقت ما تحب.
- **مكان واحد للإصلاح والتعديل:** لو حبيت تغير شرط النجاح مثلاً، بتعدله في مكان واحد فقط بدلاً من تعديله في كل ملفات المشروع.
- **تنظيم الكود:** جعل الكود مقروء ومقسم لمسؤوليات واضحة.

### قاعدة تسمية الدوال:
- الدوال العادية بتتبع أسلوب **`camelCase`** (أول حرف صغير، وكل كلمة جديدة تبدأ بحرف كبير مثل: `calculateTotal`, `getUserData`, `greet`).
- أسلوب **`PascalCase`** (أول حرف كبير مثل: `User`, `Student`) بيُستخدم فقط مع الـ Classes والـ Constructor Functions.

---

## 2. طرق تعريف واستدعاء الدوال

### 1) Function Declaration (التعريف التقليدي):
بتكون مرفوعة بالكامل في الذاكرة (Hoisted)، يعني تقدر تستدعيها في أي سطر حتى **قبل** سطر تعريفها:

<div dir="ltr">

```javascript
// الاستدعاء قبل التعريف مسموح
greet("Ahmed"); // Hello, Ahmed!

function greet(name) {
  return `Hello, ${name}!`;
}
```

</div>

---

### 2) Function Expression (دالة مخزنة في متغير):
هنا الدالة مجهولة الاسم (Anonymous) ومتخزنة جوة متغير، ولا يمكن استدعاؤها إلا **بعد** سطر تعريفها:

<div dir="ltr">

```javascript
const calc = function () {
  return 20;
};

console.log(calc()); // 20
```

</div>

---

### 3) Arrow Function (الدالة السهمية):
طريقة حديثة ومختصرة (ES6)، وهي الطريقة الافتراضية لكتابة الدوال القصيرة:

<div dir="ltr">

```javascript
// لو المحتوى تعبير واحد، نقدر نشيل الأقواس {} وكلمة return (إرجاع ضمني Implicit Return):
const double = (number) => number * 2;

// لو أكثر من سطر، بنحط {} ولازم نكتب return صريحة:
const multiply = (a, b) => {
  const result = a * b;
  return result;
};
```

</div>

> **تنبيه مهم جداً عند إرجاع كائن (Object) في سطر واحد:**  
> لو كتبت: `const createUser = (name) => { name: name };`  
> الجافاسكريبت هتفهم إن `{}` دي هي جسم الدالة (Function Body) وهيطلعلك خطأ!  
> **الحل الصحيح:** تحوّط الـ Object بأقواس عادية `( )` بالشكل ده:
>
> <div dir="ltr">
>
> ```javascript
> const createUser = (name) => ({ name: name });
> // أو بالاختصار:
> const createUserShort = (name) => ({ name });
> ```
>
> </div>

---

## 3. المعاملات (Parameters vs Arguments)

- **Parameter:** هو الاسم اللي بنحطه في سطر تعريف الدالة كـ (Placeholder).
- **Argument:** هو القيمة الحقيقية اللي بنمررها وقت استدعاء الدالة.

<div dir="ltr">

```javascript
function add(a, b) { // a, b -> Parameters
  return a + b;
}

add(5, 10); // 5, 10 -> Arguments
```

</div>

### القيم الافتراضية (Default Parameters):
بنحدد قيمة افتراضية للمعامل في حال لم يتم تمرير قيمة له.
- **تنبيه:** القيمة الافتراضية بتشتغل فقط لو المعامل **`undefined`** (يعني ماتبعتش).
- لو بعت **`null`** أو **`0`** أو **`""`** (نص فارغ)، الدالة هتعتبرهم قيم حقيقية ومش هتفعل الـ Default!

<div dir="ltr">

```javascript
function greetUser(name = "Guest") {
  return `Welcome, ${name}!`;
}

greetUser();          // "Welcome, Guest!"
greetUser(undefined); // "Welcome, Guest!"
greetUser(null);      // "Welcome, null!" (الافتراضي لا يعمل مع null)
```

</div>

### المعامل المتبقي (Rest Parameters `...rest`):
بيجمع أي عدد من المدخلات الإضافية في **مصفوفة حقيقية (Array)**.

**شروطه:**
1. لازم يكون **آخر معامل** في الدالة.
2. لا يمكن كتابة أكثر من Rest Parameter واحد في نفس الدالة.

<div dir="ltr">

```javascript
function sumAll(...numbers) {
  let total = 0;
  for (const n of numbers) {
    total += n;
  }
  return total;
}

sumAll(1, 2, 3);        // 6
sumAll(10, 20, 30, 40); // 100
```

</div>

---

## 4. الفرق بين `return` و `console.log`

- **`console.log`:** وظيفتها عرض رسالة للإنسان في شاشة التيرمينال أو المتصفح، ولكنها **لا ترجع أي قيمة** للبرنامج (بترجع `undefined`).
- **`return`:** بترجع قيمة لباقي البرنامج عشان تقدر تخزنها في متغير أو تعمل عليها عمليات حسابية، وتنهي تنفيذ الدالة فوراً.

<div dir="ltr">

```javascript
function addBad(a, b) {
  console.log(a + b);
}

function addGood(a, b) {
  return a + b;
}

const x = addBad(2, 3) * 2;  // NaN (لأن addBad رجعت undefined)
const y = addGood(2, 3) * 2; // 10 (النتيجة الصحيحة)
```

</div>

### شروط الحماية (Guard Clauses):
بدل ما نعمل `if / else` متداخلة يصعب قراءتها، بنفحص الأخطاء والحالات غير الصالحة في أول الدالة ونخرج بـ `return` فوراً:

<div dir="ltr">

```javascript
function checkGrade(score) {
  // Guard Clauses في البداية
  if (typeof score !== "number" || Number.isNaN(score)) return "Not a number";
  if (score < 0 || score > 100) return "Out of range";

  // المسار السليم الصافي (Happy Path)
  return score >= 60 ? "Pass" : "Fail";
}
```

</div>

---

## 5. نطاق المتغيرات (Scope)
**الـ Scope** هو إجابة سؤال: *من المكان اللي الكود واقف فيه دلوقتي، إيه المتغيرات المتاحة والمسموح لي استخدامها؟*

1. **Global Scope (عام):** المتغيرات المعرفة خارج أي دالة أو block، ومتاحة في أي مكان في الملف.
2. **Function Scope (خاص بالدالة):** المتغيرات المعرفة داخل دالة، ومستحيل الوصول إليها من خارج الدالة.
3. **Block Scope (خاص بالكتلة):** المتغيرات المعرفة بـ `let` و `const` داخل أي أقواس `{}` (زي if أو for)، ولا يمكن الوصول إليها خارج هذه الأقواس.
   - **تنبيه:** `var` لا تحترم الـ Block Scope وتتسرب لخارجه، عشان كده تم استبدالها بـ `let` و `const`.

### سلسلة النطاقات (Scope Chain):
البحث دايماً بيكون **من الداخل إلى الخارج**:
الدالة الداخلية تقدر تشوف متغيرات الدالة الخارجية والمتغيرات الـ Global، لكن العكس مستحيل!

<div dir="ltr">

```javascript
const globalVar = "Global";

function outer() {
  const outerVar = "Outer";

  function inner() {
    const innerVar = "Inner";
    console.log(globalVar); // ✅ متاح
    console.log(outerVar);  // ✅ متاح
    console.log(innerVar);  // ✅ متاح
  }

  inner();
  // console.log(innerVar); // ❌ خطأ: لا يمكن الوصول إليه من الخارج
}
```

</div>

### حجب المتغيرات (Shadowing):
لو عندك متغير داخلي بنفس اسم متغير خارجي، المتغير الداخلي "بيحجب" الخارجي داخل نطاقه فقط دون تغيير قيمة الخارجي:

<div dir="ltr">

```javascript
const status = "online";

function check() {
  const status = "offline"; // Shadowing
  console.log(status);      // "offline"
}

check();
console.log(status); // "online" (المتغير الخارجي لم يتأثر)
```

</div>

---

## 6. الـ Hoisting والـ Temporal Dead Zone (TDZ)

**الـ Hoisting** هي عملية يقوم بها محرك جافاسكريبت قبل تشغيل الكود، حيث يقرأ الملف ويسجل كل التعريفات في الذاكرة أولاً.

| نوع التعريف | هل يتم رفعه (Hoisted)؟ | هل يمكن استخدامه قبل سطره؟ | النتيجة لو جربت تستخدمه قبل سطره |
|---|:---:|:---:|---|
| **`function` (Declaration)** | نعم (الاسم والجسم) | نعم ✅ | يشتغل طبيعي بدون أي خطأ |
| **`var`** | نعم (الاسم فقط) | نعم ولكن ⚠️ | يرجع `undefined` ويسبب أخطاء صامتة |
| **`let` و `const`** | نعم (في الـ TDZ) | لا ❌ | يعطي `ReferenceError` صريح |
| **Arrow Function (`const f = ...`)** | نعم (كـ const في الـ TDZ) | لا ❌ | يعطي `ReferenceError` صريح |

### ما هي الـ Temporal Dead Zone (TDZ)؟
هي الفترة الزمنية بين بداية الـ Block وحتى السطر اللي بيتم فيه إعطاء المتغير قيمة ابتدائية. محاولة الوصول للمتغير خلال هذه الفترة تسبب `ReferenceError`. ودي ميزة في اللغة بتمنع الأخطاء الصامتة!

---

## 7. الـ Closures (الدالة التي تتذكر)
**الـ Closure:** هي قدرة الدالة الداخلية على تذكر واستخدام المتغيرات الموجودة في بيئتها الأصلية (النطاق الخارجي)، حتى **بعد انتهاء تنفيذ الدالة الخارجية ومسحها من الذاكرة**.

<div dir="ltr">

```javascript
function makeCounter() {
  let count = 0; // سيبقى في الذاكرة بسبب الدالة الداخلية

  return function () {
    count++;
    return count;
  };
}

const counter1 = makeCounter();
console.log(counter1()); // 1
console.log(counter1()); // 2

const counter2 = makeCounter();
console.log(counter2()); // 1 (عداد مستقل تماماً)
```

</div>

### مصنع الدوال (Function Factory):
تطبيق رائع للـ Closures هو إنشاء دوال مخصصة بمدخلات مسبقة:

<div dir="ltr">

```javascript
function makeMultiplier(factor) {
  return (number) => number * factor;
}

const double = makeMultiplier(2);
const triple = makeMultiplier(3);

console.log(double(5)); // 10
console.log(triple(5)); // 15
```

</div>

---

## 8. الـ Callbacks (تمرير الدوال)
في جافاسكريبت، الدوال تعتبر قيم من الدرجة الأولى (First-Class Citizens)، يعني تقدر تخزنها في متغير، وترسلها كمعامل (Argument) لدالة أخرى.

الدالة التي تُمرر لدالة أخرى تُسمى **Callback Function**:

<div dir="ltr">

```javascript
function repeat(n, action) {
  for (let i = 1; i <= n; i++) {
    action(i);
  }
}

// تمرير Callback كدالة سهمية
repeat(3, (num) => console.log(`Step ${num}`));
// Step 1
// Step 2
// Step 3
```

</div>

> ⚠️ **قاعدة ذهبية:** مرر الدالة كاسم (`action`)، ولا تستدعيها (`action()`)!  
> استدعاء الدالة بالأقواس ينفذها فوراً ويمرر ناتجها بدلاً من تمرير الدالة نفسها.

</div>
