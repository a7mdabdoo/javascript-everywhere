#include <iostream>

#include "../include/menu.h"
#include "../include/data.h"

using namespace std;

void displayMenu()
{
     cout << "\n============= Restaurant POS System =========\n"
          << endl;
     cout << "\n==================== MENU ====================\n"
          << endl;
     for (int i = 0; i < SIZE; ++i)
     {
          cout << i + 1 << " - " << foodName[i] << " "
               << price[i] << "$" << endl;
     }
}
