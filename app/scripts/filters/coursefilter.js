'use strict';

angular.module('modulePlannerApp')
  .filter('courseFilter', function (_) {
    return function (courses, filters) {
      // If no active filters return original 
      if (filters.length < 1) {
        return courses;
      }

      // TODO: Implement some form of caching here. Running it everytime is BAD!
      var years = [];
      var semesters = [];

      filters.forEach(function(fil, i){
        var words = fil.split(' ');
        if (words[0] === 'Year') {
          years.push(Number(words[1]));
        } else {
          semesters.push(Number(words[1]));
        }
      });

      console.log(courses);
      
      if (years.length > 0) {
        courses = _.filter(courses, function(course){
          if (!course.schedule) { return false; }
          var matchYear = _.indexOf(years, course.schedule.year);
          return matchYear > -1;
        });
      }

      if (semesters.length > 0) {
        courses = _.filter(courses, function(course){
          if (!course.schedule) { return false; }
          var matchYear = _.indexOf(semesters, course.schedule.semester);
          return matchYear > -1;
        });
      }

      return courses;
    };
  });
