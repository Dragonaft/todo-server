const db = require('../../models');
const Op = db.Sequelize.Op;
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
        },
        include: [
            'list_todo'
        ],
    }).then(function (user) {

        if (user) {
            const passwordIsValid = bcrypt.compareSync(
                password,
                user_lists.password
            );

            if (!passwordIsValid) {
                return res.status(401).send({
                    message: "Invalid Password!"
                });
            }

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
