const sgMail = require( '@sendgrid/mail' );

sgMail.setApiKey( process.env.SENDGRID_API_KEY );

const sendWelcomeEmail = ( email, name ) => {
  sgMail.send({
    to: email,
    from: 'kilted.dev@gmail.com',
    subject: 'Thanks for joining us',
    text: `Salutations, ${ name }. Welcome to the app. We always welcome feedback.`,
  });
};

const sendFarewellEmail = ( email, name ) => {
  sgMail.send({
    to: email,
    from: 'kilted.dev@gmail.com',
    subject: 'We will miss you',
    text: `Valedictions, ${ name }. We will miss you. We hope we were helpful for a time. If there's anything we could have done better, please let us know.`,
  });
};

module.exports = {
  sendWelcomeEmail,
  sendFarewellEmail,
};
