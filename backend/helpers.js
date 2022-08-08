const jwt = require('jsonwebtoken');

const authenticateToken = (req,res,next) => {
    //get token from header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    //handle token
    if (!token) return res.sendStatus(401);

    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,user)=>{
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

const isValidEmail = email => {
    const pattern = /^[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
    return pattern.test(email);
}

module.exports ={
    authenticateToken,
    isValidEmail,
}