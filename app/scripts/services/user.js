'use strict';

angular.module('modulePlannerApp')
  .factory('User', function ($resource) {
    return $resource('/api/users/:id/:action/:category', {
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
      }
	  });
  });
