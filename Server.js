var express = require('express');
var https = require('https');
var app = express();
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
	var options = {
		host: 'whats-for-supper-service.herokuapp.com',
		port: 443,
		path: '/meal',
		method: 'GET'
	};

	https.request(options, function(response) {		
		response.setEncoding('utf8');
		response.on('data', function (chunk) {
			let parsedData = JSON.parse(chunk);
			meals = parsedData._embedded.meal;
			res.render('index', {meals});
		});
	}).end();	    
});

app.get('/meal', function(req, res) {
	var options = {
		host: 'whats-for-supper-service.herokuapp.com',
		port: 443,
		path: '/meal/'+req.query.mealId,
		method: 'GET'
	};

	https.request(options, function(response) {		
		response.setEncoding('utf8');
		response.on('data', function (chunk) {
			let meal = JSON.parse(chunk);
			retrieveRecipeFor(meal, res);				
		});
	}).end();
});

function retrieveRecipeFor(meal, res) {
	var options = {
		host: 'whats-for-supper-service.herokuapp.com',
		port: 443,
		path: '/meal/'+ meal.id + '/recipe',
		method: 'GET'
	};

	https.request(options, function(response) {		
		response.setEncoding('utf8');
		response.on('data', function (chunk) {			
			let recipe = JSON.parse(chunk);
			res.render('view-meal', {meal, recipe});
		});
	}).end();
}

app.listen(process.env.PORT || 3000,function(){
  console.log("Live at Port 3000");
});