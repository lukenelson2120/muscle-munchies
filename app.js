// use express
const express = require('express');
const app = express();

// use mongoose
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI); //ds033709.mlab.com:33709/heroku_swnm5vwg); //("mongodb://localhost:27017/muzzlemunchies"); //4z

// use body parser
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//






// emailer
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
   user: 'muscle.munchies1@gmail.com',
   pass: 'Protein12345'
//     user: 'lukenelson2120@gmail.com',
//     pass: 'Lionlion99'
  }
 // tls: { rejectUnauthorized: false }
});


// use ejs
app.set('view engine', 'ejs');
app.use( express.static(__dirname + "/static"));
const orderJS = require('./static/order.js');
// set port
// var server_host = process.env.YOUR_HOST || '0.0.0.0';
const port = process.env.PORT || 3000;


// // set up mongoose variables

// products
let productSchema = new mongoose.Schema ({
  image: String,
  productName: String,
  productDescript: String,
  ingredients: String,
  price: Number,
  status: Boolean
});

let finalOrderSchema = new mongoose.Schema ({
  name: String,
  phone: Number,
  email: String,
  order: String,
  price: Number,
  location: String,
  requests: String,
  paid: String
});

let product = mongoose.model("Product", productSchema);
let order = mongoose.model("Order", finalOrderSchema);

app.get('/', (req, res) => {
      res.render('pages/index', {
      });
});
app.get('/about', (req, res) => {
      res.render('pages/about', {
      });
});

app.get('/order', (req,res)=> {
  product.find((err,products) => {
    res.render('pages/order', {
      productList: products,

      //what variables do you want
    });
});

});
app.get('/cart', (req,res)=> {
  order.find((err, orders) => {
    res.render('pages/cart', {
      orderList: orders,
      //what variables do you want
    });
});

});

// admin .ejs page
app.get('/adminF', (req, res)=> {
  order.find((err,orders) => {
  product.find((err,products) => {
    res.render('pages/adminF', {
      productList: products,
      orderList: orders
      //what variables do you want
    });
  });
});
});

// ADMIN FUNCTIONS
  // Add a product
app.post("/addproduct", (req, res) => {
    var newProduct = new product(req.body);
    newProduct.save()
      .then (item => {
      //  console.log(item);
        res.redirect('/adminF');
      })
      .catch(err => {
        res.status(400).send("Data failed to be saved");
      });
});
  // Activate a product
app.post("/updateproduct", (req,res) => {
      product.findOne({productName: req.body.productName}, function(err, prod){
        if(err) alert(err);
        prod.status = req.body.status;

        prod.save()
          .then (item => {
            res.redirect('/adminF');

          })
          .catch(err => {
            res.status(400).send("Data failed to be updated");
          });
      });
});

 // Edit
app.post("/editproduct", (req,res) => {
  console.log(req.body.property);
  console.log(parseInt(req.body.value));
 switch(req.body.property) {
//       'status':
//       product.findOne({productName: req.body.productName}, function(err, prod){
//         if(err) alert(err);
//         prod.status = JSON.parse(req.body.value);
//        break;

      case 'ingredients':
         product.findOne({productName: req.body.productName}, function(err, prod){
           if(err) alert(err);
          prod.ingredients = req.body.value;
                    editProduct(prod);
        })
        break;

        case 'price':
           product.findOne({productName: req.body.productName}, function(err, prod){
           if(err) alert(err);
          prod.price = parseInt(req.body.value);

                    editProduct(prod);
        })
         break;

         case 'description':
         product.findOne({productName: req.body.productName}, function(err, prod){
           if(err) alert(err);
          prod.productDescript = req.body.value;
                    editProduct(prod);
          })
          break;

          case 'image':
         product.findOne({productName: req.body.productName}, function(err, prod){
           if(err) alert(err);
          prod.image = req.body.value;
                    editProduct(prod, res);
          })
          break;
         }
            res.redirect('/adminF');
            res.status(400).send("Data failed to be updated");
     });
  function editProduct(prod, res) {
    prod.save()
      .then (item => {
        res.redirect('/adminF');

      })
      .catch(err => {
        res.status(400).send("Data failed to be updated");
      });
  }


  // deleting products
app.post("/deleteproduct", (req,res) => {
  product.deleteOne({productName: req.body.name}, function(err){
    if(err) {
      alert(err);
      return; }
  res.redirect('/adminF');
  });
});




app.post("/addorder", (req,res) => {

  var newOrder = new order(req.body);
  var confirmationEmail = {
    from: 'muscle.munchies1@gmail.com',
     to: req.body.email,
    subject: 'Muscle Munchies',
    text: 'test' //req.body.name + ', Your order is computed and will be ready for pick up at ' + req.body.location + ' when it has been made. An email will be sent when you can pick it up. Total cost will be $' + req.body.price
  }
   var orderEmail = {
    from: 'muscle.munchies1@gmail.com',
     to: 'muscle.munchies1@gmail.com',
    subject: 'Muscle Munchies',
    text: 'test'//'An order has been made under the name' + req.body.name + ' and will be picked up at ' + req.body.location + '. The total order is made up of '+ req.body.order + 'and costs ' +req.body.price + '. Special requests are as follows ' + req.body.requests +'. For any other info see the order page.' 
  }
  console.log(req.body.price);
  newOrder.save()
    .then (item => {
      transporter.sendMail(confirmationEmail, function(error, info){
          if (error) {
             res.send(error);
          } else {
          }
        });
    transporter.sendMail(orderEmail, function(error, info){
          if (error) {
            res.send(error);
          } else {
          }
        });
  //  res.redirect('/');
    })
    .catch(err => {
      res.status(400).send("Data failed to be saved");
    });
});

// deleting order
app.post("/deleteorder", (req,res) => {
order.deleteOne({email: req.body.email}, function(err){
  var finalEmail = {
    from: 'muscle.munchies1@gmail.com',
     to: req.body.email,
    subject: 'Muscle Munchies',
    text: 'Your order is ready for pick up.'
  }
  if(err) {
    alert(err);
    return;
  } else {
    transporter.sendMail(finalEmail, function(error, info){
        if (error) {
        } else {
        }
      });
  }
res.redirect('/adminF');
});
});

app.post("/payorder", (req,res) => {
order.findOne({email: req.body.email}, function(err, ord){
  ord.paid = req.body.paid;
  ord.save()
    .then (item => {
      res.redirect('/adminF')
    })
    .catch(err => {
      res.status(400).send("Data failed to be saved");
    });
});
});

app.listen(port, () => {
  console.log("server started on " + port);
});
