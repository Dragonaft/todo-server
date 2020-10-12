const db = require('../../models');
const Op = db.Sequelize.Op;
const jwt = require("jsonwebtoken");
const config = require('../../config/auth.config.json');
const user_lists = db.user_lists;
const bcrypt = require("bcrypt");

exports.findOne = (req, res) => {
    user_lists.findOne({
        where: {
            email: req.query.email,
            password: req.query.password,
        }
    }).then(function (user) {
        res.json(user);
        res.end();
    })
}

exports.findAll = (req, res) => {

    user_lists.findAll({
        include: [
            'list_todos'
        ],
    })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving users."
            });
        });
};

exports.create = (req, res) => {
    const user = user_lists.build();
    user.login = req.body.login;
    user.password = bcrypt.hashSync(req.body.password, 8);
    user.email = req.body.email;

    user.save()
        .then(function (user) {
            res.json(user);
            res.end();
        }).catch(function (err) {
        res.status(400).send(err);
    });
}

exports.delete = (req, res) => {
    const id = req.params.id;

    user_lists.destroy({
        where: {id: id}
    })
        .then(num => {
            if (num === 1) {
                res.send({
                    message: 'User was deleted successfully!'
                });
            } else {
                res.send({
                    message: `Cannot delete User with id=${id}`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: `Could not delete User with id=${id}`
            });
        });
};
exports.login = (req, res) => {
    const {password, email} = req.body;

    user_lists.findOne({
        where: {
            email,
        }
    }).then((user) => {

            if (!user) {
                return res.status(404).send({message: 'User Not found.'});
            }

            const passwordIsValid = bcrypt.compareSync(
                password,
                user.password
            );

            if (!passwordIsValid) {
                return res.status(401).send({
                    message: "Invalid Password!"
                });
            }

            // const expiresIn = 24 * 60 * 60  // in seconds 24 hours;
            const expiresIn = 120 * 2  // 2 min
            const token = jwt.sign({id: user.id}, config.secret, {
                expiresIn
            });

                res.status(200).send({
                    user,
                    token,
                    expiresIn,
                });
            // user.update({token})
            //     .then((user) => {
            //         res.status(200).send({
            //             user,
            //             expiresIn,
            //         });
            //
            //     })
            //     .catch((err) => res.status(400).send(err))

        }
    ).catch((err) => res.status(400).send(err))


}


exports.register = (req, res) => {
    const {password, email, name} = req.body;

    user_lists.findOne({
        where: {
            email,
            password,
            name,
        }
    }).then(function (user) {
        if (user) {
            res.json(user);
        } else {
            res.status(500).send({
                message: `User not found`
            })
        }

        res.end();
    }).catch(() => {
        res.status(500).send({
            message: `User not found`
        })
    })
}

exports.logout = (req, res) => {
    user_lists.findOne({
        where: {
            token: req.body.token
        }
    }).then(user => {

        user.update({token: null})
            .then((user) =>
                res.status(200).send({user})
            )
            .catch((err) => res.status(400).send(err));

    }).catch(err => res.status(400).send(err))
}


exports.me = (req, res) => {
    res.json(res.locals.user);
}

exports.update = (req, res) => {
    const id = +req.params.id;
    const {email, name, login} = req.body;

    user_lists.findByPk(id).then( (user) =>
        user.update({
            email,
            name,
            login,
        }) .then(function (user) {
            res.json(user);
            res.end();
        }).catch(function (err) {
            res.status(400).send(err);
        })
    ).catch(err => {
        res.status(400).send('User not found');
    })
};

