package com.model;

import com.alibaba.fastjson.JSONObject;
import com.common.Model;

import java.util.Date;

public class OpinionInfo implements Model {
    private static final long serialVersionUID = 6707791796241168215L;
    /**意见标识(OPINION_ID)*/
    private int opinionId;
    /**意见内容(OPINION_CONTENT)*/
    private String opinionContent;
    /**创建时间(CREATE_DATE)*/
    private Date createDate;
    /**意见状态(OPINION_STATE)
     * 0 默认 未处理
     * 1 已处理
     * */
    private int opinionState;
    /**更新时间(UPDATE_DATE)*/
    private Date updateDate;
    
    @Override
    public JSONObject encode() {
        return null;
    }

    @Override
    public void decode(JSONObject json) {
        if(json.containsKey("OPINION_CONTENT"))this.opinionContent=json.getString("OPINION_CONTENT");
    }

    public int getOpinionId() {
        return opinionId;
    }

    public void setOpinionId(int opinionId) {
        this.opinionId = opinionId;
    }

    public String getOpinionContent() {
        return opinionContent;
    }

    public void setOpinionContent(String opinionContent) {
        this.opinionContent = opinionContent;
    }

    public Date getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
    }

    public int getOpinionState() {
        return opinionState;
    }

    public void setOpinionState(int opinionState) {
        this.opinionState = opinionState;
    }

    public Date getUpdateDate() {
        return updateDate;
    }

    public void setUpdateDate(Date updateDate) {
        this.updateDate = updateDate;
    }
}
