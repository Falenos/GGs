import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import getDriver from "./neo4j";

const driver = getDriver();
const neo4jSession = driver.session();

const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Credentials",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        // TODO: add username functionality
        email: {
          label: "Email",
          type: "email",
          placeholder: "jsmith@jsmith.com",
        },
        password: { label: "Password", type: "password" },
      },

      // TODO: check how to go through graphql for authorize
      // async authorize(credentials) {
      //   const query = `query Users {
      //       users {
      //         id
      //         username
      //         email
      //         password
      //       }
      //     }`;

      //   const response = await fetch('http://localhost:3000/api/graphql', {
      //       method: "POST",
      //       headers: {
      //           "Content-Type": "application/json",
      //       },
      //       body: JSON.stringify({query})
      //   });
      //   const { data } = await response.json();
      //   const user = await data.users.find((dat) => dat.email === credentials.email);
      //   if(user && user.password === credentials.password) {
      //       return {
      //           _id: user._id,
      //           name: user.username,
      //           email: user.email,
      //       };
      //   }
      //   throw new Error("Invalid email or password");
      // },

      async authorize(credentials, req) {
        // TODO test this
        if (!credentials?.email || !credentials.password) {
          throw new Error("Please enter email and password");
        }
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)
        const res = await neo4jSession.run(
          `
            MATCH (u:User {email: $email})
            RETURN u
          `,
          credentials
        );
        const user = res.records[0]?.get("u")?.properties;
        console.log("user:", user);
        if (!user) return null;
        return user;
      },
    }),
  ],
  // pages: {
  //   signIn: '/login',
  // },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token, user, trigger, newSession }) {
      console.log("ALL::", "session:", session, "token:", token, "user:", user);
      // session.user = user;
      return Promise.resolve(session);
    },
    // async session(session, user) {
    //   if (!user) return null; // If no user, then this is an anonymous session.
    //   session.userId = user.id; // Attach the user ID to the session object.
    //   return session;
    // },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default authOptions;
