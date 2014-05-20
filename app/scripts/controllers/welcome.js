'use strict';

angular.module('modulePlannerApp')
  .controller('WelcomeCtrl', function ($scope, User, Auth, Course, _, $location) {
    // initialization of variables
    $scope.step = 1;
    $scope.errors = {};
    $scope.user = {};
    $scope.requirement = {};
    $scope.requirement.exemptions = [];

    $scope.firstMajor = ['No Track', 'Quantitative Economics', 'Maritime Economics Concentration'];
    $scope.secondMajors = ['Undecided', 'Finance', 'Marketing', 'Operations'];
    $scope.exemptions = Course.findByCategory({ category: 'Exemption' });

    $scope.setExemptions = function(exemption){
      exemption.selected = !exemption.selected;
      var filtered = _.filter($scope.exemptions, function(ex){
        return ex.selected;
      });
      $scope.requirement.exemptions = _.map(filtered, function(ex){
        return ex._id;
      });
    };

    $scope.register = function(form){
      $scope.submitted = true;
      if(form.$valid) {
        console.log($scope.requirement);
        User.register($scope.requirement, function(){
          $location.path('/');
        }, function(){
        });
      }
    };

    $scope.changePassword = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.changePassword( $scope.user.oldPassword, $scope.user.newPassword )
        .then( function() {
          $scope.message = 'Password successfully changed.';
          $scope.step = 2;
          $scope.submitted = false;
        })
        .catch( function() {
          form.password.$setValidity('mongoose', false);
          $scope.errors.other = 'Incorrect password';
        });
      }
		};
  });
