package com.model;

import com.alibaba.fastjson.JSONObject;
import com.common.Model;

import java.util.Date;
/**
 * 聊天记录表
 * */
public class ChatMessage implements Model{
	private static final long serialVersionUID = 6408337790659561426L;
	/**聊天消息标识(MESSAGE_ID)*/
	private String messageId;
	/**用户标识(USER_ID)*/
	private String userId;
	/**聊天类型(CHAT_TYPE) 1 普通聊天 2 群聊*/
	private int chatType;
	/**聊天对象标识(CHAT_ID)*/
	private String chatId;
	/**发送者标识(SEND_ID)*/
	private String sendId;
	/**聊天时间(CHAT_DATE)*/
	private Date chatDate;
	/** 聊天内容类型(CONTENT_TYPE) 1 普通文本 2 图片 3 文件 */
	private int contentType;
	/**聊天内容(CHAT_CONTENT)*/
	private String chatContent;
	
	public JSONObject encode() {
		JSONObject json = new JSONObject();
		json.put("MESSAGE_ID", messageId);
		json.put("USER_ID", userId);
		json.put("CHAT_TYPE", chatType);
		json.put("CHAT_ID", chatId);
		json.put("SEND_ID", sendId);
		json.put("CHAT_DATE", chatDate);
		json.put("CONTENT_TYPE", contentType);
		json.put("CHAT_CONTENT", chatContent);
		return json;
	}
	public void decode(JSONObject json) { }
	public String getMessageId() {
		return messageId;
	}
	public void setMessageId(String messageId) {
		this.messageId = messageId;
	}
	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	public int getChatType() {
		return chatType;
	}
	public void setChatType(int chatType) {
		this.chatType = chatType;
	}
	public String getChatId() {
		return chatId;
	}
	public void setChatId(String chatId) {
		this.chatId = chatId;
	}
	public String getSendId() {
		return sendId;
	}
	public void setSendId(String sendId) {
		this.sendId = sendId;
	}
	public Date getChatDate() {
		return chatDate;
	}
	public void setChatDate(Date chatDate) {
		this.chatDate = chatDate;
	}
	public int getContentType() {
		return contentType;
	}
	public void setContentType(int contentType) {
		this.contentType = contentType;
	}
	public String getChatContent() {
		return chatContent;
	}
	public void setChatContent(String chatContent) {
		this.chatContent = chatContent;
	}
}
