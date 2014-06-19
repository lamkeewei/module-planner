'use strict';

angular.module('modulePlannerApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth, _) {
    $scope.master = [
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
            link: '/requirements',
            title: 'Manage Requirements'
          }
        ]
      }
    ];

    
    $scope.$watch('currentUser', function(newVal, oldVal){
      $scope.filterMenuItems();
    }, true);

    $scope.filterMenuItems = function(){
      if ($scope.currentUser && $scope.currentUser.role !== 'admin') {
        $scope.menu = _.filter($scope.master, function(item){
          return !item.isAdmin;
        });
      } else {
        $scope.menu = $scope.master;
      }
    };


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
