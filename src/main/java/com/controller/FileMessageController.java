package com.controller;

import com.alibaba.fastjson.JSONObject;
import com.common.MessageType;
import com.common.manage.ChatMessageManage;
import com.common.manage.IdGenerateManage;
import com.common.manage.MessageManage;
import com.common.util.FileUtils;
import com.model.ChatFile;
import com.model.ChatMessage;
import com.model.SendMessage;
import com.service.ChatFileService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Date;

@RestController
public class FileMessageController {

	@Resource
	private ChatFileService chatFileService;
	
	/**
	 * 接收上传的图片
	 * */
	@RequestMapping(value="/file/upload",method=RequestMethod.POST,produces = {"application/json;charset=UTF-8"})
	public String upload(HttpServletRequest chatRequest) {
		Date date=new Date();
		String messageId=IdGenerateManage.getInstance().nextId();
		
		JSONObject result =new JSONObject();
		result.put("SUCCESS", false);
		CommonsMultipartResolver multipartResolver = new CommonsMultipartResolver(chatRequest.getSession().getServletContext()); 
		String path=System.getProperty("user.dir")+"/data/file/";
		try {
			if (multipartResolver.isMultipart(chatRequest)){
				MultipartHttpServletRequest request = multipartResolver.resolveMultipart(chatRequest);
				MultipartFile file = request.getFile("FILE");
				assert file != null;
				String fileName = file.getOriginalFilename();
				assert fileName != null;
				String fileSuffix = FileUtils.getFileSuffix(fileName);
				String receiveId=request.getParameter("RECEIVE_ID");
				int chatType=Integer.parseInt(String.valueOf(request.getParameter("CHAT_TYPE")));
				String sendId=request.getParameter("SEND_ID");
				
				//写文件到当前工作目录  data\file中 
				String fileId=IdGenerateManage.getInstance().nextId();
				FileUtils.writeFile(path, fileId, file.getBytes());
				
				ChatFile chatFile = new ChatFile();
				chatFile.setFileId(fileId);
				chatFile.setFileName(fileName);
				chatFile.setFileSuffix(fileSuffix);
				chatFile.setFileSize(file.getSize());
				chatFile.setCreateDate(date);
				chatFile.setImageWidth(0);
				chatFile.setImageHeight(0);
				chatFileService.insert(chatFile);
				
				//封装客户端消息 添加到客户端消息队列中
				SendMessage send = new SendMessage();
				send.setMessageId(messageId);
				send.setMessageType(MessageType.MESSAGE_CHAT);
				send.setSendId(sendId);
				send.setReceiveId(receiveId);
				send.setDate(date);
				send.setChatType(chatType);
				send.setContentType(3);
				send.setChatContent(fileId);
				send.put("FILE_ID", fileId);
				send.put("FILE_NAME", fileName);
				send.put("FILE_SUFFIX", fileSuffix);
				send.put("FILE_SIZE", file.getSize());
				MessageManage.getInstance().send(send);
				
				//封装聊天消息 添加到聊天消息管理队列中
				ChatMessage message=new ChatMessage();
				message.setMessageId(messageId);
				message.setUserId(sendId);
				message.setChatType(chatType);
				message.setChatId(receiveId);
				message.setSendId(sendId);
				message.setChatDate(date);
				message.setContentType(3);
				message.setChatContent(fileId);
				ChatMessageManage.getInstance().add(message);
				
				result.put("SUCCESS", true);
				result.put("FILE_ID", fileId);
				result.put("MESSAGE_ID", messageId);
                result.put("CHAT_DATE", date.getTime());
			}
		} catch (Exception e) {
			System.out.println("取消上传");
		}
		return result.toJSONString();
	}
	
	@RequestMapping(value="/file/download",method=RequestMethod.POST)
	public void download(HttpServletRequest request,HttpServletResponse response) {
		String path=System.getProperty("user.dir")+"\\data\\file\\";
		String fileId=request.getParameter("FILE_ID");
		String fileName=request.getParameter("FILE_NAME");
		FileUtils.downloadFile(fileId,path,fileName, request,response);
	}

}
