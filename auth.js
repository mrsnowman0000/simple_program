const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = mongoose.model('User');

exports.authenticate = (username, password) => {
return new Promise((resolve, reject) => {
    try{
        //get user by its username
        const user = User.findOne({username}).then(user =>{
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if(err) return(err);
                if(!isMatch) return(err); 
                resolve(user);
            });
        }).catch(err=>reject('Authentication Failed!' + err));

    } catch(err){
        reject('Authentication Failed');   
    }
});
};