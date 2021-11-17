import { createGraphQLHandler } from '@redwoodjs/graphql-server';
import directives from 'src/directives/**/*.{js,ts}';
import sdls from 'src/graphql/**/*.sdl.{js,ts}';
import { db } from 'src/lib/db'
import { logger } from 'src/lib/logger'
import services from 'src/services/**/*.{js,ts}'

import { getCurrentUser } from 'src/lib/auth'

export const handler = createGraphQLHandler({
  loggerConfig: { logger, options: {} },
  getCurrentUser,
  directives,
  sdls,
  services,

  onException: () => {
    // Disconnect from your database with an unhandled exception.
    db.$disconnect()
  },
})
