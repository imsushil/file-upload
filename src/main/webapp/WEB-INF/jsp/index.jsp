<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
	<title>File Upload</title>
	<script src="resources/js/jquery-3.3.1.min.js"></script>
  	<script src="resources/js/bootstrap.min.js" ></script>
	<script src="resources/js/angular.min.js"></script>
	<script src="resources/js/angular-route.min.js"></script>
		
	<script src="resources/component/app-module.js"></script>
	<script src="resources/component/app-config.js"></script>
	<script src="resources/js/fileUpload.js"></script>
	<script src="resources/component/fileUpload/fileUpload-controller.js"></script>
	
	<link href="resources/css/bootstrap.min.css" rel="stylesheet" />
	<link rel="stylesheet" href="resources/css/font-awesome.min.css" />
	<link rel="stylesheet" href="resources/component/fileUpload/fileUpload.css"/>	
</head>
<body ng-app="fileUpload" ng-cloak>
	<div class="container" ng-view>
	
	</div>
</body>
</html>