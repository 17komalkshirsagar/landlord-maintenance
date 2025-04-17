const mailer = require("nodemailer")

interface IEmail {
    to: string
    subject: string
    text?: string;
    html?: string;

}

export const sendEmail = ({ to, subject, text, html }: IEmail) => new Promise((resolve, reject) => {
    const transport = mailer.createTransport({
        auth: {
            user: process.env.FROM_EMAIL,
            pass: process.env.FROM_PASS
        },
        service: "gmail"
    })

    transport.sendMail({
        to,
        subject,
        text,
        html,
    }, (err: Error | null) => {
        if (err) {
            reject("Unable To Send Email" + err.message)
        }
        resolve(true)
    })
})