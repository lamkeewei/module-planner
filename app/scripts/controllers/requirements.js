'use strict';

angular.module('modulePlannerApp')
  .controller('RequirementsCtrl', function ($scope, $http, Requirement, Course, _) {
    $scope.search = {};
    $scope.flags = {
      submitted: false
    };
    $scope.categories = [];
    $scope.newRequirement = {
      major: '',
      type: 1,
      preassigned: [],
      requirements: []
    };

    $scope.requirement = angular.copy($scope.newRequirement);

    Requirement.getMajor({ major: 'Base' }, function(base){
      $scope.originalBase = base;
      $scope.base = angular.copy(base);
      var preassigned = _.groupBy(base.preassigned, 'category');
      angular.forEach($scope.base.requirements, function(el){
        var pre = preassigned[el.type];
        if (pre) {
          el.courses = pre;
        } else {
          el.courses = [];
        }
      });

      Requirement.query(function(requirements){
        $scope.requirements = _.reduce(requirements, function(obj, el){
          obj[el.major] = el;
          return obj;
        }, {});

        $scope.requirements.Base.active = true;
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

    $scope.addSubtype = function(subtype, requirement){
      var s = {
        type: subtype,
        qtyRequired: 0,
        courses: [],
        isAdded: true
      };

      requirement.subtypes.push(s);
      _.remove($scope.categories, function(type){
        return type === subtype;
      });
    };

    $scope.addToList = function(category, requirement, course){
      var list = requirement.courses;
      if (!course.code) {
        // It is a subtype
        $scope.addSubtype(course, requirement);
        return;
      }
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
      var match = _.findIndex($scope.categories, category);
      if (match > -1) {
        return;
      }
      $scope.categories.push(category);
      $scope.search.term = '';
    };

    $scope.addNewRequirement = function(data){
      if (data.code) {
        return;
      }

      var requirement = {
        type: data,
        qtyRequired: 0,
        courses: [],
        isAdded: true
      };
      _.remove($scope.categories, function(type){
        return type === data;
      });

      $scope.base.requirements.unshift(requirement);
      $scope.requirement.requirements.push(requirement);
    };

    $scope.removeNewRequirement = function(requirement, index){
      $scope.categories.unshift(requirement.type);

      angular.forEach(requirement.courses, function(course){
        _.remove($scope.requirement.preassigned, function(el){
          return el.courseId.code === course.courseId.code;
        });
      });

      $scope.base.requirements.splice(index, 1);
      _.remove($scope.requirement.requirements, function(r){
        return r.type === requirement.type;
      });
    };

    $scope.hasChanged = function(){
      return $scope.requirement.preassigned.length > 0 || $scope.requirement.requirements.length > 0;
    };

    $scope.addRequirement = function(requirement){
      var requirements = requirement.requirements;
      $scope.base.requirements = $scope.base.requirements.concat(requirements);
    };

    $scope.selectMajor = function(major){
      if (major.active) {
        angular.forEach($scope.requirements, function(value, key){
          value.active = false;
        });

        $scope.requirements.Base.active = true;
        $scope.requirement = $scope.newRequirement;
        // $scope.base = $scope.originalBase;
        return;
      }

      angular.forEach($scope.requirements, function(value, key){
        value.active = false;
      });

      major.active = true;
      if (major.major !== 'Base') {
        $scope.requirement = major;
        // $scope.addRequirement(major);
      } else {
        $scope.requirement = angular.copy($scope.newRequirement);
      }
    };
  });