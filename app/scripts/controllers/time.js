'use strict';

angular.module('modulePlannerApp')
  .controller('TimeCtrl', function ($scope, $http, course) {
    $scope.schedule = {
      courseId: course._id,
      year: 1,
      semester: 1
    };
    
    if (course.schedule) {
      $scope.schedule = course.schedule;
    }
  });
