import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

 
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    })
  ],
  callbacks: {
    async signIn({ account, profile }) {
      console.log(account,'22222222222222', profile)

      return true
    }
  }
})