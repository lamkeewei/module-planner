'use strict';

angular.module('modulePlannerApp')
  .controller('RequirementsCtrl', function ($scope, $http, Requirement, Course, _) {
    $scope.search = {};
    $scope.flags = {
      show: ''
    };
    $scope.categories = ['University Core', 'Economics Major', 'Economics Major Related'];
    $scope.requirement = {
      major: 'Test',
      preassigned: [],
      requirements: []
    };


    Requirement.getMajor({ major: 'Base' }, function(base){
      $scope.base = base;
      var preassigned = _.groupBy(base.preassigned, 'category');
      angular.forEach($scope.base.requirements, function(el){
        var pre = preassigned[el.type];
        if (pre) {
          el.courses = pre;
        } else {
          el.courses = [];
        }
      });

      Course.query(function(courses){
        $scope.courses = courses;

        var flatCourses = _.reduce($scope.base.preassigned, function(arr, el){
          arr.push(el.courseId);
          return arr;
        }, []);

        _.remove($scope.courses, function(el){
          var match = _.findIndex(flatCourses, function(c){
            return el.code === c.code;
          });

          return match > -1;
        });
      });
    });

    $scope.logOut = function(data){
      console.log(data);
    };

    $scope.addToList = function(category, list, course){
      var data = {
        category: category,
        courseId: course,
        isAdded: true
      };
      list.push(data);
      $scope.requirement.preassigned.push(data);

      _.remove($scope.courses, function(el){
        return el.code === course.code;
      });
    };

    $scope.remove = function(list, index){
      var course = list[index];
      list.splice(index, 1);
      _.remove($scope.requirement.preassigned, function(el){
        return el.courseId.code === course.courseId.code;
      });

      $scope.courses.unshift(course.courseId);
    };

    $scope.addNewCategory = function(category){
      $scope.categories.push(category);
      $scope.search.term = '';
    };
  });
