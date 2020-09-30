package com.model;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

import java.util.List;
import java.util.Map;

/**国家地区*/
public class CountryRegion extends Region{
    private static final long serialVersionUID = -3380686224274872483L;
    private Map<String, ProvinceRegion> provinceCache;
    private List<ProvinceRegion> provinceList;

    public JSONObject encode() {
        JSONObject json=super.encode();
        if(provinceList!=null&&!provinceList.isEmpty()){
            JSONArray list=new JSONArray();
            provinceList.forEach(province->{
                list.add(province.encode());
            });
            json.put("PROVINCE_LIST",list);
        }
        return json;
    }

    public List<ProvinceRegion> getProvinceList() {
        return provinceList;
    }

    public void setProvinceList(List<ProvinceRegion> provinceList) {
        this.provinceList = provinceList;
    }

    public Map<String, ProvinceRegion> getProvinceCache() {
        return provinceCache;
    }

    public void setProvinceCache(Map<String, ProvinceRegion> provinceCache) {
        this.provinceCache = provinceCache;
    }
}
