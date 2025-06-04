export const runtime = "nodejs";
import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { getCall, postCall } from "./calls";
import { v4 as uuidv4 } from 'uuid';
import { hash } from "bcryptjs";



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
          label: "Email",
          placeholder: "johndoe@gmail.com",
        },
        password: {
          type: "password",
          label: "Password",
          placeholder: "*****",
        },
      },
      async authorize(credentials: Record<string, unknown> | undefined) {
        if (!credentials) return null;

        const email = credentials.email as string | undefined;
        const password = credentials.password as string | undefined;

        if (!email || !password) return null;
        
        console.log(credentials)
        const url = `http://localhost:3000/api/user/credentials?email=${email}&provider=credentials`;
        const existingUser = await getCall(url)
        const { user } = await existingUser.json();

        if(user === null) {
          const hashedPassword = await hash(password, 10);

          const newUserData = {
            name: email.split('@')[0],
            email,
            password: hashedPassword,
            provider: 'credentials',
            connection_id: uuidv4(),
            popular_config: [],
            img: "",
          };

        
          const createUserRes = await postCall({
            url: 'http://localhost:3000/api/user',
            // url: '`https://prod-cook-pad.vercel.app/api/user',
            data: newUserData,
          });
          

          if (!createUserRes.ok) {
            console.error('Error when creating a user');
            return null;
          }

          const createdUser = await createUserRes.json();

          return {
            id: createdUser._id,
            name: createdUser.name,
            img:createdUser.img,
            email: createdUser.email,
            provider:createdUser.provider,
            connection_id: createdUser.connection_id,
            popular_config:createdUser.popular_config
          };
        }
        // const res = await fetch(`${process.env.NEXTAUTH_URL}/api/user/find?email=${email}`);
        // const userData = await res.json();
        

        // const user = userData?.user;
        // if (!user) return null;

        // const isValid = await compare(password, user.password);
        // if (!isValid) return null;

        return {
          id: user._id,
          name: user.name,
          img:user.img,
          email: user.email,
          provider:user.provider,
          connection_id: user.connection_id,
          popular_config:user.popular_config
        };
      },
    }),
    
  ],
  callbacks: {
    async signIn({ account, profile }) {
      // console.log({account, profile})
      if (account) {

        if(account.provider === 'credentials') return true
        // await connectDB();
        // const existingUser = await User.findOne({ connection_id: account.providerAccountId });
        const url = `https://prod-cook-pad.vercel.app/api/user?connection_id=${account.providerAccountId}`
        // const url = `http://localhost:3000/api/user?connection_id=${account.providerAccountId}`
        const existingUser = await getCall(url)
        const { user } = await existingUser.json();

        // console.log('existingUserexistingUserexistingUserexistingUser', existingUser)
        // `http://localhost:3000/api/user?connection_id=${account.providerAccountId}`
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
              url: 'https://prod-cook-pad.vercel.app/api/user',
              // url: 'http://localhost:3000/api/user',
              data: dataUser,
            });
            const responseData = await response.json();
            console.log('Successful answer:', responseData.message);
          } catch (error) {
            console.error('Error:', error);
          }

          try {
            const response = await postCall({
              url: 'https://prod-cook-pad.vercel.app/api/cook/history',
              // url: 'http://localhost:3000/api/cook/history',
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
    // session: async ({ session, token }) => {
    //   if (session?.user) {
    //     session.user.connection_id = token.connection_id;
    //   }
    //   return session;
    // },
    
    session: async ({ session, token }) => {
      console.log({ session, token })
      if (session?.user) {
        session.user.name = token.name ?? null;
        session.user.email = token.email ?? null;
        session.user.image = token.picture ?? null;
        session.user.connection_id = token.connection_id ?? null;
      }
      return session;
    },


    // jwt: async ({  token, account }) => {
    //   if (account) {
    //     token.connection_id = account.providerAccountId;
    //   }
    //   return token;
    // },
    jwt: async ({ token, account, user }) => {
      console.log({ token, account, user })
      if (user) {
        token.connection_id = user.connection_id;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image; 
      } else if (account?.providerAccountId) {
        token.connection_id = account.providerAccountId;
      } else if (!token.connection_id) {
        token.connection_id = null;
      }

      return token;
    },


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