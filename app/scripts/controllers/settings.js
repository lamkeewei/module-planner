'use strict';

angular.module('modulePlannerApp')
  .controller('SettingsCtrl', function ($scope, $http, User, Course, _) {
    $scope.options = ['Password', 'Majors Options'];
    $scope.activeView = 0;
    $scope.userRequirement = {
      firstMajor: 'No Track',
      secondMajor: 'Finance'
    };
    $scope.userRequirement.exemptions = [];
    
    User.getProfile(function(profile){
      $scope.userRequirement.firstMajor = profile.firstMajor;
      $scope.userRequirement.secondMajor = profile.secondMajor;
      Course.findByCategory({ category: 'Exemption' }, function(exemptions){
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
      var data = {
        exemptions: exemptions
      };
      User.updateProfile(data, function(){
        $scope.message = 'Updated';
      });
    };

    $scope.changeView = function(index){
      $scope.activeView = index;
    };
  });
