'use strict';

angular.module('modulePlannerApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth, _) {
    $scope.menu = [
      {
        link: '/settings',
        title: 'Settings',
      }, {
        isDropdown: true,
        isAdmin: true,
        title: 'Admin',
        dropdown: [
          {
            link: '/users',
            title: 'Manage Users'
          }, {
            link: '/users',
            title: 'Manage Courses'
          }, {
            link: '/users',
            title: 'Manage Requirements'
          }
        ]
      }
    ];

    if ($scope.currentUser && $scope.currentUser.role !== 'admin') {
      $scope.menu = _.filter($scope.menu, function(item){        
        return !item.isAdmin;
      });
    }
    
    $scope.logout = function() {
      Auth.logout()
      .then(function() {
        $location.path('/login');
      });
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });
