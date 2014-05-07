var app = angular.module('happyApp', []);

app.controller('TodoListController', ['$scope', '$http', function($scope, $http){
	
	$scope.todoToCreate = {};
	$scope.EnableAddButton = true;
	

	var doSearch = function(searchTerm){
		$http.get("/tasks?query=" + searchTerm).success(function(data, status, headers, config){
			$scope.Todos = data.Result;	
		}).error(function(data, status, headers, config){
	    	alert("Database down!!!");
		});
	}

	doSearch("");


	$scope.SearchChanged = function(searchTerm) {
		doSearch(searchTerm);
	};

	$scope.todoToCreate = {};
	$scope.CreateTodoItem = function(todoToCreate) {
		$scope.EnableAddButton = false;
		$http.post("/task", todoToCreate).success(function(data, status, headers, config){
			if(!$scope.searchTerm) {
				$scope.Todos.unshift(data);
				$scope.EnableAddButton = true;
				$scope.todoToCreate.Body = "";
			}
			else {
				setTimeout(function(){
					doSearch($scope.searchTerm)
					$scope.EnableAddButton = true;
					$scope.todoToCreate.Body = "";
				}, 2500);				
			}			
		}).error(function(data, status, headers, config){
	    	alert("Database down!!!");
		});

	};
}]);
