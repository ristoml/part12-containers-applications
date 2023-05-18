const express = require('express')
const { Todo } = require('../mongo')
const router = express.Router()
const redis = require('../redis')

/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({})
  res.send(todos)
})

/* POST todo to listing. */
router.post('/', async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false
  })

  const added_todos = Number(await redis.getAsync('added_todos')) || 0
  redis.setAsync('added_todos', added_todos + 1)

  res.send(todo)
})

const singleRouter = express.Router()

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params
  req.todo = await Todo.findById(id)
  if (!req.todo) return res.sendStatus(404)

  next()
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.delete()
  res.sendStatus(200)
})

/* GET todo. */
singleRouter.get('/', async (req, res) => {
  const todo = req.todo
  todo ? res.send(todo) : res.sendStatus(405)
})

/* PUT todo. */
singleRouter.put('/', async (req, res) => {
  const todo = {
    text: req.body.hasOwnProperty('text') ? req.body.text : req.todo.text,
    done: req.body.hasOwnProperty('done') ? req.body.done : req.todo.done
  }
  const updatedTodo = await Todo.findByIdAndUpdate(req.todo._id, todo, {
    new: true
  })
  res.json(updatedTodo)
})

router.use('/:id', findByIdMiddleware, singleRouter)

module.exports = router
