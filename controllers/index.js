const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {
   createJWT,
} = require("../utils/auth");

exports.login = (req, res) => {
    let { emailid, password } = req.body;
    let errors = [];
    if (!emailid) {
      errors.push({ emailid: "required" });
    }
    if (!password) {
      errors.push({ passowrd: "required" });
    }
    if (errors.length > 0) {
     return res.status(422).json({ errors: errors });
    }
    console.log("stage 1")
    User.findOne({ emailid: emailid }).then((user) => {
       if (!user) {
         return res.status(404).json({
           errors: [{ user: "not found" }],
         });
       } else {
           console.log("Stage 2")
          bcrypt.compare(password, user.password).then(isMatch => {
             if (!isMatch) {
              return res.status(400).json({ errors: [{ password:
"incorrect" }] 
              });
             }
             console.log("stage 3")
      let access_token = createJWT(
         user.emailid,
         user.role,
         user._id,
         3600
      );
      jwt.verify(access_token, "process.env.TOKEN_SECRET", (err,
decoded) => {
        if (err) {
           return res.status(500).json({ errors: err });
        }
        if (decoded) {
            return res.status(200).json({
               success: true,
               token: access_token,
               message: user
            });
          }
        });
       }).catch(err => {
         res.status(500).json({ erros: err });
       });
     }
  }).catch(err => {
     res.status(500).json({ erros: err });
  });
}

exports.signup = (req, res) => {
  let { name, emailid, role, password, password_confirmation } = req.body;
  let errors = [];
  if (!name) {
    errors.push({ name: "required" });
  }
  if (!emailid) {
    errors.push({ emailid: "required" });
  }
  if (!role) {
    errors.push({ role: "required" });
  }
  if (!password) {
    errors.push({ password: "required" });
  }
  if (!password_confirmation) {
    errors.push({
     password_confirmation: "required",
    });
  }
  if (password != password_confirmation) {
    errors.push({ password: "mismatch" });
  }
  if (errors.length > 0) {
    return res.status(422).json({ errors: errors });
  }
 User.findOne({emailid: emailid})
    .then(user=>{
       if(user){
          return res.status(422).json({ errors: [{ user: "emailid already exists" }] });
       }else {
         const user = new User({
           name: name,
           emailid: emailid,
           role: role,
           password: password,
         });
 bcrypt.genSalt(10, function(err, salt) { bcrypt.hash(password, salt, function(err, hash) {
         if (err) throw err;
         user.password = hash;
         user.save()
             .then(response => {
                res.status(200).json({
                  success: true,
                  result: response
                })
             })
             .catch(err => {
               res.status(500).json({
                  errors: [{ error: err }]
               });
            });
         });
      });
     }
  }).catch(err =>{
      res.status(500).json({
        errors: [{ error: 'Something went wrong' }]
      });
  })
}