package com.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * 聊天界面
 * */
@Controller
public class ChatHtmlController {
	@RequestMapping(value="/")
	public String chatHtml() throws Exception {
		return "chat.html";
	}
}
