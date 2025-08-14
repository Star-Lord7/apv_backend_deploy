import nodemailer from 'nodemailer'

// Configuramos el transporte de nodemailer para enviar correos electrónicos
const emailRegistro = async (datos) => {
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

    // Función para enviar el correo de registro
    // Usamos "transporter.sendMail" para enviar el correo electrónico
    const info = await transporter.sendMail({
        from: '"APV - Administrador de Pacientes de Veterinaria"', // Remitente del correo
        to: email, // Destinatario del correo
        subject: "Confirma tu cuenta en APV", // Asunto del correo
        text: "Confirma tu cuenta en APV", // Texto del correo
        // HTML del correo, incluyendo un enlace para confirmar la cuenta
        html: `<p>Hola ${nombre},</p>
            <p>Tu cuenta ha sido creada correctamente, confirma tu cuenta en el siguiente enlace:</p>
            <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Confirmar Cuenta</a>

            <p>Si no creaste esta cuenta, puedes ignorar este mensaje.</p>`
    });

    console.log("Mensaje enviado: %s", info.messageId); // Mostramos la confirmación del envío del mensaje en el servidor
};

export default emailRegistro