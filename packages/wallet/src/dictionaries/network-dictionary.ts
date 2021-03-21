import { NetworkDetails } from '../models';
import { ConnectionType, ProviderType } from '../constants';
import { Optional } from '../types';
import { rskMainnet } from '../wallets/bip44/paths';

const defaultNetworks = [
  new NetworkDetails(30, 'RSK', ConnectionType.MAINNET, 'RBTC')
    .setLogo(
      'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNy4wMDIiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAxNy4wMDIgMjQiPgogIDxnIGlkPSJyc2tfbG9nbyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtMS4yKSI+CiAgICA8cGF0aCBpZD0iUGF0aF8yOTgyIiBkYXRhLW5hbWU9IlBhdGggMjk4MiIgZD0iTTIzLjIsMTMuMTUyVjQuNWE1LjI0LDUuMjQsMCwwLDAtMi44LDQuMzU4LDUuMDg3LDUuMDg3LDAsMCwwLDIuOCw0LjI5NCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE3LjA5NyAtMi43NzEpIiBmaWxsPSIjMDA2ZTNjIi8+CiAgICA8cGF0aCBpZD0iUGF0aF8yOTgzIiBkYXRhLW5hbWU9IlBhdGggMjk4MyIgZD0iTTM3LjksNC41YTUuMjQsNS4yNCwwLDAsMSwyLjgsNC4zNTgsNS4wODcsNS4wODcsMCwwLDEtMi44LDQuMjk0WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTMxLjc2NCAtMi43NzEpIiBmaWxsPSIjMDBiNDNjIi8+CiAgICA8cGF0aCBpZD0iUGF0aF8yOTg0IiBkYXRhLW5hbWU9IlBhdGggMjk4NCIgZD0iTTc4LjU4OCw3MC4wNDZsMy44NDUtMi4xNzlhMi42NjcsMi42NjcsMCwwLDAtMi42NDQtLjE0NCwyLjYwNiwyLjYwNiwwLDAsMC0xLjIsMi4zMjMiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC02NS44NDcgLTU1LjUwNykiIGZpbGw9IiMwMDZlM2MiLz4KICAgIDxwYXRoIGlkPSJQYXRoXzI5ODUiIGRhdGEtbmFtZT0iUGF0aCAyOTg1IiBkPSJNODIuNDQ1LDcwLjJhMi42NzgsMi42NzgsMCwwLDEtMS4yMzQsMi4zMzksMi41ODIsMi41ODIsMCwwLDEtMi42MTItLjE2WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTY1Ljg2IC01Ny44MzcpIiBmaWxsPSIjMDBiNDNjIi8+CiAgICA8cGF0aCBpZD0iUGF0aF8yOTg2IiBkYXRhLW5hbWU9IlBhdGggMjk4NiIgZD0iTTE2Ljc3NiwxMmEzLjQ0OCwzLjQ0OCwwLDAsMC0zLjA4Ny0uMSwzLjEwNiwzLjEwNiwwLDAsMC0xLjM3NCwyLjQ1N2wtLjUxNy4yOTFhMS40MzUsMS40MzUsMCwwLDAtLjk4Ni0uNCwxLjM2NiwxLjM2NiwwLDAsMC0uOTg2LjRMNy41LDEzLjI4OWExLjIzLDEuMjMsMCwwLDAsLjA0OC0uMzM5LDEuNDExLDEuNDExLDAsMCwwLTEuMDE4LTEuMzU4di0uODRjLjY3OS0uNDM2LDIuODQ0LTIuMDM2LDIuODQ0LTQuNTc0LDAtMi45NDEtMi45MDktNC43NjgtMy4wMzgtNC44NDhMNi4xMjUsMS4ybC0uMjEuMTI5Yy0uMTI5LjA4MS0zLjAzOCwxLjkwNy0zLjAzOCw0Ljg0OCwwLDIuNTM3LDIuMTY2LDQuMTIxLDIuODQ0LDQuNTc0di44NEExLjM5MiwxLjM5MiwwLDAsMCw0LjcsMTIuOTQ5YTEuMjMsMS4yMywwLDAsMCwuMDQ4LjMzOUwyLjQwOCwxNC42NDZhMS40MzUsMS40MzUsMCwwLDAtLjk4Ni0uNCwxLjQxOSwxLjQxOSwwLDAsMC0uNCwyLjc4djIuODEyYTEuNDE5LDEuNDE5LDAsMCwwLC40LDIuNzgsMS4zOTIsMS4zOTIsMCwwLDAsMS4wNTEtLjQ2OWwyLjI3OSwxLjMwOWExLjIzLDEuMjMsMCwwLDAtLjA0OC4zMzksMS40MjIsMS40MjIsMCwwLDAsMi44NDQsMCwxLjIzLDEuMjMsMCwwLDAtLjA0OC0uMzM5bDIuMjc5LTEuMzA5YTEuMzkyLDEuMzkyLDAsMCwwLDEuMDUxLjQ2OSwxLjQxOSwxLjQxOSwwLDAsMCwuNC0yLjc4VjE3LjAyMmExLjQyNSwxLjQyNSwwLDAsMCwxLjAxOC0xLjM1OCwxLjk5LDEuOTksMCwwLDAtLjAzMi0uMzIzbC41MTctLjI5MWEzLjY3NywzLjY3NywwLDAsMCwxLjU1Mi4zNzIsMi40ODUsMi40ODUsMCwwLDAsMS4yNjEtLjMyM0EzLjQ4MywzLjQ4MywwLDAsMCwxNywxMi4zODR2LS4yNDJabS01LjU2LDQuMTU0YS42NTguNjU4LDAsMCwxLS4zODguMTI5LjU3LjU3LDAsMCwxLS4yMjYtLjA0OC4zMzUuMzM1LDAsMCwxLS4xNjItLjEuNjU4LjY1OCwwLDAsMS0uMjQyLS40di0uMTc4YS42MjYuNjI2LDAsMCwxLC4zODgtLjVBLjUxNi41MTYsMCwwLDEsMTAuODEyLDE1YS41OS41OSwwLDAsMSwuMjQyLjA0OC42MzkuNjM5LDAsMCwxLC4zODguNTgyLjIuMiwwLDAsMS0uMDE2LjEuNTg3LjU4NywwLDAsMS0uMjEuNDJtLjIyNiw1LjA0MmEuNjMxLjYzMSwwLDAsMS0uNjMuNjMuNTQ2LjU0NiwwLDAsMS0uMzIzLS4xLjYzOS42MzksMCwwLDEtLjMwNy0uNTMzdi0uMDE2aDBhLjgxMS44MTEsMCwwLDEsLjAzMi0uMTk0LjY2My42NjMsMCwwLDEsLjQ4NS0uNDJjLjAzMiwwLC4wNjUtLjAxNi4xMTMtLjAxNmEuNjIyLjYyMiwwLDAsMSwuMzg4LjEyOS42MzYuNjM2LDAsMCwxLC4yNDIuNTE3bS0xLjAxOC0xLjM1OGExLjIzMiwxLjIzMiwwLDAsMC0uNTE3LjI3NWwtMi4zOTItMS4zOWgwYTEuNTkyLDEuNTkyLDAsMCwwLC4wMzItLjI3NSwxLjAzLDEuMDMsMCwwLDAtLjA2NS0uMzg4bDIuMzYtMS4zNzRhMS4zMjIsMS4zMjIsMCwwLDAsLjU4Mi4zMzlabS00LjMsNC41OWEuNjI5LjYyOSwwLDAsMS0uNjMtLjUzM3YtLjFhLjYzOS42MzksMCwwLDEsLjM4OC0uNTgyLjYzLjYzLDAsMCwxLC40ODUsMCwuNjM5LjYzOSwwLDAsMSwuMzg4LjU4MnYuMWEuNjU3LjY1NywwLDAsMS0uNjMuNTMzbS0xLjM5LTUuNzA1LTIuMzkyLDEuMzlhMS4yMzIsMS4yMzIsMCwwLDAtLjUxNy0uMjc1VjE3LjAyMmExLjMyMiwxLjMyMiwwLDAsMCwuNTgyLS4zMzlsMi4zNiwxLjM1OGExLjYyNSwxLjYyNSwwLDAsMC0uMDY1LjQsMS40MjMsMS40MjMsMCwwLDAsLjAzMi4yNzVaTTIuMDY5LDIxLjE5MmEuNi42LDAsMCwxLS4zMDcuNTMzLjU4My41ODMsMCwwLDEtLjMyMy4xLjYzMS42MzEsMCwwLDEtLjYzLS42My42NTMuNjUzLDAsMCwxLC4yNDItLjUuNjU4LjY1OCwwLDAsMSwuMzg4LS4xMjkuMjc1LjI3NSwwLDAsMSwuMTEzLjAxNi41NDQuNTQ0LDAsMCwxLC4yNzUuMTI5LjY0Ni42NDYsMCwwLDEsLjIxLjI5MS44MTEuODExLDAsMCwxLC4wMzIuMTk0aDBNLjc5MiwxNS42NjVhLjYzMS42MzEsMCwwLDEsLjYzLS42My41MTYuNTE2LDAsMCwxLC4yMjYuMDQ4LjYyNi42MjYsMCwwLDEsLjM4OC41di4xOTRhLjU5My41OTMsMCwwLDEtLjI0Mi40LDEuNDIxLDEuNDIxLDAsMCwxLS4xNjIuMS41MTYuNTE2LDAsMCwxLS4yMjYuMDQ4LjYyMi42MjIsMCwwLDEtLjM4OC0uMTI5Ljg3NC44NzQsMCwwLDEtLjIyNi0uNTMzbTQuOTQ1LTMuMjE2YS42NTguNjU4LDAsMCwxLC4zODgtLjEyOS42MjIuNjIyLDAsMCwxLC4zODguMTI5LjU3My41NzMsMCwwLDEsLjIyNi40di4xYS42NTMuNjUzLDAsMCwxLS4yNDIuNSwxLjQyMSwxLjQyMSwwLDAsMS0uMTYyLjEuNTUyLjU1MiwwLDAsMS0uNDUzLDAsLjMzNS4zMzUsMCwwLDEtLjE2Mi0uMS42MjguNjI4LDAsMCwxLS4yNDItLjV2LS4xYS43NjQuNzY0LDAsMCwxLC4yNTktLjRtMS4wMTgsNi4wMTJhLjU4OS41ODksMCwwLDEtLjI0Mi40NjljLS4wMzIuMDE2LS4wNjUuMDQ4LS4xLjA2NWEuNjY4LjY2OCwwLDAsMS0uMzA3LjA4MS41NTguNTU4LDAsMCwxLS4yOTEtLjA4MS4zMzguMzM4LDAsMCwxLS4xLS4wNjUuNjIuNjIsMCwwLDEtLjI0Mi0uNDg1di0uMDE2YS41LjUsMCwwLDEsLjAxNi0uMTYyLjc1MS43NTEsMCwwLDEsLjIxLS4zMzkuNTYyLjU2MiwwLDAsMSwuMjQyLS4xMTMuNS41LDAsMCwxLC4xNjItLjAxNi41LjUsMCwwLDEsLjE2Mi4wMTYuNi42LDAsMCwxLC4yMjYuMTEzLjYyOS42MjksMCwwLDEsLjIxLjMyMy42MDYuNjA2LDAsMCwxLC4wMTYuMTc4Yy4wMzIuMDE2LjAzMi4wMzIuMDMyLjAzMlptMi42ODMtMy4xMzVhMS4yMywxLjIzLDAsMCwwLS4wNDguMzM5LDEuMzQ2LDEuMzQ2LDAsMCwwLC4wNDguMzU2TDcuMDYzLDE3LjM5NGExLjQyLDEuNDIsMCwwLDAtLjU0OS0uMzA3di0yLjc4YTEuMzIyLDEuMzIyLDAsMCwwLC41ODItLjMzOVpNMy42NjksNi4xOTRjMC0yLjA4NSwxLjgyNi0zLjU4OCwyLjQ1Ny00LjA0LjYzLjQ1MywyLjQ1NywxLjk1NiwyLjQ1Nyw0LjA0QTQuODEsNC44MSwwLDAsMSw2LjUxMyw5LjhWNi41YS4zOTMuMzkzLDAsMCwwLS4zODgtLjM4OC4zODMuMzgzLDAsMCwwLS4zODguMzg4VjkuOGE0Ljc2Myw0Ljc2MywwLDAsMS0yLjA2OS0zLjZtMS40NzEsNy43NzRhMS40MTgsMS40MTgsMCwwLDAsLjU4Mi4zMzl2Mi43OGExLjYyOSwxLjYyOSwwLDAsMC0uNTQ5LjI5MUwyLjc4LDE2YTEuMjEyLDEuMjEyLDAsMCwwLDAtLjY3OVpNMi44MjgsMjEuNDM0YTEuMjIzLDEuMjIzLDAsMCwwLC4wMTYtLjI0MiwxLjM2MSwxLjM2MSwwLDAsMC0uMDY1LS40MzZsMi4zMjctMS4zNDFhMS40ODQsMS40ODQsMCwwLDAsLjYzLjM4OHYyLjYzNGExLjQ3NiwxLjQ3NiwwLDAsMC0uNi4zMzlabTQuMjgzLDEuMzQxYTEuMzc3LDEuMzc3LDAsMCwwLS42LS4zMzlWMTkuOGExLjM0MiwxLjM0MiwwLDAsMCwuNjMtLjM4OGwyLjMyNywxLjM0MWExLjIzOSwxLjIzOSwwLDAsMC0uMDY1LjQzNiwxLjIyMywxLjIyMywwLDAsMCwuMDE2LjI0MlpNMTUuMTI3LDE0LjRhMi4xLDIuMSwwLDAsMS0xLjU1Mi4xMjlsLjc3Ni0uNDUzYS4zOTEuMzkxLDAsMSwwLS4zODgtLjY3OWwtLjc3Ni40NTNhMi4wNTksMi4wNTksMCwwLDEsLjg4OS0xLjI3NywyLjQzOCwyLjQzOCwwLDAsMSwyLjA4NS4wMTYsMi40ODEsMi40ODEsMCwwLDEtMS4wMzQsMS44MSIgZmlsbD0iI2U5ZWFlOSIvPgogIDwvZz4KPC9zdmc+Cg==',
    )
    .setWalletDPaths(ProviderType.LEDGER, [rskMainnet]),
  new NetworkDetails(
    31,
    'RSK Testnet',
    ConnectionType.TESTNET,
    'tRBTC',
  ).setLogo(
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNy4wMDIiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAxNy4wMDIgMjQiPgogIDxnIGlkPSJyc2tfbG9nbyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtMS4yKSI+CiAgICA8cGF0aCBpZD0iUGF0aF8yOTgyIiBkYXRhLW5hbWU9IlBhdGggMjk4MiIgZD0iTTIzLjIsMTMuMTUyVjQuNWE1LjI0LDUuMjQsMCwwLDAtMi44LDQuMzU4LDUuMDg3LDUuMDg3LDAsMCwwLDIuOCw0LjI5NCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE3LjA5NyAtMi43NzEpIiBmaWxsPSIjMDA2ZTNjIi8+CiAgICA8cGF0aCBpZD0iUGF0aF8yOTgzIiBkYXRhLW5hbWU9IlBhdGggMjk4MyIgZD0iTTM3LjksNC41YTUuMjQsNS4yNCwwLDAsMSwyLjgsNC4zNTgsNS4wODcsNS4wODcsMCwwLDEtMi44LDQuMjk0WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTMxLjc2NCAtMi43NzEpIiBmaWxsPSIjMDBiNDNjIi8+CiAgICA8cGF0aCBpZD0iUGF0aF8yOTg0IiBkYXRhLW5hbWU9IlBhdGggMjk4NCIgZD0iTTc4LjU4OCw3MC4wNDZsMy44NDUtMi4xNzlhMi42NjcsMi42NjcsMCwwLDAtMi42NDQtLjE0NCwyLjYwNiwyLjYwNiwwLDAsMC0xLjIsMi4zMjMiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC02NS44NDcgLTU1LjUwNykiIGZpbGw9IiMwMDZlM2MiLz4KICAgIDxwYXRoIGlkPSJQYXRoXzI5ODUiIGRhdGEtbmFtZT0iUGF0aCAyOTg1IiBkPSJNODIuNDQ1LDcwLjJhMi42NzgsMi42NzgsMCwwLDEtMS4yMzQsMi4zMzksMi41ODIsMi41ODIsMCwwLDEtMi42MTItLjE2WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTY1Ljg2IC01Ny44MzcpIiBmaWxsPSIjMDBiNDNjIi8+CiAgICA8cGF0aCBpZD0iUGF0aF8yOTg2IiBkYXRhLW5hbWU9IlBhdGggMjk4NiIgZD0iTTE2Ljc3NiwxMmEzLjQ0OCwzLjQ0OCwwLDAsMC0zLjA4Ny0uMSwzLjEwNiwzLjEwNiwwLDAsMC0xLjM3NCwyLjQ1N2wtLjUxNy4yOTFhMS40MzUsMS40MzUsMCwwLDAtLjk4Ni0uNCwxLjM2NiwxLjM2NiwwLDAsMC0uOTg2LjRMNy41LDEzLjI4OWExLjIzLDEuMjMsMCwwLDAsLjA0OC0uMzM5LDEuNDExLDEuNDExLDAsMCwwLTEuMDE4LTEuMzU4di0uODRjLjY3OS0uNDM2LDIuODQ0LTIuMDM2LDIuODQ0LTQuNTc0LDAtMi45NDEtMi45MDktNC43NjgtMy4wMzgtNC44NDhMNi4xMjUsMS4ybC0uMjEuMTI5Yy0uMTI5LjA4MS0zLjAzOCwxLjkwNy0zLjAzOCw0Ljg0OCwwLDIuNTM3LDIuMTY2LDQuMTIxLDIuODQ0LDQuNTc0di44NEExLjM5MiwxLjM5MiwwLDAsMCw0LjcsMTIuOTQ5YTEuMjMsMS4yMywwLDAsMCwuMDQ4LjMzOUwyLjQwOCwxNC42NDZhMS40MzUsMS40MzUsMCwwLDAtLjk4Ni0uNCwxLjQxOSwxLjQxOSwwLDAsMC0uNCwyLjc4djIuODEyYTEuNDE5LDEuNDE5LDAsMCwwLC40LDIuNzgsMS4zOTIsMS4zOTIsMCwwLDAsMS4wNTEtLjQ2OWwyLjI3OSwxLjMwOWExLjIzLDEuMjMsMCwwLDAtLjA0OC4zMzksMS40MjIsMS40MjIsMCwwLDAsMi44NDQsMCwxLjIzLDEuMjMsMCwwLDAtLjA0OC0uMzM5bDIuMjc5LTEuMzA5YTEuMzkyLDEuMzkyLDAsMCwwLDEuMDUxLjQ2OSwxLjQxOSwxLjQxOSwwLDAsMCwuNC0yLjc4VjE3LjAyMmExLjQyNSwxLjQyNSwwLDAsMCwxLjAxOC0xLjM1OCwxLjk5LDEuOTksMCwwLDAtLjAzMi0uMzIzbC41MTctLjI5MWEzLjY3NywzLjY3NywwLDAsMCwxLjU1Mi4zNzIsMi40ODUsMi40ODUsMCwwLDAsMS4yNjEtLjMyM0EzLjQ4MywzLjQ4MywwLDAsMCwxNywxMi4zODR2LS4yNDJabS01LjU2LDQuMTU0YS42NTguNjU4LDAsMCwxLS4zODguMTI5LjU3LjU3LDAsMCwxLS4yMjYtLjA0OC4zMzUuMzM1LDAsMCwxLS4xNjItLjEuNjU4LjY1OCwwLDAsMS0uMjQyLS40di0uMTc4YS42MjYuNjI2LDAsMCwxLC4zODgtLjVBLjUxNi41MTYsMCwwLDEsMTAuODEyLDE1YS41OS41OSwwLDAsMSwuMjQyLjA0OC42MzkuNjM5LDAsMCwxLC4zODguNTgyLjIuMiwwLDAsMS0uMDE2LjEuNTg3LjU4NywwLDAsMS0uMjEuNDJtLjIyNiw1LjA0MmEuNjMxLjYzMSwwLDAsMS0uNjMuNjMuNTQ2LjU0NiwwLDAsMS0uMzIzLS4xLjYzOS42MzksMCwwLDEtLjMwNy0uNTMzdi0uMDE2aDBhLjgxMS44MTEsMCwwLDEsLjAzMi0uMTk0LjY2My42NjMsMCwwLDEsLjQ4NS0uNDJjLjAzMiwwLC4wNjUtLjAxNi4xMTMtLjAxNmEuNjIyLjYyMiwwLDAsMSwuMzg4LjEyOS42MzYuNjM2LDAsMCwxLC4yNDIuNTE3bS0xLjAxOC0xLjM1OGExLjIzMiwxLjIzMiwwLDAsMC0uNTE3LjI3NWwtMi4zOTItMS4zOWgwYTEuNTkyLDEuNTkyLDAsMCwwLC4wMzItLjI3NSwxLjAzLDEuMDMsMCwwLDAtLjA2NS0uMzg4bDIuMzYtMS4zNzRhMS4zMjIsMS4zMjIsMCwwLDAsLjU4Mi4zMzlabS00LjMsNC41OWEuNjI5LjYyOSwwLDAsMS0uNjMtLjUzM3YtLjFhLjYzOS42MzksMCwwLDEsLjM4OC0uNTgyLjYzLjYzLDAsMCwxLC40ODUsMCwuNjM5LjYzOSwwLDAsMSwuMzg4LjU4MnYuMWEuNjU3LjY1NywwLDAsMS0uNjMuNTMzbS0xLjM5LTUuNzA1LTIuMzkyLDEuMzlhMS4yMzIsMS4yMzIsMCwwLDAtLjUxNy0uMjc1VjE3LjAyMmExLjMyMiwxLjMyMiwwLDAsMCwuNTgyLS4zMzlsMi4zNiwxLjM1OGExLjYyNSwxLjYyNSwwLDAsMC0uMDY1LjQsMS40MjMsMS40MjMsMCwwLDAsLjAzMi4yNzVaTTIuMDY5LDIxLjE5MmEuNi42LDAsMCwxLS4zMDcuNTMzLjU4My41ODMsMCwwLDEtLjMyMy4xLjYzMS42MzEsMCwwLDEtLjYzLS42My42NTMuNjUzLDAsMCwxLC4yNDItLjUuNjU4LjY1OCwwLDAsMSwuMzg4LS4xMjkuMjc1LjI3NSwwLDAsMSwuMTEzLjAxNi41NDQuNTQ0LDAsMCwxLC4yNzUuMTI5LjY0Ni42NDYsMCwwLDEsLjIxLjI5MS44MTEuODExLDAsMCwxLC4wMzIuMTk0aDBNLjc5MiwxNS42NjVhLjYzMS42MzEsMCwwLDEsLjYzLS42My41MTYuNTE2LDAsMCwxLC4yMjYuMDQ4LjYyNi42MjYsMCwwLDEsLjM4OC41di4xOTRhLjU5My41OTMsMCwwLDEtLjI0Mi40LDEuNDIxLDEuNDIxLDAsMCwxLS4xNjIuMS41MTYuNTE2LDAsMCwxLS4yMjYuMDQ4LjYyMi42MjIsMCwwLDEtLjM4OC0uMTI5Ljg3NC44NzQsMCwwLDEtLjIyNi0uNTMzbTQuOTQ1LTMuMjE2YS42NTguNjU4LDAsMCwxLC4zODgtLjEyOS42MjIuNjIyLDAsMCwxLC4zODguMTI5LjU3My41NzMsMCwwLDEsLjIyNi40di4xYS42NTMuNjUzLDAsMCwxLS4yNDIuNSwxLjQyMSwxLjQyMSwwLDAsMS0uMTYyLjEuNTUyLjU1MiwwLDAsMS0uNDUzLDAsLjMzNS4zMzUsMCwwLDEtLjE2Mi0uMS42MjguNjI4LDAsMCwxLS4yNDItLjV2LS4xYS43NjQuNzY0LDAsMCwxLC4yNTktLjRtMS4wMTgsNi4wMTJhLjU4OS41ODksMCwwLDEtLjI0Mi40NjljLS4wMzIuMDE2LS4wNjUuMDQ4LS4xLjA2NWEuNjY4LjY2OCwwLDAsMS0uMzA3LjA4MS41NTguNTU4LDAsMCwxLS4yOTEtLjA4MS4zMzguMzM4LDAsMCwxLS4xLS4wNjUuNjIuNjIsMCwwLDEtLjI0Mi0uNDg1di0uMDE2YS41LjUsMCwwLDEsLjAxNi0uMTYyLjc1MS43NTEsMCwwLDEsLjIxLS4zMzkuNTYyLjU2MiwwLDAsMSwuMjQyLS4xMTMuNS41LDAsMCwxLC4xNjItLjAxNi41LjUsMCwwLDEsLjE2Mi4wMTYuNi42LDAsMCwxLC4yMjYuMTEzLjYyOS42MjksMCwwLDEsLjIxLjMyMy42MDYuNjA2LDAsMCwxLC4wMTYuMTc4Yy4wMzIuMDE2LjAzMi4wMzIuMDMyLjAzMlptMi42ODMtMy4xMzVhMS4yMywxLjIzLDAsMCwwLS4wNDguMzM5LDEuMzQ2LDEuMzQ2LDAsMCwwLC4wNDguMzU2TDcuMDYzLDE3LjM5NGExLjQyLDEuNDIsMCwwLDAtLjU0OS0uMzA3di0yLjc4YTEuMzIyLDEuMzIyLDAsMCwwLC41ODItLjMzOVpNMy42NjksNi4xOTRjMC0yLjA4NSwxLjgyNi0zLjU4OCwyLjQ1Ny00LjA0LjYzLjQ1MywyLjQ1NywxLjk1NiwyLjQ1Nyw0LjA0QTQuODEsNC44MSwwLDAsMSw2LjUxMyw5LjhWNi41YS4zOTMuMzkzLDAsMCwwLS4zODgtLjM4OC4zODMuMzgzLDAsMCwwLS4zODguMzg4VjkuOGE0Ljc2Myw0Ljc2MywwLDAsMS0yLjA2OS0zLjZtMS40NzEsNy43NzRhMS40MTgsMS40MTgsMCwwLDAsLjU4Mi4zMzl2Mi43OGExLjYyOSwxLjYyOSwwLDAsMC0uNTQ5LjI5MUwyLjc4LDE2YTEuMjEyLDEuMjEyLDAsMCwwLDAtLjY3OVpNMi44MjgsMjEuNDM0YTEuMjIzLDEuMjIzLDAsMCwwLC4wMTYtLjI0MiwxLjM2MSwxLjM2MSwwLDAsMC0uMDY1LS40MzZsMi4zMjctMS4zNDFhMS40ODQsMS40ODQsMCwwLDAsLjYzLjM4OHYyLjYzNGExLjQ3NiwxLjQ3NiwwLDAsMC0uNi4zMzlabTQuMjgzLDEuMzQxYTEuMzc3LDEuMzc3LDAsMCwwLS42LS4zMzlWMTkuOGExLjM0MiwxLjM0MiwwLDAsMCwuNjMtLjM4OGwyLjMyNywxLjM0MWExLjIzOSwxLjIzOSwwLDAsMC0uMDY1LjQzNiwxLjIyMywxLjIyMywwLDAsMCwuMDE2LjI0MlpNMTUuMTI3LDE0LjRhMi4xLDIuMSwwLDAsMS0xLjU1Mi4xMjlsLjc3Ni0uNDUzYS4zOTEuMzkxLDAsMSwwLS4zODgtLjY3OWwtLjc3Ni40NTNhMi4wNTksMi4wNTksMCwwLDEsLjg4OS0xLjI3NywyLjQzOCwyLjQzOCwwLDAsMSwyLjA4NS4wMTYsMi40ODEsMi40ODEsMCwwLDEtMS4wMzQsMS44MSIgZmlsbD0iI2U5ZWFlOSIvPgogIDwvZz4KPC9zdmc+Cg==',
  ),
  // .setWalletDPaths(ProviderType.LEDGER, [rskTestnet]), // RSK Testnet
  // .setWalletDPaths(ProviderType.LEDGER, ["m/44'/137'/0'/0"]), // RSK mainnet
  // .setWalletDPaths(ProviderType.LEDGER, ["44'/0'/0'/0/0"]) // BTC
  // .setWalletDPaths(ProviderType.LEDGER, ["m/44'/60'/0'/0"]), // Ledger Live ETH
  // .setWalletDPaths(ProviderType.LEDGER, ["m/44'/60'/0'"]), // MyEther WalletService ETH
];

export class NetworkDictionary {
  private _networks: NetworkDetails[] = [];

  constructor(networks: NetworkDetails[] = defaultNetworks) {
    this._networks = networks;
  }

  public set(networks: NetworkDetails[]) {
    this._networks = networks;
    return this;
  }

  public add(network: NetworkDetails | NetworkDetails[]) {
    if (Array.isArray(network)) {
      this._networks.push(...network);
    } else {
      this._networks.push(network);
    }
    return this;
  }

  public list(): NetworkDetails[];
  public list(networkType: ConnectionType): NetworkDetails[];
  public list(networkType?: ConnectionType): NetworkDetails[] {
    if (networkType !== undefined) {
      return this._networks.filter(
        item => item.getNetworkType() === networkType,
      );
    }
    return this._networks;
  }

  public get(chainId: number): Optional<NetworkDetails> {
    return this._networks.find(item => item.getChainId() === chainId);
  }
}
