'use strict';

angular.module('modulePlannerApp')
  .controller('MainCtrl', function ($scope, User) {
    $scope.planner = User.planner();
  });
