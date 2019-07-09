const express = require('express');

const app = express();
app.set('view engine', 'pug');
app.use(express.static('assets'));

app.get('/', function(request, response) {
    response.render('index');
});

app.listen(3000);