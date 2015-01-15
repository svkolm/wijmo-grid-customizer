angular.module('app', ['wijmo', 'wijGridCustomizerService'])

  .value('settings', {
    pageSize: 10
  })

  .factory('userDataView', function() {
    var users = [];
    for (var i = 0, userName; i < 10000; i++) {
      userName = 'Username' + ('0000' + i).slice(-5);
      users.push({
        selected: (i % 4 > 1),
        name: userName,
        email: userName + '@email.com'
      });
    }
    return new wijmo.data.ArrayDataView(users);
  })

  .controller('userController', ['$scope', 'settings', 'userDataView', 'wijGridCustomizer',
    function($scope, settings, dataView, wijGridCustomizer) {
      dataView.pageSize(settings.pageSize);
      $scope.dataView = dataView;
      $scope.wijGridCustomizer = wijGridCustomizer(dataView);
    }
  ]);
