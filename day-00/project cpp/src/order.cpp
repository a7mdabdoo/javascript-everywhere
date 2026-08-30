#include <iostream>

#include "../include/order.h"
#include "../include/data.h"

using namespace std;

void displayCurrentOrder()
{

    cout << "\n============= Current Order ==========\n"
         << endl;
    for (int i = 0; i < SIZE; i++)
    {
        if (quantity[i] > 0)
        {
            cout << i + 1 << " - " << foodName[i]
                 << " " << price[i] << "$"
                 << " x " << quantity[i]
                 << " = " << quantity[i] * price[i] << "$" << endl;
        }
    }
    cout << "\n===================================\n"
         << endl;
}

void addOrder()
{
    int choice;
    int orderQuantity;

    while (true)
    {
        cout << "\nChoose Item Number (1:8) or 0 to Continue: ";
        cin >> choice;

        if (choice == 0)
        {
            break;
        }

        if (choice < 1 || choice > SIZE)
        {
            cout << "Invalid Choice , Please Try Again (1:8)" << endl;
            continue;
        }

        cout << "Enter Quantity: ";
        cin >> orderQuantity;

        if (orderQuantity <= 0)
        {
            cout << "Invalid Quantity , Please Try Again" << endl;
            continue;
        }

        quantity[choice - 1] += orderQuantity;

        cout << orderQuantity << " " << foodName[choice - 1] << " Added Successfully!" << endl;
    }
}

void removeOrder()
{
    bool found = false;

    for (int i = 0; i < SIZE; i++)
    {
        if (quantity[i] > 0)
        {
            found = true;
            break;
        }
    }

    if (!found)
    {
        cout << "Your Order Is Empty." << endl;
        return;
    }
    displayCurrentOrder();

    cout << "\n============= Edit Order ==========\n"
         << endl;
    cout << "0 - Back" << endl;
    cout << "1 - Change Quantity" << endl;
    cout << "2 - Remove Item" << endl;
    cout << "3 - Clear Order" << endl;
    cout << "4 - Skip" << endl;
    cout << "\n===================================\n"
         << endl;

    while (true)
    {
        cout << "Enter Your Choice From 0 To 4: ";
        int choice;
        cin >> choice;
        if (choice == 0)
        {
            addOrder();
            return;
        }
        else if (choice == 1)
        {
            cout << "Choose Item Number (1:8): ";
            int choice2;
            cin >> choice2;

            if (choice2 < 1 || choice2 > SIZE)
            {
                cout << "Invalid Choice, Please Try Again." << endl;
                continue;
            }

            if (quantity[choice2 - 1] == 0)
            {
                cout << "Item Not Found In Your Order." << endl;
                continue;
            }

            cout << "Current Quantity: " << quantity[choice2 - 1] << endl;
            cout << "Enter Quantity To Change: ";

            int quantity2change;
            cin >> quantity2change;

            if (quantity2change <= 0)
            {
                cout << "Invalid Quantity." << endl;
                continue;
            }

            quantity[choice2 - 1] = quantity2change;

            cout << "Quantity Changed Successfully." << endl;
            displayCurrentOrder();

            continue;
        }
        else if (choice == 2)
        {

            cout << "Choose Item Number (1:8): ";
            int choice2;
            cin >> choice2;

            if (choice2 < 1 || choice2 > SIZE)
            {
                cout << "Invalid Choice, Please Try Again." << endl;
                continue;
            }

            if (quantity[choice2 - 1] == 0)
            {
                cout << "Item Not Found In Your Order." << endl;
                continue;
            }

            cout << "Current Quantity: " << quantity[choice2 - 1] << endl;
            cout << "Enter Quantity To Remove: ";

            int quantity2remove;
            cin >> quantity2remove;

            if (quantity2remove <= 0)
            {
                cout << "Invalid Quantity." << endl;
                continue;
            }

            if (quantity2remove >= quantity[choice2 - 1])
            {
                quantity[choice2 - 1] = 0;
            }
            else
            {
                quantity[choice2 - 1] -= quantity2remove;
            }

            cout << "Item Removed Successfully." << endl;

            displayCurrentOrder();

            continue;
        }
        else if (choice == 3)
        {
            for (int i = 0; i < SIZE; i++)
            {
                quantity[i] = 0;
            }

            cout << "Order Cleared Successfully." << endl;

            return;
        }

        else if (choice == 4)
        {
            cout << "Order Skipped Successfully." << endl;
            break;
        }
        else
        {
            cout << "Invalid Choice." << endl;

            displayCurrentOrder();

            continue;
        }
    }
}
