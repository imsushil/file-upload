package com.example.fileUpload.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartHttpServletRequest;

@RestController
public class FileUploadController {
	
	@RequestMapping(value="/uploadFile", method=RequestMethod.POST)
	String upload(MultipartHttpServletRequest request) {
		String fileName = request.getFile("file").getOriginalFilename();
		System.out.println(fileName+" uploaded successfully.");
		return "success";
	}
}