const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    name: { type: String, required: true }
}, {collection: "profile"});

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    firstName: { type: String, map:"first_name", required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    contact: { type: String, required: true },
    profile_id: { type: mongoose.Schema.Types.ObjectId, ref: "Profile", required: true }
}, {collection: "user"});

module.exports = {
    Profile: mongoose.model("Profile", ProfileSchema),
    User: mongoose.model('User', UserSchema),
};
