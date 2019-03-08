require('dotenv').config();
require('babel-register');
require('babel-polyfill');
const path = require("path");

if (!process.env.MNEMONIC)//|| !process.env.ENDPOINT || !process.env.ENDPOINT_POSFIX
  throw new Error("Missing .env file according to .env.example");

const HDWalletProvider = require('truffle-hdwallet-provider');

const providerWithMnemonic = (mnemonic, rpcEndpoint) =>
  new HDWalletProvider(mnemonic, rpcEndpoint, 0, 1); //, process.env.PASSWORD);

const infuraProvider = network => providerWithMnemonic(
  process.env.MNEMONIC || '',
  `https://${network}.infura.io/${process.env.INFURA_API_KEY}`
);

const rinkebyProvider = process.env.SOLIDITY_COVERAGE
  ? undefined
  : infuraProvider('rinkeby');

const ropstenProvider = process.env.SOLIDITY_COVERAGE
  ? undefined
  : infuraProvider('ropsten');

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*", // Match any network id
      gas: 8000006,
      gasPrice: 4000000000
    },
    ganache: {
      host: "127.0.0.1",
      port: 9545,
      network_id: "*", // Match any network id
      gas: 6003906,
      gasPrice: 5000000000
    },
    ganache_server: {
      host: "172.31.108.2",
      port: 8545,
      network_id: "*", // Match any network id
      gas: 8003906,
      gasPrice: 4000000000
    },
    // customMainnet: {
    //   provider: providerWithMnemonic(process.env.MNEMONIC, process.env.ENDPOINT + process.env.ENDPOINT_POSFIX),
    //   network_id: 1, // eslint-disable-line camelcase
    //   gas: 4605201,
    //   gasPrice: 10000000000,
    // },
    infuraMainnet: {
      provider: infuraProvider('mainnet'),
      network_id: 1, // eslint-disable-line camelcase
      gas: 8003906,
      gasPrice: 5000000000,
    },
    rinkeby: {
      provider: rinkebyProvider,
      network_id: 4, // eslint-disable-line camelcase
      gas: 6900569,
      gasPrice: 1000000000,
    },
    ropsten: {
      provider: ropstenProvider,
      network_id: 3, // eslint-disable-line camelcase
      gas: 7900000,
      gasPrice: 1000000000,
    }
  },
  mocha: {
    useColors: true,
    timeout: 30000
  },
  contracts_build_directory: path.join(__dirname, "src/contracts")
};