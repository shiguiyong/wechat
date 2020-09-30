package com.controller;

import ch.qos.logback.classic.Level;
import com.common.Result;
import com.common.http.IMChatRequest;
import com.common.manage.LogMonitorClientManage;
import com.model.LogMonitorClient;
import com.model.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;

/**
 * 日志管理
 * */
@RestController
public class LogController {
    
    private static Logger log = LoggerFactory.getLogger(LogController.class);
    
    @RequestMapping(value = "/log/level",method= RequestMethod.POST, produces = { "application/json;charset=UTF-8" })
    public Result<User> list(IMChatRequest request, HttpServletResponse rnse) throws Exception {
        String userId=request.getString("USER_ID");
        String level=request.getString("LEVEL");
        LogMonitorClient client= LogMonitorClientManage.getInstance().get(userId);
        if(client!=null){
            log.warn("用户({})修改监控日志级别,将{}修改为{}",userId,client.getLevel().toString(),level);
            client.setLevel(Level.toLevel(level,Level.INFO));
        }
        return new Result<>();
    }
}
