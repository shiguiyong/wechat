package com.model;

import com.alibaba.fastjson.JSONObject;
import com.common.Model;
import com.common.util.StringUtils;

import java.io.Serializable;
import java.util.Date;

/**
 * 封装通信消息
 * */
public class Message implements Model,Serializable{
	private static final long serialVersionUID = 1L;
	/**消息会话*/
	protected Client client;
	/**消息id*/
    private String messageId;
	/**消息类型*/
    private int messageType;
	/**发送者标识*/
	protected String sendId;
	/**接收者标识*/
    private String receiveId;
	/**消息创建时间*/
	protected Date date;
	/**消息内容*/
	protected JSONObject json;

    public Message() {
		this.messageType=0;
		this.json=new JSONObject(10);
	}
	
	public void put(String key,Object value) {
		json.put(key, value);
	}
	
	public JSONObject encode() {
		json.put("MESSAGE_ID", messageId);
		json.put("MESSAGE_TYPE", messageType);
		if(StringUtils.isNotEmpty(sendId))json.put("SEND_ID", sendId);
		if(StringUtils.isNotEmpty(receiveId))json.put("RECEIVE_ID", receiveId);
        if(date!=null)json.put("DATE", date.getTime());
		return json;
	}


	public void decode(JSONObject json) {
		if(json.containsKey("MESSAGE_ID"))this.messageId=json.getString("MESSAGE_ID");
		if(json.containsKey("MESSAGE_TYPE"))this.messageType=json.getInteger("MESSAGE_TYPE");
		if(json.containsKey("SEND_ID"))this.sendId=json.getString("SEND_ID");
		if(json.containsKey("RECEIVE_ID"))this.receiveId=json.getString("RECEIVE_ID");
        if(json.containsKey("DATE"))this.date=new Date(json.getLong("DATE"));
	}
	
	public Client getClient() {
		return client;
	}

	public void setClient(Client client) {
		this.client = client;
	}

	public JSONObject getJson() {
		return json;
	}

	public void setJson(JSONObject json) {
		this.json = json;
	}

	public String getMessageId() {
		return messageId;
	}

	public void setMessageId(String messageId) {
		this.messageId = messageId;
	}

	public int getMessageType() {
		return messageType;
	}

	public void setMessageType(int messageType) {
		this.messageType = messageType;
	}

	public String getSendId() {
		return sendId;
	}

	public void setSendId(String sendId) {
		this.sendId = sendId;
	}

	public String getReceiveId() {
		return receiveId;
	}

	public void setReceiveId(String receiveId) {
		this.receiveId = receiveId;
	}

	public Date getDate() {
		return date;
	}

	public void setDate(Date date) {
		this.date = date;
	}



}
