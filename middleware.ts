import { getToken } from 'next-auth/jwt';
import { withAuth } from 'next-auth/middleware';
import { NextRequest, NextResponse } from 'next/server';

export default withAuth({
  callbacks: {
    authorized({ token }) {
      console.log('middleware', token);
      if (token) return true;
      return false;
    },
  },
});

export const config = { matcher: ['/test'] };
