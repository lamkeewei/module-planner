'use strict';

angular.module('modulePlannerApp')
  .controller('CourseFormCtrl', function ($scope, Course, course, categories, _) {
    $scope.course = course;
    $scope.categories = categories;
    $scope.input = {};

    $scope.addCategory = function(item, model, label){
      if (!_.contains($scope.course.category, item)) {
        $scope.course.category.push(item);
      }
      $scope.input.category = '';
    };

    $scope.addSubcategory = function(item, model, label){
      if (!_.contains($scope.course.subcategory, item)) {
        $scope.course.subcategory.push(item);
      }
      $scope.input.subcategory = '';
    };

    $scope.addDoubleCount = function(item, model, label){
      var index = _.findIndex($scope.course.doubleCount, { replace: item });
      if (index === -1) {
        $scope.course.doubleCount.push({
          replace: item,
          freeUp: 'Economics Major Related'
        });
      }
      $scope.input.doubleCount = '';
    };

    $scope.removeItem = function(index, field){
      $scope.course[field].splice(index, 1);
    };

    $scope.newAdd = function(event, field){
      var category = event.target.value;
      if (event.keyCode === 13 && category) {
        if (!_.contains($scope.course[field], category)) {
          $scope.course[field].push(category);
        }
        event.target.value = '';
      }
    };

    $scope.newAddDoubleCount = function(event){
      var category = event.target.value;
      var index = _.findIndex($scope.course.doubleCount, { replace: category });

      if (event.keyCode === 13 && category) {
        if (index === -1) {
          $scope.course.doubleCount.push({
            freeUp: 'Economics Major Related',
            replace: category
          });
        }

        event.target.value = '';
      }
    };
  });