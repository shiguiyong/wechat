package com.controller;

import com.alibaba.fastjson.JSONObject;
import com.common.http.IMChatRequest;
import com.common.manage.UserManage;
import com.common.util.TokenUtils;
import com.model.User;
import com.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Map;

@RestController
public class TokenController {

    private static Logger log = LoggerFactory.getLogger(TokenController.class);

    @Resource
    private UserService userService;

    /**
     * 检查客户端token 并返回新的token
     * */
    @RequestMapping(value = "/token/check",method= RequestMethod.POST, produces = { "application/json;charset=UTF-8" })
    public String check(IMChatRequest request, HttpServletResponse response) throws Exception {
        JSONObject result = new JSONObject();
        result.put("SUCCESS", true);

        String userId=request.getString("USER_ID");

        User user = UserManage.getInstance().get(userId);
        if(user==null) {
            user = userService.qryImgByUserId(userId);
            UserManage.getInstance().add(user);
        }

        Map<String, Object> claims = new HashMap<String, Object>();
        claims.put("USER_ID", user.getUserId());
        claims.put("USER_NAME", user.getUserName());
        String token= TokenUtils.createToken(claims);

        result.put("TOKEN", token);
        return result.toJSONString();
    }

}
