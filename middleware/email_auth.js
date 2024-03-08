const nodemailer = require('nodemailer');
const user = require('../modals/user_schema');

// Create a transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'battlefiesta07@gmail.com',
    pass: process.env.gmail_password
  }
});

const sendemail = async (receiver, message) => {
  const mailOptions = {
    from: 'BattleFiesta <battlefiesta07@gmail.com>',
    to: receiver,
    subject: 'BattleFiesta || Email Verification',
    text: message
  }

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      res.status(201).json({
        msg: "Email Sent",
      })
    }
  });
}

const emailmiddleware = async (req, res, next) => {
  try {
    const query = await user.findOne({ email: req.body.email });
    // console.log("email auth",query);
    if (!query) {
      return next({ status: 400, message: "User not found" });
    }
    if (query.isverified) {
      next();
    } else {
      const mailOptions = {
        from: 'BattleFiesta <battlefiesta07@gmail.com>',
        to: query.email,
        subject: 'BattleFiesta || Email Verification',
        // html: `Hi ${query.name}, please <a href="https://esport-backend.vercel.app/verify?id=${query._id}" target="_blank">Click Here</a>  to Verify your Email,   Thanks for Joining Us, from Jai kishan(Developer)`
        html: `<!DOCTYPE html>
        <html lang="en">
        
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta name="x-apple-disable-message-reformatting">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <title></title>
            <style type="text/css">
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
        
                body {
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    padding: 10px;
                }
        
                .main {
                    width: 600px;
        
                }
        
                .main header {
                    color: white;
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 5px;
                    background: #2f1c6a;
                    border-radius: 10px;
                }
        
                .main header img {
                    border-radius: 50%;
                    width: 60px;
                }
        
                .bottomcontent {
                    overflow: hidden;
                    border: 1px solid grey;
                    box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.4);
                    margin-top: 10px;
                    border-radius: 10px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
        
                .body {
                    width: 100%;
                    background: #2f1c6a;
                    padding: 10px;
                }
        
                .body div {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 5px;
                    padding: 10px 5px;
                    color: white;
                }
        
                .body img {
                    width: 40px;
                }
        
                .body h3,
                .body h2 {
                    color: white;
                    text-align: center;
                }
        
        
                p {
                    width: 90%;
                    font-size: 1.2em;
                    text-align: center;
                    letter-spacing: 0.2px;
                    margin-top: 10px;
                }
        
                .name {
                    color: #2f1c6a;
                    font-size: 1.2em;
                    font-weight: 700;
                    letter-spacing: 0.5px;
                }
        
                a {
                    width: 65%;
                }
        
                button {
                    width: 100%;
                    outline: none;
                    border: none;
                    padding: 5px;
                    font-size: 1.2em;
                    font-weight: 700;
                    color: white;
                    cursor: pointer;
                    background: #2f1c6a;
                    border-radius: 5px;
                    margin-top: 20px;
                }
        
                .links {
                    margin-top: 5px;
                    width: 100%;
                    padding: 5px 0px;
                    background: rgba(175, 173, 173, 0.644);
                    display: flex;
                    justify-content: center;
                    gap: 20px;
                }
        
                .links i {
                    width: 30px;
                    height: 30px;
                    background: #2f1c6a;
                    text-align: center;
                    border-radius: 50%;
                    line-height: 30px;
                    color: white;
                }
        
                footer {
                    background: #2f1c6a;
                    width: 100%;
                    text-align: center;
                    padding: 10px 0px;
                    color: white;
                }
            </style>
        </head>
        
        <body>
            <div class="main">
                <header>
                    <h3>Battle</h3>
                    <img src='https://res.cloudinary.com/dusxlxlvm/image/upload/v1709654642/battlefiesta/assets/logo/logopng250_vuhy4f.webp'
                        alt="">
                    <h3>Fiesta</h3>
                </header>
                <div class="bottomcontent">
                    <div class="body">
                        <div>
                            <span>-----------</span>
                            <img src="https://res.cloudinary.com/dusxlxlvm/image/upload/v1709831601/battlefiesta/assets/email_726623_d6kbjl.png"
                                alt="">
                            <span>-----------</span>
                        </div>
                        <h3>Thanks for Signing up with BattleFiesta!</h3>
                        <h2>Verify your E-mail Address</h2>
                    </div>
                    <p>Hi 👋, <span class="name">${query.name}</span></p>
                    <p>You're almost ready to get started. Please click on the button below to verify your email address and
                        enjoy
                        exclusive
                        features with us!</p>
                    <a href="https://esport-backend.vercel.app/verify?id=${query._id}" target="_blank"> <button>Verify Your Email</button></a>
                    <p>Thanks,</p>
                    <p>BattleFiesta</p>
                    <div class="links">
                        <i class="fa fa-facebook" aria-hidden="true"></i>
                        <i class="fa fa-instagram" aria-hidden="true"></i>
                        <i class="fa fa-youtube-play" aria-hidden="true"></i>
                        <i class="fa fa-envelope" aria-hidden="true"></i>
                    </div>
                    <footer>
                        <h5>Copyrights © BattleFiesta All Rights Reserved</h5>
                    </footer>
                </div>
        
            </div>
        </body>
        
        </html>`,
      };

      // Send the email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
        } else {
          res.status(201).json({
            msg: "Verify Email, check your inbox",
          })
          console.log('Email sent:', info.response);
        }
      });
    }
  } catch (error) {
    res.status(500).json({
      msg: "something went wrong",
      error
    })
  }
}



module.exports = emailmiddleware;