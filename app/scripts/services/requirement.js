'use strict';

angular.module('modulePlannerApp')
  .factory('Requirement', function ($resource) {
    return $resource('/api/requirements/:type', {}, {
      getType: {
        method: 'GET',
        isArray: true
      }
    });
  });
