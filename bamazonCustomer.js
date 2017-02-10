//required packages
var mysql = require("mysql");
var inquirer = require("inquirer");
//variable that will hold our connection information
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    // password: "pw",
    database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connection success!");
    display();
});

var display = function() {
    var queryString = 'SELECT item_id, product_name, price, department_name, stock_quantity FROM products';
    connection.query(queryString, function(err, results) {
        console.log("Merchandise List");
        //loop used to cycle through all items in my inventory
        for (var i = 0; i < results.length; i++) {
            //selected Items will be returned in the console.log
            console.log(results[i].item_id + " || " + results[i].product_name + " || " + results[i].price + " || " + results[i].department_name + " || " + results[i].stock_quantity + "\n");
        }
        prompt(results);
    });
};

var prompt = function(results) {
    inquirer.prompt([{
        type: 'input',
        name: 'choice',
        message: 'What item do you want to purchase? (Quit with Q)'
    }]).then(function(answer) {
        var correct = false;
        for (var i = 0; i < results.length; i++) {
            if (results[i].product_name === answer.choice) {
                correct = true;
                var product = answer.choice;
                var id = i;
                inquirer.prompt({
                    type: 'input',
                    name: 'quant',
                    message: 'How many do you want?',
                    validate: function(value) {
                        if (isNaN(value) === false) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                }).then(function(answer) {
                    if ((results[id].stock_quantity - answer.quant) > 0) {
                        connection.query("UPDATE products SET stock_quantity='" + (res[id].stock_quantity - answer.quant) + "'Where product_name'" + product + "'", function(err, results2) {
                            console.log('Product Bought');
                            display();
                        });
                    } else {
                        console.log("Not a valid selection");
                        prompt(results);
                    }
                });
            }
        }
    });
};
