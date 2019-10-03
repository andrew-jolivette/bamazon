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