# Restaurant POS System Documentation

## Project Overview

A simple Restaurant POS (Point of Sale) System built using C++.

The system allows the user to:

- Display the restaurant menu.
- Add items to an order.
- Edit the current order.
- Remove items.
- Calculate the total price.
- Apply discount automatically.
- Print a formatted invoice.
- Save the order as a JSON file.

---

# Program Flow

```
Start

↓

Display Menu

↓

Add Order

↓

Main Options

1. Edit Order
2. Print Invoice

↓

Exit
```

---

# Project Structure

```
Restaurant POS System
│
├── data/
│   └── orders.json
│
├── include/
│   ├── menu.h
│   ├── order.h
│   ├── invoice.h
│   ├── jsonManager.h
│   └── data.h
│
├── src/
│   ├── menu.cpp
│   ├── order.cpp
│   ├── invoice.cpp
│   ├── jsonManager.cpp
│   └── data.cpp
│
├── main.cpp
└── README.md
```

---

# Variables

| Variable | Type | Description |
|----------|------|-------------|
| foodName | string[] | Menu item names |
| price | float[] | Price of each item |
| quantity | int[] | Ordered quantity |
| total | float | Total bill |
| discount | float | Discount amount |
| choice | int | User menu choice |
| itemNumber | int | Selected menu item |
| orderQuantity | int | Quantity entered by user |
| orderID | int | Random invoice ID |
| orderDate | string | Current date and time |
| SIZE | const int | Number of menu items |

---

# Functions

| Function | Responsibility |
|----------|----------------|
| displayMenu() | Display restaurant menu |
| addOrder() | Add items to the order |
| removeOrder() | Edit or remove items |
| displayCurrentOrder() | Display ordered items |
| calculateTotal() | Calculate total price |
| applyDiscount() | Apply discount |
| printInvoice() | Print formatted invoice |
| saveOrder() | Save order to JSON |

---

# Business Rules

- User can order multiple items.
- User can edit the order at any time.
- User can remove items.
- Invalid menu numbers are rejected.
- Invalid quantities are rejected.
- Discount is applied automatically.
- Invoice includes all ordered items.
- Every invoice has:
  - Random Order ID
  - Current Date & Time
  - Total
  - Discount
  - Final Total

---

# JSON Output

Example:

```json
{
    "orderID": 4821,
    "date": "Sat Jul 18 23:15:30 2026",
    "itemsCount": 3,
    "items":
    [
        {
            "name":"Chicken",
            "price":90,
            "quantity":2,
            "itemTotal":180
        }
    ],
    "total":180,
    "discount":18,
    "finalTotal":162
}
```

---

# Libraries Used

## Standard Library

- iostream
- string
- iomanip
- fstream
- ctime

## External Library

- nlohmann/json

---

# What I Learned

During this project I learned:

- Splitting a C++ project into `.h` and `.cpp` files.
- Organizing project folders.
- Using Header Files.
- Using `iomanip`
  - setw()
  - left
  - right
  - fixed
  - setprecision()
- Working with `ctime`
  - time()
  - ctime()
- Generating random Invoice IDs.
- Reading/Writing files using `fstream`.
- Using the `nlohmann/json` library.
- Saving structured data as JSON.
- Building a complete console application using C++.