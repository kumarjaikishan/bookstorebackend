const express = require('express');
const app = express();
const emailauth = require('../middleware/email_auth')
const errorHandle = require('../utils/error_util');
const authmiddlewre = require('../middleware/auth_middleware')
const isadmin = require('../middleware/isadmin_middleware')
const isauthor = require('../middleware/isauthor_middleware')
const isretailer = require('../middleware/isretailer_middleware')
const user = require('../controller/user_controller')
const author = require('../controller/aurthor_controller')
const retailer = require('../controller/retailer_contorller')
const admin = require('../controller/admin_controller')
const review = require('../controller/review.controller')
const router = express.Router();

router.route('/').get((req, res, next) => {
    return res.status(200).json({
      msg: 'Welcome to the Bookstore Backend'
    })
  })
  
  router.route('/signup').post(user.signup, emailauth);    //used
  router.route('/login').post(emailauth, user.login);      //used
  router.route('/verify').get(user.verify);
  
  router.route('/getbooks').get(retailer.getbooks);
  router.route('/bookdetail/:bookid').get(retailer.bookdetail);
  router.route('/getbook/:bookid').get(retailer.getbook);
  router.route('/buybook/:bookid').post(authmiddlewre, retailer.buybook);
  router.route('/deletebook').post(retailer.deletebook);
  router.route('/getpurchasebook').get(authmiddlewre, retailer.getpurchasebook);
  
  router.route('/getusers').get(authmiddlewre, isadmin, admin.getusers);
  router.route('/edituser').post(authmiddlewre, isadmin, admin.edituser);
  
  router.route('/getaurthorbooks').get(authmiddlewre, isauthor, author.getAurthorBook);
  router.route('/sellhistory').get(authmiddlewre, isauthor, author.sellhistory);
  router.route('/revenuedetail').get(authmiddlewre, isauthor, author.revenuedetail);
  router.route('/createaurthorbooks').post(authmiddlewre, isauthor, author.createAurthorBook);
  
  router.route('/bookreview').post(authmiddlewre,isretailer, review.bookreview);

  module.exports= router;