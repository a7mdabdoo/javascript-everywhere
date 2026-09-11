# Task 1: Type Coercion Predictions

### 1. `"5" + 3`
- **Prediction:** `"53"`
- **Actual:** `"53"`

---

### 2. `"5" - 3`
- **Prediction:** `2`
- **Actual:** `2`

---

### 3. `5 + true`
- **Prediction:** `6`
- **Actual:** `6`

---

### 4. `"5" === 5`
- **Prediction:** `false`
- **Actual:** `false`

---

### 5. `"5" == 5`
- **Prediction:** `true`
- **Actual:** `true`

---

### 6. `typeof null`
- **Prediction:** `"object"`
- **Actual:** `"object"`

---

### 7. `typeof []`
- **Prediction:** `"object"`
- **Actual:** `"object"`

---

### 8. `0 || "default"`
- **Prediction:** `"default"`
- **Actual:** `"default"`

---

### 9. `0 ?? "default"`
- **Prediction:** `0`
- **Actual:** `0`

---

### 10. `Boolean("")`
- **Prediction:** `false`
- **Actual:** `false`

---

### 11. `Boolean("false")`
- **Prediction:** `true`
- **Actual:** `true`

---

### 12. `Boolean([])`
- **Prediction:** `true`
- **Actual:** `true`

---

### 13. `10 % 3`
- **Prediction:** `1`
- **Actual:** `1`

---

### 14. `null + 1`
- **Prediction:** `1`
- **Actual:** `1`

---

### 15. `undefined + 1`
- **Prediction:** `1`
- **Actual:** `NaN`
- **Reason:** In numeric operations, `undefined` converts to `NaN` (unlike `null` which converts to `0`), and any math with `NaN` results in `NaN`.
