#include <iostream>
#include <string>
#include <fstream>
#include "../include/json.hpp"
#include "../include/jsonManager.h"
#include "../include/data.h"
#include "../include/invoice.h"

using json = nlohmann::ordered_json;

void saveOrder()
{
    json order;
    float total = calculateTotal();
    float finalTotal = applyDiscount();
    float discount = total - finalTotal;
    int itemsCount = 0;

    for (int i = 0; i < SIZE; i++)
    {
        if (quantity[i] > 0)
        {
            itemsCount++;
        }
    }
    order["orderId"] = orderID;
    order["date"] = orderDate;
    order["itemsCount"] = itemsCount;

    for (int i = 0; i < SIZE; i++)
    {
        if (quantity[i] > 0)
        {
            order["items"].push_back(
                {{"name", foodName[i]},
                 {"price", price[i]},
                 {"quantity", quantity[i]},
                 {"itemTotal", price[i] * quantity[i]}});
        }
    }

    order["total"] = total;
    order["discount"] = discount;
    order["finalTotal"] = finalTotal;

    ofstream file("data/orders.json");

    if (!file.is_open())
    {
        cout << "Error opening orders.json\n";
        return;
    }

    file << order.dump(4);

    file.close();
}
