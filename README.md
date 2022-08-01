# Sovryn Monorepo
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)

Monorepo for design system, react components and blockchain wallet implementations.

## Packages

- [![npm](https://img.shields.io/npm/v/@sovryn/wallet.svg)](https://www.npmjs.com/package/@sovryn/wallet) [@sovryn/wallet](https://github.com/DistributedCollective/sovryn-monorepo/tree/master/packages/wallet)
- [![npm](https://img.shields.io/npm/v/@sovryn/react-wallet.svg)](https://www.npmjs.com/package/@sovryn/react-wallet) [@sovryn/react-wallet](https://github.com/DistributedCollective/sovryn-monorepo/tree/master/packages/react-wallet)
- [![npm](https://img.shields.io/npm/v/@sovryn/common.svg)](https://www.npmjs.com/package/@sovryn/common) [@sovryn/common](https://github.com/DistributedCollective/sovryn-monorepo/tree/master/packages/common)

## Development

Note: Please use yarn package manager for development.

```bash
yarn lerna:bootstrap
```

Try again if it fails, as there multiple packages that depend on each other one of them may be not build before another tries to use it.


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

## Publishing libraries

After all changes done you can publish new package versions to the npm:

```bash
yarn lerna:publish
```

This command:

- builds all packages
- increments version of changes packages
- publishes packages to the npm

**!!!** You must be signed to user with user write permissions to these packages. Permissions can be requested from @creed-victor or Sovryn dev-ops. 

## Contributing

<a href="https://github.com/DistributedCollective/sovryn-monorepo/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=DistributedCollective/sovryn-monorepo" />
</a>

### Bug Reports

To encourage active collaboration, Sovryn strongly encourages pull requests, not just bug reports. "Bug reports" may also be sent in the form of a pull request containing a failing test.

However, if you file a bug report, your issue should contain a title and a clear description of the issue. You should also include as much relevant information as possible. The goal of a bug report is to make it easy for yourself - and others - to replicate the bug and develop a fix.

Remember, bug reports are created in the hope that others with the same problem will be able to collaborate with you on solving it. Do not expect that the bug report will automatically see any activity or that others will jump to fix it. Creating a bug report serves to help yourself and others start on the path of fixing the problem. If you want to chip in, you can help out by fixing any bugs listed in our [issue trackers](https://github.com/issues?q=is%3Aopen+is%3Aissue+label%3Abug+user%3Adistributedcollective).

### Support Questions

Sovryn's GitHub issue trackers are not intended to provide help or support. Instead, use one of the following channels:

- [Discord](https://discord.gg/J22WS6z)
- [Sovryn Wiki](https://wiki.sovryn.app)
- [Sovryn Blog](https://sovryn.app/blog/)
- [Sovryn Forum](https://forum.sovryn.app)

### Core Development Discussion

You may propose new features or improvements of existing dapp behavior in the Sovryn Ideas issue board. If you propose a new feature, please be willing to implement at least some of the code that would be needed to complete the feature.

Informal discussion regarding bugs, new features, and implementation of existing features takes place in the #sorcery channel of the Sovryn Discord server.

### Which Branch?

**All** bug fixes should be sent to the latest stable (`main`) branch. Bug fixes should never be sent to the development branch unless they fix features that exist only in the upcoming release.

**Minor** features that are fully backward compatible with the current release may be sent to the latest stable branch.

**Major** new features should always be sent to the `development` branch, which contains the upcoming release.

If you are unsure if your feature qualifies as a major or minor, please ask Victor Creed in the #sorcery channel of the Sovryn Discord server.

### Working With UI

All UI designs used for this repository should be available publically in [Google Drive folder as Adobe XD files](https://drive.google.com/drive/folders/1e_VljWpANJe0o4VmIkKU5Ewo56l9iMaM?usp=sharing)

## Security Vulnerabilities

If you discover a security vulnerability within DApp, please send an e-mail to Victor Creed via victor@sovryn.app. All security vulnerabilities will be promptly addressed.

## Code of Conduct

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## Licence

The Sovryn Monorepo is open-sourced software licensed under the [MIT license](LICENSE).
