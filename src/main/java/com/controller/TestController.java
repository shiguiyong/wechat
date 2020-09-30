package com.controller;

import com.common.manage.ChatMonitorClientManage;
import com.common.manage.LogMonitorClientManage;
import com.common.manage.UserManage;
import com.common.pool.IdPool;
import com.common.util.FileUtils;
import com.common.util.ImageUtils;
import com.model.User;
import com.service.UserService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.OutputStreamWriter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@RestController
public class TestController {

	@Resource
	private UserService userService;

	@RequestMapping(value = "/test", produces = { "application/json;charset=UTF-8" })
	public void test(HttpServletRequest request, HttpServletResponse response) throws Exception {
		response.setContentType("text/html");
		ServletOutputStream out = response.getOutputStream(); 
		OutputStreamWriter ow = new OutputStreamWriter(out,"UTF-8");
		ow.write("<body style=\"width :100%;height: 100%;overflow-x: hidden;margin: 0;padding: 0\">"); 
		ow.write("<div style=\"width :99%;height: 100%;overflow-x: hidden;margin: 0;padding: 0px 0px 0px 10px;\">"); 
		ow.write("<p>内存用户号码池:"+ IdPool.getInstance().getQueue().size()+"</p>");
        ow.write("<p>日志缓存大小:"+ LogMonitorClientManage.getInstance().getQueue().size() +"</p>");
        ow.write("<p>日志监控客户端:"+ LogMonitorClientManage.getInstance().getCache().size() +"</p>");
        ow.write("<p>聊天监控客户端:"+ ChatMonitorClientManage.getInstance().getCache().size() +"</p>");
		List<User> list = UserManage.getInstance().getAllUser();
        Collections.sort(list,(a,b)->a.getUserId().compareTo(b.getUserId()));
		for(User user:list) {
			if(user.isOnLine()) {
				ow.write("<p style=\"color:#00FF00\">用户:    "+user.getUserId()+"   ,用户昵称:   "+user.getUserName()+",   状态:     "+(user.isOnLine()?"在线":"不在线")+"</p>");
			}else {
				ow.write("<p>用户:    "+user.getUserId()+"   ,用户昵称:   "+user.getUserName()+",   状态:     "+(user.isOnLine()?"在线":"不在线")+"</p>");
			}
		}
		ow.write("</div></body>"); 
		ow.flush(); 
		ow.close();
		//insertUser();
	}
	/**
	 * 用于生成测试用户   
	 *   读取文件夹图片  
	 *   用户名为用户名
	 * */
	public void insertUser(){
		System.out.println("用户生成");
		List<File> fileList = getFileList("G:\\image\\");
		for(int i=0;i<fileList.size();i++){
			File file=fileList.get(i);
			String fileName=file.getName();
			fileName=fileName.substring(0,fileName.lastIndexOf("."));
			String userId=fileName.split("_")[0];
			String userName=fileName.split("_")[1];

			User user = new User();
			user.setUserId(userId);
			user.setUserName(userName);
			user.setUserPwd("123");
			user.setUserSex(1);
			user.setRegionCode("");
			user.setUserImg(ImageUtils.compressImage(FileUtils.readFile(file)));
			userService.insert(user);
		}
	}

	private static List<File> getFileList(String strPath) {
		List<File> fileList =new ArrayList<File>();
		File fileDir = new File(strPath);
		if (null != fileDir && fileDir.isDirectory()) {
			File[] files = fileDir.listFiles();
			if (null != files) {
				for (int i = 0; i < files.length; i++) {
					// 如果是文件夹 继续读取
					if (files[i].isDirectory()) {
						getFileList(files[i].getAbsolutePath());
					} else {
						String strFileName = files[i].getAbsolutePath();
						if (null != strFileName && !strFileName.endsWith(".jar") && !strFileName.endsWith(".cmd")&& !strFileName.endsWith(".xlsx")) {
							fileList.add(files[i]);
						}
					}
				}

			} else {
				if (null != fileDir) {
					String strFileName = fileDir.getAbsolutePath();
					// 排除jar cmd 和 xlsx （根据需求需要）
					if (null != strFileName && !strFileName.endsWith(".jar") && !strFileName.endsWith(".cmd")&& !strFileName.endsWith(".xlsx")) {
						fileList.add(fileDir);
					}
				}
			}
		}
		// 定义的全去文件列表的变量
		return fileList;
	}

}
