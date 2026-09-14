// Type declarations for backend environment when node_modules is not locally installed in backend root
declare const process: {
  env: {
    [key: string]: string | undefined;
    NODE_ENV?: string;
    PORT?: string;
    MONGODB_URI?: string;
    JWT_SECRET?: string;
    SMTP_USER?: string;
    SMTP_PASS?: string;
    SMTP_FROM?: string;
  };
};

declare module 'nodemailer' {
  export interface SendMailOptions {
    from?: string;
    to?: string;
    subject?: string;
    text?: string;
    html?: string;
    [key: string]: any;
  }

  export interface Transporter {
    sendMail(options: SendMailOptions): Promise<{ messageId: string; [key: string]: any }>;
  }

  export function createTransport(config: any): Transporter;
  
  const nodemailer: {
    createTransport(config: any): Transporter;
  };
  export default nodemailer;
}
