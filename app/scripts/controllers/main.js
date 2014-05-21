'use strict';

angular.module('modulePlannerApp')
  .controller('MainCtrl', function ($scope, User, _, $modal) {
    $scope.planner = User.planner();

    $scope.isExemption = function(course){
      var match = _.indexOf(course.category, 'Exemption');
      return match >= 0;
    };

    $scope.openModal = function(){
      var modalInstace = $modal.open({
        template: '<div class="course-modal"></div>'
      });
    };
  });
