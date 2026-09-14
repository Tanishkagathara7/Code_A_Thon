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

declare module 'bcryptjs' {
  export function hash(s: string, salt: number | string): Promise<string>;
  export function hashSync(s: string, salt?: number | string): string;
  export function compare(s: string, hash: string): Promise<boolean>;
  export function compareSync(s: string, hash: string): boolean;
  export function genSalt(rounds?: number): Promise<string>;
  export function genSaltSync(rounds?: number): string;
  const bcrypt: {
    hash: typeof hash;
    hashSync: typeof hashSync;
    compare: typeof compare;
    compareSync: typeof compareSync;
    genSalt: typeof genSalt;
    genSaltSync: typeof genSaltSync;
  };
  export default bcrypt;
}

declare module 'jsonwebtoken' {
  export interface SignOptions {
    expiresIn?: string | number;
    [key: string]: any;
  }
  export function sign(payload: string | Buffer | object, secretOrPrivateKey: string | Buffer, options?: SignOptions): string;
  export function verify(token: string, secretOrPublicKey: string | Buffer, options?: any): any;
  export function decode(token: string, options?: any): any;
  const jwt: {
    sign: typeof sign;
    verify: typeof verify;
    decode: typeof decode;
  };
  export default jwt;
}

declare module 'express' {
  export interface Request {
    headers: Record<string, string | string[] | undefined>;
    query: Record<string, any>;
    params: Record<string, any>;
    body: any;
    file?: any;
    files?: any;
    [key: string]: any;
  }
  export interface Response {
    status(code: number): this;
    json(data: any): this;
    send(data: any): this;
    sendFile(path: string): this;
    setHeader(name: string, value: any): this;
    [key: string]: any;
  }
  export type NextFunction = (err?: any) => void;
  export type RequestHandler = (req: Request, res: Response, next: NextFunction) => any;
  export function Router(): any;
  const express: any;
  export default express;
}

declare module 'express-rate-limit' {
  import { RequestHandler } from 'express';
  export interface Options {
    windowMs?: number;
    max?: number;
    standardHeaders?: boolean;
    legacyHeaders?: boolean;
    message?: any;
    [key: string]: any;
  }
  export default function rateLimit(options?: Options): RequestHandler;
}

