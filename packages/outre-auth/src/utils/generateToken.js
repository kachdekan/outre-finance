const jwt = require('jsonwebtoken');
const { db } = require('../fbconfig');

const generateTokens = (res, userId, userPassword) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "5m",
  });

  const refreshToken = jwt.sign({ userId }, process.env.JWT_SECRET_TWO + userPassword, {
    expiresIn: '7d',
  });

  res.cookie('x-token', token, {
    httpOnly: true,
    secure: false, // Use secure cookies in production
    sameSite: 'strict', // Prevent CSRF attacks
    maxAge:   5 * 60 * 1000, // 5 minutes
  });
  
  res.cookie('x-refresh-token', refreshToken, {
    httpOnly: true,
    secure: false, // Use secure cookies in production
    sameSite: 'strict', // Prevent CSRF attacks
    maxAge:  7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

const refreshTokens = async (res, refreshToken) => {
  const decoded = jwt.decode(refreshToken);
  if(decoded.userId){
    const user = await db.collection('users').doc(decoded.userId).get();
    const userPassword = user.data().password;
    const verified = jwt.verify(refreshToken, process.env.JWT_SECRET_TWO + userPassword);
    const userId = verified.userId;
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "5m",
    });
    res.cookie('x-token', token, {
      httpOnly: true,
      secure: false, // Use secure cookies in production
      sameSite: 'strict', // Prevent CSRF attacks
      maxAge:   5 * 60 * 1000, // 5 minutes
    });
    return {userId};  
  }else {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
}
module.exports = { generateTokens, refreshTokens};