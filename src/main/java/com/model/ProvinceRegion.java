package com.model;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

import java.util.List;
import java.util.Map;

/**省份地区*/
public class ProvinceRegion extends Region{
    private static final long serialVersionUID = 3494186607099527954L;
    private Map<String, CityRegion> cityCache;
    private List<CityRegion> cityList;

    public JSONObject encode() {
        JSONObject json = super.encode();
        if(cityList!=null&&!cityList.isEmpty()){
            JSONArray list = new JSONArray();
            cityList.forEach(city -> {
                list.add(city.encode());
            });
            json.put("CITY_LIST",list);
        }
        return json;
    }

    public List<CityRegion> getCityList() {
        return cityList;
    }

    public void setCityList(List<CityRegion> cityList) {
        this.cityList = cityList;
    }


    public Map<String, CityRegion> getCityCache() {
        return cityCache;
    }

    public void setCityCache(Map<String, CityRegion> cityCache) {
        this.cityCache = cityCache;
    }
}
