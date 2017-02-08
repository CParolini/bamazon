//required packages
var mysql = require("mysql");
var inquirer = require("inquirer");
//variable that will hold our connection information
var connection = mysql.createConnection({
    host: "localhost",
    port: 3000,

    // Your username
    user: "root",

    // Your password
    password: "*********",
    database: "baa"
});
//the display function is used to pull information from my sql table.
function display() {
    connection.query('SELECT item_id, product_name, price, department_name, stock_quantity FROM products', function(error, results) {
        console.log("Here is a list of all merchandise available in our store!");
        console.log("**********************************************************************");
        //loop used to cycle through all items in my inventory
        for (var i = 0; i < results.length; i++) {
            //selected Items will be returned in the console.log
            console.log("Product ID: " + results[i].item_id + "  Product Name: " + results[i].product_name + "  Price: $" + results[i].price + " Department: " + results[i].department_name + " Stock Quantity: " + results[i].stock_quantity);
            console.log("**********************************************************************");

        }
        //Action function called which prompts user questions and takes order/updates inventory
        Action();
    });
};




//Action function will prompt user questions and calculate inventory,etc.  detailed comments below
var Action = function() {
    //Prompts user questions
    inquirer.prompt([{
        name: "product",
        type: "input",
        message: "What is the ID of the product you would like to buy?"
    }, {
        name: "quantity",
        type: "input",
        message: "How many of this item do you want?"
    }]).then(function(answer) {
        //idChosen is set equal to answer.product
        idChosen = answer.product;
        //quantityChosen is set equal to answer.quantity
        quantityChosen = answer.quantity;
        //select product name, price, and stock quantity from the products table for the specific item the user types in
        connection.query('SELECT product_name, price, stock_quantity FROM products WHERE item_id =' + idChosen,
            function(error, results) {
                //var newQuantity is set equal to the current inventory amount minus the quantity of item the user selects
                var newQuantity = results[0].stock_quantity - quantityChosen;
                //if quantity available is less than the user want to buy console.log that there isnt enough inventory
                if (results[0].stock_quantity < quantityChosen) {
                    console.log("There is not enough of this item to fulfill your order.")
                } else {
                    //if the amount of items is available to buy the products table will update the quantity to reflect your purchase
                    connection.query("UPDATE products SET? WHERE?", [{
                        stock_quantity: newQuantity
                    }, {
                        item_id: idChosen
                    }], function(error, results) {});
                    //console logs which will display the total of your order/quantity of items purchased/ and name of product purchased
                    if (quantityChosen === "1") {
                        console.log("Your total is: $" + results[0].price * quantityChosen + ". You have purchased a total of " + quantityChosen + " pair of " + results[0].product_name + "s");
                    } else {
                        console.log("Your total is: $" + results[0].price * quantityChosen + ". You have purchased a total of " + quantityChosen + " pair of " + results[0].product_name + "s");
                    }

                }
            });
    });
}

//display function called to initialize app
display();
