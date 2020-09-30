package com.model;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

import java.util.List;
import java.util.Map;

/**城市地区*/
public class CityRegion extends Region{
    private static final long serialVersionUID = -2112467908043237341L;
    private Map<String, AreaRegion> areaCache;
    private List<AreaRegion> areaList;

    public JSONObject encode() {
        JSONObject json = super.encode();
        if(areaList!=null&&!areaList.isEmpty()){
            JSONArray list = new JSONArray();
            areaList.forEach(area->{
                list.add(area.encode());
            });
            json.put("AREA_LIST",list);
        }
        return json;
    }

    public List<AreaRegion> getAreaList() {
        return areaList;
    }

    public void setAreaList(List<AreaRegion> areaList) {
        this.areaList = areaList;
    }

    public Map<String, AreaRegion> getAreaCache() {
        return areaCache;
    }

    public void setAreaCache(Map<String, AreaRegion> areaCache) {
        this.areaCache = areaCache;
    }
}
