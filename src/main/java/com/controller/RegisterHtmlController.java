package com.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * *注册界面
 * */
@Controller
public class RegisterHtmlController {
	
	@RequestMapping(value="/register")
	public String registerHtml() throws Exception {
		return "register.html";
	}

}
