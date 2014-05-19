'use strict';

var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Course = mongoose.model('Course');

/**
 * Populate database with sample application data
 */

//Clear old things, then add things in
Course.find({}).remove(function() {
  Course.create({
    code: 'IS101',
    title: 'Academic Writing',
    category: ['Exemption']
  }, {
    code: 'IS102',
    title: 'Introduction to Economics',
    category: ['Exemption']
  }, {
    code: 'IS103',
    title: 'General Education 1',
    category: ['Exemption']
  }, {
    code: 'IS104',
    title: 'General Education 2',
    category: ['Exemption']
  }, {
    code: 'IS105',
    title: 'Calculus',
    category: ['Exemption']
  }, function() {
      console.log('finished populating courses');
    }
  );
});

// Clear old users, then add a default user
User.find({}).remove(function() {
  User.create({
    provider: 'local',
    name: 'Test User',
    email: 'test@test.com',
    password: 'test'
  }, function() {
      console.log('finished populating users');
    }
  );
});
