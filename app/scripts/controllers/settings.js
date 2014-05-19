'use strict';

angular.module('modulePlannerApp')
  .controller('SettingsCtrl', function ($scope, User, Auth, Course, _) {
    $scope.errors = {};
    $scope.requirement = {
      exemptions: []
    };
    $scope.firstMajor = ['No Track', 'Quantitative Economics', 'Maritime Economics Concentration'];
    $scope.secondMajors = ['Finance', 'Marketing', 'Operations'];
    $scope.exemptions = Course.findByCategory({ category: 'Exemption' });

    $scope.setExemptions = function(exemption){
      if (exemption.selected){
        $scope.requirement.exemptions = _.remove($scope.requirement.exemptions, function(e){
          return e._id === exemption._id;
        });
        exemption.selected = false;
      } else {
        $scope.requirement.exemptions.push(exemption._id);
        exemption.selected = true;
      }
    };

    $scope.changePassword = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.changePassword( $scope.user.oldPassword, $scope.user.newPassword )
        .then( function() {
          $scope.message = 'Password successfully changed.';
        })
        .catch( function() {
          form.password.$setValidity('mongoose', false);
          $scope.errors.other = 'Incorrect password';
        });
      }
		};
  });
