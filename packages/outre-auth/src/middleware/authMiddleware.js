const jwt = require('jsonwebtoken');
const { db } = require('../fbconfig');
const asyncHandler = require('express-async-handler');
const { refreshTokens } = require('../utils/generateToken');

const protect = asyncHandler(async (req, res, next) => {
  let token;
  token = req.cookies["x-token"];
  
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await db.collection('users').doc(decoded.userId).get();
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  } else {
    const refreshToken = req.cookies["x-refresh-token"];
    if (refreshToken) {
      try {
        const responve = await refreshTokens(res, refreshToken);
        req.user = await db.collection('users').doc(responve.userId).get();
        next();
      } catch (error) {
        console.error(error);
        res.status(401);
        throw new Error('Not authorized, token failed');
      }
    }else{
      res.status(401);
      throw new Error('Not authorized, no token');
    }
  }
});

module.exports =  { protect };