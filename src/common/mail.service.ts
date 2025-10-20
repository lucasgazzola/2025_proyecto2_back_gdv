import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: '38f723fc615fde',
      pass: 'a59c43cff03082',
    },
  });

  async send(options: { to: string; subject: string; html: string }) {
    await this.transporter.sendMail({
      from: '"Gestor de ventas" <no-reply@GestorVentas.com>',
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
  }
}