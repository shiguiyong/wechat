package com.model;

import com.alibaba.fastjson.JSONObject;
import com.common.Model;

import java.util.Date;

/**
 * 好友信息表
 * */
public class Friend implements Model {
	private static final long serialVersionUID = -5716200446505355769L;
	/**用户标识(USER_ID)*/
	private String userId;
	/**好友标识(FRIEND_ID)*/
	private String friendId;
	/**备注名(REMARK_NAME)*/
	private String remarkName;
	/**创建时间(CREATE_DATE)*/
	private Date createDate;
	/**好友昵称(FRIEND_NAME)*/
	private String friendName;
	/**
	 * *好友用户性别(USER_SEX)
	 * *0保密 1男2女
	 * */
	private int userSex;
	/**好友地区编码(REGION_CODE)*/
	private String regionCode;
	/**好友地区名称(REGION_NAME)*/
	private String regionName;
	/**好友用户个性签名(USER_DES)*/
	private String userDes;
	
	public JSONObject encode() {
		JSONObject json=new JSONObject(10);
		json.put("USER_ID", userId);
		json.put("FRIEND_ID", friendId);
		json.put("REMARK_NAME", remarkName);
		json.put("CREATE_DATE", createDate);
		json.put("FRIEND_NAME", friendName);
		json.put("USER_SEX", userSex);
		json.put("REGION_CODE", regionCode);
		json.put("REGION_NAME", regionName);
		json.put("USER_DES", userDes);
		return json;
	}
	public void decode(JSONObject json) { }
	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	public String getFriendId() {
		return friendId;
	}
	public void setFriendId(String friendId) {
		this.friendId = friendId;
	}
	public String getRemarkName() {
		return remarkName;
	}
	public void setRemarkName(String remarkName) {
		this.remarkName = remarkName;
	}
	public Date getCreateDate() {
		return createDate;
	}
	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}
	public String getFriendName() {
		return friendName;
	}
	public void setFriendName(String friendName) {
		this.friendName = friendName;
	}
	public int getUserSex() {
		return userSex;
	}
	public void setUserSex(int userSex) {
		this.userSex = userSex;
	}
	public String getUserDes() {
		return userDes;
	}
	public void setUserDes(String userDes) {
		this.userDes = userDes;
	}
	public void setRegionCode(String regionCode) {
		this.regionCode = regionCode;
	}
	public String getRegionCode() {
		return regionCode;
	}
	public String getRegionName() {
		return regionName;
	}
	public void setRegionName(String regionName) {
		this.regionName = regionName;
	}
}
