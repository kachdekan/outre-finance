const TronWeb = require('tronweb')
import { GRID_KEY } from 'app-env'

export let privateKey = null;

export const setPrivateKey = (key) => {
    privateKey = key;
}


export const tronWeb = new TronWeb({
  fullNode:'https://api.shasta.trongrid.io',
  solidityNode:'https://api.shasta.trongrid.io',
  eventServer:'https://api.shasta.trongrid.io',
  privateKey: privateKey,
  headers: { "TRON-PRO-API-KEY": GRID_KEY }
});