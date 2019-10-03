var mysql = require('mysql');
var inquirer = require('inquirer');
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "bamazon"
});

const connect = function() {
  connection.connect( (err) => {
    if (err) throw err;
    console.log('...connected to bamazon database...\n');
    menu();
  })
};
connect();

const menu = () => {
  inquirer.prompt([
    {
      message: "\nMenu Options:",
      type: "list",
      choices: ["1) View Products for Sale", "2) View Low Inventory", "3) Add to Inventory", "4) Add New Product", "Exit"],
      name: "choice"
    }
  ]).then( input => {
    switch(input.choice) {
      case "1) View Products for Sale":
        showProducts();
        break;
      case "2) View Low Inventory":
        viewLowInv();
        break;
      case "3) Add to Inventory":
        addInv();
        break;
      case "4) Add New Product":
        addProduct();
        break;
      case "Exit":
        connection.end();
        return;
    }
  })
};

const showProducts = () => {
  connection.query(`SELECT * FROM products ORDER BY item_id`, (err, products) => {
    if (err) throw err;
    console.log('******************** - P R O D U C T S - *********************')
    for(let i = 0; i < products.length; i++){
      console.log(`ID: ${products[i].item_id} - "${products[i].product_name}" (${products[i].department_name}) -- $${products[i].price} -- Qty: ${products[i].stock_quantity}`)
    }
    console.log(`${products.length} items found.`)
    console.log('**************************************************************')
    menu();``
  })
};

const viewLowInv = () => {
  console.log("View Low Items Here!")
  menu();
};
const addInv = () => {
  console.log("Add Inventory Here!")
  menu();
};
const addProduct = () => {
  console.log("Add Products Here!")
  menu();
};