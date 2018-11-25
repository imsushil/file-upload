(function($) {
    $.fn.fileUpload = function(options) {
        // default configuration properties
        var defaults = {
            dragText: "Drag and Drop your files here or <span id='selectFiles'>select files from computer</span>",
            allowedExtensions: ["tif", "jpg", "png", "bmp", "csv", "doc", "docx", "msg", "pdf", "ppt", "pptx", "txt", "xls", "xml", "rtf", "zip"],
            imageExtensions: ["tif", "jpg", "jpg", "gif", "png", "bmp"],
            maxSize: 10485760,
            showPreview: true,
            showFilename: true,
            showPercent: true,
            showErrorAlerts: true,
            errorOnResponse: "There has been an error uploading your file",
            invalidExtError: "The file type is not supported.",
            onSubmit: false,
            url: null,
            data: null,
            limit: 5,
            uploadedFiles: 0,
            onFileError: function(file, data) {},
            onFileSuccess: function(file, data) {},
            onFileProgress: function(file, data) {}
        };
        var getSizeWithUnit = function(size) {
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
        defaults.limitError = "You can upload a maximum of "+ defaults.limit + " files.";
        defaults.sizeError = "Size of the file is greater than maximum supported file size of " + getSizeWithUnit(defaults.maxSize);
        var options = $.extend(defaults, options);
        var fileUpload = {
            obj: $(this),
            files: [],
            errorFiles: [],
            uparea: null,
            hasErrors: false,
            init: function() {
                this.replacehtml();
                $("#selectFiles").on("click", function() {
                    fileUpload.selectfiles();
                });
                this.handledragevents(); // Handle events when drag
                this.handlebuttonevents(); // handle button events
            },
            replacehtml: function() {
                var html = '<div class="well well-lg dragArea"><h4>' + options.dragText + "</h4></div>";
                this.obj.hide();
                this.uparea = $(html).insertAfter(this.obj);
                $('<ul id="notification"></ul>').insertAfter(this.uparea);
            },
            selectfiles: function() {
                this.obj.click();
            },
            handlebuttonevents: function() {
                $("#file").on("change", function() {
                	let files = fileUpload.obj[0].files;
                    if(files.length > 0) {
                        options.data = files;
                        var len = options.data.length;
                        
                        for(var i=0; i<len; ++i) {
                        	// If upload limit is reached, don't upload rest of the files
                        	if(options.uploadedFiles+1 > options.limit && options.limit > 0) {
                        		options.onFileError(null, options.limitError);
                        		break;
                        	} else {
                        		fileUpload.checkFile(files[i]);
                        	}
                        }
                        
                        var errLen = fileUpload.errorFiles.length;
                        for(var i=0; i<errLen; ++i) {
                            options.onFileError(fileUpload.errorFiles[i], fileUpload.errorFiles[i].error);
                        }
                        fileUpload.errorFiles = [];
                        /* clearing files from input file DOM after the files are uploaded so that next time when we upload
                         * new set of files, the files which we have already uploaded don't get upload again because they are present in DOM
                         * */ 
                        if(fileUpload.uploadedFiles === fileUpload.files.length) {
                            $(fileUpload.obj).val("");
                        }
                    }
                });
                
                $(document).on('click','.delete',function() {
                    options.uploadedFiles--;
                });
            },
            handledragevents: function() {
                var dragText = options.dragText;
                var counter = 0;
                
                $(document).on("dragenter", function(e) {
                    e.stopPropagation();
                    e.preventDefault();
                });
                $(document).on("dragover", function(e) {
                    e.stopPropagation();
                    e.preventDefault();
                });
                $(document).on("drop", function(e) {
                    e.stopPropagation();
                    e.preventDefault();
                });
                this.uparea.on("dragenter", function(e) {
                    counter++;
                    e.stopPropagation();
                    e.preventDefault();
                    $(this).css("border", "3px dashed #ccc");
                });
                this.uparea.on("dragleave", function(e) {
                    counter--;
                    e.stopPropagation();
                    e.preventDefault();
                    if(counter == 0) {
                    	$(this).css("border", "1px solid #e3e3e3");
                    }
                });
                this.uparea.on("dragover", function(e) {
                    e.stopPropagation();
                    e.preventDefault();
                });
                this.uparea.on("drop", function(e) {
                    counter = 0;
                    $(this).css("border", "1px solid #e3e3e3");
                    e.preventDefault();
                    
                    let files = e.originalEvent.dataTransfer.files;
                    if(files.length > 0) {
                        for (var i = 0; i < files.length; i++) {
                        	// If upload limit is reached, don't upload rest of the files
                        	if(options.uploadedFiles+1 > options.limit && options.limit > 0) {
                        		options.onFileError(null, options.limitError);
                        		break;
                        	} else {
                        		fileUpload.checkFile(files[i]);
                        	}
                        }
                        var errLen = fileUpload.errorFiles.length;
                        for(var i=0; i<errLen; ++i) {
                            options.onFileError(fileUpload.errorFiles[i], fileUpload.errorFiles[i].error);
                        }
                        fileUpload.errorFiles = [];
                        /* clearing files from input file DOM after the files are uploaded so that next time when we upload
                         * new set of files, the files which we have already uploaded don't get upload again because they are present in DOM
                         * */ 
                        if(fileUpload.uploadedFiles === fileUpload.files.length) {
                            $(fileUpload.obj).val("");
                        }
                    }
                });
            },
            checkFile: function(file) {
                error = this.validateFile(file);
                if (error) {
                    this.hasErrors = true;
                    file.error = error;
                    this.errorFiles.push(file);
                } else {
                    if(options.uploadedFiles+1 > options.limit && options.limit > 0) {
                    	options.onFileError(null, options.limitError);
                    } else {
                        this.files.push(file);
                        options.onFileProgress(file,  this.files.length - 1);
                        
                        this.upload(file, this.files.length - 1);
                        options.uploadedFiles++;
                    }
                }
            },
            validateFile: function(file) {
                if (!this.checkExtension(file)) {
                    return options.invalidExtError;
                }
                if (!this.checkSize(file)) {
                    return options.sizeError;
                }
                return null;
            },
            checkExtension: function(file) {
                if (options.allowedExtensions === []) {
                    return true;
                }
                var ext = file.name.split(".").pop().toLowerCase();
                if ($.inArray(ext, options.allowedExtensions) == -1) {
                    return false;
                } else {
                    return true;
                }
            },
            checkSize: function(file) {
                if (options.maxSize == 0) {
                    return true;
                }
                if (file.size > options.maxSize) {
                    return false;
                } else {
                    return true;
                }
            },
            upload: function(file, pos) {
                var formData = new FormData();
                formData.append("file", file);
                
                $.ajax({
                    url: options.url,
                    type: "POST",
                    enctype: "multipart/form-data", 
                    data: formData,
                    dataType: "text",
                    success: function(data) {
                        $("#notification>li[rel='"+pos+"']").remove();
                        options.onFileSuccess(file, data);
                    },
                    error: function(xhr, ajaxOptions, thrownError) {
                        $("#notification>li[rel='"+pos+"']").remove();
                        fileUpload.files.splice(pos, 1);
                        options.uploadedFiles--;
                        options.onFileError(file, thrownError);
                    },
                    xhr: function() {
                        myXhr = $.ajaxSettings.xhr();
                        if (myXhr.upload) {
                            myXhr.upload.addEventListener("progress", function(e) {
                                fileUpload.handleProgress(e, pos);
                            }, false);
                        }
                        return myXhr;
                    },
                    cache: false,
                    contentType: false,
                    processData: false
                });
            },
            handleProgress: function(e, pos) {
                if (e.lengthComputable) {
                    var total = e.total, loaded = e.loaded;
                    var percent = Number((e.loaded * 100 / e.total).toFixed(2));
                    var progressbar = $('div.progress-bar[rel="' + pos + '"]');
                    progressbar.css("width", percent + "%");
                    if (options.showPercent) {
                        progressbar.text(percent + "%");
                    }
                }
            }
        };
        fileUpload.init();
    };
})(jQuery);