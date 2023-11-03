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

const Handlebars = require('handlebars');
Handlebars.registerHelper('ratingHelper', function(rating, options) {
    if (rating !== 0) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

Handlebars.registerHelper('isZeroRating', function(value) {
    return value === "zero";
});
  
module.exports = Handlebars;
