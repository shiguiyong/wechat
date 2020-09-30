package com.model;

import com.alibaba.fastjson.JSONObject;
import com.common.Model;

import java.util.Date;

/**
 *  未读消息表 对应数据库中未读消息记录表<UNREAD_MESSAGE>表
 * */
public class UnreadMessage implements Model {
    
    /**聊天消息标识(MESSAGE_ID)*/
    private String messageId;
    /**未读消息用户(USER_ID)*/
    private String userId;
    /**聊天消息时间(MESSAGE_DATE)*/
    private Date messageDate;
    /**消息内容(MESSAGE_CONTENT)*/
    private String messageContent;
    
    public JSONObject encode() {
        return null;
    }

    public void decode(JSONObject json) {

    }

    public String getMessageId() {
        return messageId;
    }
    public void setMessageId(String messageId) {
        this.messageId = messageId;
    }
    public String getMessageContent() {
        return messageContent;
    }
    public void setMessageContent(String messageContent) {
        this.messageContent = messageContent;
    }
    public Date getMessageDate() {
        return messageDate;
    }
    public void setMessageDate(Date messageDate) {
        this.messageDate = messageDate;
    }
    public String getUserId() {
        return userId;
    }
    public void setUserId(String userId) {
        this.userId = userId;
    }
}
