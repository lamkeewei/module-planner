'use strict';

angular.module('modulePlannerApp')
  .controller('TimeCtrl', function ($scope, $http, course) {
    $scope.schedule = {
      courseId: course._id,
      year: 1,
      semester: 1
    };
    
    $scope.hasSchedule = false;

    if (course.schedule) {
      $scope.schedule = course.schedule;
      $scope.hasSchedule = true;
    }
  });
