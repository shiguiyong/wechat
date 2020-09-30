package com.controller;

import com.alibaba.fastjson.JSONObject;
import com.common.MessageType;
import com.common.http.IMChatRequest;
import com.common.manage.ChatMessageManage;
import com.common.manage.IdGenerateManage;
import com.common.manage.MessageManage;
import com.model.ChatMessage;
import com.model.ReceiveMessage;
import com.model.SendMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;
import java.util.Date;

@RestController
public class MessageController {
	
	private static Logger log = LoggerFactory.getLogger(MessageController.class);
	
	/**
	 * 接收消息
	 * */
	@RequestMapping(value = "/message/receive",method=RequestMethod.POST, produces = { "application/json;charset=UTF-8" })
	public String receive(IMChatRequest request, HttpServletResponse response) throws Exception {
		Date date=new Date();
		String messageId=IdGenerateManage.getInstance().nextId();
		
		ReceiveMessage message =new ReceiveMessage();
		message.decode(request.getJson());
		//生成唯一的消息ID 并返回给客户端
		message.setMessageId(messageId);
		
        SendMessage send = new SendMessage();
        send.setMessageId(messageId);
        send.setMessageType(MessageType.MESSAGE_CHAT);
        send.setSendId(message.getSendId());
        send.setReceiveId(message.getReceiveId());
        send.setDate(date);
        send.setChatType(message.getChatType());
        send.setContentType(message.getContentType());
        send.setChatContent(message.getChatContent());
        MessageManage.getInstance().send(send);

        //封装聊天消息 添加到聊天消息管理队列中
        ChatMessage chatMessage=new ChatMessage();
        chatMessage.setMessageId(messageId);
        chatMessage.setUserId(message.getSendId());
        chatMessage.setChatType(message.getChatType());
        chatMessage.setChatId(message.getReceiveId());
        chatMessage.setSendId(message.getSendId());
        chatMessage.setChatDate(date);
        chatMessage.setContentType(1);
        chatMessage.setChatContent(message.getChatContent());
        ChatMessageManage.getInstance().add(chatMessage);
        
		log.debug("聊天消息接收处理:{}",message.toJSONString());
		JSONObject result=new JSONObject();
		result.put("SUCCESS", true);
		result.put("MESSAGE_ID", messageId);
        result.put("CHAT_DATE", date.getTime());
		return result.toJSONString();
	}

}
