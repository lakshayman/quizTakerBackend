const jwt = require("jsonwebtoken");
exports.createJWT = (emailid, role, userId, duration) => {
   const payload = {
      emailid,
      role,
      userId,
      duration
   };
   return jwt.sign(payload, "process.env.TOKEN_SECRET", {
     expiresIn: duration,
   });
};