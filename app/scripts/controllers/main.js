'use strict';

angular.module('modulePlannerApp')
  .controller('MainCtrl', function ($scope, User, _, $modal, Course) {
    $scope.planner = User.planner();

    $scope.isStatic = function(course){
      var exemption = _.indexOf(course.category, 'Exemption');
      var preassigned = _.indexOf(course.category, 'Preassigned');
      return exemption >= 0 || preassigned >= 0;
    };

    $scope.isExemption = function(course){
      var exemption = _.indexOf(course.category, 'Exemption');
      var preassigned = _.indexOf(course.category, 'Preassigned');
      return exemption >= 0 && preassigned === -1;
    };

    $scope.isPreassigned = function(course){
      var preassigned = _.indexOf(course.category, 'Preassigned');
      return preassigned >= 0;
    };

    $scope.setTime = function(course){
      var modalInstance = $modal.open({
        templateUrl: 'partials/time',
        controller: 'TimeCtrl',
        resolve: {
          course: function(){
            return course;
          }
        }
      });

      modalInstance.result.then(function(schedule){
        if (!schedule) {
          var query = {
            courseId: course._id
          };

          User.unscheduleCourse(query, function(){
            delete course.schedule;
          });

          return;
        }
        User.scheduleCourse(schedule, function(){
          course.schedule = schedule;
        });
      });
    };

    $scope.chooseCourse = function(category, index){
      console.log(category.type);
      var modalInstance = $modal.open({
        templateUrl: 'partials/modal',
        controller: 'ModalCtrl',
        resolve: {
          courses: function(){
            return User.getCourses({category: category.type}).$promise;
          },
          current: function(){
            return category.courses[index];
          }
        }
      });

      modalInstance.result.then(function(selected){
        if (!selected){
          var params = {
            courseId: category.courses[index]._id
          };

          User.deselectCourse(params, function(){
            var prev = category.courses[index];
            
            if (prev.doubleCount.length > 0) {
              angular.forEach($scope.planner, function(category){
                var categoryType = category.type;

                angular.forEach(prev.doubleCount, function(doubleCount){
                  // Remove appropriate number of courses
                  if (doubleCount.replace === categoryType) {
                    category.courses.push({});
                  }
                  // Add appropriate number of courses
                  if (doubleCount.freeUp === categoryType) {
                    var courses = category.courses;
                    courses.splice(courses.length - 1, 1);
                  }
                });
              });
            }

            category.courses[index] = {};
          });

          return;
        }

        var data = {
          selected: selected,
          previous: category.courses[index]._id
        };

        User.selectCourse(data, function(){
          category.courses[index] = selected;
          if (selected.doubleCount.length > 0) {
            angular.forEach($scope.planner, function(category){
              var categoryType = category.type;

              angular.forEach(selected.doubleCount, function(doubleCount){
                // Remove appropriate number of courses
                if (doubleCount.replace === categoryType) {
                  var courses = category.courses;
                  courses.splice(courses.length - 1, 1);
                }
                // Add appropriate number of courses
                if (doubleCount.freeUp === categoryType) {
                  category.courses.push({});
                }
              });
            });
          }
        });
      }, function(reason){
        // console.log('Dismissed:', reason);
      });
    };
  });
