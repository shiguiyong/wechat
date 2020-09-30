package com.service;

import com.mapper.RegionMapper;
import com.model.AreaRegion;
import com.model.CityRegion;
import com.model.CountryRegion;
import com.model.ProvinceRegion;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

@Service
public class RegionService {

    @Resource
    private RegionMapper regionMapper;
    
    public List<CountryRegion> qryCountryRegion(){
        return regionMapper.qryCountryRegion();
    }

    public List<ProvinceRegion> qryProvinceRegion(){
        return regionMapper.qryProvinceRegion();
    }

    public List<CityRegion> qryCityRegion(){
        return regionMapper.qryCityRegion();
    }

    public List<AreaRegion> qryAreaRegion(){
        return regionMapper.qryAreaRegion();
    }
}
