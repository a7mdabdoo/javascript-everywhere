# ملخص Session 05 — من الـ Promises حتى الـ Async/Await

---

## 1. إيه هو الـ Promise وليه اتعمل؟

في **Day 04** كنا بنتعامل مع الـ Asynchronous Code عن طريق **الـ Callbacks**:
> *"خد الفانكشن دي معاك، ولما تخلص العملية ابقى ناديها."*

المشكلة في الطريقة دي:
1. **Callback Hell (هرم العذاب):** لما عملية تعتمد على عملية تانية، بنلاقي الكود دخل في أقواس متداخلة جوه بعضها وشبه المثلث.
2. **فقدان السيطرة (Inversion of Control):** أنت بتسلّم الفانكشن بتاعتك لكود خارجي ومش ضامن هيناديها مرة ولا مرتين ولا هينساها خالص.
3. **تكرار معالجة الأخطاء:** عند كل مستوى لازم نكتب `if (err) return ...`.

### تشبيه الـ Promise (إيصال الكافيه / المطعم):
الـ **Promise** هو ببساطة عبارة عن **إيصال (Receipt)** أو عقد بتستلمه فوراً أول ما تطلب أوردر في كافيه.
- الكاشير مش بيخليك واقف مستني القهوة تخلص في إيدك (Synchronous Blocking).
- هو بيديك إيصال في إيدك فوراً ويقولك: *"اتفضل الإيصال ده بيمثل القهوة بتاعتك في المستقبل"*.
- أنت معاك الإيصال، وبتقرر هتعمل إيه لما القهوة تجهز (تسلسل الأحداث)، أو لو البن خلص (معالجة الخطأ).

---

## 2. حالات الـ Promise التلاتة (The Three States)

الـ Promise في أي لحظة بيكون في حالة واحدة فقط من التلاتة دول:

1. **`pending` (قيد الانتظار):** العملية لسه شغالة وما خلصتش (مثلاً القهوة بتتعمل أو السيرفر بيرد).
2. **`fulfilled` (تم بنجاح):** العملية خلصت بنجاح وبتستلم معاها القيمة أو النتيجة (Value). بيتم الانتقال للحالة دي لما بننادي `resolve(value)`.
3. **`rejected` (فشل):** العملية فشلت لأي سبب (مثلاً الطالب مش موجود أو السيرفر وقع) وبتستلم معاها سبب الخطأ (Reason/Error). بيتم الانتقال للحالة دي لما بننادي `reject(error)`.

> **قاعدة ذهبية (Settles Once):**
> الـ Promise بيستقر (Settles) **مرة واحدة فقط لا غير**. 
> يعني لو ناديت `resolve()` وبعدها `reject()`، أو ناديت `resolve()` مرتين، أول واحدة بس هي اللي بتتحسب والباقي جافاسكريبت بتتجاهله تماماً. وده بيقضي تماماً على مشكلة إن الـ Callback كان ممكن يتنادى بالخطأ أكتر من مرة في Day 04.

---

## 3. إزاي بنعمل Promise جديد؟ (Creation)

بنستخدم الـ Constructor المدمج في جافاسكريبت `new Promise`:

```javascript
// دالة بتعمل تأخير زمني وتتحول لـ Promise نقدر نستناه:
function delay(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(); // العملية تمت بنجاح
    }, ms);
  });
}

// مثال: دالة استرجاع بيانات طالب
function getStudent(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id === 101) {
        resolve({ id: 101, name: "Ahmed", city: "Qena" });
      } else {
        // نصيحة: دايمًا ابعت Error object مش مجرد string عشان تاخد stack trace
        reject(new Error(`لم يتم العثور على طالب برقم ${id}`));
      }
    }, 100);
  });
}
```

---

## 4. إزاي بنتعامل مع نتيجة الـ Promise؟ (Consuming)

بنستخدم تلات دوال أساسية:
- `.then(value => { ... })`: بتتنفذ لو الـ Promise بقى `fulfilled`، وبتاخد القيمة الناتجة.
- `.catch(error => { ... })`: بتتنفذ لو الـ Promise بقى `rejected`، وبتاخد الـ Error.
- `.finally(() => { ... })`: بتتنفذ في كل الحالات (سواء نجح أو فشل)، ومفيدة جداً لعمليات التنظيف (Cleanup) زي قفل اللودينج.

```javascript
getStudent(101)
  .then((student) => {
    console.log(`تم العثور على الطالب: ${student.name}`);
  })
  .catch((err) => {
    console.error(`خطأ: ${err.message}`);
  })
  .finally(() => {
    console.log("انتهت العملية (تنظيف الذاكرة أو إيقاف مؤشر التحميل).");
  });
```

---

## 5. تسلسل الـ Promises وحل Callback Hell (Chaining)

أجمل ميزة في الـ Promise هي الـ Chaining:
بدل ما نحط كول باك جوه كول باك، كل `.then` بترجع Promise جديد، ونستقبله في الـ `.then` اللي بعدها بخط مستقيم ومريح للعين:

