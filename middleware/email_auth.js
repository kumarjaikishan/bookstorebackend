const nodemailer = require('nodemailer');
const user = require('../modals/user_schema');

// Create a transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'BookStore07@gmail.com',
    pass: process.env.gmail_password
  }
});


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
        from: 'BookStore <BookStore07@gmail.com>',
        to: query.email,
        subject: 'BookStore || Email Verification',
        // html: `Hi ${query.name}, please <a href="https://esport-backend.vercel.app/verify?id=${query._id}" target="_blank">Click Here</a>  to Verify your Email,   Thanks for Joining Us, from Jai kishan(Developer)`
        html: `<!DOCTYPE html>
        <html lang="en">
        
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta name="x-apple-disable-message-reformatting">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <title></title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
            </style>
        </head>
        
        <body style="width: 100%; padding: 10px;">
            <div class="main" style="width: 600px;  margin: 0 auto;">
                <div style="color: white; border-radius: 10px; width: 100%; height: 60px; background: #2f1c6a; text-align: center;">
                    <h2 style="display: inline-block; vertical-align: middle; height: 100%; width: 60px; line-height: 60px;">Battle</h2>
                    <img src='https://res.cloudinary.com/dusxlxlvm/image/upload/v1710221293/book_efwbft.webp' alt="" style="border-radius: 50%; width: 60px; height: 60px; display: inline-block; vertical-align: middle;">
                    <h2 style="display: inline-block; vertical-align: middle; height: 100%; width: 60px; line-height: 60px;">Fiesta</h2>
                </div>
                <div class="bottomcontent"
                    style="overflow: hidden;text-align: center; border: 1px solid grey; box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.4); margin-top: 10px; border-radius: 10px;">
                    <div class="body"
                        style="width: 100%; background: #2f1c6a; padding: 10px; ">
                        <div
                            style="text-align: center;height: 50px; color: white;">
                            <span style="display: inline-block; height: 100%; vertical-align: middle;">-----------</span>
                            <img src="https://res.cloudinary.com/dusxlxlvm/image/upload/v1709831601/BookStore/assets/email_726623_d6kbjl.png"
                                alt="" style="width: 40px; height: 40px; line-height: 50px;">
                                <span style="display: inline-block; height: 100%; vertical-align: middle;">-----------</span>
                        </div>
                        <h3 style="color: white; text-align: center;">Thanks for Signing up with BookStore!</h3>
                        <h2 style="color: white; text-align: center; margin-top: 8px;">Verify your E-mail Address</h2>
                    </div>
                    <p style="width: 100%;  font-size: 1.2em; text-align: center; letter-spacing: 0.2px; margin-top: 10px;">Hi
                        👋,
                        <span class="name"
                            style="color: #2f1c6a; text-transform: uppercase; font-size: 1.2em; font-weight: 700; letter-spacing: 0.5px;">${query.name}</span>
                    </p>
                    <p style="width: 100%; font-size: 1.2em; text-align: center; letter-spacing: 0.2px; margin-top: 10px; padding: 5px 10px;">
                        You're
                        almost ready to get started. Please click on the button below to verify your email address and enjoy
                        exclusive features with us!</p>
                    <a href="https://esport-backend.vercel.app/verify?id=${query._id}" target="_blank"
                        ><button
                            style="width: 65%; outline: none; cursor: pointer; border: none; padding: 5px; font-size: 1.2em; font-weight: 700; color: white; cursor: pointer; background: #2f1c6a; border-radius: 5px; margin-top: 20px;">Verify
                            Your Email</button></a>
                    <p style="width: 100%;font-size: 1.1em; text-align: center; letter-spacing: 0.2px; margin-top: 5px;">
                        Thanks, BookStore</p>
                    <p
                        style="width: 100%;padding-right: 10px; font-size: 0.8em; text-align: end; letter-spacing: 0.2px; margin-top: 2px;">
                        Developer - Jai Kishan Kumar</p>
                    <div class="links"
                        style="margin-top: 5px; width: 100%; text-align: center; padding: 5px 0px; background: rgba(175, 173, 173, 0.644); ">
                        <a href="http://" target="_blank" rel="noopener noreferrer"  style="cursor: pointer; margin: 0 15px;"><img
                                style="width: 30px; height: 30px; padding: 2px; border: 1px solid #2f1c6a; border-radius: 50%; background: white;"
                                src="https://res.cloudinary.com/dusxlxlvm/image/upload/v1709879629/BookStore/assets/icon/facebook_5968764_aqgopi.png"
                                alt=""></a>
                        <a href="https://www.instagram.com/BookStore" target="_blank" rel="noopener noreferrer"
                            style="cursor: pointer; margin: 0 15px;"><img
                                style="width: 30px; height: 30px; padding: 2px; border: 1px solid #2f1c6a; border-radius: 50%; background: white;"
                                src="https://res.cloudinary.com/dusxlxlvm/image/upload/v1709879531/BookStore/assets/icon/instagram_3955024_vjrnvj.png"
                                alt=""></a>
                        <a href="https://www.youtube.com/@Battle_Fiesta" target="_blank" rel="noopener noreferrer"
                        style="cursor: pointer; margin: 0 15px;"><img
                                style="width: 30px; height: 30px; padding: 2px; border: 1px solid #2f1c6a; border-radius: 50%; background: white;"
                                src="https://res.cloudinary.com/dusxlxlvm/image/upload/v1709879430/BookStore/assets/icon/youtube_3670147_sy7gii.png"
                                alt=""></a>
                        <a href="http://" target="_blank" rel="noopener noreferrer"  style="cursor: pointer; margin: 0 15px;"><img
                                style="width: 30px; height: 30px; padding: 2px; border: 1px solid #2f1c6a; border-radius: 50%; background: white;"
                                src="https://res.cloudinary.com/dusxlxlvm/image/upload/v1709879286/BookStore/assets/icon/email_552486_pbfpji.png"
                                alt=""></a>
                    </div>
                    <footer style="background: #2f1c6a; width: 100%; text-align: center; padding: 10px 0px; color: white;">
                        <h5 style="margin: 0;">Copyrights © BookStore All Rights Reserved</h5>
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