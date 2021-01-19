<h1 align="center">Welcome to @oneclickdapp/ethereum-auth 👋</h1>
<p>
    <img alt="Twitter: pi0neerpat" src="https://img.shields.io/twitter/follow/pi0neerpat.svg?style=social" />
  </a>
</p>

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)

<!-- ALL-CONTRIBUTORS-BADGE:END -->

> Auth provider for RedwoodJS using Ethererum

This package was inspired from a [lengthy tutorial](https://patrickgallagher.dev/blog/2020/12/27/tutorial-redwood-web3-login/tutorial-add-web3-login-to-redwoodjs) I wrote on adding Ethereum auth to Redwood. If you're planning to implement your own custom auth to RedwoodJS (aside from Ethereum), you may find that tutorial useful.

### ✨ [Demo](https://redwood-web3-login-demo.vercel.app/)

Demo [source code](https://github.com/pi0neerpat/redwood-web3-login-demo)

## Setup

If you haven't created a redwood app yet, you can do so now. See my [introductory blog post](https://patrickgallagher.dev/blog/2020/11/18/web3-redwood-intro/using-redwoodjs-to-create-an-ethereum-app) for more help getting started.

```bash
yarn create redwood-app myDapp
```

First let's do some scaffolding and install the necessary packages. This is where the 🧙‍♂️✨ magic happens!

```bash
cd myDapp
yarn rw generate auth ethereum
```

Next we need to update our models. Add `address` to the **User** model, and create a new `AuthDetail` model.

```js
// api/db/schema.prisma
model User {
  id    String     @id @default(uuid())
  address String  @unique
  authDetail AuthDetail
}

model AuthDetail {
  id    String     @id @default(uuid())
  nonce String
  timestamp DateTime @default(now())
}
```

Now lets use the generator for our new models. We only need the **sdl** for `AuthDetail`.

```bash
yarn rw generate scaffold user
yarn rw generate sdl AuthDetail
```

You can delete the service for `authDetails`, since it won't be used.

Awesomesauce. Let's spin up our database!

```bash
yarn rw db save
yarn rw db up
```

We're halfway there. Now let's create a new service to verify Ethereum signatures. We'll start by creating the **sdl** `ethereumAuth.js`.

```js
// api/src/graphql/ethereumAuth.js
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

Next create a new service named `ethereumAuth`, and paste in this code.

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

Last step, we need to create a secret for issuing jwt tokens.

```bash
openssl rand -base64 48
```

Add the result as `ETHEREUM_JWT_SECRET` to your .env file.

Done! You can use your shiny new Ethereum auth, just like any other RedwoodJS auth. Here's a quick example. Read more in the official RedwoodJS docs https://redwoodjs.com/docs/authentication

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

## Additional Resources

Once you have things working, these resources may be helpful for adapting this package to your use-case. More docs/examples are welcome here!

### Implementing Role-based Access Control (RBAC)

https://redwoodjs.com/cookbook/role-based-access-control-rbac

## Contributing

If you're only editing this package, then you only need to update `@oneclickdapp/ethereum-auth` in your test redwood app. You can ignore the rest of this section.

If you're changes affect how internal stuff in RedwoodJS uses this package, then you'll need to do a bit more work. Things that may be affected include decoders in `@redwoodjs/api`, frontend tooling in `@redwoodjs/auth`, and CLI generators in `@redwoodjs/cli`. Feel free to adjust the commands below depending on which of these packages your changes affect.

Unfortunately, `yarn link` will not work for redwood local development (sorry!). Please follow the **Local Package Registry Emulation** method here https://github.com/redwoodjs/redwood/blob/main/CONTRIBUTING.md#local-development

Once verdaccio is running, use this command to build the package you need.

```bash
./tasks/publish-local ./packages/auth
# or
./tasks/publish-local ./packages/api
# or
./tasks/publish-local ./packages/cli
```

Then in your test redwood app

```bash
rm -rf ./node_modules/@redwoodjs/auth
rm -rf ./node_modules/@redwoodjs/api
rm -rf ./node_modules/@redwoodjs/cli

yarn upgrade @redwoodjs/auth@dev @redwoodjs/api@dev @redwoodjs/api@cli --no-lockfile --registry http://localhost:4873/
```

## Planned features

### Add additional wallet providers

- `walletlink` v1.0.0
- `@walletconnect/web3-provider` v1.0.13

## Publishing

```bash
yarn publish --dry-run
```

## Author

👤 **Patrick Gallagher <blockchainbuddha@gmail.com>**

- Website: https://patrickgallagher.dev
  - Twitter: [@pi0neerpat](https://twitter.com/pi0neerpat)
  - GitHub: [@pi0neerpat](https://github.com/pi0neerpat)

## Show your support

Give a ⭐️ if this project helped you!

---

_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
