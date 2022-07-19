var express =  require("express");
var app = express();
var bodyParser = require("body-parser");
var toobusy = require('node-toobusy');
var serveStatic = require('serve-static')
var path = require('path')
const rateLimit = require("express-rate-limit");
require('dotenv').config();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(function(req, res, next) {
  if (toobusy()) res.status(503).send("I'm busy right now, sorry.");
  else next();
});
app.disable('x-powered-by');
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});
app.use(serveStatic(path.join(__dirname, 'frontend')))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(limiter);
app.set('view engine', 'ejs');


app.get('/', async (req, res) => {
  res.render('index/index')
})

app.get('/leo-ethereum', async (req, res) => {
  res.render('leo-ethereum/leo')
})

app.get('/leo-bsc', async (req, res) => {
  res.render('leo-bsc/leo')
})

app.get('/leo-polygon', async (req, res) => {
  res.render('leo-polygon/leo')
})

app.get('/hbd-polygon', async (req, res) => {
  res.render('hbd-polygon/hbd')
})

app.get('/hive-polygon', async (req, res) => {
  res.render('hive-polygon/hive')
})

app.get('/sps-polygon', async (req, res) => {
  res.render('sps-polygon/sps')
})

app.get('/hive-bsc', async (req, res) => {
  res.render('hive-bsc/hive')
})

app.get('/hbd-bsc', async (req, res) => {
  res.render('hbd-bsc/hbd')
})

app.get("/wleo", (req, res) => { res.redirect(301, "/leo-ethereum") })
app.get("/bleo", (req, res) => { res.redirect(301, "/leo-bsc") })
app.get("/polygon", (req, res) => { res.redirect(301, "/leo-polygon") })
app.get("/hbd", (req, res) => { res.redirect(301, "/hbd-polygon") })
app.get("/hive", (req, res) => { res.redirect(301, "/hive-polygon") })
app.get("/sps", (req, res) => { res.redirect(301, "/sps-polygon") })

app.listen(8080)
