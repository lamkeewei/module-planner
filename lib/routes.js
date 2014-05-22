'use strict';

var api = require('./controllers/api'),
    index = require('./controllers'),
    users = require('./controllers/users'),
    session = require('./controllers/session'),
    courses = require('./controllers/courses'),
    middleware = require('./middleware');

/**
 * Application routes
 */
module.exports = function(app) {

  // Server API Routes
  app.route('/api/awesomeThings')
    .get(api.awesomeThings);
  
  app.route('/api/users')
    .post(users.create)
    .put(users.changePassword);

  app.route('/api/users/*')
    .all(middleware.auth);

  app.route('/api/users/me')
    .get(users.me);

  app.route('/api/users/me/register')
    .post(users.register);

  app.route('/api/users/me/planner')
    .get(users.planner);

  app.route('/api/users/me/schedule')
    .post(users.schedule);
  app.route('/api/users/me/schedule/:id')
    .delete(users.unschedule);

  app.route('/api/users/me/select')
    .post(users.select);
  app.route('/api/users/me/select/:id')
    .delete(users.deselect);
    
  app.route('/api/users/me/courses/:category')
    .get(users.getCourses);

  app.route('/api/users/:id')
    .get(users.show);

  app.route('/api/session')
    .post(session.login)
    .delete(session.logout);

  app.route('/api/courses/:category')
    .get(courses.findByCategory);
    
  // All undefined api routes should return a 404
  app.route('/api/*')
    .get(function(req, res) {
      res.send(404);
    });

  // All other routes to use Angular routing in app/scripts/app.js
  app.route('/partials/*')
    .get(index.partials);
  app.route('/*')
    .get( middleware.setUserCookie, index.index);
};