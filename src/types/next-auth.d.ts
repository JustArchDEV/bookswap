import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: DefaultSession['user'] & {
      id: string;
      image?: string;
      avatar?: string;
      role: string;
      isBlocked: boolean;
    };
  }

  interface User {
    role: string;
    isBlocked: boolean;
    avatar?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
    isBlocked: boolean;
    avatar?: string;
  }
}