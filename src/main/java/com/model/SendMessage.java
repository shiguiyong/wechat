package com.model;

import com.alibaba.fastjson.JSONObject;
import com.common.util.StringUtils;

public class SendMessage extends Message{
	private static final long serialVersionUID = -4077057325998551471L;
	/**聊天类型 1 普通聊天 2 群聊*/
	private int chatType;
	/**聊天内容类型 1 普通文本 2 图片 3 文件*/
	private int contentType;
	/**聊天内容*/
	private String chatContent;
	
	public SendMessage() {
		super();
	}
	
	public JSONObject encode() {
		JSONObject encode = super.encode();
		if(chatType!=0)json.put("CHAT_TYPE", chatType);
		if(chatType!=0)json.put("CONTENT_TYPE", contentType);
		if(StringUtils.isNotEmpty(chatContent))json.put("CHAT_CONTENT", chatContent);
		return encode;
	}
	
    public void decode(JSONObject json) {
	    super.decode(json);
        if(json.containsKey("CHAT_TYPE"))this.chatType=json.getInteger("CHAT_TYPE");
        if(json.containsKey("CONTENT_TYPE"))this.contentType=json.getInteger("CONTENT_TYPE");
        if(json.containsKey("CHAT_CONTENT"))this.chatContent=json.getString("CHAT_CONTENT");
    }
	
	public String toJSONString() {
		JSONObject encode = this.encode();	
		return encode.toJSONString();
	}

	public int getChatType() {
		return chatType;
	}

	public void setChatType(int chatType) {
		this.chatType = chatType;
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
