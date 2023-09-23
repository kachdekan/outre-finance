const asyncHandler = require('express-async-handler');
const { db } = require('../fbconfig');

// @desc    Add an encrypted wallet to user profile
// @route   GET /api/addWallet
// @access  Private
const addWallet = asyncHandler(async (req, res) => {
  const userCollection = db.collection('users').doc(req.user.id)
    try {
      const user = await userCollection.get(); 
      // if doesnt user exists, return error
      if (user.empty) {
        return res.status(400).send('User does not already exists')
      }else{
        const wallet = await userCollection.collection('wallets').doc(req.body.address).get()
        if (wallet.exists) {
          return res.status(400).send('Wallet exists')
        }else{
          await userCollection.collection('wallets').doc(req.body.address).create({
            enMnemonic: req.body.enMnemonic,
            enPrivateKey: req.body.enPrivateKey,
            publicKey: req.body.publicKey
          })
        return res.status(201).json({ _id: req.user.id, address: req.body.address, });
      } 
    }
} catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
});

module.exports = { addWallet }