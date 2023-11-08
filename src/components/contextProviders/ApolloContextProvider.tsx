"use client";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

const ApolloContextProvider = ({ children }: { children: any }) => {
  // TODO check if this is the right way to do this taking into account our rsc configuration
  const client = new ApolloClient({
    uri: "http://localhost:3000/api/graphql",
    cache: new InMemoryCache(),
  });
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default ApolloContextProvider;
