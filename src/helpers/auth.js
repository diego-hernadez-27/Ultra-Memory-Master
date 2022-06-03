const Role = require('../models/Role');
const User = require('../models/User');
const storage = require('node-sessionstorage')
const jwt = require('jsonwebtoken');
const { SECRET } = process.env;

const helpers = {};

helpers.isAuthenticated = (req, res, next) => {
    if(req.isAuthenticated()){

        return next();
    }
    res.redirect('/login');

}

helpers.isnotAuthenticated = (req, res, next) => {
  if(req.isAuthenticated()){

      res.redirect('/menu');
  }
  return next();

}

helpers.verifyToken = async (req, res, next) => {
  let token = storage.getItem("token");
  

  if (!token) return console.log("No hay token." );

  try {
    const decoded = jwt.verify(token, `${SECRET}`);
    req.userId = decoded.id;

    const user = await User.findById(req.userId, { password: 0 });
    if (!user) return res.status(404).json({ message: "No user found" });

    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized!" });
  }
};



helpers.isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    const roles = await Role.find({ _id: { $in: user.roles } });

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "admin") {
        res.redirect('/finduser');
      }else{
        next();
      }
    }

  } catch (error) {
    console.log(error)
  }
};




module.exports = helpers;
