import nodemailer from "nodemailer";
/*
  Sends an email using nodemailer, Resolves with the info
  of the sent email or throws an error if sending fails.
 */


// Factory method for creating transporters
function EmailTransporterFactory() {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",  
    port: 587,               
    secure: false,           
    service: "gmail",        
    auth: {
      user: process.env.SENDER_EMAIL,         
      pass: process.env.SENDER_EMAIL_PASSWORD, 
    },
  });
}

async function sendEmail(dest, subject, message) {
  try {
    const transporter = EmailTransporterFactory();

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
