import nodemailer from "nodemailer";

async function sendEmail(dest, subject, message) {
  try {
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",  
      port: 587,               
      secure: false,           
      service: "gmail",        
      auth: {
        user: process.env.SENDER_EMAIL,         
        pass: process.env.SENDER_EMAIL_PASSWORD, 
      },
    });

    const mailOptions = {
      from: `"LearnHub" <${process.env.SENDER_EMAIL}>`,  
      to: [dest],                                      
      subject: subject,                                
      html: message,                                  
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return info;  
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;  
  }
}

export default sendEmail;
