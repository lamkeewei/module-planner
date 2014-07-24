'use strict';

angular.module('modulePlannerApp')
  .factory('Course', function ($resource) {
    return $resource('/api/courses/:id:category', {}, {
      findByCategory: {
        method: 'GET',
        isArray: true
      },

      update: {
        method: 'PUT'
      }
    });
  });
