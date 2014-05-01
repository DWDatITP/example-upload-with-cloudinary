var express    = require('express');
var cloudinary = require('cloudinary');
var expressHandlebars = require('express3-handlebars');
var bodyParser = require('body-parser')();
var fileParser = require('connect-multiparty')();
var port = Number(process.env.PORT || 5000);

////////////////
var cloudinaryCredentials = {
  cloud_name: 'ENTER-YOUR-CLOUD-NAME-HERE',
  api_key:    'ENTER-YOUR-API-KEY',
  api_secret: 'ENTER-YOUR-API-SECRET'
};
///////////////

cloudinary.config({
  cloud_name: cloudinaryCredentials.cloud_name,
  api_key:    cloudinaryCredentials.api_key,
  api_secret: cloudinaryCredentials.api_secret
});

var app = express();
app.engine('handlebars', expressHandlebars.create({
  defaultLayout: 'main'
}).engine);
app.set('view engine', 'handlebars');

app.use( bodyParser );

app.get('/', function(req, res){
  res.render('index');
});

app.post('/upload', fileParser, function(req, res){
  console.log('req.files',req.files);
  var imageFile = req.files.image;

  cloudinary.uploader.upload(imageFile.path, function(result){
    console.log('result:',result);

    if (result.url) {
      res.render('upload', {url: result.url});
    } else {
      res.send('did not get url');
    }
  });
});

console.log('App started on port',port);
app.listen(port);
