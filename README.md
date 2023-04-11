# DAuction

## Scope and design

### Overview

This project aims to build a decentralized online auction platform with the smart contract on Ethereum. The front-end of the project is a single-page application implemented with React. The back-end of the project is implemented with smart contract on Ethereum. 

### Features

- Easy to use: Users can directly use their crypto wallet in our application, no registration in our application is required
- Anonymity: No user information needs to be collected other than their crypto wallet address
- Low service fee: Users only need to pay gas fees to participate in auctions, there is no additional service fee for the auction
- Decentralization: No centralized databases are used. All data about auctions are stored on the Ethereum blockchain and those data are immutable

### Deployment

- The front-end React application is deployed and tested on AWS EC2 t3.small machine

- The back-end smart contract is deployed and tested on the Sepolia Testnet

- Please note that users not only can directly utilize the deployed front-end application on AWS, but also can build and host the front-end application locally. Both approaches provide access to the deployed contract on the public blockchain networks


## How to run the application

All procedures below are applicable for Ubuntu 22.04 LTS

1. Install Node.js with following commands

```sh
$ sudo apt-get update
$ sudo apt-get upgrade
$ sudo apt-get install curl
$ curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
$ sudo apt-get install nodejs
```

2. Install truffle with the following command

```sh
$ npm install -g truffle
```

3. Install the dependencies in the client folder with following commands

```sh
$ cd client
$ npm install
```

4. Download Ganache and create a new workspace

5. Add the local network to Metamask, then reset wallet with the MNEMONIC on Ganache

6. Migrate the contract on local network with following commands

```sh
$ cd truffle
$ truffle migrate --network development
```

7. Run the application with following commands

```sh
$ cd client
$ npm start
```

8. Visit localhost:8080 to start using the application


## Reference 

This project is built base on React Truffle Box.

https://trufflesuite.com/boxes/react/
