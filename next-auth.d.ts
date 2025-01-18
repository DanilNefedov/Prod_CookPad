import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      connection_id?: string; 
    } & DefaultSession["user"];
  }

  interface User {
    connection_id?: string; 
  }
}
