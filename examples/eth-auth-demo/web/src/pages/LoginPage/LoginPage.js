import { Link, routes, navigate } from '@redwoodjs/router'
import { useAuth } from '@redwoodjs/auth'
import { useParams } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'
import { MobileWalletIcon, MetamaskIcon } from 'src/components/Icons'

const LoginPage = () => {
  const { logIn } = useAuth()
  const { redirectTo } = useParams()

  const onLogin = async (walletType) => {
    try {
      await logIn(walletType)
      navigate(redirectTo || routes.home())
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <>
      <MetaTags
        title="Login"
        // description="Home description"
        /* you should un-comment description and add a unique description, 155 characters or less
    You can look at this documentation for best practices : https://developers.google.com/search/docs/advanced/appearance/good-titles-snippets */
      />
      <h1 className="text-xl tracking-tight font-extrabold text-gray-900 sm:text-2xl md:text-3xl">
        Login
      </h1>
      <ul>
        <li>
          <button
            className={
              'mt-4 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border rounded-md shadow-sm text-base font-medium hover:bg-gray-300'
            }
            onClick={() => onLogin()}
          >
            <MetamaskIcon />
            Log in with Ethereum
          </button>
        </li>
        <li>
          <button
            className={
              'mt-4 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border rounded-md shadow-sm text-base font-medium hover:bg-gray-300'
            }
            onClick={() => onLogin('walletConnect')}
          >
            <MobileWalletIcon />
            Log in with Wallet Connect
          </button>
        </li>
      </ul>
    </>
  )
}

export default LoginPage
