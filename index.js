const express = require('express');
const cors = require('cors');
const app = express();
const user = require('./controller/user_controller')
const emailauth = require('./middleware/email_auth')
require('./conn/conn');
const router = express.Router();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use(router);

router.route('/').get((req,res,next)=>{
  return res.status(200).json({
    msg:'Welcome to the Bookstore Backend'
   })
})

router.route('/signup').post(user.signup, emailauth);    //used
router.route('/login').post(emailauth, user.login);      //used
router.route('/verify').get(user.verify);  

app.use((req, res, next) => {
    res.status(404).json({ msg: 'Route not found, kindly Re-Check api End point' });
  });

app.listen(port, () => {
    console.log(`server listening at ${port}`);
  })


