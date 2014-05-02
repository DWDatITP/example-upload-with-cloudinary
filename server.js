///////////////////////////////////

/* After you create an account at cloudinary.com, fill in the
 * values below with your credentials. */
var cloudinaryCredentials = {
  cloud_name: 'YOUR-CLOUD-NAME',
  api_key:    'YOUR-API-KEY',
  api_secret: 'YOUR-API-SECRET'
};

///////////////////////////////////

var express    = require('express');
var cloudinary = require('cloudinary');
var expressHandlebars = require('express3-handlebars');
var bodyParser = require('body-parser')();
var fileParser = require('connect-multiparty')();
var port = Number(process.env.PORT || 5000);

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
  /* The `req.files` property will be populated because we
   * used the 'fileParser' middleware for this route.
   *
   * The 'name' attribute from the file input in your form will match the
   * property name on `req.files`.
   * So since we have <input type='file' name='image' /> in our form,
   * there is a `req.files.image` property available.
   */
  var imageFile = req.files.image;

  cloudinary.uploader.upload(imageFile.path, function(result){
    /*
     * After a successful upload, the callback's `result` argument
     * will be a hash (javascript object) with a property `url`
     * that you can use to display the uploaded image.
     * To learn more about the format of the `result` hash, see:
     *   http://cloudinary.com/documentation/node_image_upload
     */

    if (result.url) {
      /*
       * This would be a good spot to save this url (perhaps into a
       * mongo database) so that you can display it later.
       */
      res.render('upload', {url: result.url});
    } else {
      /*
       * There was an error and the file did not upload.
       */

      console.log('Error uploading to cloudinary: ',result);
      res.send('did not get url');
    }
  });
});

console.log('App started on port',port);
app.listen(port);
