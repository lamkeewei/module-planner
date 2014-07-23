'use strict';

angular.module('modulePlannerApp')
  .controller('CourseCtrl', function ($scope, Course, $modal) {
    $scope.courses = Course.query();
    $scope.search = {};
  });