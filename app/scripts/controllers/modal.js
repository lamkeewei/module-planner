'use strict';

angular.module('modulePlannerApp')
  .controller('ModalCtrl', function ($scope, $modalInstance, courses, current, _) {
    $scope.courses = _.filter(courses, function(c){
      var match = _.indexOf(c.category, 'Exemption');
      return match === -1;
    });

    $scope.current = current;

    $scope.select = function(course){
      $scope.courses.forEach(function(c, i){
        c.selected = c.code === course.code;
      });
    };

    $scope.getPrerequisite = function(course){
      if(course.prerequisite.length < 1) {
        return 'None';
      }

      return course.prerequisite.join();
    };

    $scope.getDoubleCount = function(course){
      if (course.doubleCount.length > 0) {
        return course.doubleCount[0].replace;
      }

      return 'None';
    };

    $scope.done = function(){
      var selected;

      angular.forEach($scope.courses, function(course){
        if(course.selected) {
          selected = course;
        }
      });

      if (selected) {
        $modalInstance.close(selected);
      } else {
        $modalInstance.dismiss('No module selected');
      }
    };
  });
