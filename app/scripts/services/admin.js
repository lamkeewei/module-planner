'use strict';

angular.module('modulePlannerApp')
  .factory('Admin', function () {
    return $resource('/api/admin/:resource', {}, {
      createUser: {
        method: 'POST',
        params: {
          resource: 'users'
        }
      }
    })
  });
