const { default: mongoose } = require("mongoose");

async function getTokenValidUser(email) {
    const user = await mongoose.connection.db
        .collection("v_token_user")
        .findOne({
            "user.email": email,
            expiration_Date: { $gt: new Date() }
        });
    return user;
}

module.exports = {
    getTokenValidUser
}