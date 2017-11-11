var mysql = require("mysql");
var inquirer = require("inquirer");


var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    user: "adam",

    password: "password",
    database: "bamazon"
});

connection.connect(function (err) {
    start();
});



function start() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log("productId: " + res[i].item_id + "\nProduct_name: " + res[i].product_name + "\nprice: $" + res[i].price + "\n--------------------");
        }


        inquirer
            .prompt([
                {
                    type: "input",
                    message: "What is the ID of the product you would like to buy?",
                    name: "purchaseId"
                },
                {
                    type: "input",
                    message: "How many units of the product they would like to buy?",
                    name: "units"
                }
            ])
            .then(function (inquirerResponse) {
                var query = connection.query(
                    "SELECT * FROM products WHERE ?",
                    {
                        item_id: inquirerResponse.purchaseId
                    }, function (err, res) {
                        //console.log(res);
                        //target the stockquantity the user selected
                        if (res[0].stock_quantity < inquirerResponse.units) {
                            console.log("sorry we do not have enough supply");
                        } else {
                            var newQuantity = res[0].stock_quantity - inquirerResponse.units;

                            var query = connection.query("UPDATE products SET ? WHERE ?", [
                                {
                                    stock_quantity: newQuantity
                                },
                                {
                                    item_id: inquirerResponse.purchaseId

                                }
                            ]
                            )
                            var billAmount = inquirerResponse.units * res[0].price;
                            console.log("Your price is: " + billAmount);
                            inquirer
                                .prompt([
                                    {
                                        input: "list",
                                        message: "Would you like to purchase this item for $" + billAmount + "? (Y/N)",
                                        name: "yndecision"
                                    }
                                ])
                                .then(function (inquirerResponse) {
                                    if (inquirerResponse.yndecision = "Y") {
                                        console.log("Congrats! Your item is being shipped");
                                    } else {
                                        console.log("Thats fine try another item");
                                    }
                                }
                                )
                        }
                    })
            })
    });
}
