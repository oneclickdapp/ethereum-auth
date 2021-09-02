import { Link, routes, navigate } from '@redwoodjs/router'
import { useAuth } from '@redwoodjs/auth'
import { useParams } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

const LoginPage = () => {
  const { logIn } = useAuth()
  const { redirectTo } = useParams()

  const onLogin = async () => {
    try {
      await logIn()
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
      <p className="mt-4">
        You must have an ethereum wallet, such as MetaMask, installed in your
        browser
      </p>
      <button
        className={
          'mt-4 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700'
        }
        onClick={onLogin}
      >
        Log in with Ethereum
      </button>
    </>
  )
}

export default LoginPage
