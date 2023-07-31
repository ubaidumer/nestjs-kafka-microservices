const sgMail = require('@sendgrid/mail');
import { configService } from '../config/config';

export async function sendMail(email, password) {
  sgMail.setApiKey(configService.get('API_KEY'));
  const msg = {
    to: `${email}`,
    from: 'ali.raza@frizhub.com',
    subject: 'Admin Dashboard Temporary Password',
    text:
      'Your temporary password is:' +
      `"${password}"` +
      '.please try to change your password from admin dashboard as soon as you want.',
  };

  const response = await sgMail.send(msg);
  return response;
}
