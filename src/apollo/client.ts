import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
  createHttpLink,
  from,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { SchemaLink } from "@apollo/client/link/schema";
import merge from "deepmerge";
import { useMemo } from "react";

let apolloClient: ApolloClient<NormalizedCacheObject>;

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

function createApolloClient() {
  const authMiddleware = setContext(async (operation, context) => {
    console.log("operation", operation);
    console.log("context", context);
    const { headers } = context;
    console.log("headers", headers);
    // const { token } = await fetch('/api/auth/token')
    //   .then(res => res.json())
    //   .catch(() => ({ token: null }));

    const token = "1234567890";

    return {
      headers: {
        ...headers,
        authorization: `Bearer ${token}`,
      },
    };
  });

  const httpLink = createIsomorphLink();

  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    link: from([authMiddleware, httpLink]),
    cache: new InMemoryCache(),
  });
}

function initializeApollo(initialState = null) {
  const _apolloClient = apolloClient ?? createApolloClient();

  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract();

    // Merge the existing cache into data passed from getStaticProps/getServerSideProps
    const data = merge(initialState, existingCache);

    // Restore the cache with the merged data
    _apolloClient.cache.restore(data);
  }

  if (typeof window === "undefined") return _apolloClient;

  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
}

export function useApollo(initialState: undefined) {
  const store = useMemo(() => initializeApollo(initialState), [initialState]);
  return store;
}
