// services/auth.service.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const { User } = require('../models/User');
const { Token } = require('../models/Token');
const { getTokenValidUser } = require('./tokenService');

const AuthService = {
    authenticate: async (email, password) => {
        const user = await User.findOne({email: email}).populate('profile_id');
        if (!user) throw new Error('User not found');

        // const valid = await bcrypt.compare(password, user.password);
        const valid = (password === user.password);
        if (!valid) throw new Error('Invalid password');

        let token = await getTokenValidUser(email, password);

        if(token == null){
            const secret_key = process.env.SECRET_KEY;
            const created_date = new Date();
            const expiration_Date = new Date(created_date.getTime() + 3600 * 3 * 1000);
            
    
            token = jwt.sign({ id: user.id, email: user.email, name: user.name, firstName: user.firstName, profile: user.profile_id.name },
                secret_key, {expiresIn: '3h',
            });
    
            const tokenUser = new Token({
                user_id : user.id,
                valeur : token,
                created_date,
                expiration_Date
            });
    
            await tokenUser.save();
        }

        return token.valeur;
    },

    verifyToken: (token) => {
        return jwt.verify(token, process.env.SECRET_KEY);
    }
};

module.exports = AuthService;
