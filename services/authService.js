// services/auth.service.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const { User } = require('../models/User');
const SECRET_KEY = 'ma-super-cle-secrete';

const AuthService = {
    authenticate: async (email, password) => {
        console.log(email);
        const user = await User.findOne({email: email}).populate('profile_id');
        if (!user) throw new Error('User not found');

        // const valid = await bcrypt.compare(password, user.password);
        const valid = (password === user.password);
        if (!valid) throw new Error('Invalid password');

        console.log("Authentification d'un utilisateur :" + user.profile_id.name);

        const token = jwt.sign({ id: user.id, email: user.email, name: user.name, firstName: user.firstName, profile: user.profile_id.name },
            SECRET_KEY, {expiresIn: '3h',
        });
        return token;
    },

    verifyToken: (token) => {
        return jwt.verify(token, SECRET_KEY);
    }
};

module.exports = AuthService;
