'use strict';

angular.module('modulePlannerApp')
  .factory('Admin', function ($resource) {
    return $resource('/api/admin/:resource', {}, {
      createUser: {
        method: 'POST',
        params: {
          resource: 'users'
        }
      }
    });
  });
