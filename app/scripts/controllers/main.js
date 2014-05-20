'use strict';

angular.module('modulePlannerApp')
  .controller('MainCtrl', function ($scope, User, _) {
    $scope.planner = User.planner();

    $scope.isExemption = function(course){
      var match = _.indexOf(course.category, 'Exemption');
      return match >= 0;
    };
  });
