package com.thread;

import com.common.manage.RegionManage;
import com.model.AreaRegion;
import com.model.CityRegion;
import com.model.CountryRegion;
import com.model.ProvinceRegion;
import com.service.RegionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CountDownLatch;

public class LoadingRegionToCacheThread implements Runnable{
    
    private Logger log = LoggerFactory.getLogger(LoadingRegionToCacheThread.class);
    
    private RegionService regionService;

    private CountDownLatch latch;
    
    public void run() {
        try{
            //缓存国地区信息
            List<CountryRegion> countryRegions = regionService.qryCountryRegion();
            if(countryRegions!=null&&!countryRegions.isEmpty()){
                countryRegions.forEach(c->{
                    c.setProvinceList(new ArrayList<>(40));
                    c.setProvinceCache(new ConcurrentHashMap<>(40));
                    RegionManage.getInstance().add(c);
                    log.info("缓存国家:{}({})",c.getRegionName(),c.getRegionCode());
                });
            }
            //缓存省份信息
            List<ProvinceRegion> provinceRegions = regionService.qryProvinceRegion();
            if(provinceRegions!=null&&!provinceRegions.isEmpty()){
                provinceRegions.forEach(p->{
                    p.setCityList(new ArrayList<>(100));
                    p.setCityCache(new ConcurrentHashMap<>(100));
                    RegionManage.getInstance().add(p);
                });
            }
            //缓存城市信息
            List<CityRegion> cityRegions = regionService.qryCityRegion();
            if(cityRegions!=null&&!cityRegions.isEmpty()){
                cityRegions.forEach(c->{
                    c.setAreaList(new ArrayList<>(100));
                    c.setAreaCache(new ConcurrentHashMap<>(100));
                    RegionManage.getInstance().add(c);
                });
            }
            //缓存区域信息
            List<AreaRegion> areaRegions = regionService.qryAreaRegion();
            if(areaRegions!=null&&!areaRegions.isEmpty()){
                areaRegions.forEach(a->{
                    RegionManage.getInstance().add(a);
                });
            }
        }finally {
            latch.countDown();
        }
    }

    public RegionService getRegionService() {
        return regionService;
    }

    public void setRegionService(RegionService regionService) {
        this.regionService = regionService;
    }

    public void setLatch(CountDownLatch latch) {
        this.latch = latch;
    }
}
