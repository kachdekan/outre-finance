const asyncHandler = require('express-async-handler');
const { db } = require('../fbconfig');
const { generateUID } = require('../utils/generateUID');
const { generateTokens } = require('../utils/generateToken');

//@desc    Auth user & get token
// @route   POST /api/auth
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { phone, password } = req.body;

  const user = await db.collection('users').where('phone', '==', phone).get()
  const matchPassword = user.docs[0].data().password === password;
  if (!user.empty && matchPassword) {
    generateTokens(res, user.docs[0].id, user.docs[0].data().password); 
    
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
// @route   POST /api/register
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
        generateTokens(res, userId, req.body.password);
        return res.status(201).json({ _id: userId, phone: req.body.phone });
      } 
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
});

// @desc    Change user password
// @route   POST /api/changepass
// @access  Public
const changePassword = asyncHandler(async (req, res) => {
  const { phone, password } = req.body;
  const user = await db.collection('users').where('phone', '==', phone).get()
  if (!user.empty) {
    const response = await db.collection('users').doc(user.docs[0].id).update({
      password: password,
    });
    generateTokens(res, user.docs[0].id, req.body.password);
    res.status(201).json({
      _id: user.docs[0].id,
      phone: user.docs[0].data().phone,
      uat: response.writeTime.toDate(),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});


/* @desc    Logout user / clear cookie
// @route   POST /api/logout
// @access  Public
const logoutUser = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
}; */

// @desc    Get user profile
// @route   GET /api/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await db.collection('users').doc(req.user.id).get();
  if (user) {
    res.json({
      _id: user.id,
      phone: user.data().phone,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
 const user = await db.collection('users').doc(req.user.id).get();
 const updateUser = {
    name: "",
    email: "",
 }

  if (user) {
    updateUser.name = req.body.name || user.data().name ;
    updateUser.email = req.body.email || user.data().email;

    const response = await db.collection('users').doc(req.user.id).update({
      name: updateUser.name,
      email: updateUser.email,
    });

    const updatedUser = await db.collection('users').doc(req.user.id).get();

    res.json({
      _id: updatedUser.id,
      name: updatedUser.data().name,
      email: updatedUser.data().email,
      uat: response.writeTime.toDate(),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});


module.exports = { registerUser, authUser, getUserProfile, updateUserProfile, changePassword};