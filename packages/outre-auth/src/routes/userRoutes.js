const express = require('express');
const {
  authUser,
  registerUser,
  changePassword,
  //logoutUser,
  getUserProfile,
  updateUserProfile,
} = require('../controllers/userController');
const { addWallet } = require('../controllers/walletsController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/auth', authUser);
//router.post('/logout', logoutUser);
router.post("/changepass", changePassword);
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router.post('/addWallet', protect, addWallet);

module.exports = router;