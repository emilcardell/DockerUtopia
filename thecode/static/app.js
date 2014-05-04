var app = angular.module('happyApp', []);

app.controller('TodoListController', ['$scope', '$http', function($scope, $http){
	$scope.todoToCreate = {};

	$scope.Todos = [ { Body: "Text1" }, { Body: "Text2" }, { Body: "Text3" } ];
	console.log($scope.Todos);

	$scope.SearchChanged = function(searchTerm) {
		console.log(searchTerm);
	};


	$scope.DoTodoItem = function(todoToDone) {
		console.log(todoToDone);
	};

	$scope.todoToCreate = {};
	$scope.CreateTodoItem = function(todoToCreate) {
		console.log(todoToCreate);
	};
}]);
