var app = angular.module('app', ["ngResource"]).
  config(function ($routeProvider, $locationProvider) {
    $routeProvider.
        when("/",         {templateUrl: "/assets/list.html", controller: "AppCtrl"}).
        when("/new",      {templateUrl: "/assets/edit.html", controller: "NewCtrl"}).
        when("/edit/:id", {templateUrl: "/assets/edit.html", controller: "EditCtrl"}).
        otherwise({redirectTo: "/"});
  }).
  config(["$httpProvider", function(provider) {
    provider.defaults.headers.common['X-CSRF-Token'] = $('meta[name=csrf-token]').attr('content');
    provider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
  }]);

app.factory("Crew", function($resource) {
  return $resource("/crews/:id", {id: "@id"}, {update: {method: "PUT"}, destroy: {method: "DELETE"}});
});

function EditCtrl($scope, $location, $routeParams, Crew) {
  $scope.title = "Edit Crew";
  $scope.person = Crew.get({id: $routeParams.id});

  $scope.save = function() {
    Crew.update({id: $scope.person.id}, $scope.person, function(response){
      $location.path("/");
    });
  }
}

function NewCtrl($scope, $location, Crew) {
  $scope.title = "New Crew";
  $scope.person = {name: "", description: ""};

  $scope.save = function() {
    var crew = Crew.save($scope.person, function(response) {
      $scope.crew.push(response);
      $location.path("/");
    });
  }
}

function AppCtrl($scope, $location, Crew){
  $scope.crew = Crew.query();

  $scope.destroy = function(id) {
    if (confirm("Are you sure?")) {
      Crew.remove({id: id}, function(response){
        angular.forEach($scope.crew, function(e, i) {
          if(e.id === id) {
            $scope.crew.splice(i, 1);
            return;
          }
        });
      });
    }
  };
}