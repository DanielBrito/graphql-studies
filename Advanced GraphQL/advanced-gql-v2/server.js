const {
  ApolloServer,
  PubSub,
  AuthenticationError,
  UserInputError,
  ApolloError,
  SchemaDirectiveVisitor,
} = require("apollo-server");
const gql = require("graphql-tag");
const { defaultFieldResolver, GraphQLString } = require("graphql");

const pubSub = new PubSub();
const NEW_ITEM = "NEW_ITEM";

class LogDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const resolver = field.resolve || defaultFieldResolver;
    const { message } = this.args;
    field.args.push({
      type: GraphQLString,
      name: "message",
    });

    field.resolve = (root, { message, ...rest }, ctx, info) => {
      const { message: schemaMessage } = this.args;
      console.log(`⚡ Hello: ${message || schemaMessage}`);
      return resolver.call(this, root, rest, ctx, info);
    };
  }
}

const typeDefs = gql`
  directive @log(message: String = "My message") on FIELD_DEFINITION

  type User {
    id: ID! @log(message: "I'm the id.")
    username: String!
    error: String! @deprecated(reason: "Replaced for something else.")
    createdAt: String!
  }

  type Settings {
    user: User!
    theme: String!
  }

  type Item {
    task: String!
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
    settings(input: NewSettingsInput!): Settings!
    createItem(task: String!): Item!
  }

  type Subscription {
    newItem: Item
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
    createItem(_, { task }) {
      const item = { task };

      pubSub.publish(NEW_ITEM, { newItem: item });

      return item;
    },
  },
  Subscription: {
    newItem: {
      subscribe: () => pubSub.asyncIterator(NEW_ITEM),
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
  User: {
    error() {
      throw new AuthenticationError("Not auth");
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  schemaDirectives: {
    log: LogDirective,
  },
  formatError(error) {
    console.log(error);
    return error;
  },
  context({ connection, req }) {
    if (connection) {
      return { ...connection.context };
    }
  },
  subscriptions: {
    onConnect(params) {},
  },
});

server.listen().then(({ url }) => console.log(`Server running at ${url}`));
