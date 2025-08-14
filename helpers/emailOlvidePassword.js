import nodemailer from 'nodemailer'

// Configuramos el transporte de nodemailer para enviar correos electrónicos
const emailOlvidePassword = async (datos) => {
    // Configuración del transporte de nodemailer
    var transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    // Desestructuramos los datos necesarios para el correo electrónico
    const { email, nombre, token } = datos;

    // Función para enviar el correo electrónico de restablecimiento de contraseña
    // Usamos "transporter.sendMail" para enviar el correo electrónico
    const info = await transporter.sendMail({
        from: '"APV - Administrador de Pacientes de Veterinaria"', // Remitente del correo
        to: email, // Destinatario del correo
        subject: "Reestablece tu Password", // Asunto del correo
        text: "Reestablece tu Password", // Texto del correo
        // HTML del correo, incluyendo un enlace para reestablecer la contraseña
        html: `<p>Hola ${nombre},</p>
            <p>Has solicitado reestablecer tu password, haz clic en el siguiente enlace:</p>
            <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer Password</a>

            <p>Si no creaste esta cuenta, puedes ignorar este mensaje.</p>`
    });

    console.log("Mensaje enviado: %s", info.messageId); // Mostramos la confirmación del envío del mensaje en el servidor
};

export default emailOlvidePassword