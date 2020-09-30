package com.model;

import com.alibaba.fastjson.JSONObject;
import com.common.Model;

import java.util.Date;
import java.util.Vector;

public class GroupChat implements Model {
	private static final long serialVersionUID = -4786844642368407899L;
	/**群聊标识(GROUP_ID)*/
	private String groupId;
	/**群聊名称(GROUP_NAME)*/
	private String groupName;
	/**
	 * * 群聊头像(GROUP_IMG)
	 * * 由群成员头像组成
	 * */
	private byte[] groupImg;
	/**群主标识(USER_ID)*/
	private String userId;
	/**创建时间(CREATE_DATE)*/
	private Date createDate;
	/**群成员*/
	private Vector<GroupChatNumber> numbers;

	public JSONObject encode() {
		JSONObject json=new JSONObject();
		json.put("GROUP_ID", groupId);
		json.put("GROUP_NAME", groupName);
		json.put("USER_ID", userId);
		json.put("CREATE_DATE", createDate);
		if(groupImg!=null) {
			json.put("GROUP_IMG", groupImg);
		}
		return json;
	}

	public void decode(JSONObject json) {
		if(json.containsKey("GROUP_NAME"))this.groupName=json.getString("GROUP_NAME");
		if(json.containsKey("USER_ID"))this.userId=json.getString("USER_ID");
		this.createDate=new Date();
	}
	
	public void removeNumber(String numberId){
	    if(numbers!=null){
	        for(GroupChatNumber number:numbers){
	            if(numberId.equals(number.getNumberId())){
                    numbers.remove(number);
	                break;
                }
            }
        }
    }

	public String getGroupId() {
		return groupId;
	}

	public void setGroupId(String groupId) {
		this.groupId = groupId;
	}

	public String getGroupName() {
		return groupName;
	}

	public void setGroupName(String groupName) {
		this.groupName = groupName;
	}

	public byte[] getGroupImg() {
		return groupImg;
	}

	public void setGroupImg(byte[] groupImg) {
		this.groupImg = groupImg;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public Date getCreateDate() {
		return createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}

	public Vector<GroupChatNumber> getNumbers() {
		return numbers;
	}

	public void setNumbers(Vector<GroupChatNumber> numbers) {
		this.numbers = numbers;
	}

}
