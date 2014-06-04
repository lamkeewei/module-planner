'use strict';

angular.module('modulePlannerApp')
  .factory('User', function ($resource) {
    return $resource('/api/users/:id/:action/:category:courseId', {
      id: '@id'
    }, { //parameters default
      update: {
        method: 'PUT',
        params: {}
      },
      get: {
        method: 'GET',
        params: {
          id:'me'
        }
      },
      register: {
        method: 'POST',
        params: {
          id: 'me',
          action: 'register'
        }
      },
      planner: {
        method: 'GET',
        isArray: true,
        params: {
          id: 'me',
          action: 'planner'
        }
      },
      selectCourse: {
        method: 'POST',
        params: {
          id: 'me',
          action: 'select'
        }
      },
      getCourses: {
        method: 'GET',
        isArray: true,
        params: {
          id: 'me',
          action: 'courses'
        }
      },
      deselectCourse: {
        method: 'DELETE',
        params: {
          id: 'me',
          action: 'select'
        }
      },
      scheduleCourse: {
        method: 'POST',
        params: {
          id: 'me',
          action: 'schedule'
        }
      },
      unscheduleCourse: {
        method: 'DELETE',
        params: {
          id: 'me',
          action: 'schedule'
        }
      },
      getProfile: {
        method: 'GET',
        params: {
          id: 'me',
          action: 'profile'
        }
      },
      updateProfile: {
        method: 'PUT',
        params: {
          id: 'me',
          action: 'profile'
        }
      }
	  });
  });
