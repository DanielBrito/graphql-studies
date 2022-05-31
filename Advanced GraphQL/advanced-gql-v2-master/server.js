const { ApolloServer } = require("apollo-server");
const gql = require("graphql-tag");

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    createdAt: Int!
  }

  type Settings {
    user: User!
    theme: String!
  }

  input NewSettingsInput {
    user: ID!
    theme: String!
  }

  type Query {
    me: User!
    settings(user: ID!): Settings!
  }

  type Mutation {
    settings(input: NewSettingsInput!): Settings
  }
`;

const resolvers = {
  Query: {
    me() {
      return {
        id: 1,
        username: "daniel",
        createdAt: 1283718927,
      };
    },
    settings(_, { user }) {
      return {
        user,
        theme: "Light",
      };
    },
  },
  Mutation: {
    settings(_, { input }) {
      return input;
    },
  },
  Settings: {
    user() {
      return {
        id: 1,
        username: "daniel",
        createdAt: 1283718927,
      };
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => console.log(`Server running at ${url}`));
