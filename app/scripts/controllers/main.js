'use strict';

angular.module('modulePlannerApp')
  .controller('MainCtrl', function ($scope, User, _, $modal, Course) {
    $scope.planner = User.planner();

    $scope.isExemption = function(course){
      var match = _.indexOf(course.category, 'Exemption');
      return match >= 0;
    };

    $scope.openModal = function(type){
      var modalInstace = $modal.open({
        templateUrl: 'partials/modal',
        controller: 'ModalCtrl',
        resolve: {
          courses: function(){
            return Course.findByCategory({category: type}).$promise;
          }
        }
      });

      modalInstace.result.then(function(selected){
        console.log(selected);
      }, function(reason){
        console.log('Dismissed:', reason);
      });
    };
  });
