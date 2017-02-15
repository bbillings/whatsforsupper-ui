var express = require('express');
var https = require('https');
var request = require('request');
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
			var opts = {
                host: 'whats-for-supper-service.herokuapp.com',
                port: 443,
                path: '/meal/'+ meal.id + '/recipe',
                method: 'GET'
            };
	        retrieveRecipeAndRenderMealFor(opts, res, meal, 'view-meal');
		});
	}).end();
});

app.get('/edit-meal', function(req, res) {
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
			var opts = {
                host: 'whats-for-supper-service.herokuapp.com',
                port: 443,
                path: '/meal/'+ meal.id + '/recipe',
                method: 'GET'
            };
			retrieveRecipeAndRenderMealFor(opts, res, meal, 'edit-meal');
		});
	}).end();
});

app.post('/save-meal', function(req, res) {
    request.post({
            url:'https://whats-for-supper-service.herokuapp.com/meal',
            'content-type': 'application/json',
            body : JSON.stringify({
                'id' : req.body.mealId,
                'name' : req.body.mealName,
                'description' : req.body.mealDescription
            })
        },
        function (err, httpResponse, body) {
            //do error handling...
            var meal = {
                id : req.body.mealId,
                name : req.body.mealName,
                description : req.body.mealDescription
            };
            var opts = {
                host: 'whats-for-supper-service.herokuapp.com',
                port: 443,
                path: '/meal/'+ req.body.mealId + '/recipe',
                method: 'GET'
            };
            retrieveRecipeAndRenderMealFor(opts, res, meal, 'view-meal');
        }
    );
})

function retrieveRecipeAndRenderMealFor(options, res, meal, mealViewName) {
    https.request(options, function(response) {
        response.setEncoding('utf8');
        response.on('data', function (chunk) {
            let recipe = JSON.parse(chunk);
            res.render(mealViewName, {meal, recipe});
        });
    }).end();
}

app.listen(process.env.PORT || 3000,function(){
  console.log("Live at Port 3000");
});