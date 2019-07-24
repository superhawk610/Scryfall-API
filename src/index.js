import { ApolloServer } from 'apollo-server';
import { error } from 'winston';
import schema from './schema';
import dataSources from './sources';
import { defaultQuery } from './defaultQuery';
import './logger';

const isDev = process.env.NODE_ENV !== 'production';
const server = new ApolloServer({
  schema,
  dataSources,
  tracing: true,
  formatError: err => error(err),
  introspection: isDev,
  playground: isDev
    ? {
        tabs: [{ endpoint: process.env.ENDPOINT, query: defaultQuery, name: 'cardById' }],
      }
    : false,
});

server
  .listen({ port: process.env.PORT })
  .then(({ url }) => console.log(`🚀  Server ready at ${url}`));
