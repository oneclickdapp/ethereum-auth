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

### 🏠 [Homepage](todo)

### ✨ [Demo](https://redwood-web3-login-demo.vercel.app/)

## Contributing

Unfortunately, `yarn link` will not work for redwood local development (sorry!). Please follow the **Local Package Registry Emulation** method here https://github.com/redwoodjs/redwood/blob/main/CONTRIBUTING.md#local-development

Once verdaccio is running, use this command to only build `@redwoodjs/auth`.

```bash
./tasks/publish-local ./packages/auth
```

Then in your test redwood app

```bash
yarn rwt install @redwoodjs/auth
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

- [] Generate stubs for the `services/auth/auth.js`
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
