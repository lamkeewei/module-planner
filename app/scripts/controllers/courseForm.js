'use strict';

angular.module('modulePlannerApp')
  .controller('CourseFormCtrl', function ($scope, Course, $modal, course) {
    $scope.input = {};
    $scope.course = course;

    $scope.addCategory = function(){
      if($scope.input.category) {
        $scope.course.category.push($scope.input.category);
      }
      $scope.input.category = '';
    };

    $scope.removeCategory = function(index){
      $scope.course.category.splice(index, 1);
    };

    $scope.addSubcategory = function(){
      if ($scope.input.subcategory) {
        $scope.course.subcategory.push($scope.input.subcategory);
      }
      $scope.input.subcategory = '';
    };

    $scope.removeSubcategory = function(index){
      $scope.course.subcategory.splice(index, 1);
    };

    $scope.addDoubleCount = function(){
      if ($scope.input.doubleCount) {
        $scope.course.doubleCount = [{
          replace: $scope.input.doubleCount,
          freeUp: 'Economics Major Related'
        }];
      }
      $scope.input.doubleCount = '';
    };

    $scope.removeDoubleCount = function(){
      $scope.course.doubleCount = [];
    };

    $scope.isValid = function(){
      var notBlank = $scope.course.title && $scope.course.code;

      return notBlank && $scope.course.category.length > 0;
    };
  });