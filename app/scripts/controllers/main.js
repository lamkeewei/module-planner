'use strict';

angular.module('modulePlannerApp')
  .controller('MainCtrl', function ($scope, User, _, $modal, Course) {
    $scope.planner = User.planner();

    $scope.isExemption = function(course){
      var match = _.indexOf(course.category, 'Exemption');
      return match >= 0;
    };

    $scope.openModal = function(category, index){
      var modalInstace = $modal.open({
        templateUrl: 'partials/modal',
        controller: 'ModalCtrl',
        resolve: {
          courses: function(){
            return User.getCourses({category: category.type}).$promise;
          }
        }
      });

      modalInstace.result.then(function(selected){
        User.selectCourse(selected, function(){
          category.courses[index] = selected;
        });
      }, function(reason){
        console.log('Dismissed:', reason);
      });
    };
  });
