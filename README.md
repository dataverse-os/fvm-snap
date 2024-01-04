# Fvm-Snap Monorepo

This repository is a MetaMask snap for interacting with FEVM RaaS services which allows uploading small files to Lighthouse and synthesizing large files for storage on the Filecoin network.

For more information, see the documentation below: 
- [MetaMask Snap](https://docs.metamask.io/guide/snaps.html)
- [Data replication, renewal and repair (RaaS)](https://docs.filecoin.io/smart-contracts/programmatic-storage/raas)

## Packages

- [site](https://github.com/dataverse-os/fvm-snap/tree/main/packages/site) - Fvm snap fontend for Metamask
- [snap](https://github.com/dataverse-os/fvm-snap/tree/main/packages/snap) - Snap backend
- [raas](https://github.com/dataverse-os/fvm-snap/tree/main/packages/raas) - Provider for FEVM RaaS services

## Getting Started

Requirements:
- [MetaMask Flask](https://metamask.io/flask/) - A cryptocurrency wallet browser extension.
- [Node.js](https://nodejs.org/en/) version >= 18.
- [pnpm](https://pnpm.io/) version >= 8.

Clone [the repository](https://github.com/dataverse-os/fvm-snap.git) and setup the development environment:

```shell
pnpm install
pnpm build:raas
pnpm start
```

**Notes:**
- If you cloud not connect to Metamask Snap, and received an error like `request time out`, please check if you can open the [link](https://execution.consensys.io/3.1.0/index.html), which is used by Metamask Snap but sometimes blocked by Cloudflare because of impure IP(may be related to your proxy).

## Cloning

This repository contains GitHub Actions that you may find useful, see `.github/workflows` and [Releasing & Publishing](https://github.com/MetaMask/template-snap-monorepo/edit/main/README.md#releasing--publishing) below for more information.

If you clone or create this repository outside the MetaMask GitHub organization, you probably want to run `./scripts/cleanup.sh` to remove some files that will not work properly outside the MetaMask GitHub organization.

Note that the `action-publish-release.yml` workflow contains a step that publishes the frontend of this snap (contained in the `public/` directory) to GitHub pages. If you do not want to publish the frontend to GitHub pages, simply remove the step named "Publish to GitHub Pages" in that workflow.

If you don't wish to use any of the existing GitHub actions in this repository, simply delete the `.github/workflows` directory.

## Contributing

Contributions to this project are welcome. To contribute, please follow these steps:

1. Fork the repository and create a new branch.
2. Make your changes and test them thoroughly.
3. Submit a pull request with a detailed description of your changes.

Run `pnpm test` to run the tests once.

Run `pnpm lint` to run the linter, or run `pnpm lint:fix` to run the linter and fix any automatically fixable issues.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.MIT0) file for details.