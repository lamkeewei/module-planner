'use strict';

var should = require('should'),
    mongoose = require('mongoose'),
    Requirement = mongoose.model('Requirement'),
    Course = mongoose.model('Course');

var requirement;
var course;

describe('Requirement Model', function(){
  before(function(done){
    // Add one course first;
    course = new Course({
      code: 'IS200',
      title: 'IS Software Foundations',
      category: ['Core']
    });

    course.save(function(err){
      should.not.exist(err);
      done();
    });
  });

  beforeEach(function(done){
    requirement = new Requirement({
      firstMajor: 'Economics',
      secondMajor: 'Finance',
      preassigned: [course._id],
      requirements: [
        {
          type: 'Core',
          qtyRequired: 5
        }, {
          type: 'Elective',
          qtyRequired: 2
        }
      ]
    });

    Requirement.remove().exec();
    done();
  });

  after(function(done){
    Requirement.remove().exec();
    done();
  });

  it('should save correctly', function(done){
    requirement.save(function(err){
      should.not.exist(err);
      done();
    });
  });

  it('should fail with saving a duplicate', function(done){
    requirement.save(function(err){
      should.not.exist(err);
      var dupRequirement = new Requirement(requirement);
      dupRequirement.save(function(err){
        should.exist(err);
        done();
      });      
    });
  });
});