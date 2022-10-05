import { Session, User } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
    user: {
      createdAt: date;
      email: string;
      id: string;
    };
  }
}

declare module 'next-auth' {
  interface Session {
    accessToken: string;
    refreshToken: string;
    user: {
      createdAt: date;
      email: string;
      id: string;
    };
  }

  interface User {
    id: string;
    email: string;
    createdAt: Date;
    access_token: string;
    refresh_token: string;
  }
}

declare global {
  interface Project {
    id: string;
    title: string;
    desc: string;
    createdAt: Date;
    userId: string;
  }
}
