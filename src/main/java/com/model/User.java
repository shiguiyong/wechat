package com.model;

import com.alibaba.fastjson.JSONObject;
import com.common.Model;

import java.util.Date;

/**
 * *用户表
 * */
public class User implements Model {
	private static final long serialVersionUID = -97652911057394478L;
	/**用户标识(USER_ID)*/
	private String userId;
	/**用户昵称(USER_NAME)*/
	private String userName;
	/**用户密码(USER_PWD)*/
	private String userPwd;
	/**
	 * *用户性别(USER_SEX)
	 * *0未知1男2女
	 * */
	private int userSex;
	/**地区编码(REGION_CODE)*/
	private String regionCode;
	/**地区名称(REGION_NAME)*/
	private String regionName;
	/**用户个性签名(USER_DES)*/
	private String userDes;
	/**用户头像(USER_IMG)*/
	private byte[] userImg;
	/**用户状态(USER_STATE)
     * 0 不在线
     * 1 在线
     * 2 冻结
     * */
    private int userState;
	/**创建时间(CREATE_DATE)*/
    private Date createDate;
    /**最近登录时间(LAST_LOGIN_DATE)*/
    private Date lastLoginDate;
    /**角色标识(ROLE_TYPE)
     * 0 普通角色
     * 1 普通管理员
     * 2 超级管理员(可修改服务器配置管理普通管理员)
     * */
    private int roleType;
	/**用户是否在线*/
	private boolean onLine;
	/**
	 * web客户端
	 * */
	private Client webClient;
	
	public void send(SendMessage message) {
		if(webClient!=null) {
			webClient.send(message);
		}
	}
	/**
     * 包含用户头像
     * */
	public JSONObject encode() {
		JSONObject json=new JSONObject();
		json.put("USER_ID", userId);
		json.put("USER_NAME", userName);
		json.put("USER_SEX", userSex==0?"保密":userSex==1?"男":"女");
		json.put("REGION_CODE", regionCode);
		json.put("REGION_NAME", regionName);
		json.put("USER_DES", userDes==null?"":userDes);
		if(userImg!=null) {
			json.put("USER_IMG", userImg);
		}
		return json;
	}
    /**
     * 不包含头像
     * */
    public JSONObject toJSON() {
        JSONObject json=new JSONObject();
        json.put("USER_ID", userId);
        json.put("USER_NAME", userName);
        json.put("USER_SEX", userSex==0?"保密":userSex==1?"男":"女");
        json.put("REGION_CODE", regionCode);
        json.put("REGION_NAME", regionName);
        json.put("USER_DES", userDes==null?"":userDes);
        json.put("USER_STATE", userState);
        json.put("ROLE_TYPE", roleType);
        return json;
    }

	public void decode(JSONObject json) {
		
	}
	/**
	 * *设置客户端在线
	 * */
	public synchronized void setOnLine(boolean onLine) {
		if(onLine) {
			this.onLine = Boolean.TRUE;
		}else {
			this.onLine = Boolean.FALSE;
		}
	}
	
	
	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	public String getUserName() {
		return userName;
	}
	public void setUserName(String userName) {
		this.userName = userName;
	}
	public String getUserPwd() {
		return userPwd;
	}
	public void setUserPwd(String userPwd) {
		this.userPwd = userPwd;
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
	public byte[] getUserImg() {
		return userImg;
	}
	public void setUserImg(byte[] userImg) {
		this.userImg = userImg;
	}
	public boolean isOnLine() {
		return onLine;
	}
	public Client getWebClient() {
		return webClient;
	}
	public void setWebClient(Client webClient) {
		this.webClient = webClient;
	}
	public String getRegionCode() { return regionCode; }
	public void setRegionCode(String regionCode) { this.regionCode = regionCode; }
	public String getRegionName() { return regionName; }
	public void setRegionName(String regionName) { this.regionName = regionName; }

    public int getUserState() {
        return userState;
    }

    public void setUserState(int userState) {
        this.userState = userState;
    }

    public Date getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
    }
    

    public int getRoleType() {
        return roleType;
    }

    public void setRoleType(int roleType) {
        this.roleType = roleType;
    }

    public Date getLastLoginDate() {
        return lastLoginDate;
    }

    public void setLastLoginDate(Date lastLoginDate) {
        this.lastLoginDate = lastLoginDate;
    }
}
