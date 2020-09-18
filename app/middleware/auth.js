const db = require('../../models');
const user_lists = db.user_lists;

const {secret} = require('../../config/auth.config.json');
const jwt = require('jsonwebtoken');

module.exports = async  (req, res, next) => {
    try {
        const token = req.headers.authorization;
        const decodedToken = jwt.decode(token, secret);
        const userId = decodedToken.id;
        const user_lists = await user_lists.findByPk(userId, {
            include: [
                'tasks'
            ],
        });
        if (!user_lists) {
            res.status(401).json( {
                error: 'Invalid data'
            });
        } else {
            res.locals.user = user_lists;
            next();
        }
    } catch {
        res.status(401).json({
            error: 'Invalid request!'
        });
    }
};
