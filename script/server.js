var connect = require('connect');
var serveStatic = require('serve-static');

var app = connect();

app.use(serveStatic('J:\_Работа\Программирование\_Museum', {'index': ['index.html']}));
app.listen(3000);