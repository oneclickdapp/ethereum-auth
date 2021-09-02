import { routes, navigate, Link } from '@redwoodjs/router'
import { useAuth } from '@redwoodjs/auth'
import Logo from 'src/components/Logo'

const truncate = (text, length = 50) => {
  if (typeof text !== 'string') return ''
  return text.substring(0, length) + '...'
}

const DefaultLayout = ({ children }) => {
  const { isAuthenticated, currentUser, logOut } = useAuth()

  const onLogOut = () => {
    logOut()
    navigate(routes.home())
  }

  const loginButton = isAuthenticated ? (
    <>
      <button
        onClick={() => navigate(routes.user({ id: currentUser.id }))}
        to="login"
        className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
      >
        {truncate(currentUser?.address, 7)}
      </button>
      <button onClick={onLogOut}>Logout</button>
    </>
  ) : (
    <div className="md:flex items-center justify-end md:flex-1 lg:w-0">
      <button
        onClick={() => navigate(routes.login())}
        to="login"
        className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
      >
        Log in
      </button>
    </div>
  )

  return (
    <div className="flex flex-col min-h-screen">
      <header className="relative bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center border-b-2 border-gray-100 py-6 md:justify-start md:space-x-10">
            <div className="flex justify-start lg:w-0 lg:flex-1">
              <Link to="/">
                <Logo />
              </Link>
            </div>
            {loginButton}
          </div>
        </div>
      </header>
      <div className="mt-4 flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6">
        {children}
      </div>

      <footer>
        <div className="mt-8 relative bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex justify-between items-center py-6 md:justify-start md:space-x-10">
              <div className="flex justify-start  lg:w-0 lg:flex-1">
                <code>
                  <a
                    className="text-blue-600"
                    href="https://github.com/oneclickdapp/ethereum-auth"
                  >
                    @oneclickdapp/ethereum-auth
                  </a>
                </code>
                <p className="ml-4">
                  © {new Date().getFullYear()} One Click Dapp
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default DefaultLayout
