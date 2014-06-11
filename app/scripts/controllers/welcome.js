'use strict';

angular.module('modulePlannerApp')
  .controller('WelcomeCtrl', function ($scope, User, Auth, Course, _, $location, $timeout) {
    // initialization of variables
    $scope.step = 1;
    $scope.errors = {};
    $scope.state = {};
    $scope.user = {
      firstMajor: 'No Track',
      secondMajor: 'Finance'
    };
    $scope.requirement = {
      majors: ['Base'],
      exemptions: []
    };

    $scope.firstMajors = ['No Track'];
    $scope.secondMajors = ['Undecided', 'Finance'];
    $scope.exemptions = Course.findByCategory({ category: 'Exemptions' });

    $scope.setExemptions = function(exemption, exemptions){
      exemption.selected = !exemption.selected;
      var filtered = _.filter(exemptions, function(ex){
        return ex.selected;
      });
      $scope.requirement.exemptions = _.map(filtered, function(ex){
        return ex._id;
      });
    };

    $scope.register = function(form, requirement){
      $scope.submitted = true;

      $scope.requirement.majors.push($scope.user.firstMajor);
      $scope.requirement.majors.push($scope.user.secondMajor);

      $scope.requirement.majors = _.filter($scope.requirement.majors, function(r){
        return r !== 'Undecided' && r !== 'No Track';
      });

      console.log($scope.requirement.majors);
      if(form.$valid) {
        User.register(requirement, function(){
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
          $scope.state.message = 'Password successfully changed.';
          $scope.step = 2;
          $scope.submitted = false;
          $scope.errors = {};
          $scope.user.oldPassword = '';
          $scope.user.newPassword = '';
        })
        .catch( function() {
          form.password.$setValidity('mongoose', false);
          $scope.errors.other = 'Incorrect password';
        });
      }
		};
  });