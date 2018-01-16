var express = require('express');
var app = express();
var port = process.env.PORT || 8080;

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) =>{
    res.sendfile('./public/LearningPath.html')
})
console.log("Served at: http://localhost:" + port);
app.listen(port);