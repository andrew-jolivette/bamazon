USE bamazon;

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES 
  ("Laptop", "Electronics", 1500, 50),
  ("Xbox One", "Electonics", 400, 50),
  ("Playstation 4", "Electonics", 400, 50),
  ("Cutting Board", "Kitchen", 20, 200),
  ("Silverware Set", "Dining", 30, 150),
  ("Sharpie Marker", "Office Supplies", 5, 1000),
  ("Travel Coffee Mug", "Kitchen", 25, 200),
  ("King Bedsheets", "Bedroom", 50, 100),
  ("Coding King Hoodie", "Apparel", 50, 200),
  ("Black Socks", "Apparel", 15, 500);
  
  UPDATE products SET stock_quantity = 50 - 1 WHERE item_id = 1;
  
  select * from products;
  
  