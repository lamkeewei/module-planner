'use strict';

var _ = require('lodash'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Course = mongoose.model('Course'),
    Requirement = mongoose.model('Requirement');

/**
 * Populate database with sample application data
 */

//Clear old things, then add things in
Course.find({}).remove(function() {
  Course.create({
    code: 'WRIT001',
    title: 'Academic Writing',
    category: ['Exemption', 'Foundation Courses']
  }, {
    code: 'ECON001',
    title: 'Introductory Economics',
    category: ['Exemption', 'Foundation Courses']
  }, {
    code: 'MATH001',
    title: 'Calculus',
    category: ['Exemption', 'Foundation Courses']
  }, {
    code: 'ECON101',
    title: 'Intermediate Macroeconomics',
    category: ['Economics Major']
  }, {
    code: 'ECON107',
    title: 'Applied Econometrics',
    category: ['Economics Major']
  }, {
    code: 'ECON102',
    title: 'Intermediate Microeconomics',
    category: ['Economics Major']
  }, {
    code: 'ECON203',
    title: 'International Economics B',
    category: ['Economics Major']
  }, {
    code: 'MGMT002',
    title: 'Technology and World Change',
    category: ['University Core']
  }, {
    code: 'IS012',
    title: 'Computer as an Analysis Tool',
    category: ['Technology and Entrepreneurship']
  }, {
    code: 'MGMT003',
    title: 'Bus., Govt & Soc',
    category: ['University Core']
  }, {
    code: 'COMM001',
    title: 'Management Communication',
    category: ['University Core']
  }, {
    code: 'LGST001',
    title: 'Ethics & Social Responsibility',
    category: ['University Core']
  }, {
    code: 'OBHR001',
    title: 'Leadership and Team Building',
    category: ['University Core']
  }, {
    code: 'MGMT004',
    title: 'Creative Thinking',
    category: ['University Core']
  }, {
    code: 'IDIS001',
    title: 'Analytical Skills',
    category: ['University Core']
  }, {
    code: 'STAT151',
    title: 'Intro to Statistical Theory',
    category: ['Economics Major Related']
  }, function() {
      console.log('finished populating courses');

      // Populate courses
      Course.find({}, function(err, courses){
        var courseIds = _.map(courses, function(c){
          return c._id;
        });

        Requirement.find({}).remove().exec();
        Requirement.create({
          firstMajor: 'No Track',
          secondMajor: 'Undecided',
          preassigned: courseIds,
          requirements: [
            {
              type: 'Foundation Courses',
              qtyRequired: 3
            }, {
              type: 'University Core',
              qtyRequired: 7
            }, {
              type: 'Economics Major Related',
              qtyRequired: 9
            }, {
              type: 'Economics Major',
              qtyRequired: 11
            }, {
              type: 'General Education',
              qtyRequired: 3
            }, {
              type: 'Global and Regional Studies',
              qtyRequired: 1,
              subtypes: [{
                type: 'Global and Regional Studies (Econ)',
                qtyRequired: 1
              }]
            }, {
              type: 'Technology and Entrepreneurship',
              qtyRequired: 2
            }
          ]
        }, {
          firstMajor: 'No Track',
          secondMajor: 'Finance',
          preassigned: courseIds,
          requirements: [
            {
              type: 'Foundation Courses',
              qtyRequired: 3
            }, {
              type: 'University Core',
              qtyRequired: 7
            }, {
              type: 'Economics Major Related',
              qtyRequired: 3
            }, {
              type: 'Finance',
              qtyRequired: 6
            }, {
              type: 'Economics Major',
              qtyRequired: 11
            }, {
              type: 'General Education',
              qtyRequired: 3
            }, {
              type: 'Global and Regional Studies',
              qtyRequired: 1,
              subtypes: [{
                type: 'Global and Regional Studies (Econ)',
                qtyRequired: 1
              }]
            }, {
              type: 'Technology and Entrepreneurship',
              qtyRequired: 2
            }
          ]
        }, {
          firstMajor: 'Quantitative Economics',
          secondMajor: 'Undecided',
          preassigned: courseIds,
          requirements: [
            {
              type: 'Foundation Courses',
              qtyRequired: 3
            }, {
              type: 'University Core',
              qtyRequired: 7
            }, {
              type: 'Economics Major Related',
              qtyRequired: 3
            }, {
              type: 'Finance',
              qtyRequired: 6
            }, {
              type: 'Economics Major',
              qtyRequired: 8,
              subtypes: [{
                type: 'Quantitative Economics',
                qtyRequired: 3
              }]
            }, {
              type: 'General Education',
              qtyRequired: 3
            }, {
              type: 'Global and Regional Studies',
              qtyRequired: 1,
              subtypes: [{
                type: 'Global and Regional Studies (Econ)',
                qtyRequired: 1
              }]
            }, {
              type: 'Technology and Entrepreneurship',
              qtyRequired: 2
            }
          ]
        }, function(err){
          console.log('populating requirements');

          Course.create({
            code: 'GE001',
            title: 'General Education 1',
            category: ['Exemption', 'General Education']
          }, {
            code: 'GE002',
            title: 'General Education 2',
            category: ['Exemption', 'General Education']
          }, {
            code: 'GE003',
            title: 'General Education 3',
            category: ['Exemption', 'General Education']
          }, {
            code: 'ECON118',
            title: 'Economic Development in Asia',
            category: ['Global and Regional Studies (Econ)']
          }, {
            code: 'MGMT312',
            title: 'Asia Pacific Business',
            category: ['Global and Regional Studies']
          }, {
            code: 'QF305',
            title: 'Global Financial Risk Mgmt',
            category: ['Finance'],
            doubleCount: [{
              replace: 'Global and Regional Studies',
              freeUp: 'Economics Major Related'
            }]
          }, {
            code: 'MGMT315',
            title: 'Global Megatrends',
            category: ['Global and Regional Studies']
          }, {
            code: 'MGMT205',
            title: 'International Business',
            category: ['Global and Regional Studies']
          }, {
            code: 'MGMT224',
            title: 'World Travel & Tourism',
            category: ['Global and Regional Studies']
          }, {
            code: 'ECON236',
            title: 'Advanced Microeconomics',
            category: ['Economic Major', 'Quantitative Economics']
          }, {
            code: 'ECON237',
            title: 'Advanced Macroeconomics',
            category: ['Economic Major', 'Quantitative Economics']
          }, {
            code: 'ECON207',
            title: 'Intermediate Econometrics',
            category: ['Economic Major', 'Quantitative Economics']
          }, {
            code: 'ACCT101',
            title: 'Financial Accounting',
            category: ['Finance'],
            doubleCount: [{
              replace: 'Technology and Entrepreneurship',
              freeUp: 'Economics Major Related'
            }]
          }, {
            code: 'FNCE213',
            title: 'Entrepreneurial Finance',
            category: ['Finance'],
            doubleCount: [{
              replace: 'Global and Regional Studies',
              freeUp: 'Economics Major Related'
            }]
          }, {
            code: 'OPIM101',
            title: 'Management Science',
            category: ['Finance'],
            doubleCount: [{
              replace: 'Technology and Entrepreneurship',
              freeUp: 'Economics Major Related'
            }]
          }, function(){
            console.log('Added non-requirement modules');
          });
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
