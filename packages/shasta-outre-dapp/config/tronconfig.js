const TronWeb = require('tronweb');
import { GRID_KEY } from 'app-env';

export let privateKey = null;
export let tronWeb = null;

export const setPrivateKey = (key) => {
  privateKey = key.slice(2);
  tronWeb = new TronWeb({
    fullNode: 'https://api.shasta.trongrid.io',
    solidityNode: 'https://api.shasta.trongrid.io',
    eventServer: 'https://api.shasta.trongrid.io',
    privateKey: privateKey,
    headers: { 'TRON-PRO-API-KEY': GRID_KEY },
  });
};
