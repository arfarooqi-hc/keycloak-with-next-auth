import CredentialsProvider from 'next-auth/providers/credentials';
import KeycloakProvider from 'next-auth/providers/keycloak';

import { jwtDecode } from 'jwt-decode';
import NextAuth from 'next-auth';

export const authOptions: any = {
  providers: [
    // Local Credentials Provider
    CredentialsProvider({
      name: 'Keycloak Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const params = new URLSearchParams();
        params.append("grant_type", "password");
        params.append("client_id", process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID!);
        params.append("client_secret", process.env.KEYCLOAK_CLIENT_SECRET!);
        params.append("username", credentials!.username);
        params.append("password", credentials!.password);

        const res = await fetch(`${process.env.KEYCLOAK_ISSUER_LINK}/protocol/openid-connect/token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: params.toString(),
        });

        const data = await res.json();

        if (!res.ok) {
          console.error('Login failed:', data);
          return null;
        }

        const decoded: any = jwtDecode(data.access_token);

        return {
          id: decoded.sub,
          name: decoded.name || decoded.preferred_username,
          email: decoded.email,
          access_token: data.access_token,
          refresh_token: data.refresh_token,
        };
      },
    }),


    // Keycloak Provider
    KeycloakProvider({
      clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID as string,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET as string,
      issuer: process.env.KEYCLOAK_ISSUER_LINK,
    }),
  ],

  session: {
    strategy: 'jwt', // Use JWT strategy
  },

  callbacks: {
    async jwt({ token, user, account }: any) {
      // First time login
      if (account && user) {
        token.id = user.id ?? user.sub;
        token.name = user.name || user.username;
        token.accessToken = account.access_token;
        token.provider = account.provider;

        if (account.provider === 'credentials' && user.access_token) {
          const decoded: any = jwtDecode(user.access_token);

          // Extract roles
          const realmRoles = decoded?.realm_access?.roles || [];
          token.roles = realmRoles;

        }
      }

      return token;
    },

    async session({ session, token }: any) {
      // Attach custom properties to the session object
      session.user.id = token.id;
      session.user.name = token.name;
      session.accessToken = token.accessToken;
      session.provider = token.provider;
      session.roles = token.roles;

      return session;
    },
  },

  pages: {
    signIn: '/login',
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
