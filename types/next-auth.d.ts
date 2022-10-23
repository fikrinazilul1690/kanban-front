import { Session, User } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
    user: {
      id: string;
      createdAt: Date;
      updatedAt: Date;
      firstName: string;
      lastName: string;
      fullName: string;
      email: string;
      roles: Array<string>;
    };
  }
}

declare module 'next-auth' {
  interface Session {
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      createdAt: Date;
      updatedAt: Date;
      firstName: string;
      lastName: string;
      fullName: string;
      email: string;
      roles: Array<string>;
    };
  }

  interface User {
    accessToken: string;
    refreshToken: string;
  }
}

declare global {
  interface Project {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    slug: string;
    description: string;
    owner: string;
    UsStatus: UsStatus[];
  }

  interface UsStatus {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    slug: string;
    isClosed: boolean;
    projectId: number;
    colorHex: string;
  }
}
