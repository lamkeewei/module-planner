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
    category: ['Foundation Courses', 'Exemptions']
  }, {
    code: 'ECON001',
    title: 'Introductory Economics',
    category: ['Foundation Courses', 'Exemptions']
  }, {
    code: 'MATH001',
    title: 'Calculus',
    category: ['Foundation Courses', 'Exemptions']
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
  }, {
    code: 'ACCT101',
    title: 'Financial Accounting',
    category: ['Finance', 'Economics Major Related']
  }, {
    code: 'FNCE101',
    title: 'Finance',
    category: ['Finance', 'Economics Major Related']
  }, {
    code: 'FNCE102',
    title: 'Financial Instruments, Institutions & Mkt',
    category: ['Finance', 'Economics Major Related']
  }, {
    code: 'ACCT102',
    title: 'Management Accounting',
    category: ['Finance', 'Economics Major Related']
  }, {
    code: 'ACCT201',
    title: 'Corporate Reporting and Analysis of Financial Statements',
    category: ['Finance', 'Economics Major Related']
  }, {
    code: 'ECON205',
    title: 'Intermediate Maths for Econ',
    category: ['Economics Major Related']
  }, function() {
      console.log('finished populating courses');

      // Populate courses
      Course.find({}, function(err, courses){
        var courseIds = _.reduce(courses, function(arr, c){
          var course = {
            courseId: c._id,
            category: c.category[0]
          };
          arr.push(course);
          return arr;
        }, []);

        Requirement.find({}).remove().exec();
        Requirement.create({
          major: 'Base',
          type: 1,
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
          major: 'Finance',
          type: 2,
          preassigned: [],
          requirements: [
            {
              type: 'Economics Major Related',
              qtyRequired: 3
            }, {
              type: 'Finance',
              qtyRequired: 8
            }
          ]
        }, {
          major: 'Marketing',
          type: 2,
          preassigned: [],
          requirements: [
            {
              type: 'Economics Major Related',
              qtyRequired: 4
            }, {
              type: 'Marketing',
              qtyRequired: 8
            }
          ]
        }, {
          major: 'Quantitative Economics',
          type: 1,
          preassigned: [],
          requirements: [
            {
              type: 'Economics Major',
              qtyRequired: 8,
              subtypes: [{
                type: 'Quantitative Economics',
                qtyRequired: 3
              }]
            }
          ]
        }, {
          major: 'Quantitative Finance',
          type: 2,
          preassigned: [],
          requirements: [
            {
              type: 'Quantitative Finance',
              qtyRequired: 12,
              subtypes: [
                {
                  type: 'QF List A',
                  qtyRequired: 1
                },{
                  type: 'QF List B',
                  qtyRequired: 1
                }
              ]
            }, {
              type: 'Economics Major Related',
              qtyRequired: 2
            }
          ]
        }, function(err){
          console.log('populating requirements');

          Course.create({
            code: 'GE001',
            title: 'General Education 1',
            category: ['General Education', 'Exemptions']
          }, {
            code: 'GE002',
            title: 'General Education 2',
            category: ['General Education', 'Exemptions']
          }, {
            code: 'GE003',
            title: 'General Education 3',
            category: ['General Education', 'Exemptions']
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
            category: ['Finance', 'Economics Major Related'],
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
            code: 'FNCE213',
            title: 'Entrepreneurial Finance',
            category: ['Finance', 'Economics Major Related'],
            doubleCount: [{
              replace: 'Technology and Entrepreneurship',
              freeUp: 'Economics Major Related'
            }]
          }, {
            code: 'LGST219',
            title: 'Islamic Law, Banking & Commerce',
            category: ['Finance', 'Economics Major Related'],
            doubleCount: [{
              replace: 'Global and Regional Studies',
              freeUp: 'Economics Major Related'
            }]
          }, { 
            code: 'ECON131',
            title: 'Maritime Economics & Shipping Fnce',
            category: ['Economics Major']
          }, { 
            code: 'ECON132',
            title: 'Port Economics & Management',
            category: ['Economics Major', 'Economics Major Related']
          }, { 
            code: 'ECON204',
            title: 'Development Economics',
            category: ['Economics Major', 'Economics Major Related']
          }, { 
            code: 'ECON206',
            title: 'Game Theory',
            category: ['Economics Major', 'Economics Major Related']
          }, { 
            code: 'ECON208',
            title: 'Industrial Organisation',
            category: ['Economics Major', 'Economics Major Related']
          }, { 
            code: 'ECON209',
            title: 'Labour Economics',
            category: ['Economics Major', 'Economics Major Related']
          }, { 
            code: 'ECON210',
            title: 'Monetary Economics',
            category: ['Economics Major', 'Economics Major Related']
          },  { 
            code: 'ECON211',
            title: 'Public Sector Economics',
            category: ['Economics Major', 'Economics Major Related']
          }, { 
            code: 'ECON212',
            title: 'Real Estate Economics',
            category: ['Economics Major', 'Economics Major Related']
          }, { 
            code: 'ECON215',
            title: 'Health Economics',
            category: ['Economics Major', 'Economics Major Related']
          }, { 
            code: 'ECON216',
            title: 'Economics of Ageing',
            category: ['Economics Major', 'Economics Major Related']
          },  { 
            code: 'ECON222',
            title: 'Econs of Privat., Regultn & Comp Policy',
            category: ['Economics Major', 'Economics Major Related']
          }, { 
            code: 'ECON226',
            title: 'Urban Economics and Policy',
            category: ['Economics Major', 'Economics Major Related']
          }, { 
            code: 'ECON229',
            title: 'The Econs of Asymmetric Information',
            category: ['Economics Major', 'Economics Major Related']
          }, { 
            code: 'ECON231',
            title: 'Economic Aspects of Maritime Law',
            category: ['Economics Major', 'Economics Major Related']
          }, { 
            code: 'ECON233',
            title: 'Economic Forecasting',
            category: ['Economics Major', 'Economics Major Related']
          }, { 
            code: 'ECON238',
            title: 'Political Economy of Globalisation',
            category: ['Economics Major', 'Economics Major Related']
          }, { 
            code: 'ECON207',
            title: 'Intermediate Econometrics',
            category: ['Economics Major', 'Economics Major Related']
          }, { 
            code: 'FNCE102',
            title: 'Financial Instruments, Institutions and Markets',
            category: ['Finance', 'Economics Major Related']
          }, { 
            code: 'FNCE201',
            title: 'Corporate Finance',
            category: ['Finance', 'Economics Major Related']
          }, { 
            code: 'FNCE203',
            title: 'Analysis of Equity Investment',
            category: ['Finance', 'Economics Major Related']
          }, { 
            code: 'FNCE204',
            title: 'Analysis of Fixed-Income Investment',
            category: ['Finance', 'Economics Major Related']
          }, { 
            code: 'FNCE210',
            title: 'International Finance',
            category: ['Finance', 'Economics Major Related']
          }, { 
            code: 'FNCE215',
            title: 'Risk Management and Insurance',
            category: ['Finance', 'Economics Major Related']
          }, { 
            code: 'FNCE217',
            title: 'Wealth Management',
            category: ['Finance', 'Economics Major Related']
          }, { 
            code: 'FNCE218',
            title: 'Wealth Management and the Law',
            category: ['Finance', 'Economics Major Related']
          }, { 
            code: 'FNCE221',
            title: 'Investment Banking',
            category: ['Finance', 'Economics Major Related']
          }, { 
            code: 'FNCE222',
            title: 'Financial Planning & Advisory',
            category: ['Finance', 'Economics Major Related']
          }, { 
            code: 'FNCE225',
            title: 'Consumer Banking',
            category: ['Finance', 'Economics Major Related']
          }, { 
            code: 'FNCE226',
            title: 'Hedge Funds',
            category: ['Finance', 'Economics Major Related']
          }, { 
            code: 'FNCE227',
            title: 'Corporate Treasury Management',
            category: ['Finance', 'Economics Major Related']
          }, { 
            code: 'FNCE228',
            title: 'Advanced Corporate Finance',
            category: ['Finance', 'Economics Major Related']
          }, { 
            code: 'FNCE229',
            title: 'Banking Financing and Credit Management',
            category: ['Finance', 'Economics Major Related']
          }, { 
            code: 'FNCE305',
            title: 'Analysis of Derivative Securities',
            category: ['Finance', 'Economics Major Related']
          }, { 
            code: 'FNCE307',
            title: 'Portfolio Management',
            category: ['Finance', 'Economics Major Related']
          }, { 
            code: 'FNCE309',
            title: 'Enterprise Risk Management',
            category: ['Finance', 'Economics Major Related']
          }, { 
            code: 'FNCE310',
            title: 'Trade Finance',
            category: ['Finance', 'Economics Major Related']
          }, { 
            code: 'FNCE311',
            title: 'Mergers & Acquisitions',
            category: ['Finance', 'Economics Major Related']
          }, { 
            code: 'FNCE312',
            title: 'Behavioral Finance',
            category: ['Finance', 'Economics Major Related']
          }, { 
            code: 'QF201',
            title: 'Linear Algebra and Regression',
            category: ['Finance', 'Economics Major Related']
          }, { 
            code: 'QF202',
            title: 'Differential Equations',
            category: ['Finance', 'Economics Major Related']
          }, { 
            code: 'QF203',
            title: 'Real Analysis',
            category: ['Finance', 'Economics Major Related']
          }, { 
            code: 'QF204',
            title: 'Probability and Finance Theory',
            category: ['Finance', 'Economics Major Related']
          }, { 
            code: 'QF205',
            title: 'Computing Technology for Finance',
            category: ['Finance', 'Economics Major Related']
          }, { 
            code: 'QF206',
            title: 'Quantitative Trading Strategies',
            category: ['Finance', 'Economics Major Related']
          }, { 
            code: 'QF301',
            title: 'Structured Finance',
            category: ['Finance', 'Economics Major Related']
          }, { 
            code: 'QF302',
            title: 'Investment and Financial Data Analysis',
            category: ['Finance', 'Economics Major Related']
          }, { 
            code: 'QF303',
            title: 'Stochastic Calculus and Finance Theory',
            category: ['Finance', 'Economics Major Related']
          }, { 
            code: 'QF304',
            title: 'Numerical Methods',
            category: ['Finance', 'Economics Major Related']
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
    role: 'admin',
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
