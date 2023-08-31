require("@nomicfoundation/hardhat-toolbox");
require('hardhat-deploy')
require('hardhat-abi-exporter')
require('@nomiclabs/hardhat-ethers')
require('dotenv').config({path:__dirname+'/.env'})

const defaultNetwork = 'mumbai'
const mnemonicPath = "m/44'/52752'/0'/0/" 
const {DEV_MNEMONIC, ACC1, ACC2} = process.env

// This is the mnemonic used by celo-devchain
const DEVCHAIN_MNEMONIC =
  'concert load couple harbor equip island argue ramp clarify fence smart topic'

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  defaultNetwork,
  paths: {
    sources: './src',
  },
  abiExporter: {
    path: '../dapp/blockchain/Abis/Jsons',
    only: ['Spaces', 'Rosca', 'Personal', 'P2PLoans'],
    runOnCompile: true,
    clear: true,
    flat: true,
  },
  networks: {
    hardhat: {
      accounts: {
        mnemonic: DEV_MNEMONIC,
        path: mnemonicPath,
        count: 5,
      },
      forking: {
       url: 'https://rpc-mumbai.maticvigil.com'
      }
    },
    localhost: {
      url: 'http://127.0.0.1:7545',
      chainId: 31337,
      accounts: [ACC1, ACC2],
      gasPrice: 2500000000,
      gas: 35000000,
    },
    mumbai: {
      url: 'https://rpc-mumbai.maticvigil.com',
      accounts: [ACC1, ACC2],
      gasPrice: 1550000000,
      gas: 35000000,
      chainId: 80001,
      loggingEnabled: true,
    },
  },
  namedAccounts: {
    deployer: 0,
  },
    typechain: {
    outDir: 'types',
    target: 'ethers-v5', //web3-v1
    alwaysGenerateOverloads: false, // should overloads with full signatures like deposit(uint256) be generated always, even if there are no overloads?
    externalArtifacts: ['externalArtifacts/*.json'], // optional array of glob patterns with external artifacts to process (for example external libs from node_modules)
  },
};

task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners()

  for (const account of accounts) {
    console.log(account.address)
  }
})

task(
  'devchain-keys',
  'Prints the private keys associated with the devchain',
  async (taskArgs, hre) => {
    const accounts = await hre.ethers.getSigners()
    const hdNode = hre.ethers.utils.HDNode.fromMnemonic(DEVCHAIN_MNEMONIC)
    for (let i = 0; i < accounts.length; i++) {
      const account = hdNode.derivePath(`m/44'/60'/0'/0/${i}`)
      console.log(`Account ${i}\nAddress: ${account.address}\nKey: ${account.privateKey}`)
    }
  },
)
