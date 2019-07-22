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
        tabs: [
          { endpoint: 'http://localhost:1337', query: defaultQuery, name: 'cardById' },
        ],
      }
    : false,
});

server
  .listen({ port: 1337 })
  .then(({ url }) => console.log(`🚀  Server ready at ${url}`));
