/******************************************************************************
***
* ITE5315 – Assignment 2
* I declare that this assignment is my own work in accordance with Humber Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name: Rushi Patel__ - Student ID: N01539145__ Date: 27 October 2023
*
*
******************************************************************************
**/
// Import necessary modules for Express
var express = require('express');
var path = require('path');
var app = express();
var fs = require('fs');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const customHelpers = require('./helpers/helpers'); // Update the path accordingly

// Register Handlebars with custom helpers
// app.engine('handlebars', exphbs.engine({ helpers }));
app.engine('.hbs', exphbs.engine({ extname: '.hbs', defaultLayout: "main", helpers: customHelpers }));
// app.set('view engine', 'handlebars');
app.set('view engine', 'hbs');

// Define the port
const port = process.env.port || 3000;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

//changes for step-7
const handlebars = require('handlebars');

// Register a custom Handlebars helper
handlebars.registerHelper('getPropertyWithSpaces', function(object, propertyName) {
  // Replace spaces with underscores in property name
  const modifiedPropertyName = propertyName.replace(/ /g, '_');
  return object[modifiedPropertyName];
});

// store JSON data inside variable globally
const jsonData = fs.readFileSync('SuperSales.json', 'utf8');
  const supersalesData = JSON.parse(jsonData);


// Define a route that renders the 'index.hbs'
app.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

// Define a route for '/users'
app.get('/users', (req, res) =>{
  res.send('respond with a resource');
});

//Step-6[1]
//http://localhost:3000/data

app.get('/alldata', (req, res)=> {
    // Load the JSON file
    fs.readFile(__dirname +'/SuperSales.json', 'utf8', (err, data) =>{
        if (err) {
            console.error(err);
            res.status(500).send('Error loading JSON data');
        } else {
            console.log('JSON data is loaded and ready!');
            
            // Parse JSON data
            const jsonData = JSON.parse(data);
            console.log(jsonData); 
            res.send('JSON data is loaded and ready!');
        }
    });
});
//Step-6[2]
// Define a route for '/data/invoiceNo/:index'
app.get('/data/invoiceNo/:index', (req, res) => {
    const index = req.params.index;
    fs.readFile(__dirname + '/SuperSales.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error loading JSON data');
      } else {
        try {
          const jsonData = JSON.parse(data);
  
          if (!isNaN(index) && index >= 0 && index < jsonData.length) {
            const carSale = jsonData[index];
            // Modify property names with spaces
            carSale['Invoice_ID'] = carSale['Invoice ID'];
            carSale['Customer_Type'] = carSale['Customer type'];
            carSale['Product_Line'] = carSale['Product line'];
            carSale['Unit_price'] = carSale['Unit price'];
            delete carSale['Invoice ID'];
            delete carSale['Customer type'];
            delete carSale['Product line'];
            delete carSale['Unit price'];
            res.render('alldata', { carSale });
          } else {
            res.status(404).send('InvoiceNo not found');
          }
        } catch (error) {
          console.error(error);
          res.status(500).send('Error parsing JSON data');
        }
      }
    });
  });
  
//Step-6[3]
// Define a route for '/search/invoiceID'
app.get('/search/invoiceID',(req, res) =>{
    res.render('form');

});

// Define a route to handle POST request
app.post('/search/invoiceID/result', (req, res) => {
    const invoiceID = req.body.invoiceID; 
  
    // Read the JSON data 
    fs.readFile('SuperSales.json', 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading JSON file:', err);
        res.render('error', { error: 'Error reading JSON file' });
        return;
      }
      try {
        const jsonData = JSON.parse(data);
        let carInfo = null;
        for (const car of jsonData) {
            if (car['Invoice ID'] === invoiceID) {
                carInfo = car;
                break;
            }
        }
        if (carInfo) {
           carInfo['Invoice_ID'] = carInfo['Invoice ID'];
           carInfo['Customer_Type'] = carInfo['Customer type'];
           carInfo['Product_Line'] = carInfo['Product line'];
           carInfo['Unit_price'] = carInfo['Unit price'];
           delete carInfo['Invoice ID'];
           delete carInfo['Customer type'];
           delete carInfo['Product line'];
           delete carInfo['Unit price'];
            res.render('search_invoice', { carInfo });
        } else {
            res.render('error', { error: 'Invoice not found' });
        }
    } catch (error) {
        console.error('Error parsing JSON:', error);
        res.render('error', { error: 'Error parsing JSON data' });
    }
});
});


//Step-6[4]
app.get('/search/productLine', (req, res) => {
    res.render('productLineForm');
});
app.post('/search/productLine/result', (req, res) => {
    const productLine = req.body.productLine;

    // Read the JSON data
    fs.readFile('SuperSales.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading JSON file:', err);
            res.render('error', { error: 'Error reading JSON file' });
            return;
        }
        try {
            const jsonData = JSON.parse(data);

            // Filter data based on the product line
            const matchingProducts = jsonData.filter((product) => product['Product line'] === productLine);

            if (matchingProducts.length > 0) {
                res.render('productLineResult', { matchingProducts });
            } else {
                res.render('error', { error: 'No matching products found for the given product line' });
            }
        } catch (error) {
            console.error('Error parsing JSON:', error);
            res.render('error', { error: 'Error parsing JSON data' });
        }
    });
});

//Step-7
// Define a route to display all sales data
app.get('/viewData', (req, res) => {
    // Read the JSON data from the file (SuperSales.json)
    fs.readFile('SuperSales.json', 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading JSON file:', err);
        res.render('error', { error: 'Error reading JSON file' });
        return;
      }
  
      try {
        let jsonData = JSON.parse(data);
  
        // Modify the JSON data before rendering
        jsonData = jsonData.map(item => {
            item['Invoice_ID'] = item['Invoice ID'];
            item['Customer_Type'] = item['Customer type'];
            item['Product_line'] = item['Product line'];
            item['Unit_price'] = item['Unit price'];
            item['Tax_5'] = item['Tax 5%'];
            item['gross_income'] = item['gross income'];
            delete item['Invoice ID'];
            delete item['Customer type'];
            delete item['Product line'];      
            delete item['Unit price'];
            delete item['Tax 5%'];
            delete item['gross income'];
          return item;
        });
  
        res.render('viewData', { salesData: jsonData });
      } catch (error) {
        console.error('Error parsing JSON:', error);
        res.render('error', { error: 'Error parsing JSON data' });
      }
    });
  });
  
//Step-8

// Define a route for '/viewName'
app.get('/viewName', (req, res) => {
  const salesDataInfo = supersalesData;    
  res.render('viewName', { supersalesData: salesDataInfo });
});


//Step-9

// Define new route for '/updaterating'
app.get('/updaterating', (req,res)=>{
  const salesDataInfo = supersalesData;   
  const modifiedSalesData = salesDataInfo.map((data) => {
      if (data.Rating === 0) {
          data.Rating = 'zero';
      }
      return data;
  }); 
  res.render('updaterating', { supersalesData: modifiedSalesData });
})

// Define a catch-all route for all other routes, which renders the 'error.hbs' template
app.get('*', (req, res) =>{
  res.render('error', { title: 'Error', message:'Wrong Route' });
});

// Start the Express server and listen on the specified port
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})