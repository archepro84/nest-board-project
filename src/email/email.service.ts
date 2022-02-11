import { Injectable, Logger } from '@nestjs/common';
import * as Mail from 'nodemailer/lib/mailer';
import * as nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class EmailService {
  private transporter: Mail;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'userId',
        pass: 'password',
      },
    });
  }

  async sendMemberJoinVerification(
    emailAddress: string,
    signupVerifyToken: string,
  ) {
    const baseUrl = 'http://localhost:3000';

    const url = `${baseUrl}/users/email-verify?signupVerifyToken=${signupVerifyToken}`;

    const mailOptions: EmailOptions = {
      to: emailAddress,
      subject: 'signup Mail',
      html: `
      Click Signup Button. <br/>
      <form action="${url}" method="POST">
        <button>signup</button>
      </form>
      `,
    };

    Logger.debug(signupVerifyToken);

    return await this.transporter.sendMail(mailOptions);
  }
}
