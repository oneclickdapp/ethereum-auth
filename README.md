<h1 align="center">Welcome to @oneclickdapp/ethereum-auth 👋</h1>
<p>
    <img alt="Twitter: pi0neerpat" src="https://img.shields.io/twitter/follow/pi0neerpat.svg?style=social" />
  </a>
</p>

> Ethereum wallet login provider for RedwoodJS projects

## ✨ See it

Demo [RedwoodJS App](https://redwood-ethereum-login-demo.vercel.app/) & the source code can be found in `/examples`

<div align="center" >
 <img margin="0 0 10px" width="500" src="./ocd-ethereum-auth.gif"/>
</div>

## 🛠️ Set up

If this is your first time using Redwood Auth, you should first familiarize yourself with how [Redwood authentication](https://redwoodjs.com/docs/authentication) works.

Create a new redwood app:

```bash
yarn create redwood-app myDapp
```

> See my [introductory blog post](https://patrickgallagher.dev/blog/2020/11/18/web3-redwood-intro/using-redwoodjs-to-create-an-ethereum-app) for more help getting started.

### Scaffolding

First let's do some scaffolding and install the necessary packages. This is where the 🧙‍♂️✨ magic happens!

```bash
cd myDapp
yarn rw setup auth ethereum
```

Next we need to update our models. Add `address` to the **User** model, and create a new `AuthDetail` model.

```js
// api/db/schema.prisma
model User {
  id           String     @id @default(uuid())
  address      String     @unique
  authDetail   AuthDetail @relation(fields: [authDetailId], references: [id])
  authDetailId String
}

model AuthDetail {
  id        String   @id @default(uuid())
  nonce     String
  timestamp DateTime @default(now())
  User      User?
}
```

Now lets use the generator for our user model.

```bash
yarn rw generate scaffold user
```

Awesomesauce! Let's spin up our database and apply the changes:

```bash
yarn rw prisma migrate dev
```

### Services

Now let's make a service to perform authentication. Create a\ file `ethereumAuth.sdl.js` in `api/src/graphql/`

```js
// api/src/graphql/ethereumAuth.sdl.js
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
`;
```

Then create a file `ethereumAuth.js` in `api/src/services/ethereumAuth`

```js
// api/src/services/ethereumAuth/ethereumAuth.js
import { AuthenticationError } from "@redwoodjs/api";

import { bufferToHex } from "ethereumjs-util";
import { recoverPersonalSignature } from "eth-sig-util";
import jwt from "jsonwebtoken";

import { db } from "src/lib/db";

const NONCE_MESSAGE =
  "Please prove you control this wallet by signing this random text: ";

const getNonceMessage = nonce => NONCE_MESSAGE + nonce;

export const authChallenge = async ({ input: { address: addressRaw } }) => {
  const nonce = Math.floor(Math.random() * 1000000).toString();
  const address = addressRaw.toLowerCase();
  await db.user.upsert({
    where: { address },
    update: {
      authDetail: {
        update: {
          nonce,
          timestamp: new Date()
        }
      }
    },
    create: {
      address,
      authDetail: {
        create: {
          nonce
        }
      }
    }
  });

  return { message: getNonceMessage(nonce) };
};

export const authVerify = async ({
  input: { signature, address: addressRaw }
}) => {
  try {
    const address = addressRaw.toLowerCase();
    const authDetails = await db.user
      .findOne({
        where: { address }
      })
      .authDetail();
    if (!authDetails) throw new Error("No authentication started");

    const { nonce, timestamp } = authDetails;
    const startTime = new Date(timestamp);
    if (new Date() - startTime > 5 * 60 * 1000)
      throw new Error(
        "The challenge must have been generated within the last 5 minutes"
      );
    const signerAddress = recoverPersonalSignature({
      data: bufferToHex(Buffer.from(getNonceMessage(nonce), "utf8")),
      sig: signature
    });
    if (address !== signerAddress.toLowerCase())
      throw new Error("invalid signature");

    const token = jwt.sign({ address }, process.env.ETHEREUM_JWT_SECRET, {
      expiresIn: "5h"
    });
    return { token };
  } catch (e) {
    throw new Error(e);
  }
};
```

We're almost there! Create a server secret for issuing jwt tokens:

```bash
openssl rand -base64 48
```

Use the resulting string for `ETHEREUM_JWT_SECRET` in your `.env` file.

And don't forget to update your `Redwood.toml` for including the environment variables in your hosted app.

```toml
[web]
  includeEnvironmentVariables = ['ETHEREUM_JWT_SECRET', 'INFURA_ID']
```

### Webpack V5

Webpack V5 no longer injects some node modules automatically, which are required by the `@walletconnect` dependencies. To fix this issue, you must add them manually to the webpack config in your RedwoodJS app.

> Want to help out by removing this extra step? The [`@walletconnect` V5 update issue](https://github.com/WalletConnect/walletconnect-monorepo/issues/584) is waiting for a champion!

If you haven't run this command already, create the config file:

```bash
yarn rw setup webpack
```

Then add the following to your config in `web/config/webpack.config.js`:

```js
const webpack = require("webpack");

// See https://github.com/WalletConnect/walletconnect-monorepo/issues/584
config.resolve.fallback = {
  os: require.resolve(`os-browserify/browser`),
  https: require.resolve(`https-browserify`),
  http: require.resolve(`stream-http`),
  stream: require.resolve(`stream-browserify`),
  util: require.resolve(`util/`),
  url: require.resolve(`url/`),
  assert: require.resolve(`assert/`),
  crypto: require.resolve(`crypto-browserify`)
};
config.plugins.push(
  new webpack.ProvidePlugin({
    process: "process/browser",
    Buffer: ["buffer", "Buffer"]
  })
);
```

Now install the missing 8 packages:

```bash
cd web
yarn add stream-browserify stream-http crypto-browserify https-browserify os-browserify util url assert
```

Test the app builds properly in development and production

```bash
yarn rw dev

# It works in development? Great!

yarn rw build
```

Done! You're ready to start using your shiny new Ethereum auth just like any other RedwoodJS auth provider.

## Usage

Start your RedwoodJS app:

```bash
yarn rw dev
```

Here's a quick snippet to help get you started. Check out the `/examples` folder for more.

```js
// web/src/pages/LoginPage/LoginPage.js
import { Link, routes, navigate } from "@redwoodjs/router";
import { useAuth } from "@redwoodjs/auth";
import { useParams } from "@redwoodjs/router";

const LoginPage = () => {
  const { logIn } = useAuth();
  const { redirectTo } = useParams();

  const onLogin = async () => {
    await logIn();
    navigate(redirectTo || routes.home());
  };

  return (
    <>
      <h1>LoginPage</h1>
      <p>
        You must have an ethereum wallet, such as MetaMask, installed in your
        browser
      </p>
      <button onClick={onLogin}>Log in with Ethereum</button>
    </>
  );
};

export default LoginPage;
```

## Options

### Wallet Connect

You must pass an optional `rpc` or `infuraId` to use Wallet Connect.

```js
ethereum = new EthereumAuthClient({
  makeRequest,
  // Note: you must set NODE_ENV manually when using Netlify
  debug: process.NODE_ENV !== "development",
  infuraId: process.env.INFURA_ID
  // For rpc see https://docs.walletconnect.org/quick-start/dapps/web3-provider#provider-options
});
```

Then pass the type "walletConnect" when you unlock

```js
const { logIn, logOut, getCurrentUser } = useAuth()

const onClickWalletConnect = async () => {
  await logIn("walletConnect")
```

## Additional Resources

Now that you've completed setup, you might find these resources useful. More docs/examples are welcome here!

- Tutorial II Role-based access control (RBAC) https://redwoodjs.com/tutorial2/role-based-authorization-control-rbac
- Cookbook RBAC https://redwoodjs.com/cookbook/role-based-access-control-rbac

## Developing

In this repo link and watch files:

```bash
yarn link
yarn watch
```

Then in your app, use the local linked package

```bash
yarn link @oneclickdapp/ethereum-auth
```

### Advanced

If you're changes affect how internal stuff in RedwoodJS uses this package, then you'll need to do a bit more work. Things that may be affected include decoders in `@redwoodjs/api`, frontend tooling in `@redwoodjs/auth`, and CLI generators in `@redwoodjs/cli`. Unfortunately, `yarn link` will not work for redwood local development. Please follow the guide here https://github.com/redwoodjs/redwood/blob/main/CONTRIBUTING.md#local-development for more help.

```bash
# In the redwood repo
yarn build:watch

# Then in your example redwood app
yarn rwt copy:watch ../redwood
```

## TODO

- [x] Add support for `walletconnect`
- [ ] Add ethereum-auth the redwood (auth playground)[https://github.com/redwoodjs/playground-auth]
- [ ] Allow direct access to the ethers `provider` on the client.
- [ ] Export typescript types here for the user object, instead of declaring them inside `@redwoodjs/auth`
- [ ] Add support for `walletlink`

## Publishing

```bash
yarn publish --dry-run
```

## Resources

- Looking to implement your own custom Redwood Auth? You may find this [tutorial](https://patrickgallagher.dev/blog/2020/12/27/tutorial-redwood-web3-login/tutorial-add-web3-login-to-redwoodjs) helpful (it may be out-dated by now)

## Author

👤 **Patrick Gallagher <blockchainbuddha@gmail.com>**

- Website: https://patrickgallagher.dev
  - Twitter: [@pi0neerpat](https://twitter.com/pi0neerpat)
  - GitHub: [@pi0neerpat](https://github.com/pi0neerpat)

## Show your support

Give a ⭐️ if this project helped you!

---

_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
