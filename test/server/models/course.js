'use strict';

var should = require('should'),
    mongoose = require('mongoose'),
    Course = mongoose.model('Course');

var course;

describe('Course Model', function(){
  beforeEach(function(done){
    course = new Course({
      code: 'IS200',
      title: 'IS Software Foundations',
      category: ['Core']
    });

    Course.remove().exec();
    done();
  });

  after(function(done){
    Course.remove().exec(function(){
      done();
    });
  });

  it('should add the Course model successfully', function(done){
    course.save(function(err){
      should.not.exist(err);
      done();
    });
  });

  it('should not save with a duplicate course code', function(done){
    course.save(function(err){
      should.not.exist(err);

      var dupCourse = new Course(course);
      dupCourse.save(function(err){
        should.exist(err);
        done();
      });
    });
  });

  it('should give be able to return if it is possible to double count', function(done){
    course.save(function(err){
      should.not.exist(err);

      course.canDoubleCount.should.be.false;      
    });

    var doubleCount = new Course({
      code: 'IS201',
      title: 'IS Software Foundations 2',
      category: ['Core', 'Elective']
    });

    doubleCount.save(function(err){
      should.not.exist(err);
      doubleCount.canDoubleCount.should.be.true;
      done();
    });
  });
});