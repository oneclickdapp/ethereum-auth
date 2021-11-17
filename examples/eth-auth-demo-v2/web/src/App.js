import { AuthProvider } from '@redwoodjs/auth'


import { FatalErrorBoundary, RedwoodProvider } from '@redwoodjs/web'
import { RedwoodApolloProvider } from '@redwoodjs/web/apollo'

import FatalErrorPage from 'src/pages/FatalErrorPage'
import Routes from 'src/Routes'

import './scaffold.css'
import './index.css'

let ethereum

const ApolloInjector = ({ children }) => {
  const { uri, headers } = useFetchConfig()
  try {
    const graphQLClient = new ApolloClient({
      cache: new InMemoryCache(),
      uri,
      headers,
    })
    // Default option using Apollo Client
    const makeRequest = (mutation, variables) =>
      graphQLClient.mutate({
        mutation,
        variables,
      })

    // Alternative option using graphql-hooks
    // You'll also need to modify graphQLClient
    // const makeRequest = (query, variables) =>
    //   graphQLClient.request({
    //     query,
    //     variables,
    //   })

    ethereum = new EthereumAuthClient({
      makeRequest,
      infuraId: process.env.INFURA_ID,
      debug: process.NODE_ENV === 'development',
    })
  } catch (e) {
    console.log(e)
  }
  return React.cloneElement(children, { client: ethereum })
}

const App = () => (
  <FatalErrorBoundary page={FatalErrorPage}>
    <RedwoodProvider titleTemplate="%PageTitle | %AppTitle">
      <FetchConfigProvider>
        <ApolloInjector>
          <AuthProvider type="dbAuth">
            <RedwoodApolloProvider>
              <Routes />
            </RedwoodApolloProvider>
          </AuthProvider>
        </ApolloInjector>
      </FetchConfigProvider>
    </RedwoodProvider>
  </FatalErrorBoundary>
)

export default App
