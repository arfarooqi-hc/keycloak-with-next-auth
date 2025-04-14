import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import KeycloakProvider from 'next-auth/providers/keycloak';
import { jwtDecode } from 'jwt-decode';

export const authOptions: any = {
  providers: [
    // Local Credentials Provider
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const user = {
          id: '1',
          name: 'Admin',
          username: 'admin',
          password: 'password123', // In production: hash & verify
        };

        if (
          credentials?.username === user.username &&
          credentials?.password === user.password
        ) {
          return user;
        }

        return null;
      },
    }),

    // Keycloak Provider
    KeycloakProvider({
      clientId:  process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID as string,
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

        if (account.provider === 'keycloak' && account.access_token) {
          const decoded: any = jwtDecode(account.access_token);

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
