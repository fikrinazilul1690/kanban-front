import axios from 'axios';
import jwtDecode from 'jwt-decode';
import NextAuth, { NextAuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { NextResponse } from 'next/server';
import axiosClient from '../../../utils/fetcher/axios';

const refreshAccessToken = async (token: any) => {
  try {
    const response = await axios.post(
      'http://localhost:3500/api/v1/auth/refresh',
      JSON.stringify({ rt: token.refreshToken }),
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      }
    );
    const data = await response.data;

    if (!(response.status === 201)) {
      throw data;
    }

    const payload: { exp: number } = jwtDecode(data.accessToken);

    return {
      ...token,
      accessToken: data.accessToken,
      accessTokenExpires: payload.exp * 1000,
    };
  } catch (err) {
    console.log('error', err);
    NextResponse.redirect('/login');

    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
};

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: {
          label: 'email',
          type: 'email',
        },
        password: {
          label: 'password',
          type: 'password',
        },
      },
      authorize: async (credential) => {
        const payload = {
          email: credential?.email,
          password: credential?.password,
        };
        // database lookup

        const response = await axios
          .post(
            'http://localhost:3500/api/v1/auth/login',
            JSON.stringify(payload),
            {
              headers: {
                'Content-Type': 'application/json',
              },
              withCredentials: true,
            }
          )
          .catch((err) => {
            throw new Error(err.response.data.message);
          });

        const user = await response.data;

        if (response.status === 200) {
          return user;
        }

        return null;
      },
    }),
  ],
  callbacks: {
    redirect: async ({ url, baseUrl }) => {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    jwt: async ({ token, user }) => {
      if (user) {
        const { accessToken, refreshToken } = user;
        const payload: { exp: number } = await jwtDecode(accessToken);
        const account = await axiosClient.get('/users/me', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        return {
          accessToken: accessToken,
          refreshToken: refreshToken,
          accessTokenExpires: payload.exp * 1000,
          user: account.data,
        };
      }

      if (Date.now() < token.accessTokenExpires - 1000) {
        return token;
      }

      // Access token has expired, try to update it
      return refreshAccessToken(token);
    },
    session: async ({ session, token }) => {
      if (token) {
        session.user = token.user;
        session.accessToken = token.accessToken;
        session.refreshToken = token.refreshToken;
        session.error = token.error;
      }

      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
};

export default NextAuth(authOptions);
