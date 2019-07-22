import { join } from 'path';
import { importSchema } from 'graphql-import';
import { makeExecutableSchema } from 'graphql-tools';

import { DateTime } from '@saeris/graphql-scalars';
import * as resolvers from './resolvers';

export const schema = makeExecutableSchema({
  typeDefs: importSchema(join(__dirname, 'types', 'query.graphql')),
  resolvers: {
    ...resolvers,
    DateTime,
  },
});

export default schema;
