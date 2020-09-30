package com.model;

import java.util.Date;

import com.alibaba.fastjson.JSONObject;
import com.common.Model;

public class GroupChatNumber implements Model {
	private static final long serialVersionUID = 601461059872744077L;
	/**群聊标识(GROUP_ID)*/
	private String groupId;
	/**成员标识(NUMBER_ID)*/
	private String numberId;
	/**在本群昵称(GROUP_NICK_NAME)*/
	private String groupNickName;
	/**加入时间(JOIN_DATE)*/
	private Date joinDate;

	public JSONObject encode() {
		JSONObject json = new JSONObject();
		json.put("GROUP_ID", groupId);
		json.put("NUMBER_ID", numberId);
		json.put("GROUP_NICK_NAME", groupNickName);
		json.put("JOIN_DATE", joinDate);
		return json;
	}

	public void decode(JSONObject json) {
		
	}

	public String getGroupId() {
		return groupId;
	}

	public void setGroupId(String groupId) {
		this.groupId = groupId;
	}

	public String getNumberId() {
		return numberId;
	}

	public void setNumberId(String numberId) {
		this.numberId = numberId;
	}

	public String getGroupNickName() {
		return groupNickName;
	}

	public void setGroupNickName(String groupNickName) {
		this.groupNickName = groupNickName;
	}

	public Date getJoinDate() {
		return joinDate;
	}

	public void setJoinDate(Date joinDate) {
		this.joinDate = joinDate;
	}

}
