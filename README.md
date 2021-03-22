# Sovryn Monorepo
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)

Monorepo for design system, react components and blockchain wallet implementations.

## Packages

- [![npm](https://img.shields.io/npm/v/@sovryn/wallet.svg)](https://www.npmjs.com/package/@sovryn/wallet) [@sovryn/wallet](https://github.com/DistributedCollective/sovryn-monorepo/tree/master/packages/wallet)
- [![npm](https://img.shields.io/npm/v/@sovryn/react-wallet.svg)](https://www.npmjs.com/package/@sovryn/react-wallet) [@sovryn/wallet](https://github.com/DistributedCollective/sovryn-monorepo/tree/master/packages/react-wallet)

## Development

```bash
lerna bootstrap
```

If you want to use some of packages in another project when updating package, for example you are working with wallet package - then run these:

```bash
cd packages/wallet
yarn link
```

And if you want to use and test wallet package in sovryn-frontend project you run this too:

```bash
cd {YourProjectsPath}/Sovryn-frontend
yarn link @sovryn/wallet
```
