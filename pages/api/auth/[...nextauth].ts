import axios from 'axios';
import jwtDecode from 'jwt-decode';
import NextAuth, { NextAuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

const refreshAccessToken = async (token: any) => {
  try {
    const response = await axios.post(
      'http://localhost:3500/api/v1/auth/refresh-token',
      JSON.stringify({ refresh_token: token.refreshToken }),
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

    const payload: { exp: number } = jwtDecode(data.access_token);

    return {
      ...token,
      accessToken: data.access_token,
      accessTokenExpires: payload.exp * 1000,
    };
  } catch (err) {
    console.log(err);

    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
};

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: {
          label: 'email',
          type: 'email',
          placeholder: 'test@domain.com',
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

        const response = await axios.post(
          'http://localhost:3500/api/v1/auth/login',
          JSON.stringify(payload),
          {
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true,
          }
        );

        const user = await response.data;

        if (!(response.status === 201)) {
          throw user;
        }

        if (response.status === 201 && user) {
          return user;
        }

        // login failed
        return null;
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        const payload: { exp: number } = jwtDecode(
          user?.access_token as string
        );
        const { access_token, refresh_token, ...data } = user;
        return {
          accessToken: access_token,
          refreshToken: refresh_token,
          accessTokenExpires: payload.exp * 1000,
          user: {
            ...data,
          },
        };
      }

      if (Date.now() < (token.accessTokenExpires as number) - 1000) {
        return token;
      }

      // Access token has expired, try to update it
      return refreshAccessToken(token);
    },
    session: async ({ session, token }) => {
      if (token) {
        session.user = token.user!;
        session.accessToken = token.accessToken;
        session.refreshToken = token.refreshToken;
        session.error = token.error;
      }

      return session;
    },
  },
  secret: process.env.SECRET_CODE,
  pages: {
    signIn: '/login',
  },
  jwt: {
    secret: process.env.SECRET_CODE,
  },
};

export default NextAuth(authOptions);
