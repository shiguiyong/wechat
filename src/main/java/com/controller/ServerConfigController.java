package com.controller;

import com.alibaba.fastjson.JSONObject;
import com.common.http.IMChatRequest;
import com.common.manage.ServerConfigManage;
import com.common.manage.UserManage;
import com.common.session.SessionContext;
import com.model.ServerConfig;
import com.model.User;
import com.service.ServerConfigService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;

/**
 * 服务器配置修改
 * */
@RestController
public class ServerConfigController {
    @Resource
    private ServerConfigService serverConfigService;

    @RequestMapping(value = "/serverconfig/qry",method= RequestMethod.POST, produces = { "application/json;charset=UTF-8" })
    public String qry(IMChatRequest request, HttpServletResponse response) throws Exception {
        JSONObject result = new JSONObject();
        result.put("SUCCESS",true);
        result.put("UNREAD-MESSAGE-TIMEOUT",ServerConfigManage.getInstance().getUnreadMessageTimeOut());
        return result.toJSONString();
    }

    @RequestMapping(value = "/serverconfig/update",method= RequestMethod.POST, produces = { "application/json;charset=UTF-8" })
    public String update(IMChatRequest request, HttpServletResponse response) throws Exception {
        JSONObject result = new JSONObject();
        String userId=SessionContext.get("USER_ID");
        User user=UserManage.getInstance().get(userId);
        if(user!=null&&user.getRoleType()==2){
            String configKey=request.getString("CONFIG_KEY");
            String configValue=request.getString("CONFIG_VALUE");
            ServerConfig serverConfig = new ServerConfig();
            serverConfig.setConfigKey(configKey);
            serverConfig.setConfigValue(configValue);
            serverConfigService.update(serverConfig);
            ServerConfigManage.getInstance().update(serverConfig);
            result.put("SUCCESS",true);
        }else{
            result.put("SUCCESS",false);
            result.put("RETURN_MSG","您没有修改配置权限");
        }
        return result.toJSONString();
    }
    
}
