import deployed from './Abis/Jsons/deployed.json';

const configCeloAlfajores = {
  jsonRpcUrlPrimary: 'https://alfajores-forno.celo-testnet.org',
  blockscoutUrl: 'https://explorer.celo.org/alfajores',
  discordUrl: 'https://discord.gg/ht885KmG5A',
  name: 'alfajores',
  chainId: 44787,
  contractAddresses: {
    StableToken: '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1', // cUSD
    StableTokenEUR: '0x10c892A6EC43a53E45D0B916B4b7D383B1b78C0F', // cEUR
    StableTokenBRL: '0xE4D517785D091D3c54818832dB6094bcc2744545', // cBRL
    GoldToken: '0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9', // cGLD
    Exchange: '0x17bc3304F94c85618c46d0888aA937148007bD3C', // Exchange cUSD
    ExchangeEUR: '0x997B494F17D3c49E66Fafb50F37A972d8Db9325B', // Exchange cEUR
    ExchangeBRL: '0xf391DcaF77360d39e566b93c8c0ceb7128fa1A08', // Exchange cBRL
    MinGasPrice: '0xd0Bf87a5936ee17014a057143a494Dc5C5d51E5e', // MinGasPrice
    Spaces: deployed[44787][0].contracts.Spaces.address, //deployed[chainId][0].contracts.Spaces.address,
    P2PLoans: deployed[44787][0].contracts.P2PLoans.address, //deployed[chainId][0].contracts.P2PLoans.address,
    RoscaSpace: '0x0000000000000000000000000000000000000000',
    PersonalSpace: deployed[44787][0].contracts.Personal.address, //deployed[chainId][0].contracts.PersonalSpace.address,
    GroupSpace: '0x0000000000000000000000000000000000000000',
  },
  nomspaceRegistry: '0x40cd4db228e9c172dA64513D0e874d009486A9a9',
};

exports.config = Object.freeze(configCeloAlfajores);
