import nodemailer from 'nodemailer';

const SMTP_USER="9946d5001@smtp-brevo.com";
const SMTP_PASSWORD="k62djLQ71vRBtDZ0";
const transporter=nodemailer.createTransport({
    host:'smtp-relay.brevo.com',
    port: 587,

    auth:{
        user:SMTP_USER,
        pass:SMTP_PASSWORD,
    }
});

export default transporter;