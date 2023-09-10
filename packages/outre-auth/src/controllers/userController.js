const asyncHandler = require('express-async-handler');
const { db } = require('../fbconfig');
const { generateUID } = require('../utils/generateUID');
const { generateToken } = require('../utils/generateToken');

//@desc    Auth user & get token
// @route   POST /api/users/auth
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { phone, password } = req.body;

  const user = await db.collection('users').where('phone', '==', phone).get()
  const matchPassword = user.docs[0].data().password === password;
  if (!user.empty && matchPassword) {
    generateToken(res, user.docs[0].id);
    
    res.json({
      _id: user.docs[0].id,
      phone: user.docs[0].data().phone,
    });
  } else {
    res.status(401);
    throw new Error('Invalid phone or pin');
  }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const userId = generateUID();
    try {
      const user = await db.collection('users').where('phone', '==', req.body.phone).get()
      // if user exists, return error
      if (!user.empty) {
        return res.status(400).send('User already exists')
      }else{
        await db.collection('users').doc('/' + userId + '/').create({
          password: req.body.password,
          phone: req.body.phone,
        })
        generateToken(res, userId);
        return res.status(201).json({ _id: userId, phone: req.body.phone });
      } 
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
});

/* @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Public
const logoutUser = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});
export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
};

*/

module.exports = { registerUser, authUser};