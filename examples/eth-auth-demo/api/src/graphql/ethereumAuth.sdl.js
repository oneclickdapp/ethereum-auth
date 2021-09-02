export const schema = gql`
  type Mutation {
    authChallenge(input: AuthChallengeInput!): AuthChallengeResult
    authVerify(input: AuthVerifyInput!): AuthVerifyResult
  }

  input AuthChallengeInput {
    address: String!
  }

  type AuthChallengeResult {
    message: String!
  }

  input AuthVerifyInput {
    signature: String!
    address: String!
  }

  type AuthVerifyResult {
    token: String!
  }
`
