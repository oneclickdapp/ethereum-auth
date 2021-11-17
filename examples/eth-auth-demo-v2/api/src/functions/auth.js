import { db } from 'src/lib/db'
import { DbAuthHandler } from '@redwoodjs/api'
import { InputError } from '@redwoodjs/graphql-server'

export const handler = async (event, context) => {
  const authHandler = new DbAuthHandler(event, context, {
    db: db,
    authModelAccessor: 'user',
    authFields: {
      id: 'id',
      address: 'address',
      hashedPassword: 'hashedPassword',
      salt: 'salt',
      resetToken: 'resetToken',
      resetTokenExpiresAt: 'resetTokenExpiresAt',
    },
    login: {
      handler: (user) => {
        return user
      },
      errors: {
        usernameOrPasswordMissing: 'Both username and password are required',
        usernameNotFound: 'Username ${username} not found',
        incorrectPassword: 'Incorrect password for ${username}',
      },
      expires: 60 * 60 * 24 * 365 * 10,
    },
    forgotPassword: {
      handler: () => null,
      expires: 60 * 60 * 24,
      errors: {
        usernameNotFound: 'Error',
        usernameRequired: 'Error',
      },
    },
    resetPassword: {
      handler: () => {
        throw new InputError('resetPassword is not relevant for ethereum-auth')
      },
      allowReusedPassword: false,
      errors: {
        resetTokenExpired: 'resetToken is expired',
        resetTokenInvalid: 'resetToken is invalid',
        resetTokenRequired: 'resetToken is required',
        reusedPassword: 'Must choose a new password',
      },
    },
    signup: {
      handler: () => {
        throw new InputError('signUp is not relevant for ethereum-auth')
      },
    },
  })

  authHandler.login = async () => {
    const { code, state } = authHandler.params
    if (!code || !state)
      throw new InputError('logIn() Code or state not provided.')

    const user = await handleOauthCodeGrant({ state, code })

    const sessionData = { id: user[authHandler.options.authFields.id] }

    // TODO: this needs to go into graphql somewhere so that each request makes
    // a new CSRF token and sets it in both the encrypted session and the
    // csrf-token header
    const csrfToken = DbAuthHandler.CSRF_TOKEN

    const response = [
      sessionData,
      {
        'csrf-token': csrfToken,
        ...authHandler._createSessionHeader(sessionData, csrfToken),
      },
    ]
    return response
  }

  return await authHandler.invoke()
}
