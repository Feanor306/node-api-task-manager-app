const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'feanor306@gmail.com',
        subject: 'Welcome to the task app!',
        text: `Welcome to the app, ${name}. Let us know if you like it!`
    })
}

const sendCancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'feanor306@gmail.com',
        subject: 'Goodbye!',
        text: `Goodbye, ${name}. Let us know why you left!`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}