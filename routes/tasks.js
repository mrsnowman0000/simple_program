const errors = require('restify-errors');
const Tasks = require('../models/Tasks');
const config = require('../config');
//const auth = require('../auth');
const rjwt = require('restify-jwt-community');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose'),
Schema = mongoose.Schema;
module.exports = server => {


    // Get Tasks
    server.get('/tasks', 
    //to protect this using token
    rjwt({ secret: config.JWT_SECRET}),
    async (req, res, next) => {

        try {
            const { _id } = jwt.decode(req.headers['x-access-token']);
            const tasks = await Tasks.find({user_id : _id});
            res.send(tasks);
            lo
            next();
        } catch (err) {
          return next(new errors.InvalidContentError(err));
        }
      });


  // Add Task
  server.post(
    '/addtask',
    rjwt({ secret: config.JWT_SECRET }),
    async (req, res, next) => {
        // Check for JSON
      if (!req.is('application/json')) {
        return next(
          new errors.InvalidContentError("Expects 'application/json'")
        );
      }

        const { status, definition,user_id } = req.body;
        
      const task = new Tasks({
        status,
        definition,
        user_id
      });

      try {
        const { _id } = jwt.decode(req.headers['x-access-token']);
        task.user_id=_id;
        const newTask = await task.save();
        res.send(201, 'Task Added');
        console.log(task);
        
        next();
      } catch (err) {
        return next(new errors.InternalError(err.message));
      }
    }
  );


  // Delete Task
  server.del(
    '/deletetask',
    //rjwt({ secret: config.JWT_SECRET }),
    async (req, res, next) => {
        
      try {
        const { _id } = jwt.decode(req.headers['x-access-token']);
        const task = await Tasks.findOneAndRemove({user_id: _id});
        res.send('task deleted');
        next();
      } catch (err) {
        return next(
          new errors.ResourceNotFoundError(
            `There is no user with the id of ${req.params.id}`
          )
        );
      }
    }
  );


  // Update Task
  server.put(
    '/tasks',
    //rjwt({ secret: config.JWT_SECRET }),
    async (req, res, next) => {
      // Check for JSON
      if (!req.is('application/json')) {
        return next(
          new errors.InvalidContentError("Expects 'application/json'")
        );
      }

      try {
        const task = await Tasks.findOneAndUpdate(
          { _id: req.params.id },
          req.body
        );
        res.send(200, 'Task has been updated.');
        next();
      } catch (err) {
        return next(
          new errors.ResourceNotFoundError(
            `There is no task with the id of ${req.params.id}`
          )
        );
      }
    }
  );


}