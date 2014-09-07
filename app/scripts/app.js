'use strict';

angular.module('modulePlannerApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ngAnimate',
  'angular-loading-bar',
  'ui.bootstrap'
])
  .config(function ($routeProvider, $locationProvider, $httpProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'partials/main',
        controller: 'MainCtrl',
        authenticate: true
      })
      .when('/login', {
        templateUrl: 'partials/login',
        controller: 'LoginCtrl'
      })
      .when('/signup', {
        templateUrl: 'partials/signup',
        controller: 'SignupCtrl'
      })
      .when('/welcome', {
        templateUrl: 'partials/welcome',
        controller: 'WelcomeCtrl',
        authenticate: true
      })
      .when('/settings', {
        templateUrl: 'partials/settings',
        controller: 'SettingsCtrl',
        authenticate: true
      })
      .when('/users', {
        templateUrl: 'partials/users',
        controller: 'UserCtrl',
        authenticate: true,
        admin: true
      })
      .when('/course', {
        templateUrl: 'partials/course',
        controller: 'CourseCtrl',
        resolve: {
          courses: ['Course', function(Course){
            return Course.query().$promise;
          }]
        }
        // authenticate: true,
        // admin: true
      })
      .when('/requirements', {
        templateUrl: 'partials/requirements',
        controller: 'RequirementsCtrl',
        authenticate: true,
        admin: true
      })
      .otherwise({
        redirectTo: '/'
      });
      
    $locationProvider.html5Mode(true);
      
    // Intercept 401s and redirect you to login
    $httpProvider.interceptors.push(['$q', '$location', function($q, $location) {
      return {
        'responseError': function(response) {
          if(response.status === 401) {
            $location.path('/login');
            return $q.reject(response);
          }
          else {
            return $q.reject(response);
          }
        }
      };
    }]);
  })
  .config(function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = false;
  })
  .factory('_', function(){
    return window._;
  })
  .run(function ($rootScope, $location, Auth, User) {

    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$routeChangeStart', function (event, next) {
      event.preventDefault();
      if (next.authenticate && !Auth.isLoggedIn()) {
        return $location.path('/login');
      }

      if (next.authenticate) {
        User.get(function(user){
          if (!next.admin) {
            if (user && user.requirement.length < 1) {
              return $location.path('/welcome');
            }

            if(next.originalPath === '/welcome'){
              return $location.path('/');
            }
          } else {
            if (user.role !== 'admin') {
              return $location.path('/');
            }
          }
        });
      }
    });
  });