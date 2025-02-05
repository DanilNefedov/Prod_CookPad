import connectDB from "@/app/lib/mongoose";
import User from "@/app/models/user";
import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";
import Google from "next-auth/providers/google";
import { postCall } from "./calls";


export interface RequestData <T>{
  url: string;
  data: T;
}

 
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),

    Discord({
      clientId: process.env.DISCORD_CLIENT as string,
      clientSecret: process.env.DISCORD_SECRET as string,
    })


  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account) {
        await connectDB();
        const existingUser = await User.findOne({ connection_id: account.providerAccountId });
        
        if (!existingUser) {
          const isGoogle = account.provider === 'google';
          const dataUser = {
            name: isGoogle ? profile?.name : profile?.username,
            email: profile?.email,
            provider: account.provider,
            img: isGoogle ? profile?.picture : profile?.image_url,
            connection_id: account.providerAccountId,
            popular_config: [],
          };
          
          try {
            const response = await postCall({
              url: 'http://localhost:3000/api/user',
              data: dataUser,
            });
            const responseData = await response.json();
            console.log('Successful answer:', responseData.message);
          } catch (error) {
            console.error('Error:', error);
          }
        }
      }
      return true;
    },
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.connection_id = token.connection_id;
      }
      return session;
    },
    jwt: async ({  token, account }) => {
      if (account) {
        token.connection_id = account.providerAccountId;
      }
      return token;
    },
  
  },
  cookies: {
    sessionToken: {
      name: `authjs.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production", // Только в проде
      },
    },
  },
  
})