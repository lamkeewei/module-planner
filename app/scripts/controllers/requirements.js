'use strict';

angular.module('modulePlannerApp')
  .controller('RequirementsCtrl', function ($scope, $http, Requirement, Course, _, $window) {
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

    $scope.base = {
      requirements: []
    };

    $scope.requirement = angular.copy($scope.newRequirement);

    Requirement.getMajor({ major: 'Base' }, function(base){
      // Store the original base for use later
      $scope.base = base;

      // Group the preassigned for easy access
      var preassigned = _.groupBy(base.preassigned, 'category');

      // intiialize the preassigned 
      angular.forEach($scope.base.requirements, function(el){
        var pre = preassigned[el.type];
        if (pre) {
          el.courses = pre;
        } else {
          el.courses = [];
        }
      });

      $scope.originalBase = angular.copy($scope.base);

      // Get all the requirements and flatten them into a (kev, value) data structure
      // for easy access
      Requirement.query(function(requirements){
        $scope.requirements = _.reduce(requirements, function(obj, el){
          obj[el.major] = el;
          return obj;
        }, {});

        $scope.requirements.Base.active = true;
      });

      // Retrieve all the courses
      Course.query(function(courses){
        $scope.courses = courses;
        $scope.originalCourses = angular.copy(courses);

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

    $scope.addToList = function(category, requirement, course){
      if (!course.code) {
        return;
      }

      if (!requirement.courses) {
        requirement.courses = [];
      }

      var data = {
        category: category,
        courseId: course,
        isAdded: true
      };

      requirement.courses.push(data);
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

    $scope.addSubtype = function(data, main){
      if (data.code) {
        // Prevent dropping of course
        return;
      }

      if (!main.subtypes) {
        main.subtypes = [];
      }

      _.remove($scope.categories, function(type){
        return type === data;
      });

      var subtype = {
        type: data,
        qtyRequired: 1,
        courses: [],
        isAdded: true
      };

      main.subtypes.push(subtype);

      var match = _.findIndex($scope.requirement.requirements, { type: main.type });
      if (match < 0) {
        $scope.requirement.requirements.push(main);
      }
    };

    $scope.addNewRequirement = function(data){
      if (data.code) {
        return;
      }

      var requirement = {
        type: data,
        qtyRequired: 1,
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
      if (requirement.subtypes) {
        angular.forEach(requirement.subtypes, function(sub){
          $scope.categories.unshift(sub.type);
        });
      }

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

    $scope.removeSubtype = function(subtype, main, index){
      $scope.categories.unshift(subtype.type);
      angular.forEach(subtype.courses, function(course){
        _.remove($scope.requirement.preassigned, function(el){
          return el.courseId.code === course.courseId.code;
        });
      });

      main.subtypes.splice(index, 1);

      if (main.subtypes.length < 1 && main.requirements.length < 1 && main.preassigned.length < 1) {
        _.remove($scope.requirement.requirements, function(r){
          return r.type === main.type;
        });
      } else {
        angular.forEach($scope.requirement.requirements, function(r){
          if (r.type === main.type){
            _.remove(main.subtypes, function(s){
              return s.type === subtype.type;
            });
          }
        });
      }
    };

    $scope.hasChanged = function(){
      return $scope.requirement.preassigned.length > 0 || $scope.requirement.requirements.length > 0;
    };

    $scope.addRequirement = function(requirement){
      var requirements = requirement.requirements;
      var major = requirement.major;
      // Check if the current type exists already anot
      requirements.forEach(function(r){
        var type = r.type;
        var match = _.findIndex($scope.base.requirements, { type: type });

        angular.forEach(r.courses, function(c){
          c.isAdded = true;
        });
        
        // Set the is added flag
        r.isAdded = true;
        angular.forEach(r.subtypes, function(s){
          s.isAdded = true;
        });

        if (match > -1) {
          var original = $scope.base.requirements[match];
          if (!r.courses) {
            r.courses = [];
          }
          // Concat the list of requirements
          r.courses = r.courses.concat(original.courses);
          $scope.base.requirements[match] = r;
        } else {
          $scope.base.requirements = $scope.base.requirements.concat(r);
        }
      });
    };

    $scope.selectMajor = function(major){
      // Reset to original base first
      $scope.base = angular.copy($scope.originalBase);
      $scope.courses = angular.copy($scope.originalCourses);

      // Reset active flags for requirements
      angular.forEach($scope.requirements, function(value, key){
        value.active = false;
      });

      // Check if they selected the same one again
      if (major.active) {
        $scope.requirements.Base.active = true;
        $scope.requirement = $scope.newRequirement;
        return;
      }

      // Set active on the selected one
      major.active = true;

      if (major.major !== 'Base') {
        $scope.requirement = major;
        var ids = _.reduce(major.preassigned, function(arr, el){
          arr.push(el.courseId);
          return arr;
        }, []);

        _.remove($scope.courses, function(el){
          var match = _.findIndex(ids, function(c){
            return el.code === c.code;
          });

          return match > -1;
        });

        // Group the preassigned for easy access        
        var preassigned = _.groupBy(major.preassigned, 'category');
        // intiialize the preassigned 
        angular.forEach(major.requirements, function(el){
          var pre = preassigned[el.type];
          if (pre) {
            el.courses = pre;
          } else {
            el.courses = [];
          }
        });
        $scope.addRequirement(major);
      } else {
        var ids2 = _.reduce($scope.originalBase.preassigned, function(arr, el){
          arr.push(el.courseId);
          return arr;
        }, []);

        _.remove($scope.courses, function(el){
          var match = _.findIndex(ids2, function(c){
            return el.code === c.code;
          });

          return match > -1;
        });

        $scope.requirement = angular.copy($scope.newRequirement);
      }
    };

    $scope.addMajor = function(){
      var exists = $scope.requirements[$scope.requirement.major];
      var requirement = angular.copy($scope.requirement);

      angular.forEach(requirement.preassigned, function(p){
        p.courseId = p.courseId._id;
      });

      if (!exists) {
        Requirement.save(requirement, function(){
          new $window.PNotify({
            title: 'Success',
            text: 'New requirement has been created!',
            type: 'success'
          });

          $scope.requirements[requirement.major] = requirement;
          $scope.resetForm();
        });
      } else {
        Requirement.update(requirement, function(){
          new $window.PNotify({
            title: 'Success',
            text: 'Requirement has been updated!',
            type: 'success'
          });

          $scope.resetForm();
        });
      }
    };

    $scope.decreaseQty = function(requirement) {

      requirement.qtyRequired -= 1;

      var match = _.findIndex($scope.requirement.requirements, { type: requirement.type });
      if (match > -1) {
        $scope.requirement.requirements[match].qtyRequired = requirement.qtyRequired;
      } else {
        $scope.requirement.requirements.push(requirement);
      }

      // If it is the same as the base remove it
      var baseMod = _.find($scope.originalBase.requirements, { type: requirement.type });
      if (baseMod) {
        var baseQty = baseMod.qtyRequired;
        if (requirement.qtyRequired === baseQty) {
          _.remove($scope.requirement.requirements, { type: requirement.type });
        }
      }
    };

    $scope.increaseQty = function(requirement) {
      
      requirement.qtyRequired += 1;

      var match = _.findIndex($scope.requirement.requirements, { type: requirement.type });
      if (match > -1) {
        $scope.requirement.requirements[match].qtyRequired = requirement.qtyRequired;
      } else {
        $scope.requirement.requirements.push(requirement);
      }

      // If it is the same as the base remove it
      var baseMod = _.find($scope.originalBase.requirements, { type: requirement.type });
      if (baseMod) {
        var baseQty = baseMod.qtyRequired;
        if (requirement.qtyRequired === baseQty) {
          _.remove($scope.requirement.requirements, { type: requirement.type });
        }
      }
    };

    $scope.getTotalModules = function(){
      var total = 0;
      angular.forEach($scope.base.requirements, function(r){
        total += r.qtyRequired;

        if (r.subtypes && r.subtypes.length > 0) {
          angular.forEach(r.subtypes, function(s) {
            total += s.qtyRequired;
          });
        }
      });

      return total;
    };

    $scope.resetForm = function(){
      $scope.base = angular.copy($scope.originalBase);
      
      var ids2 = _.reduce($scope.originalBase.preassigned, function(arr, el){
        arr.push(el.courseId);
        return arr;
      }, []);


      angular.forEach($scope.requirements, function(value, key){
        value.active = false;
      });

      $scope.requirements.Base.active = true;

      _.remove($scope.courses, function(el){
        var match = _.findIndex(ids2, function(c){
          return el.code === c.code;
        });

        return match > -1;
      });
    };
  });