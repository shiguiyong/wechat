package com.mapper;

import com.model.AreaRegion;
import com.model.CityRegion;
import com.model.CountryRegion;
import com.model.ProvinceRegion;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RegionMapper {

    List<CountryRegion> qryCountryRegion();

    List<ProvinceRegion> qryProvinceRegion();

    List<CityRegion> qryCityRegion();

    List<AreaRegion> qryAreaRegion();
    
    
    
}