```javascript
getStudent(101)
  .then((student) => {
    console.log(`1. جبنا الطالب: ${student.name}`);
    return getScores(student.id); // لازم ترجع Promise عشان اللي بعدك يستناه!
  })
  .then((scores) => {
    console.log(`2. درجات الطالب:`, scores);
    return getCourse("CS-201");
  })
  .then((course) => {
    console.log(`3. الكورس: ${course.title}`);
  })
  .catch((err) => {
    // catch واحدة بس في الآخر بتمسك أي إيرور يحصل في أي خطوة من الخطوات اللي فوق!
    console.error(`حصل مشكلة في السلسلة: ${err.message}`);
  });
```

> **ملحوظة مهمة جداً (The Missing return Bug):**
> لو نسيت تكتب كلمة `return` قبل الفانكشن اللي بترجع Promise جوه `.then`، الخطوة اللي بعدها مش هتستناها وهتاخد `undefined` فوراً!

---

## 6. دوال التجميع للـ Promises (Combinators)

لما بنحب ننفذ كذا Promise مع بعض، عندنا 4 دوال أساسية:

1. **`Promise.all([p1, p2, p3])`:**
   - بيشغلهم بالتوازي وبيستنى لما **الكل ينجح**.
   - لو **واحد بس فشل**، الـ `all` كلها بتفشل فوراً وبترمي الخطأ بتاعه.
   - ممتازة لما تكون العمليات معتمدة على بعض ومحتاج كل الداتا كاملة.

2. **`Promise.allSettled([p1, p2, p3])`:**
   - بيستنى لما **الكل يخلص**، سواء نجح أو فشل.
   - بيرجع لك أراي فيها حالة كل واحد: `{ status: "fulfilled", value }` أو `{ status: "rejected", reason }`.
   - ممتازة للتقارير ولو عندك عملية مش عايزها توقف باقي السيستم (زي جلب حضور الطلاب).

3. **`Promise.race([p1, p2])`:**
   - سباق: بيرجع نتيجة **أول واحد يستقر** (سواء كان نجاح أو فشل).
   - مفيدة جداً لعمل الـ Timeout (سباق بين طلب الداتا ومؤقت 2 ثانية).

4. **`Promise.any([p1, p2])`:**
   - بيدور على **أول واحد ينجح** بس، وبيطنش أي فشل لحد ما يلاقي أول نجاح.
   - لو كلهم فشلوا، بيرمي `AggregateError`.

---

## 7. الانتقال إلى `async / await` (السحر الحقيقي)

رغم إن الـ `.then()` و `.catch()` حلت مشكلة الـ Callbacks، إلا إن شكل الكود لسه فيه Chaining كتير وأقواس.
جافاسكريبت عملت الـ **`async / await`** كـ "Syntactic Sugar" فوق الـ Promises:
- بيخلي الكود الـ Asynchronous يتقرأ ويتكتب زي الكود الـ Synchronous العادي تماماً (سطر ورا سطر من فوق لتحت).
- وبنرجع نستخدم الـ `try / catch / finally` العادية خالص اللي اتعلمناها من أول يوم!

### القواعد الأساسية:
1. **كلمة `async`:** بتتحط قبل أي فانكشن، ووظيفتها إنها تخلي الفانكشن دي **دائماً ترجع Promise**.
2. **كلمة `await`:** ما ينفعش تتكتب إلا جوه فانكشن `async` (أو Top-Level في ملفات الـ ES Modules).
   - وظيفتها: بتوقف تنفيذ الفانكشن دي تحديداً لحد ما الـ Promise يخلص، وبترجع لك القيمة بتاعته مباشرة.
   - **مهم:** هي بتوقف الفانكشن دي بس، لكن مش بتوقف برنامج جافاسكريبت كله ولا بتهنج الـ Event Loop.

### مثال المقارنة:

**باستخدام async / await (الكود نضف وبقى واضح جداً):**
```javascript
async function showStudentReport(studentId) {
  try {
    console.log("جاري تحميل البيانات...");
    
    const student = await getStudent(studentId);
    const scores = await getScores(student.id);
    const course = await getCourse(student.courseId);

    console.log(`الطالب ${student.name} في كورس ${course.title} ودرجاته ${scores.join(", ")}`);
  } catch (err) {
    console.error(`تعذر استخراج التقرير: ${err.message}`);
  } finally {
    console.log("تم إنهاء التقرير.");
  }
}
```

---

## 8. نقط وفخاخ لازم تخلي بالك منها

1. **الترتيب المتتالي مقابل التوازي (Sequential vs Parallel):**
   - لو العمليات مش معتمدة على بعض (مثلاً بجيب 3 طلاب مختلفين)، ما تعملش `await` ورا بعض في لوب عشان ما تضيعش وقت.
   - الأفضل تستخدم `Promise.all` عشان يشتغلوا في نفس اللحظة بالتوازي.
2. **فخ `forEach`:**
   - لما تكتب `[1, 2, 3].forEach(async (id) => { await ... })`، الـ `forEach` مش بتستنى الـ async callback يخلص!
   - الصح: استخدم `for...of` لوب، أو استخدم `Promise.all(arr.map(async ...))`.
3. **`return await` جوه `try / catch`:**
   - لو كتبت `return riskyPromise()` جوه بلوك `try`، الفانكشن هترجع الـ Promise والـ `catch` مش هتمسك الإيرور لو باظ!
   - عشان الـ `catch` تمسك الإيرور، لازم تكتب: `return await riskyPromise()`.
