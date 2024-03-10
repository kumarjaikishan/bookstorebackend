const express = require('express');
const cors = require('cors');
const app = express();
const user = require('./controller/user_controller')
const emailauth = require('./middleware/email_auth')
const authmiddlewre = require('./middleware/auth_middleware')
require('./conn/conn');
const errorHandle = require('./utils/error_util');
const author = require('./controller/aurthor_controller')
const retailer = require('./controller/retailer_contorller')
const router = express.Router();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use(router);
app.use(errorHandle);

router.route('/').get((req,res,next)=>{
  return res.status(200).json({
    msg:'Welcome to the Bookstore Backend'
   })
})

router.route('/signup').post(user.signup, emailauth);    //used
router.route('/login').post(emailauth, user.login);      //used
router.route('/verify').get(user.verify);  

router.route('/getbooks').get(retailer.getbooks);  
router.route('/getbook/:bookid').get(retailer.getbook);  
router.route('/buybook/:bookid').post(authmiddlewre,retailer.buybook);  
router.route('/deletebook').post(retailer.deletebook);  
router.route('/getpurchasebook').get(authmiddlewre,retailer.getpurchasebook);  


router.route('/getaurthorbooks').get(authmiddlewre,author.getAurthorBook);  
router.route('/createaurthorbooks').post(authmiddlewre,author.createAurthorBook);  

app.use((req, res, next) => {
    res.status(404).json({ message: 'Route not found, kindly Re-Check api End point' });
  });

app.listen(port, () => {
    console.log(`server listening at ${port}`);
  })


