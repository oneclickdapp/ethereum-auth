import {
  createGraphQLHandler,
  makeMergedSchema,
  makeServices,
} from '@redwoodjs/api'

import schemas from 'src/graphql/**/*.{js,ts}'
import { db } from 'src/lib/db'
import { logger } from 'src/lib/logger'
import services from 'src/services/**/*.{js,ts}'

import { getCurrentUser } from 'src/lib/auth'

export const handler = createGraphQLHandler({
  loggerConfig: { logger, options: {} },
  getCurrentUser,
  schema: makeMergedSchema({
    schemas,
    services: makeServices({ services }),
  }),

  onException: () => {
    // Disconnect from your database with an unhandled exception.
    db.$disconnect()
  },
})
