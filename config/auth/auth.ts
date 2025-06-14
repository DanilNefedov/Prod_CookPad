export const runtime = "nodejs";
import NextAuth, { AuthError } from "next-auth";
import Discord from "next-auth/providers/discord";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { getCall, postCall } from "./calls";
import { compare } from "bcryptjs";



export interface RequestData <T>{
  url: string;
  data: T;
}


 
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),

    Discord({
      clientId: process.env.DISCORD_CLIENT,
      clientSecret: process.env.DISCORD_SECRET,
    }),

    Credentials({
      name: "Credentials",
      credentials: {
        email: {
          type: "email",
          // label: "Email",
          // placeholder: "johndoe@gmail.com",
        },
        password: {
          type: "password",
          // label: "Password",
          // placeholder: "*****",
        },
      },
      async authorize(credentials) {
        const email = credentials.email as string;
        const password = credentials.password as string;

        if (!credentials?.email || !credentials?.password) return null;

        const url = `${process.env.APP_MAIN_URL}/api/user/credentials?email=${email}&provider=credentials`;

        const existingUserRes = await getCall(url);
        const userDb = await existingUserRes.json();

        const user = userDb?.user;

        if (!user || !user.password) {
          return null;
        }


        if (!user) {
          console.log("Invalid credentials");
          return null;
        }

        const isValid = await compare(password, user.password);
        console.log(email, password, isValid)
        if (!isValid) {
          console.log("Invalid password");
          return null;
        }
        const finalUser = {
          id: user.connection_id, 
          name: user.name,
          email: user.email,
          connection_id: user.connection_id,
          provider: user.provider,
          image: user.img || '',
        };

        return finalUser;
      }
    }),
    
  ],
  callbacks: {
    async signIn({ account, profile, credentials }) {
      if (account?.provider === 'credentials') {
        return true;
      }
      if (account && (account.provider === 'google' || account.provider === 'discord')) {
        // await connectDB();
        // const existingUser = await User.findOne({ connection_id: account.providerAccountId });
        const url = `${process.env.APP_MAIN_URL}/api/user?connection_id=${account.providerAccountId}`
        const existingUser = await getCall(url)
        const { user } = await existingUser.json();

        if (!user) {
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
              url: `${process.env.APP_MAIN_URL}/api/user`,
              data: dataUser,
            });
            const responseData = await response.json();
            console.log('Successful answer:', responseData.message);
          } catch (error) {
            console.error('Error:', error);
          }

          try {
            const response = await postCall({
              url: `${process.env.APP_MAIN_URL}/api/cook/history`,
              data: {
                connection_id:account.providerAccountId,
                history_links:[]
              },
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
        session.user.id = token.id;
        session.user.connection_id = token.connection_id;
        session.user.name = token.name;
        session.user.email = token.email;
      }
      return session;
    },

    
    jwt: async ({ token, user, account }) => {
      if (user) {
        token.id = user.id;
        token.connection_id = user.connection_id;
        token.name = user.name;
        token.email = user.email;
      }

      if (account) {
        token.connection_id = account.providerAccountId;
      }
      return token;
    },

    // jwt: async ({  token, account }) => {
    //   // console.log('jwtjwtjwtjwtjwtjwtjwtjwtjwt', {  token, account })
    //   if (account) {
    //     token.connection_id = account.providerAccountId;
    //   }
    //   return token;
    // },
    


    authorized(params) {
      return !!params.auth?.user;
    },
  },
  cookies: {
    sessionToken: {
      name: `authjs.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  session: {
    strategy: "jwt", 
  },
  
})