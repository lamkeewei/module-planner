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
      var types = [];

      filters.forEach(function(fil, i){
        var words = fil.split(' ');
        if (words[0] === 'Year') {
          years.push(Number(words[1]));
        } else if (words[0] === 'Semester') {
          semesters.push(Number(words[1]));
        } else {
          types.push(words[0]);
        }
      });
      
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
          var matchSemester = _.indexOf(semesters, course.schedule.semester);
          return matchSemester > -1;
        });
      }

      if (types.length > 0) {
        courses = _.filter(courses, function(course){
          var matchType = false;

          angular.forEach(types, function(type){
            var match = _.indexOf(course.category, type);
            if (match > -1) {
              matchType = true;
            }
          });
          return matchType;
        });
      }

      return courses;
    };
  });
