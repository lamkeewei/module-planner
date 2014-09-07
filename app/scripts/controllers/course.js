'use strict';

angular.module('modulePlannerApp')
  .controller('CourseCtrl', function ($scope, Course, courses, $modal, _, $window) {
    $scope.courses = courses;

    var categories = _.reduce(courses, function(arr, c){
      arr = arr.concat(c.category);
      return arr;
    }, []);

    $scope.categories = _.uniq(categories).sort();
    $scope.search = {};
    $scope.limit = 30;

    $scope.$watch('search', function(){
      $scope.limit = 30;
    }, true);

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
          },
          categories: function(){
            return $scope.categories;
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
        var pos = _.findIndex($scope.courses, { code: course.code });
        $scope.courses.splice(pos, 1);
        $scope.search.title = '';

        new $window.PNotify({
          title: 'Course Deleted',
          text: 'Courses successfully deleted',
          type: 'success'
        });
      });
    };

    $scope.editCourse = function(course){
      var modalInstance = $modal.open({
        templateUrl: 'partials/courseForm',
        controller: 'CourseFormCtrl',
        resolve: {
          course: function(){
            return angular.copy(course);
          },
          categories: function(){
            return $scope.categories;
          }
        }
      });

      modalInstance.result.then(function(course){
        Course.update({id: course._id}, course, function(data){
          var index = _.findIndex($scope.courses, {code: course.code});
          $scope.courses[index] = course;

          new $window.PNotify({
            title: 'Course Updated',
            text: 'Courses successfully updated',
            type: 'success'
          });
        });
      });
    };

    $scope.toggleHidden = function(course){
      course.hidden = !course.hidden;
      Course.update({ id: course._id }, course, function(data){});
    };

    $scope.matchCategory = function(courses){
      if (!$scope.search.category) {
        return courses;
      }
      
      courses = _.filter(courses, function(c){
        var match = _.findIndex(c.category, function(c1){
          return c1 === $scope.search.category;
        });

        return match > -1;
      });

      return courses;
    };

    $scope.increaseLimit = function(){
      $scope.limit += 10;
    };

    $scope.resetSearch = function(){
      $scope.search = {};
    };
  });