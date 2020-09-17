const db = require('../../models');
const Op = db.Sequelize.Op;
const list_todos = db.list_todos;

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
    console.log(req.body)
    if (!req.body.description) {
        res.status(400)
        res.json({
            error: 'Bad Data'
        })
    } else {
        list_todos.create(req.body)
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
