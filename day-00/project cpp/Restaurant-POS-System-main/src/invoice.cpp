#include <iostream>
#include <iomanip>
#include <ctime>

#include "../include/invoice.h"
#include "../include/data.h"
#include "../include/jsonManager.h"

float calculateTotal()
{
    float total = 0;
    for (int i = 0; i < SIZE; i++)
    {
        total += price[i] * quantity[i];
    }
    return total;
}

float applyDiscount()
{
    float total = calculateTotal();
    float finalTotal = 0;
    if (total > 300)
    {
        finalTotal = total - (total * 10 / 100);
        return finalTotal;
    }
    else
    {
        return total;
    }
}

void printInvoice()
{
    if (calculateTotal() == 0)
    {
        cout << "Order Is Empty.\n";
        return;
    }
    time_t now = time(0);
    orderDate = ctime(&now);

    cout << "==============================================================\n";
    cout << "                    Restaurant POS System\n";
    cout << "==============================================================\n";
    srand(time(0));
    orderID = rand() % 9000 + 1000;

    cout << "Date: " << orderDate << endl;
    cout << "Order ID: " << orderID << endl
         << endl;

    cout << left
         << setw(5) << "No."
         << setw(22) << "Item"
         << setw(10) << "Price"
         << setw(8) << "Qty"
         << setw(10) << "Total"
         << endl;

    cout << "--------------------------------------------------------------\n";

    for (int i = 0; i < SIZE; i++)
    {
        if (quantity[i] > 0)
        {
            cout << left
                 << setw(5) << i + 1
                 << setw(22) << foodName[i]
                 << setw(10) << fixed << setprecision(2) << price[i]
                 << setw(8) << quantity[i]
                 << setw(10) << quantity[i] * price[i]
                 << endl;
        }
    }

    cout << "--------------------------------------------------------------\n";

    cout << left << setw(45) << "Total:"
         << fixed << setprecision(2)
         << calculateTotal() << "$" << endl;

    if (calculateTotal() > 300)
    {
        cout << left << setw(45) << "Discount (10%):"
             << calculateTotal() * 0.10 << "$" << endl;
    }

    cout << left << setw(45) << "Final Total:"
         << applyDiscount() << "$" << endl;

    cout << "==============================================================\n";
    cout << "                 Thank You For Your Visit!\n";
    cout << "==============================================================\n";
    saveOrder();
}
