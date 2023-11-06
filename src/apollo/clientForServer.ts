import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
  createHttpLink,
} from "@apollo/client";
import { SchemaLink } from "@apollo/client/link/schema";

function createIsomorphLink() {
  if (typeof window === "undefined") {
    const schema = require("./schema");
    return new SchemaLink({ schema });
  } else {
    return createHttpLink({
      uri: "/api/graphql",
      credentials: "same-origin",
    });
  }
}

export const getClient = () => {
  let client: ApolloClient<NormalizedCacheObject> | null = null;

  if (!client) {
    // const httpLink = createIsomorphLink();
    client = new ApolloClient({
      ssrMode: typeof window === "undefined",
      // link: httpLink,
      uri: "http:/localhost:3000/api/graphql", // TODO: change this
      cache: new InMemoryCache(),
    });
  }

  return client;
};
