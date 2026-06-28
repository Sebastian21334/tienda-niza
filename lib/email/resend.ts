import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY!)
const FROM = process.env.RESEND_FROM ?? 'onboarding@resend.dev'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL!

export async function sendTwoFactorEmail(code: string) {
  await resend.emails.send({
    from: FROM,
    to: ADMIN_EMAIL,
    subject: `Tu código de acceso: ${code}`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
        <h2 style="font-size:24px;margin-bottom:8px">Código de verificación</h2>
        <p style="color:#666;margin-bottom:24px">
          Ingresá este código para completar el inicio de sesión.
          Expira en <strong>10 minutos</strong>.
        </p>
        <div style="font-size:40px;font-weight:700;letter-spacing:12px;text-align:center;
                    padding:24px;background:#f4f4f4;border-radius:12px;margin-bottom:24px">
          ${code}
        </div>
        <p style="color:#999;font-size:13px">
          Si no intentaste iniciar sesión, ignorá este correo.
        </p>
      </div>
    `,
  })
}

export async function sendLoginNotificationEmail(ip?: string) {
  await resend.emails.send({
    from: FROM,
    to: ADMIN_EMAIL,
    subject: 'Nuevo inicio de sesión en tu panel',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
        <h2 style="font-size:24px;margin-bottom:8px">Inicio de sesión detectado</h2>
        <p style="color:#666">
          Se registró un nuevo inicio de sesión en el panel de administración.
        </p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0">
          <tr>
            <td style="padding:8px 0;color:#999;font-size:13px">Fecha y hora</td>
            <td style="padding:8px 0;font-size:13px">${new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })}</td>
          </tr>
          ${ip ? `<tr><td style="padding:8px 0;color:#999;font-size:13px">IP</td><td style="padding:8px 0;font-size:13px">${ip}</td></tr>` : ''}
        </table>
        <p style="color:#999;font-size:13px">
          Si fuiste vos, podés ignorar este correo. Si no reconocés este acceso,
          cambiá tu contraseña inmediatamente.
        </p>
      </div>
    `,
  })
}

export async function sendPasswordResetEmail(resetLink: string) {
  await resend.emails.send({
    from: FROM,
    to: ADMIN_EMAIL,
    subject: 'Restablecer contraseña',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
        <h2 style="font-size:24px;margin-bottom:8px">Restablecer contraseña</h2>
        <p style="color:#666;margin-bottom:24px">
          Recibimos una solicitud para restablecer la contraseña de tu cuenta.
          Este link expira en <strong>30 minutos</strong>.
        </p>
        <a href="${resetLink}"
           style="display:inline-block;padding:12px 24px;background:#000;color:#fff;
                  text-decoration:none;border-radius:8px;font-weight:500">
          Restablecer contraseña
        </a>
        <p style="color:#999;font-size:13px;margin-top:24px">
          Si no solicitaste esto, ignorá este correo. Tu contraseña no cambiará.
        </p>
      </div>
    `,
  })
}
