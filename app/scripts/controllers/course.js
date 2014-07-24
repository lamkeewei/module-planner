'use strict';

angular.module('modulePlannerApp')
  .controller('CourseCtrl', function ($scope, Course, $modal) {
    $scope.courses = Course.query();
    $scope.search = {};

    $scope.addCourse = function(){
      var modalInstance = $modal.open({
        templateUrl: 'partials/courseForm',
        controller: 'CourseFormCtrl',
        resolve: {
          course: function(){
            return {
              category: [],
              subcategory: [],
              doubleCount: [],
              prerequisite: []
            };
          }
        }
      });

      modalInstance.result.then(function(course){
        Course.save(course, function(data){
          $scope.courses.unshift(data);
          $scope.search.title = '';
        });
      });
    };

    $scope.deleteCourse = function(course, index){
      Course.delete({id: course._id}, function(){
        $scope.courses = Course.query();
        $scope.search.title = '';
      });
    };

    $scope.editCourse = function(course){
      var modalInstance = $modal.open({
        templateUrl: 'partials/courseForm',
        controller: 'CourseFormCtrl',
        resolve: {
          course: function(){
            return course;
          }
        }
      });

      modalInstance.result.then(function(course){
        console.log(course);
        Course.update({id: course._id}, course, function(data){
          $scope.courses = Course.query();
        });
      });
    };
  });