'use strict';

angular.module('modulePlannerApp')
  .factory('Course', function ($resource) {
    return $resource('/api/courses/:category', {}, {
      findByCategory: {
        method: 'GET',
        isArray: true
      }
    });
  });
