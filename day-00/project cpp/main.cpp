#include <iostream>
#include <limits>
#include "./include/menu.h"
#include "./include/order.h"
#include "./include/invoice.h"
#include "./include/jsonManager.h"

using namespace std;

int main()
{
    displayMenu();

    cout << "\nChoice Your Order:\n";
    addOrder();

    while (true)
    {
        cout << "\n===================================\n"
             << endl;
        cout << "1 - Edit Order" << endl;
        cout << "2 - Print Invoice" << endl;

        cout << "\n===================================\n"
             << endl;
        cout << "Enter Your Choice: ";

        int choice;
        cin >> choice;

        if (choice == 1)
        {
            removeOrder();
        }
        else if (choice == 2)
        {
            printInvoice();
            break;
        }
        else
        {
            cout << "Invalid Choice, Please Try Again.\n";
        }
    }

    


    cout << "\nPress Enter to Exit...";
    cin.ignore(numeric_limits<streamsize>::max(), '\n');
    cin.get();

    return 0;
}