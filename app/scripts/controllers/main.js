'use strict';

angular.module('modulePlannerApp')
  .controller('MainCtrl', function ($scope, User, _, $modal, Course) {
    $scope.showOptions = false;
    $scope.planner = User.planner(function(){
      $scope.flatten = _.reduce($scope.planner, function(flat, el){
        flat[el.type] = {
          qtyRequired: el.qty,
          courses: el.courses
        };

        if (el.subtypes.length > 0) {
          angular.forEach(el.subtypes, function(sub){
            flat[sub.type] = {
              qtyRequired: sub.qtyRequired,
              courses: sub.courses
            };
          });
        }
        return flat;
      }, {});
    });

    $scope.optionsToggle = function(){
      $scope.showOptions = !$scope.showOptions;
    };

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

    $scope.countEmpty = function(arr){
      var empty = _.filter(arr, function(el){
        return !$scope.isStatic(el);
      });

      return empty.length;
    };

    $scope.getNumDoubleCount = function(replace){
      var allCourses = _.reduce($scope.flatten, function(arr, el, key){
        arr = _.union(arr, el.courses);
        return arr;
      }, []);

      var doubleCountable = _.filter(allCourses, function(el){
        return el.doubleCount && el.doubleCount[0] && el.doubleCount[0].replace === replace;
      });

      return doubleCountable.length;
    };

    $scope.deselect = function(prev){
      if (prev.doubleCount.length > 0) {
        var doubleCount = prev.doubleCount[0];
        var freeUp = $scope.flatten[doubleCount.freeUp];
        var replace = $scope.flatten[doubleCount.replace];

        // When the number doubled counted for and of module that is double countable
        // are equal, this means that the max double countable is not exceeded

        var numDoubleCount = $scope.getNumDoubleCount(doubleCount.replace);

        // This is not aware of other category double count
        // It should get the number of double count applied for the the replace-freeUp pair
        
        var doubleCountedFor = replace.qtyRequired - replace.courses.length;

        if (numDoubleCount === doubleCountedFor){
          // Add to free up
          var last = freeUp.courses[freeUp.courses.length - 1];
          if (last._id) {
            User.deselectCourse({ courseId: last._id});
          }
          
          replace.courses.push({});
          freeUp.courses.splice(freeUp.courses.length - 1, 1);
        }
      }
    };

    $scope.chooseCourse = function(category, index){
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
            $scope.deselect(prev);
            category.courses[index] = {};
          });

          return;
        }

        var data = {
          category: category.type,
          selected: selected,
          // Previous will be set if it's a replacement
          previous: category.courses[index]._id
        };


        User.selectCourse(data, function(){
          if (data.previous) {
            $scope.deselect(category.courses[index]);
          }

          category.courses[index] = selected;
          if (selected.doubleCount.length > 0) {
            var doubleCount = selected.doubleCount[0];
            var replace = $scope.flatten[doubleCount.replace];

            if ($scope.countEmpty(replace.courses) > 0){
              // Add to free up
              var freeUp = $scope.flatten[doubleCount.freeUp];
              var last = replace.courses[replace.courses.length - 1];
              if (last._id) {
                User.deselectCourse({ courseId: last._id});
              }

              freeUp.courses.push({});
              replace.courses.splice(replace.courses.length - 1, 1);
            }
          }
        });
      }, function(reason){
        // console.log('Dismissed:', reason);
      });
    };
  });
