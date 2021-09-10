import { routes, navigate, Link } from '@redwoodjs/router'
import { useAuth } from '@redwoodjs/auth'
import Logo from 'src/components/Logo'
import { LogoutIcon } from 'src/components/Icons'

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

  const loginButtons = isAuthenticated ? (
    <div className="flex items-center">
      <button
        onClick={() => navigate(routes.profile())}
        to="login"
        className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
      >
        {truncate(currentUser?.address, 7)}
      </button>
      <button className="ml-4 rw-button rw-button-small" onClick={onLogOut}>
        Logout
        <div className="ml-2">
          <LogoutIcon color="#718096" />
        </div>
      </button>
    </div>
  ) : (
    <div className="justify-end">
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
          <div className="flex justify-between items-center border-b-2 border-gray-100 py-6  md:space-x-10">
            <div className="flex justify-start lg:w-0 lg:flex-1">
              <Link to="/">
                <Logo />
              </Link>
            </div>
            {loginButtons}
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
                <p className="mr-4">
                  © {new Date().getFullYear()} One Click Dapp
                </p>
                <p>
                  Made with{' '}
                  <a
                    className="text-blue-600"
                    target="_blank"
                    href="https://redwoodjs.com"
                  >
                    RedwoodJS
                  </a>
                  {' & '}
                  <a
                    className="text-blue-600"
                    target="_blank"
                    href="https://github.com/oneclickdapp/ethereum-auth"
                  >
                    @oneclickdapp/ethereum-auth
                  </a>
                  {' by '}
                  <a
                    href="https://twitter.com/pi0neerpat"
                    className="text-blue-600"
                    target="_blank"
                  >
                    @pi0neerpat
                  </a>
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
