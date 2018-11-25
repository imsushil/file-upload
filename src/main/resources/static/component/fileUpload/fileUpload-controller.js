angular.module("fileUpload").controller("fileUploadCtrl", function($scope){
	var homeVm = this;
	$scope.uploadedFiles = [];
	
	/* file: the uploaded file
	 * data: object on success of AJAX file upload
	 */ 
	function addToUploadedFilesTable(file, data) {
		var ext = file.name.split(".").pop().toLowerCase();
		
		if(ext === "pdf") {
			file.icon = "fa fa-file-pdf-o red";
		} else if(ext === "doc" || ext === "docx") {
			file.icon = "fa fa-file-word-o blue";
		} else if(ext === "csv" || ext === "xls" || ext === "xlsx") {
			file.icon = "fa fa-file-excel-o green";
		} else if(ext === "txt") {
			file.icon = "fa fa-file-text-o";
		} else if(ext === "ppt" || ext === "pptx" || ext === "pptm") {
			file.icon = "fa fa-file-powerpoint-o orange";
		} else if(ext === "zip" || ext === "7z") {
			file.icon = "fa fa-file-zip-o yellow";
		} else if($.inArray(ext, options.imageExtensions)>-1){
			file.icon = "fa fa-photo-o";
		} else {
			file.icon = "fa fa-file-o";
		}
		
        var sizeWithUnit, size = file.size;
        if(size <= 1024) {
            sizeWithUnit = size.toFixed(2) + "B";
        } else if(size <= 1024*1024) {
            sizeWithUnit = (size/1024).toFixed(2) + "KB";          
        } else {
            sizeWithUnit = (size/(1024*1024)).toFixed(2) + "MB";
        }
        file.sizeWithUnit = sizeWithUnit;
        
        $scope.uploadedFiles.push(file);
        $scope.$apply();
	}
	
	function getSizeWithUnit(size) {
    	var sizeWithUnit;
        if(size <= 1024) {
            sizeWithUnit = size.toFixed(2) + "B";
        } else if(size <= 1024*1024) {
            sizeWithUnit = (size/1024).toFixed(2) + "KB";          
        } else {
            sizeWithUnit = (size/(1024*1024)).toFixed(2) + "MB";
        }
        return sizeWithUnit;
    }
	
	/* file: the file which got error while uploading
	 * error: error message
	 */ 
	function addErrorToNotification(file, error) {
        var el = document.createElement("li");
        if(file) {
            var sizeWithUnit = getSizeWithUnit(file.size);
            var html = "<div class='alert alert-danger alert-small alert-dismissible alert-fileUpload'><a class='close custom-close' data-dismiss='alert' aria-label='close'>&times;</a><b>" + file.name + "</b>";
            
            if(error === options.sizeError) {
                html += "(" + sizeWithUnit + ") : " + error + "</div>";
            } else {
                html += " : " + error + "</div>";
            }
        } else {
            var html = "<div class='alert alert-danger alert-small alert-dismissible alert-fileUpload'><a class='close custom-close' data-dismiss='alert' aria-label='close'>&times;</a> "+ error +" </div>";
        }
        console.log(html);
        el.innerHTML = html;
        $("#notification").append(el);
    }
	
	/* file: the file which is getting uploaded
	 * pos: position used to get location in the notification area to update it's progress
	 */ 
	function addFileProgressToNotification(file, pos) {
        var el = document.createElement("li");
        var fileName;
        el.setAttribute("rel", pos);
        
        var sizeWithUnit = getSizeWithUnit(file.size);
        fileName = file.name;
        if(file.name.length > 30) {
            fileName = file.name.substring(0, 30);
        }
        var child = "<div class='alert alert-info alert-small alert-dismissible alert-fileUpload'><div class='row'>" +
        		"<div class='col-sm-5 col-md-4 col-lg-4'> "+ file.name.substring(0, 30) + "... (" + sizeWithUnit + ") : </div>" +
        		"<div class='col-sm-4 col-md-3 col-lg-3'>" +
        			"<div class='progress' id='fileUploadProgress'>" +
        			"<div class='progress-bar progress-bar-striped progress-bar-animated' rel='"+pos+"' role='progressbar' aria-valuenow='75' aria-valuemin='0' aria-valuemax='100'></div>" +
        		"</div></div></div></div>";
        el.innerHTML = child;
        $("#notification").append(el);
    }
	
	$scope.deleteFile = function(pos) {
		$scope.uploadedFiles.splice(pos, 1);
	}
	
	var options = {
		url: "uploadFile",
		maxSize: 52428800,
		limit: 5,
		onFileSuccess: addToUploadedFilesTable,
		onFileError: addErrorToNotification,
		onFileProgress: addFileProgressToNotification
	};
	
	angular.element("#file").fileUpload(options);
});