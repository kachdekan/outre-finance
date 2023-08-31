import deployed from './Abis/Jsons/deployed.json';

const configCeloAlfajores = {
  jsonRpcUrlPrimary: 'https://rpc.ankr.com/polygon_mumbai', //'https://rpc-mumbai.maticvigil.com',
  blockscoutUrl: 'https://api-testnet.polygonscan.com',
  discordUrl: 'https://discord.gg/ht885KmG5A',
  name: 'mumbai',
  chainId: 80001,
  contractAddresses: {
    StableToken: '0xE097d6B3100777DC31B34dC2c58fB524C2e76921', // USDC
    MaticToken: '0x0000000000000000000000000000000000001010', // MATIC
    MinGasPrice: '0xd0Bf87a5936ee17014a057143a494Dc5C5d51E5e', // MinGasPrice
    Spaces: deployed[80001][0].contracts.Spaces.address, //deployed[chainId][0].contracts.Spaces.address,
    //P2PLoans: deployed[80001][0].contracts.P2PLoans.address, //deployed[chainId][0].contracts.P2PLoans.address,
    RoscaSpace: '0x0000000000000000000000000000000000000000',
    //PersonalSpace: deployed[80001][0].contracts.Personal.address, //deployed[chainId][0].contracts.PersonalSpace.address,
    GroupSpace: '0x0000000000000000000000000000000000000000',
  },
  nomspaceRegistry: '0x40cd4db228e9c172dA64513D0e874d009486A9a9',
  polyscan: 'WBZHWIYY8C52X75U89XS422VN2F3R36AZS',
};

exports.config = Object.freeze(configCeloAlfajores);
