import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";
import Google from "next-auth/providers/google";

 
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
      console.log(account,'22222222222222', profile)

      return true
    }
  }
})