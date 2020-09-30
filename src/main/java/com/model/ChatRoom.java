package com.model;

import com.alibaba.fastjson.JSONObject;
import com.common.Model;

import java.util.Date;

public class ChatRoom implements Model,Comparable<ChatRoom>{
	private static final long serialVersionUID = 4342260969355575824L;
	/**
	 * 房间名称(ROOM_NAME)
	 * CHAT_TYPE 1 USER.USER_NAME 或者好友备注名称
	 * 			 2 GROUP_CHAT.GROUP_NAME
	 * */
	private String roomName;
	/**用户标识(USER_ID)*/
	private String userId;
	/**聊天类型(CHAT_TYPE)
	 * 1 点对点聊天
	 * 2 群聊
	 * */
	private int chatType;
	/**聊天对象标识(CHAT_ID)*/
	private String chatId;
	/**创建时间(CREATE_DATE)*/
	private Date createDate;
	/**置顶标识(STICK_SIGN)
	 * 默认 0 
	 * 置顶 1
	 * */
	private int stickSign;
	/**置顶排序编码(SORT_INDEX)*/
	private int sortIndex;
	/**最后一次聊天时间(LAST_CHAT_DATE)*/
	private Date lastChatDate;
	
	@Override
	public int compareTo(ChatRoom c) {
		if(this.stickSign==c.stickSign) {
			if(this.stickSign==1) {
				return this.sortIndex-c.sortIndex;
			}
			if(this.stickSign==0) {
				return c.lastChatDate.compareTo(this.lastChatDate);
			}
			return 0;
		}else {
			return c.stickSign-this.stickSign;
		}
	}
	public JSONObject encode() {
		JSONObject json = new JSONObject();
		json.put("ROOM_NAME", roomName);
		json.put("USER_ID", userId);
		json.put("CHAT_TYPE", chatType);
		json.put("CHAT_ID", chatId);
		json.put("CREATE_DATE", createDate);
		json.put("STICK_SIGN", stickSign);
		json.put("SORT_INDEX", sortIndex);
		if(lastChatDate!=null) {
			json.put("LAST_CHAT_DATE", lastChatDate.getTime());
		}
		return json;
	}
	public void decode(JSONObject json) {
		if(json.containsKey("USER_ID"))this.userId=json.getString("USER_ID");
		if(json.containsKey("CHAT_TYPE"))this.chatType=json.getInteger("CHAT_TYPE");
		if(json.containsKey("CHAT_ID"))this.chatId=json.getString("CHAT_ID");
	}
	public String getRoomName() {
		return roomName;
	}
	public void setRoomName(String roomName) {
		this.roomName = roomName;
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
	public Date getCreateDate() {
		return createDate;
	}
	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}
	public int getStickSign() {
		return stickSign;
	}
	public void setStickSign(int stickSign) {
		this.stickSign = stickSign;
	}
	public int getSortIndex() {
		return sortIndex;
	}
	public void setSortIndex(int sortIndex) {
		this.sortIndex = sortIndex;
	}
	public Date getLastChatDate() {
		return lastChatDate;
	}
	public void setLastChatDate(Date lastChatDate) {
		this.lastChatDate = lastChatDate;
	}
}
