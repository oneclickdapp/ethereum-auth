import { db } from 'src/lib/db'
import { requireAuth } from 'src/lib/auth'

// Used when the environment variable REDWOOD_SECURE_SERVICES=1
export const beforeResolver = (rules) => {
  rules.add(requireAuth)
}

export const users = () => {
  return db.user.findMany({ take: 100 })
}

export const user = ({ id }) => {
  return db.user.findUnique({
    where: { id },
  })
}

export const User = {
  authDetail: (_obj, { root }) =>
    db.user.findUnique({ where: { id: root.id } }).authDetail(),
}
