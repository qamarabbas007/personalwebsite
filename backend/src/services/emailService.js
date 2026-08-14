const nodemailer = require("nodemailer");
const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, NOTIFY_EMAIL } = require("../config/env");

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT) || 587,
  secure: Number(SMTP_PORT) === 465,
  auth: { user: SMTP_USER, pass: SMTP_PASS },
});

const sendMail = async ({ to, subject, html }) => {
  if (!SMTP_USER || !SMTP_PASS) {
    console.warn("SMTP not configured - skipping email send:", subject);
    return;
  }
  try {
    await transporter.sendMail({ from: `"Qamar Abbas Portfolio" <${SMTP_USER}>`, to, subject, html });
  } catch (error) {
    console.error("Email send failed:", error.message);
  }
};

const notifyAdminNewMessage = async (message) => {
  await sendMail({
    to: NOTIFY_EMAIL || SMTP_USER,
    subject: `New project request from ${message.name}`,
    html: `
      <h3>New Contact / Project Request</h3>
      <p><strong>Name:</strong> ${message.name}</p>
      <p><strong>Email:</strong> ${message.email}</p>
      <p><strong>Project Type:</strong> ${message.projectType || "N/A"}</p>
      <p><strong>Budget:</strong> ${message.budget || "N/A"}</p>
      <p><strong>Message:</strong></p>
      <p>${message.message}</p>
    `,
  });
};

const sendClientConfirmation = async (message) => {
  await sendMail({
    to: message.email,
    subject: "Thanks for reaching out to Qamar Abbas",
    html: `
      <p>Hi ${message.name},</p>
      <p>Thanks for your message — I usually reply within 24 hours. Here's a copy of what you sent:</p>
      <blockquote>${message.message}</blockquote>
      <p>Best,<br/>Qamar Abbas</p>
    `,
  });
};

module.exports = { sendMail, notifyAdminNewMessage, sendClientConfirmation };
