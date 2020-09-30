package com.controller;

import com.alibaba.fastjson.JSONObject;
import com.common.Logo;
import com.common.http.IMChatRequest;
import com.common.manage.UserManage;
import com.common.pool.IdPool;
import com.common.util.EncryUtil;
import com.model.User;
import com.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;
import java.io.PrintWriter;
import java.util.Date;

@RestController
public class RegisterController {
	
	private static Logger log = LoggerFactory.getLogger(RegisterController.class);
	
	@Resource
	private UserService userService;
	
	@RequestMapping(value = "/register/register",method=RequestMethod.POST, produces = { "application/json;charset=UTF-8" })
	public String register(IMChatRequest request, HttpServletResponse response) throws Exception {
		log.info("注册参数:{}",request.toJSONString());
		User user = new User();
		user.setUserId(IdPool.getInstance().get());
		user.setUserName(request.getString("USER_NAME"));
		user.setUserPwd(EncryUtil.encode(user.getUserId(), request.getString("USER_PWD")));
        user.setUserSex(0);
        user.setUserState(0);
        user.setCreateDate(new Date());
        user.setUserImg(Logo.logo);
        user.setRoleType(0);
		userService.insert(user);
		UserManage.getInstance().add(user);
		JSONObject result = new JSONObject();
		result.put("USER_ID", user.getUserId());
		result.put("SUCCESS", true);
		return result.toJSONString();
	}
	
	@RequestMapping(value = "/register/filewriter",method=RequestMethod.GET)
	public void filewriter(IMChatRequest request, HttpServletResponse response) throws Exception {
		String id=request.getParameter("ID");
		PrintWriter writer = response.getWriter();
		writer.write("恭喜你,你申请的IMChat号码是:"+id);
		response.setContentType("application/force-download");// 设置强制下载不打开            
        response.addHeader("Content-Disposition", "attachment;fileName=IMchat_"+id+".txt");
        writer.flush();
        writer.close();
	}

}
