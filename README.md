<h1 align="center">Welcome to @oneclickdapp/ethereum-auth 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-0.0.1-blue.svg?cacheSeconds=2592000" />
  <a href="https://twitter.com/pi0neerpat" target="_blank">
    <img alt="Twitter: pi0neerpat" src="https://img.shields.io/twitter/follow/pi0neerpat.svg?style=social" />
  </a>
</p>

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)

<!-- ALL-CONTRIBUTORS-BADGE:END -->

> Auth provider for RedwoodJS using Ethererum

- `@ethersproject/providers` v5.0.4 [docs](https://docs.ethers.io/v5/)

This project was inspired from a [lengthy tutorial](https://patrickgallagher.dev/blog/2020/12/27/tutorial-redwood-web3-login/tutorial-add-web3-login-to-redwoodjs) I wrote on adding Ethereum auth to Redwood. If you're planning to implement your own custom auth to RedwoodJS (aside from Ethereum), you may find it useful. Now the process is much more streamlined. Enjoy!

## Setup

If you haven't created a redwood app yet, you can do so now. See my [introductory blog post](https://patrickgallagher.dev/blog/2020/11/18/web3-redwood-intro/using-redwoodjs-to-create-an-ethereum-app) for more help getting started.

```
yarn create redwood-app myDapp
```

First let's do some scaffolding and install the necessary packages.

```bash
cd myDapp
yarn rw generate auth ethereum
```

Next we need to update our models, by adding `address` to `User` mode, and create a new `AuthDetail` model.

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

Now use the scaffold tool.

```bash
yarn rw generate scaffold user
```

Awesomesauce. Let's spin up our database!

```bash
yarn rw db save
yarn rw db up
```

If you

We're halfway there. Now let's create the service to verify Ethereum signatures.

```
yarn rw generate service ethereumAuth

```

Done! Continue normally using the official RedwoodJS docs on authentication: https://redwoodjs.com/docs/authentication

## Usage

TODO

## Additional Resources

Once you have things working, these resources may be helpful for adapting this package to your use-case. More docs/examples are welcome here!

### Implementing Role-based Access Control (RBAC)

https://redwoodjs.com/cookbook/role-based-access-control-rbac

### ✨ [Demo](https://redwood-web3-login-demo.vercel.app/)

## Contributing

If you're only editing this package, then you only need to update `@oneclickdapp/ethereum-auth` in your test redwood app. You can ignore the rest of this section.

If you're changes affect how RedwoodJS uses this package, then you'll need to do a bit more work. Things that may be affected include decoders in `@redwoodjs/api`, frontend tooling in `@redwoodjs/auth`, and CLI generators in `@redwoodjs/cli`. Feel free to adjust the commands below depending on which of these packages your changes affect.

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

## TODO

### Add a Generator for Redwood CLI

#### Web side

There is an additional @redwoodjs/web import.

```js
// web/src/index.js
import { RedwoodProvider, FatalErrorBoundary } from "@redwoodjs/web";

// Changes to add  import createGraphQLClient
import {
  RedwoodProvider,
  FatalErrorBoundary,
  createGraphQLClient
} from "@redwoodjs/web";
```

Then do the standard pattern. If you want to use a different auth server, you can substitute `graphQLClient` with your own.

```
import EthereumAuthClient from 'ethereumAuthClient'

const graphQLClient = createGraphQLClient();
const client = new EthereumAuthClient({client: graphQLClient})

<AuthProvider client={ethereumAuthClient} type="Ethereum">
```

#### Server side

- [] add decoder
- [] Generate stubs for the `services/auth/auth.js` and add `ethereumjs-util` and `eth-sig-util`
- [] Generate stubs for `lib/auth.js` and add `getCurrentUser()`
- [] Update the graphql function with `getCurrentUser`?

### Create a new Ethereum JWT decoder

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
