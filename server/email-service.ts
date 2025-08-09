import { MailService } from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
  console.warn("SENDGRID_API_KEY não encontrada. Emails não serão enviados.");
}

const mailService = new MailService();
if (process.env.SENDGRID_API_KEY) {
  mailService.setApiKey(process.env.SENDGRID_API_KEY);
}

interface EmailParams {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  if (!process.env.SENDGRID_API_KEY) {
    console.log('Email não enviado - SENDGRID_API_KEY não configurada:', params);
    return false;
  }

  try {
    await mailService.send({
      to: params.to,
      from: params.from,
      subject: params.subject,
      text: params.text,
      html: params.html,
    });
    console.log('Email enviado com sucesso para:', params.to);
    return true;
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    return false;
  }
}

export async function sendPrayerRequest(
  subject: string, 
  content: string, 
  userEmail?: string, 
  userName?: string
): Promise<boolean> {
  const emailContent = `
    <h2>Novo Pedido de Oração</h2>
    <p><strong>Assunto:</strong> ${subject}</p>
    <p><strong>Conteúdo:</strong></p>
    <p>${content.replace(/\n/g, '<br>')}</p>
    ${userEmail ? `<p><strong>Email do usuário:</strong> ${userEmail}</p>` : ''}
    ${userName ? `<p><strong>Nome do usuário:</strong> ${userName}</p>` : ''}
    <hr>
    <p><em>Enviado através do aplicativo Fé em Jesus BR</em></p>
    <p><em>Data: ${new Date().toLocaleString('pt-BR')}</em></p>
  `;

  return await sendEmail({
    to: 'faithinjesuseua@gmail.com',
    from: 'noreply@feemjesus.replit.app', // Use um domínio verificado no SendGrid
    subject: `Pedido de Oração: ${subject}`,
    html: emailContent,
    text: `Novo Pedido de Oração\n\nAssunto: ${subject}\n\nConteúdo: ${content}\n\nEnviado através do aplicativo Fé em Jesus BR\nData: ${new Date().toLocaleString('pt-BR')}`
  });
}