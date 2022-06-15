
# Wallet firewall

Wallet firewall is a firewall built between wallet and dapp, it can help us to observe the requests between dapp and wallet, 

on top of that we can add some protection rules like: if we find dapp request `setApprovalForAll`, and the domain name of dapp is not in the domain whitelist, remind the user to confirm the risk, etc.

NOTE: It's a client version of [page-analytics](https://github.com/scamsniffer/page-analytics)


## How To Use

- [Tampermonkey](https://greasyfork.org/scripts/446501-web3-wallet-firewall)
