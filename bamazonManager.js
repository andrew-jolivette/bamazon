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
  connection.query(`SELECT * FROM products WHERE stock_quantity <= 5`, (err, stock) => {
    if (err) throw err;
    if (stock.length === 0) {
      console.log("\n----- NO LOW INVENTORY! -----\n")
    } else {
      console.log('\n********* LOW INVENTORY: *********\n');
      for (let i = 0; i < stock.length; i++){
        const item = stock[i];
        console.log(`ID: ${item.item_id} - "${item.product_name}" - Qty: ${item.stock_quantity}`);
      }
      console.log('\n**********************************\n');
    }
    menu();
  })
};

const addInv = () => {
  connection.query(`SELECT * FROM products`, (err, products) => {
    if (err) throw err;
    console.log('\n************ INVENTORY: **********\n');
    for (let i = 0; i < products.length; i++){
      const item = products[i];
      console.log(`ID: ${item.item_id} - "${item.product_name}" - Qty: ${item.stock_quantity}`);
    }
    console.log('\n**********************************\n');
    inquirer.prompt([
      {
        message: "What product (ID #) would you like to add to?",
        name: "product",
        validate: function(value){
          if (!isNaN(value)){
            return true;
          }
          return false;
        }
      },
      {
        message: "How much would you like to add?",
        name: "qty",
        validate: function(value){
          if(!isNaN(value)){
            return true;
          }
          return false;
        }
      }
    ]).then( update => {
      const id = update.product;
      connection.query(`SELECT * FROM products WHERE item_id = ?`, [id], (err, res) => {
        if (err) throw err;
        const qty = parseInt(res[0].stock_quantity) + parseInt(update.qty);
        connection.query(`UPDATE products SET stock_quantity = ? WHERE item_id = ?`, [qty, id], (err, updated) => {
          if (err) throw err;
          const item = res[0];
          console.log(`\n ***** ID: ${item.item_id} - "${item.product_name}" - UPDATED Qty: ${qty} ***** \n`)
          menu();
        })
      })
    })
  })
};

const addProduct = () => {
  console.log("Add Products Here!")
  menu();
};