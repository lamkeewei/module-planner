'use strict';

var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Course = mongoose.model('Course'),
  Requirement = mongoose.model('Requirement');

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
    title: 'General Education 3',
    category: ['Exemption']
  }, {
    code: 'IS106',
    title: 'Calculus',
    category: ['Exemption']
  }, function() {
      console.log('finished populating courses');

      // Populate courses
      Course.find({}, function(err, courses){
        Requirement.find({}).remove().exec();
        var requirement = new Requirement({
          firstMajor: 'No Track',
          secondMajor: 'Finance',
          preassigned: [ courses[0]._id, courses[1]._id ],
          requirements: [
            {
              type: 'Foundation Courses',
              qtyRequired: 3
            }, {
              type: 'University Core',
              qtyRequired: 6
            }, {
              type: 'Economics Major Related',
              qtyRequired: 9
            }, {
              type: 'Economic Major',
              qtyRequired: 11
            }
          ]
        });
        requirement.save(function(err){
          console.log('populating requirements');
        });
      });
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
