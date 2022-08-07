const isValidEmail = email => {
    if (!email) return false 
    if (email.length > 64) return false;
    const pattern = /^[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
    return pattern.test(email);
}


module.exports ={
    isValidEmail
}