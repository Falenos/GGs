// TODO does not work with app router

import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { getServerSession } from "next-auth/next";
import { neoSchema } from "../../apollo/schema";
import authOptions from "../../util/authOptions";

const server = async (): Promise<ApolloServer> => {
  const schema = await neoSchema.getSchema();
  return new ApolloServer({ schema });
};

export default startServerAndCreateNextHandler(await server(), {
  context: async (req, res) => {
    const session = await getServerSession(req, res, authOptions);
    // console.log("Session in api/graphql:", session);
    return { req, res, session };
  },
});
