'use strict';

angular.module('modulePlannerApp')
  .controller('WelcomeCtrl', function ($scope, User, Auth, Course, _, $location) {
    // initialization of variables
    $scope.step = 1;
    $scope.errors = {};
    $scope.user = {};
    $scope.requirement = {
      firstMajor: 'No Track',
      secondMajor: 'Undecided'
    };
    $scope.requirement.exemptions = [];

    $scope.firstMajors = ['No Track', 'Quantitative Economics'];
    $scope.secondMajors = ['Undecided', 'Finance'];
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
        User.register($scope.requirement, function(){
          $location.path('/');
        }, function(err){
          $scope.errors.other = err;
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
          $scope.errors = {};
        })
        .catch( function() {
          form.password.$setValidity('mongoose', false);
          $scope.errors.other = 'Incorrect password';
        });
      }
		};
  });
