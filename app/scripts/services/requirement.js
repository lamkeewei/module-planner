'use strict';

angular.module('modulePlannerApp')
  .factory('Requirement', function ($resource) {
    return $resource('/api/requirements/:type:attribute/:major', {}, {
      getType: {
        method: 'GET',
        isArray: true
      },
      getMajor: {
        method: 'GET',
        params: {
          attribute: 'major'
        }
      },
      update: {
        method: 'PUT'
      }
    });
  });
