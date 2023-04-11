# DAuction

This project is built with the React Truffle Box.

https://trufflesuite.com/boxes/react/

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
