package com.controller;

import com.alibaba.fastjson.JSONObject;
import com.common.manage.UserManage;
import com.common.util.EncryUtil;
import com.common.util.GetRequestJsonUtil;
import com.common.util.StringUtils;
import com.common.util.TokenUtils;
import com.model.User;
import com.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Map;

@RestController
public class LoginController {
	
	private static Logger log = LoggerFactory.getLogger(LoginController.class);
	
	@Resource
	private UserService userService;
	
	/**
	 * * 登录
	 * */
	@RequestMapping(value = "/login", method = RequestMethod.POST)
	public String login(HttpServletRequest request, HttpServletResponse response) throws Exception {
		JSONObject result = new JSONObject();
		String jsonStr = GetRequestJsonUtil.getRequestJsonString(request);
		if(StringUtils.isNotEmpty(jsonStr)) {
			JSONObject json=JSONObject.parseObject(jsonStr);
			String userId=json.getString("USER_ID");
            String userPwd=json.getString("USER_PWD");
            int clientType=json.getInteger("CLIENT_TYPE");
            
			User user = UserManage.getInstance().get(userId);
			if(user==null) {
				user = userService.qryImgByUserId(userId);
                if(user!=null){
                    UserManage.getInstance().add(user);
                }
			}
            if(user==null) {//用户不存在
                result.put("SUCCESS", false);
                result.put("RETURN_MSG", "账号或者密码错误");
                return result.toJSONString();
            }
            // 验证用户密码
            String pwd=EncryUtil.encode(userId,userPwd);
            log.info("加密后密码：{}",pwd);
            if(pwd.equals(user.getUserPwd())){
                if(user.getUserState()==2){
                    result.put("SUCCESS", false);
                    result.put("RETURN_MSG", "账号已经被冻结,请联系管理员解冻");
                    return result.toJSONString();
                }
                if(user.getUserState()==1&&clientType!=4){
                    result.put("SUCCESS", false);
                    result.put("RETURN_MSG", "该账号已经被登录");
                    return result.toJSONString();
                }
                if(clientType==4){
                    if(user.getRoleType()<=0){
                        result.put("SUCCESS", false);
                        result.put("RETURN_MSG", "您没有管理员权限,不能登录");
                        return result.toJSONString();
                    }
                }
                Map<String, Object> claims = new HashMap<>();
                claims.put("USER_ID", user.getUserId());
                claims.put("USER_NAME", user.getUserName());
                String token=TokenUtils.createToken(claims);

                result.put("SUCCESS", true);
                result.put("USER_ID", user.getUserId());
                result.put("USER_NAME", user.getUserName());
                result.put("USER_SEX", user.getUserSex());
                result.put("REGION_CODE", user.getRegionCode());
                result.put("REGION_NAME", user.getRegionName());
                result.put("USER_DES", user.getUserDes());
                result.put("USER_IMG", user.getUserImg());
                result.put("ROLE_TYPE", user.getRoleType());
                result.put("TOKEN", token);
                log.info("用户 {}({}) 通过 {} 登录系统",user.getUserName(),user.getUserId(),"网页版");
            }else{
                result.put("SUCCESS", false);
                result.put("RETURN_MSG", "账号或者密码错误");
            }
		}else {
			result.put("SUCCESS", false);
            result.put("RETURN_MSG", "账号或者密码错误");
		}
		return result.toJSONString();
	}
}
