'use strict';

angular.module('modulePlannerApp')
  .controller('SettingsCtrl', function ($scope, $http, User, Course, _, $location, Requirement, Auth) {
    $scope.options = ['Majors Options', 'Password'];
    $scope.activeView = 0;
    $scope.user = {};
    $scope.errors = {};
    $scope.state = {};
    $scope.userRequirement = {
      majors: ['Base'],
      exemptions: []
    };
    
    // Intialize majors
    $scope.firstMajors = [{ major: 'No Track' }];
    $scope.secondMajors = [{ major: 'Undecided' }];

    // Initialize user values
    User.getProfile(function(profile){
      var majors = profile.majors;
      var firstMajor = _.find(majors, function(el){
        return el.type === 1 && el.major !== 'Base';
      });

      var secondMajor = _.find(majors, function(el){
        return el.type === 2;
      });

      // Set first major
      Requirement.getType({ type: 1 }, function(firstMajors){
        firstMajors = _.filter(firstMajors, function(el){
          return el.major !== 'Base';
        });
        $scope.firstMajors = _.union($scope.firstMajors, firstMajors);
        $scope.userRequirement.firstMajor = firstMajor ? firstMajor.major : 'No Track';
      });

      // Set second major
      Requirement.getType({ type: 2 }, function(secondMajors){
        $scope.secondMajors = _.union($scope.secondMajors, secondMajors);
        $scope.userRequirement.secondMajor = secondMajor ? secondMajor.major : 'Undecided';
      });
      
      // Set exemptions
      Course.findByCategory({ category: 'Exemptions' }, function(exemptions){
        $scope.availableExemptions = exemptions;

        angular.forEach($scope.availableExemptions, function(ex, i){
          var match = _.indexOf(profile.exemptions, ex._id);
          if (match > -1) {
            ex.selected = true;
          }
        });
      });
    });

    $scope.updateProfile = function(form){
      var exemptions = _.reduce($scope.availableExemptions, function(arr, el){
        if (el.selected) {
          arr.push(el._id);
        }
        return arr;
      }, []);

      var majors = ['Base', $scope.userRequirement.firstMajor, $scope.userRequirement.secondMajor];
      majors = _.filter(majors, function(m){
        return m !== 'Undecided' && m !== 'No Track';
      });

      var data = {
        exemptions: exemptions,
        majors: majors
      };
      User.updateProfile(data, function(){
        $location.path('/');
      }, function(){
        $scope.message = 'An error has occurred';
      });
    };

    $scope.changeView = function(index){
      $scope.activeView = index;
    };

    $scope.selectExemption = function(exemption, form){
      exemption.selected = !exemption.selected;
      form.$setDirty();
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
