angular.module("fileUpload").config(function($routeProvider) {
	$routeProvider.when("/", {
		templateUrl : "resources/views/homeView.html",
		controller: "fileUploadCtrl",
		controllerAs: "homeVm"
	}).otherwise({
		templateUrl : "resources/views/error.html"
	});
});