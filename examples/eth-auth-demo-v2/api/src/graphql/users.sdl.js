export const schema = gql`
  type User {
    id: String!
    address: String!
    authDetail: AuthDetail!
    authDetailId: String!
  }

  type Query {
    users: [User!]! @requireAuth
    user(id: String!): User @requireAuth
  }

  input CreateUserInput {
    address: String!
    authDetailId: String!
  }

  input UpdateUserInput {
    address: String
    authDetailId: String
  }

  type Mutation {
    createUser(input: CreateUserInput!): User! @requireAuth
    updateUser(id: String!, input: UpdateUserInput!): User! @requireAuth
    deleteUser(id: String!): User! @requireAuth
  }
`
