'use strict';

angular.module('modulePlannerApp')
  .factory('Session', function ($resource) {
    return $resource('/api/session/');
  });
