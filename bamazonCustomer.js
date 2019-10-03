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
    showProducts();
  })
};
connect();

const menu = function() {
  inquirer.prompt([
    {
      message: "Menu",
      type: "list",
      choices: ["Purchase", "Show Products", "Exit"],
      name: "choice"
    }
  ]).then ( res => {
    switch(res.choice) {
      case "Purchase":
        purchaseItem();
        break;
      case "Show Products":
        showProducts();
        break;
      case "Exit":
        console.log("Thank you for using BAM-azon!")
        connection.end();
        return;
    }
  }).catch (err => {
    if (err) throw err;
    return;
  })
};

const showProducts = function() {
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
}

const purchaseItem = function() { 
  inquirer.prompt([
    {
      message: "Please type what you want to buy by ID",
      name: "choice",
      validate: function(value) {
        if (!isNaN(value)){
          return true;
        }
        return false;
      }
    },
    {
      message: "How many would you like to buy?",
      name: "qty",
      validate: function(value) {
        if (!isNaN(value)){
          return true;
        }
        return false;
      }
    }
  ]).then(res => {
    var choiceID = res.choice
    connection.query(`SELECT * FROM products WHERE item_id = ?`, choiceID, (err, product) => {
      if (err) throw err;
      const newQty = product[0].stock_quantity - res.qty;
      if (newQty < 0) {
        console.log('\nInsufficent quantity!\n')
        showProducts();
      } else {
        connection.query(`UPDATE products SET stock_quantity = ? WHERE item_id = ?`, [newQty, choiceID], (err, updated) => {
          if (err) throw err;
          printReceipt(product[0].product_name, product[0].price, res.qty);
          showProducts();
        })
      };
    })
  })
};

const printReceipt = (item, itemPrice, qtyPurchased) => {
  console.log('\n-------R E C E I P T-------');
  console.log(`${item} x ${qtyPurchased} @ $${itemPrice}`);
  console.log(`=`)
  console.log(`GRAND TOTAL: $${itemPrice * qtyPurchased}`)
  console.log('----T H A N K | Y O U !----\n');
}