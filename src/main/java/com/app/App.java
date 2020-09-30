package com.app;

import com.common.aspect.LogInterceptor;
import com.common.listener.CloseListener;
import com.common.listener.StartListener;
import com.common.util.SpringUtil;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.web.servlet.MultipartAutoConfiguration;
import org.springframework.boot.web.servlet.ServletComponentScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Import;
/**程序入口*/
@EnableAutoConfiguration(exclude = {MultipartAutoConfiguration.class})
@Import({SpringUtil.class, LogInterceptor.class})
@MapperScan("com.mapper")
@ComponentScan(basePackages= {"com.mapper","com.service","com.common.advice","com.websocket","com.controller"})
@ServletComponentScan(basePackages= {"com.common.filter"})
public class App {
    public static void main( String[] args ){
		SpringApplication app=new SpringApplication(App.class);
		// 添加程序启动监听
		app.addListeners(new StartListener());
		// 添加程序关闭监听
		app.addListeners(new CloseListener());
		app.run(args);
    }
}