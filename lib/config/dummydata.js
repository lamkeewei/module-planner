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
    category: ['Exemption', 'University Core']
  }, {
    code: 'IS102',
    title: 'Introduction to Economics',
    category: ['Exemption', 'University Core']
  }, {
    code: 'IS103',
    title: 'General Education 1',
    category: ['Exemption', 'General Education']
  }, {
    code: 'IS104',
    title: 'General Education 2',
    category: ['Exemption', 'General Education']
  }, {
    code: 'IS105',
    title: 'General Education 3',
    category: ['Exemption', 'General Education']
  }, {
    code: 'IS106',
    title: 'Calculus',
    category: ['Exemption', 'General Education']
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
            }, {
              type: 'General Education',
              qtyRequired: 3
            }, {
              type: 'Global and Regional Studies',
              qtyRequired: 2
            }, {
              type: 'Technology and Entrepreneurship',
              qtyRequired: 2
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
    name: 'Kee Wei',
    email: 'test@test.com',
    password: 'test'
  }, {
    provider: 'local',
    name: 'Benjamin Lam',
    email: 'benjaminlam.2012@economics.smu.edu.sg',
    password: 'password'
  }, function() {
      console.log('finished populating users');
    }
  );
});
