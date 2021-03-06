'use strict';

var api = require('./controllers/api'),
    index = require('./controllers'),
    users = require('./controllers/users'),
    session = require('./controllers/session'),
    courses = require('./controllers/courses'),
    requirements = require('./controllers/requirements'),
    middleware = require('./middleware'),
    config = require('./config/config.js');

/**
 * Application routes
 */
module.exports = function(app) {

  // Set HTTPS middleware if it is production env
  if (config.env === 'production') {
    app.route('/*')
      .all(middleware.redirectHttps);
  }

  // Server API Routes
  app.route('/api/awesomeThings')
    .get(api.awesomeThings);
  
  app.route('/api/requirements')
    .get(requirements.getAllRequirements)
    .post(requirements.add)
    .put(requirements.update);

  app.route('/api/requirements/:type')
    .get(requirements.findByType);

  app.route('/api/requirements/major/:major')
    .get(requirements.findByMajor);

  app.route('/api/users')
    .post(users.create)
    .put(users.changePassword);

  app.route('/api/users/*')
    .all(middleware.auth);

  app.route('/api/users/me')
    .get(users.me);

  app.route('/api/users/me/profile')
    .get(users.getProfile)
    .put(users.updateProfile);

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

  app.route('/api/courses')
    .get(courses.getAll)
    .post(courses.addCourse);

  app.route('/api/courses/:id')
    .delete(courses.delete)
    .put(courses.update);

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