# 🍽 Restaurant POS System

A simple Restaurant Point of Sale (POS) System built with **C++**.

## Features

- Display restaurant menu
- Add/Edit/Remove orders
- Calculate total & discount
- Print invoice
- Save orders as JSON

## Technologies

- C++
- STL
- nlohmann/json

## Project Structure

```text
Restaurant POS System
│
├── data/
│   └── orders.json
│
├── docs/
│   └── PROJECT_DOCUMENTATION.md
│
├── include/
│   ├── menu.h
│   ├── order.h
│   ├── invoice.h
│   ├── jsonManager.h
│   ├── json.hpp
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

## Build

```bash
g++ src/*.cpp main.cpp -Iinclude -o restaurant.exe
```

## Documentation

See the complete project documentation:

- [Project Documentation](docs/PROJECT_DOCUMENTATION.md)

## Author

Ahmed Mohamed
