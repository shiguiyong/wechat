package com.controller;

import com.alibaba.fastjson.JSONObject;
import com.common.http.IMChatRequest;
import com.common.manage.RegionManage;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;

/**
 * 获取全国省市县数据
 */
@RestController
public class RegionController {

    @RequestMapping(value = "/region/region",method= RequestMethod.POST, produces = { "application/json;charset=UTF-8" })
    public String region(IMChatRequest request, HttpServletResponse response) throws Exception {
        JSONObject result= new JSONObject();
        result.put("SUCCESS",true);
        result.put("DATA", RegionManage.getInstance().getList());
        return result.toJSONString();
    }
}
