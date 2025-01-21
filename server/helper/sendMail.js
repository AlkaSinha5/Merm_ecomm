import nodemailer from "nodemailer";


export const sendEmail = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "contacthospitaldoctor@gmail.com",
            service: "gmail",
            port: 465,
            secure: true,
            auth: {
                user: "contacthospitaldoctor@gmail.com",
                pass: "vdxu hvgq ucnx xkzc",
            },
        });
    
        const htmlContent = `Hi, Here is your <a href="${text}">Link</a> to reset your password`;
        await transporter.sendMail({
            from: "contacthospitaldoctor@gmail.com",
            to: email,
            subject: subject, 
            html: htmlContent
        });

        console.log("email sent sucessfully");
    } catch (error) {
        console.log(error, "email not sent");
    }
};

