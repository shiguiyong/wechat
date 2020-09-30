package com.model;

import com.alibaba.fastjson.JSONObject;
import com.common.DateConst;
import com.common.Model;
import com.common.util.DateUtils;
import com.common.util.StringUtils;

import java.util.Date;

public class ApplyInfo implements Model {
	private static final long serialVersionUID = -8304208707984388421L;
	/**申请标识(APPLY_ID)*/
	private int applyId;
	/**用户标识(USER_ID)*/
	private String userId;
	/**申请用户标识(APPLY_USER_ID)*/
	private String applyUserId;
	/**申请类型(APPLY_TYPE)
	 * 1 好友申请
	 * 2 入群申请
	 * 3 邀请申请
	 * */
	private int applyType;
	/**申请内容(APPLY_CONTENT)*/
	private String applyContent;
	/**申请时间(APPLY_DATE)*/
	private Date applyDate;
	/**
	 * *状态(APPLY_STATE)
	 * *0 默认 1 已同意 2 拒绝 
	 * */
	private int applyState;
	/**申请用户昵称(APPLY_USER_NAME)*/
	private String applyUserName;
	/**内容*/
	private JSONObject content;
	
	public JSONObject encode() {
		JSONObject json = new JSONObject();
		json.put("APPLY_ID", applyId);
		json.put("USER_ID", userId);
		json.put("APPLY_USER_ID", applyUserId);
		json.put("APPLY_USER_NAME", applyUserName);
		json.put("APPLY_TYPE", applyType);
		json.put("APPLY_DATE", DateUtils.parseDateToStr(applyDate, DateConst.DATE_TIME_FORMAT_YYYY_MM_DD_HH_MI_SS));
		json.put("APPLY_STATE", applyState);
		if(content!=null){
			json.putAll(content);
		}
		return json;
	}

	public void decode(JSONObject json) {
		if(json.containsKey("USER_ID"))this.userId=json.getString("USER_ID");
		if(json.containsKey("APPLY_USER_ID"))this.applyUserId=json.getString("APPLY_USER_ID");
	}

	public void analysis(){
		if(StringUtils.isNotEmpty(applyContent)){
			content=JSONObject.parseObject(applyContent);
		}
	}
	
	public String get(String key){
		return content.getString(key);
	}

	public void put(String key,Object value){
		content.put(key,value);
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getApplyUserId() {
		return applyUserId;
	}

	public void setApplyUserId(String applyUserId) {
		this.applyUserId = applyUserId;
	}
	
	public Date getApplyDate() {
		return applyDate;
	}

	public void setApplyDate(Date applyDate) {
		this.applyDate = applyDate;
	}

	public int getApplyState() {
		return applyState;
	}

	public void setApplyState(int applyState) {
		this.applyState = applyState;
	}

	public int getApplyId() {
		return applyId;
	}

	public void setApplyId(int applyId) {
		this.applyId = applyId;
	}

	public int getApplyType() {
		return applyType;
	}

	public void setApplyType(int applyType) {
		this.applyType = applyType;
	}

	public String getApplyContent() {
		return applyContent;
	}

	public void setApplyContent(String applyContent) {
		this.applyContent = applyContent;
	}

	public void setApplyUserName(String applyUserName) {
		this.applyUserName = applyUserName;
	}
	
	public String getApplyUserName() {
		return applyUserName;
	}

	public void setContent(JSONObject content) {
		this.content = content;
	}

	public JSONObject getContent() {
		return content;
	}
}
