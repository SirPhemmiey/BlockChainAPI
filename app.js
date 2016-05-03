
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , transaction = require('./routes/transaction')
  , cors = require('cors');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
// app.use(cors());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// apis for blockchain transaction
app.get('/',routes.index);
app.post('/createTransaction', transaction.createTransaction);
app.post('/getTransactionHashData/:mutation_hash', transaction.getTransactionHashData);
app.post('/validateTransactionData/:mutation_hash', transaction.validateTransactionData);
app.post('/getMutationHashList', transaction.getMuationHashList);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
