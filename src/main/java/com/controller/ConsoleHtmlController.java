package com.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class ConsoleHtmlController {
    @RequestMapping(value="/console")
    public String consoleHtml() throws Exception {
        return "console.html";
    }
}
