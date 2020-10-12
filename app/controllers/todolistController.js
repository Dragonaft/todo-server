const db = require('../../models');
const Op = db.Sequelize.Op;
const list_todos = db.list_todos;
const user_lists = db.user_lists;

function checkUser(userListId) {
    return user_lists.findByPk(userListId);
}

exports.findAll = (req, res) => {
    list_todos.findAll()
        .then(list_todos => {
            res.json(list_todos)
        })
        .catch(err => {
            res.send('error:' + err)
        })
};

exports.findOne = (req, res) => {
    list_todos.findOne(
        {
            where: {
                id: req.params.id
            }
        })
        .then(list_todos => {
            if (list_todos) {
                res.json(list_todos)
            } else {
                res.send('Task does not exist')
            }
        })
        .catch(err => {
            res.send('error:' + err)
        })
};

exports.create = (req, res) => {


    if (!req.body.description) {
        res.status(400)
        res.json({
            error: 'Bad Data'
        })
    } else {
        const {description, userListId} = req.body

        list_todos.create({description, userListId})
            .then(data => {
                res.send(data)
            })
            .catch(err => {
                res.json('error:' + err)
            })
    }
};

exports.delete = (req, res) => {
    list_todos.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(() => {
            res.json({status: 'Task Deleted!'})
        })
        .catch(err => {
            res.send('error:' + err)
        })
};

exports.update = (req, res) => {
    if (!req.body.status) {
        res.status(400)
        res.json({
            error: 'Bad Data'
        })
    } else {
        list_todos.update(
            {status: req.body.status},
            {where: {id: req.params.id}}
        )
            .then(() => {
                res.json({status: 'Task Update!'})
            })
            .error(err => handleError(err))
    }
};

exports.findById = (req, res) => {
    const id = req.params.id;
    list_todos.findOne({
        where: {
            id
        },
    }).then(function (user) {
        res.json(user);
        res.end();
    })
};
