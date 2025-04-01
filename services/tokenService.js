const { default: mongoose } = require("mongoose");

async function getTokenValidUser(email, password) {
    const user = await mongoose.connection.db
        .collection("v_token_user")
        .findOne({
            "user.email": email,
            expiration_Date: { $gt: new Date() }
        });
    console.log(user);
    
    return user;
}

module.exports = {
    getTokenValidUser
}