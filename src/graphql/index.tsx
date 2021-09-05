import { ApolloClient, InMemoryCache, from } from "@apollo/client";
import { createUploadLink } from 'apollo-upload-client';
import { onError } from "@apollo/client/link/error";

const graphqlUri = process.env.NEXT_PUBLIC_GRAPHQL_URL

const httpLink = new createUploadLink({
  uri: graphqlUri
});

// Log any GraphQL errors or network error that occurred
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: from([
    errorLink,
    httpLink
  ]),
});

export default client

