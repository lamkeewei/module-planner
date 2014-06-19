'use strict';

angular.module('modulePlannerApp')
  .controller('RequirementsCtrl', function ($scope, $http) {
    $scope.search = {};
    $scope.categories = ['University Core', 'Economics Major', 'Economics Major Related'];
  });
