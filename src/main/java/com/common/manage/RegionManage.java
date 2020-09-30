package com.common.manage;

import com.alibaba.fastjson.JSONArray;
import com.common.util.StringUtils;
import com.model.AreaRegion;
import com.model.CityRegion;
import com.model.CountryRegion;
import com.model.ProvinceRegion;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 *  所在地缓存管理
 */
public class RegionManage {
    private static Map<String, CountryRegion> cache=new ConcurrentHashMap<>(100);
    private volatile static RegionManage instance = null;
    /**聊天消息队列*/
    private RegionManage(){}
    public static RegionManage getInstance() {
        if (instance== null)  {
            synchronized (RegionManage.class) {
                if (instance== null)  {
                    instance= new RegionManage();
                }
            }
        }
        return instance;
    }
    
    public void add(CountryRegion region){
        cache.put(region.getRegionCode(),region);
    }

    public void add(ProvinceRegion region){
        if(cache.containsKey(region.getParentCode())){
            CountryRegion countryRegion=cache.get(region.getParentCode());
            countryRegion.getProvinceCache().put(region.getRegionCode(),region);
            countryRegion.getProvinceList().add(region);
        }
    }

    public void add(CityRegion region){
        String code=region.getRegionCode();
        String countryCode = code.substring(0,3)+"000000";
        if(cache.containsKey(countryCode)){
            CountryRegion countryRegion=cache.get(countryCode);// 获取国家地区
            if(countryRegion.getProvinceCache().containsKey(region.getParentCode())){// 获取省份
                ProvinceRegion provinceRegion=countryRegion.getProvinceCache().get(region.getParentCode());
                provinceRegion.getCityCache().put(region.getRegionCode(),region);
                provinceRegion.getCityList().add(region);
            }
        }
    }

    public void add(AreaRegion region){
        String code=region.getRegionCode();
        String countryCode = code.substring(0,3)+"000000";
        String provinceCode = code.substring(0,5)+"0000";
        String cityCode = code.substring(0,7)+"00";
        if(cache.containsKey(countryCode)){
            CountryRegion countryRegion=cache.get(countryCode);// 获取国家地区
            if(countryRegion.getProvinceCache().containsKey(provinceCode)){
                ProvinceRegion provinceRegion=countryRegion.getProvinceCache().get(provinceCode);//获取对应的省份
                if(provinceRegion.getCityCache().containsKey(cityCode)){
                    CityRegion cityRegion=provinceRegion.getCityCache().get(cityCode);
                    cityRegion.getAreaCache().put(region.getRegionCode(),region);
                    cityRegion.getAreaList().add(region);
                }
            }
        }
    }
    
    public JSONArray getList(){
        JSONArray list = new JSONArray();
        cache.forEach((k,v)->{
            list.add(v.encode());
        });
        return list;
    }
    
    public String getRegionName(String regionCode){
        if(StringUtils.isEmpty(regionCode)){
            return null;
        }
        StringBuilder buffer=new StringBuilder(100);
        String countryId=regionCode.substring(0,3)+"000000";
        if(cache.containsKey(countryId)){
            //国家
            CountryRegion countryRegion=cache.get(countryId);
            buffer.append(countryRegion.getRegionName()).append(" ");
            //省份
            String provinceId = regionCode.substring(0,5)+"0000";
            if(countryRegion.getProvinceCache().containsKey(provinceId)){
                ProvinceRegion provinceRegion=countryRegion.getProvinceCache().get(provinceId);
                buffer.append(provinceRegion.getRegionName()).append(" ");
                //城市
                String cityId = regionCode.substring(0,7)+"00";
                if(provinceRegion.getCityCache().containsKey(cityId)){
                    CityRegion cityRegion=provinceRegion.getCityCache().get(cityId);
                    buffer.append(cityRegion.getRegionName()).append(" ");
                    //区域
                    String areaId=regionCode;
                    if(cityRegion.getAreaCache().containsKey(areaId)){
                        AreaRegion areaRegion=cityRegion.getAreaCache().get(areaId);
                        buffer.append(areaRegion.getRegionName());
                    }
                }
            }
        }
        return buffer.toString().trim();
    }
    
}
