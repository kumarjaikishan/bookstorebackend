const express = require('express');
const app = express();
const emailauth = require('../middleware/email_auth')
const errorHandle = require('../utils/error_util');
const authmiddlewre = require('../middleware/auth_middleware')
const islogin = require('../middleware/islogin_middleware')
const isretailer = require('../middleware/isretailer_middleware')
const roleMidleware = require('../middleware/role_middleware')
const user = require('../controller/user_controller')
const author = require('../controller/aurthor_controller')
const retailer = require('../controller/retailer_contorller')
const admin = require('../controller/admin_controller')
const review = require('../controller/review.controller')
const razor = require('../controller/razorpay_controller')
const router = express.Router();

router.route('/').get((req, res, next) => {
    return res.status(200).json({
      msg: 'Welcome to the Bookstore Backend'
    })
  })

  router.route('/test').get(retailer.test); 
  
  router.route('/signup').post(user.signup, emailauth); 
  router.route('/login').post(emailauth, user.login);
  router.route('/verify').get(user.verify);

  router.route('/createorder').post(razor.createorder);
  router.route('/purchesed').post(authmiddlewre,razor.purchesed);
  
  router.route('/getbooks').get(islogin,retailer.getbooks);
  router.route('/bookdetail/:bookid').get(islogin,retailer.bookdetail);
  router.route('/getbook/:bookid').get(retailer.getbook);
  router.route('/buybook/:bookid').post(authmiddlewre, retailer.buybook);
  router.route('/deletebook').post(retailer.deletebook);
  router.route('/getpurchasebook').get(authmiddlewre, retailer.getpurchasebook);
  
  // router.route('/getusers').get(authmiddlewre, isadmin, admin.getusers);
  router.route('/getusers').get(authmiddlewre, roleMidleware(['admin']), admin.getusers);
  router.route('/edituser').post(authmiddlewre, roleMidleware(['admin']), admin.edituser);
  router.route('/deleteuser').post(authmiddlewre, roleMidleware(['admin']), admin.deleteuser);
  
  // router.route('/getaurthorbooks').get(authmiddlewre, isauthor, author.getAurthorBook);
  router.route('/getaurthorbooks').get(authmiddlewre, roleMidleware(['admin','author']), author.getAurthorBook);
  router.route('/sellhistory').get(authmiddlewre, roleMidleware(['admin','author']), author.sellhistory);
  router.route('/revenuedetail').get(authmiddlewre, roleMidleware(['admin','author']), author.revenuedetail);
  router.route('/createaurthorbooks').post(authmiddlewre, roleMidleware(['admin','author']), author.createAurthorBook);
  
  router.route('/bookreview').post(authmiddlewre,isretailer, review.bookreview);

  module.exports= router;