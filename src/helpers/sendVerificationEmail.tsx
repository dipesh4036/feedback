import nodemailer from 'nodemailer';

// Function to send the verification email
export async function sendVerificationEmail(username: string, otp: string, email: string) {

  // Create a Nodemailer transporter
  var transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "0a267e7bd1b2d4", // Your Mailtrap user
      pass: "fb2deca9bd6493"  // Your Mailtrap pass
    }
  });

  // Set up the email options with plain HTML (inline styles simulating Tailwind CSS)
  const mailOptions = {
    from: "sandbox.smtp.mailtrap.io", // Use the same sender email (Mailtrap or other SMTP service)
    to: email,             // Recipient email address
    subject: 'Your Verification Code',
    html: `
      <!DOCTYPE html>
      <html lang="en" dir="ltr">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verification Code</title>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f7f7f7;
              color: #333;
            }
            .email-container {
              width: 100%;
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              border-radius: 8px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
              padding: 24px;
            }
            h2 {
              font-size: 24px;
              font-weight: bold;
              color: #333;
              margin-bottom: 16px;
            }
            p {
              font-size: 16px;
              line-height: 1.5;
              color: #555;
              margin-bottom: 16px;
            }
            .otp {
              font-size: 28px;
              font-weight: bold;
              color: #61dafb;
              margin-bottom: 24px;
            }
            .footer {
              font-size: 14px;
              text-align: center;
              color: #777;
              margin-top: 32px;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <h2>Hello ${username},</h2>
            <p>Thank you for registering. Please use the following verification code to complete your registration:</p>
            <p class="otp">${otp}</p>
            <p>If you did not request this code, please ignore this email.</p>
            <div class="footer">
              <p>&copy; 2023 Your Company. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  // Send the email
  try {
    const info = await transport.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return true;  // Email was sent successfully
  } catch (error) {
    console.error('Error sending email:', error);
    return false;  // Email sending failed
  }
}
