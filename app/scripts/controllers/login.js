'use strict';

angular.module('modulePlannerApp')
  .controller('LoginCtrl', function ($scope, Auth, $location, $rootScope, User) {
    $scope.user = {};
    $scope.errors = {};

    $scope.login = function(form) {
      $scope.submitted = true;
      
      if(form.$valid) {
        Auth.login({
          email: $scope.user.email,
          password: $scope.user.password
        })
        .then( function() {
          User.get(function(user){
            if (user.requirement.length < 1) {
              $location.path('/welcome');
            } else {
              // Logged in, redirect to home
              $location.path('/');
            }
          });

        })
        .catch( function(err) {
          err = err.data;
          $scope.errors.other = err.message;
        });
      }
    };
  });