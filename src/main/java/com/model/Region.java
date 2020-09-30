package com.model;

import com.alibaba.fastjson.JSONObject;
import com.common.Model;

/**
 * 地区
 */
public class Region implements Model {
    private static final long serialVersionUID = 5583921056995708092L;
    /**地区编码(REGION_CODE)*/
    private String regionCode;
    /**地区名称(REGION_NAME)*/
    private String regionName;
    /**所属地区编码(PARENT_CODE)*/
    private String parentCode;
    /**
     * 地区类型(REGION_TYPE)
     * 1 国家
     * 2 省份
     * 3 城市
     * 4 区域
     */
    private int regionType;

    public JSONObject encode() {
        JSONObject json=new JSONObject();
        json.put("REGION_CODE",regionCode);
        json.put("REGION_NAME",regionName);
        json.put("PARENT_CODE",parentCode);
        json.put("REGION_TYPE",regionType);
        return json;
    }

    public void decode(JSONObject json) {

    }

    public String getRegionCode() {
        return regionCode;
    }

    public void setRegionCode(String regionCode) {
        this.regionCode = regionCode;
    }

    public String getRegionName() {
        return regionName;
    }

    public void setRegionName(String regionName) {
        this.regionName = regionName;
    }

    public String getParentCode() {
        return parentCode;
    }

    public void setParentCode(String parentCode) {
        this.parentCode = parentCode;
    }

    public int getRegionType() {
        return regionType;
    }

    public void setRegionType(int regionType) {
        this.regionType = regionType;
    }
}
