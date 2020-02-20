const errors = require('restify-errors');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const config = require('../config');
const auth = require('../auth');
const rjwt = require('restify-jwt-community');
const jwt = require('jsonwebtoken');

module.exports = server => {

    // Get Users
    server.get('/users', 
    //to protect this using token
    rjwt({ secret: config.JWT_SECRET}),
    async (req, res, next) => {
        try {
            const user = await User.find({});
            res.send(user);
            next();
        } catch (err) {
          return next(new errors.InvalidContentError(err));
        }
      });

      //Add user
      server.post('/register', async (req, res, next) => {
     //const { _id } = jwt.decode(req.headers['x-access-token']);
      const { username, password} = req.body;

      const user = new User({
        username,
        password
      });
      bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(user.password, salt, async(err, hash) =>{
              //Hash password
              user.password = hash;
              try {
                const newUser = await user.save();
                res.send(201);
                next();
           //     console.log(_id);
              } catch (err) {
                return next(new errors.InternalError(err.message));
              }

          })
      })

      
    } 
  );


  //Auth User
  server.post('/auth', async (req, res, next) => {
    const {username, password} = req.body;

    try{
      const user = await auth.authenticate(username, password);
      console.log(user);

      //create JWT
      const token = await jwt.sign(user.toJSON(), config.JWT_SECRET, {
        expiresIn: "365d"
      });

      const { iat, exp } = await jwt.decode(token);
      console.log(token);
      
      //respond with token
      res.send({ iat, exp, token });
    

    } catch(err) {
      console.log(err);
      
      return next(new errors.UnauthorizedError(err));
    }
  }) 

}