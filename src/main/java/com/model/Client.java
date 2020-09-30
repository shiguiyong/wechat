package com.model;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.websocket.Session;
import java.io.IOException;

public class Client {
	private Logger log = LoggerFactory.getLogger(Client.class);
	/**用户标识*/
	private String userId;
	/**
	 ** 客户端会话
	 * */
	private Session session;
	public void close() {
		try {
			session.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	public void send(SendMessage message) {
		String content = message.toJSONString();
		if(userId==null) {
			log.debug("发送消息给:"+session.getRequestURI().getHost()+" 内容:"+content);
		}else {
			log.debug("发送消息给:"+userId+" 内容:"+content);
		}
        session.getAsyncRemote().sendText(content);
	}
	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
		if(session!=null) {
			session.getUserProperties().put("USER_ID", userId);
		}
	}
	public Session getSession() {
		return session;
	}
	public void setSession(Session session) {
		this.session = session;
	}
}
