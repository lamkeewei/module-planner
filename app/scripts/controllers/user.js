'use strict';

angular.module('modulePlannerApp')
  .controller('UserCtrl', function ($scope, $http, Auth) {
    var user = {};
    $scope.submitted = false;

    $scope.createUser = function(form){
      $scope.submitted = true;
      
      if (form.$valid){
        Auth.createUser($scope.user, function(){
          console.log('Added');
        });
      }
    };
  });
