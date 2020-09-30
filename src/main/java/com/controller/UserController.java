package com.controller;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.common.Result;
import com.common.http.IMChatRequest;
import com.common.manage.RegionManage;
import com.common.manage.UserManage;
import com.common.util.EncryUtil;
import com.common.util.ImageUtils;
import com.common.util.StringUtils;
import com.model.User;
import com.service.UserService;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;
import java.io.OutputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class UserController {
	
	@Resource
	private UserService userService;
	
	@RequestMapping(value = "/user/qryById",method=RequestMethod.POST, produces = { "application/json;charset=UTF-8" })
	public Result<User> qryById(IMChatRequest request, HttpServletResponse response) throws Exception {
		String userId=request.getString("USER_ID");
		User user = UserManage.getInstance().get(userId);
		if(user==null) {
			user = userService.qryImgByUserId(userId);
			if(user!=null)UserManage.getInstance().add(user);
		}
		return new Result<User>(user);
	}
    /**
     * 更新用户信息
     * */
    @RequestMapping(value = "/user/update",method=RequestMethod.POST, produces = { "application/json;charset=UTF-8" })
    public Result<User> update(IMChatRequest request, HttpServletResponse response) throws Exception {
        String userId=request.getString("USER_ID");
        User user = UserManage.getInstance().get(userId);
        if(user==null) {
            user = userService.qryImgByUserId(userId);
        }
        if(user!=null){
            user.setUserName(request.getString("USER_NAME"));
            user.setUserSex(request.getInteger("USER_SEX"));
            user.setRegionCode(request.getString("REGION_CODE"));
            user.setUserDes(request.getString("USER_DES"));
            String regionName= RegionManage.getInstance().getRegionName(user.getRegionCode());
            user.setRegionName(regionName);
            String userImg=request.getString("USER_IMG");
            if(StringUtils.isNotEmpty(userImg)){
                byte[] img = ImageUtils.compressImage(userImg);
                user.setUserImg(img);
            }
            userService.update(user);
            UserManage.getInstance().add(user);
        }
        return new Result<User>(user);
    }

    @RequestMapping(value = "/user/img/{userId}",method=RequestMethod.GET, produces = { "image/png" })
    public void qryImg(@PathVariable String userId, IMChatRequest request, HttpServletResponse response) throws Exception {
        User user=UserManage.getInstance().get(userId);
        if(user!=null){
            OutputStream out = response.getOutputStream();
            out.write(user.getUserImg());
            out.flush();
            out.close();
        }
    }
    /**密码修改*/
    @RequestMapping(value = "/user/pwdchage",method=RequestMethod.POST, produces = { "application/json;charset=UTF-8" })
    public String pwdchage(IMChatRequest request, HttpServletResponse response) throws Exception {
        JSONObject result = new JSONObject();
        result.put("SUCCESS",true);
        String userId=request.getString("USER_ID");
        String oldPwd=request.getString("OLD_PWD");
        String pwd=request.getString("PWD");
        User user=UserManage.getInstance().get(userId);
        if(user!=null){
            String old=EncryUtil.encode(userId,oldPwd);
            String newP=EncryUtil.encode(userId,pwd);
            if(user.getUserPwd().equals(old)){
                user.setUserPwd(newP);
                userService.updatePWD(user);
            }else{
                result.put("SUCCESS",false);
                result.put("RETURN_MSG","旧密码错误");
            }
        }
        return result.toJSONString();
    }
    /**
     * 根据条件查询用户列表
     * */
    @RequestMapping(value = "/user/qry",method=RequestMethod.POST, produces = { "application/json;charset=UTF-8" })
    public String qry(IMChatRequest request, HttpServletResponse response) throws Exception {
        Map<String,Object> m = new HashMap<>();
        String userId=request.getString("USER_ID");
        if(StringUtils.isNotEmpty(userId)){
            m.put("USER_ID",userId);
        }
        String userName=request.getString("USER_NAME");
        if(StringUtils.isNotEmpty(userName)){
            m.put("USER_NAME",userName);
        }
        String userState=request.getString("USER_STATE");
        if(StringUtils.isNotEmpty(userState)){
            m.put("USER_STATE",userState);
        }
        int pageNo= request.getInteger("PAGE_NO");
        int pageSize= request.getInteger("PAGE_SIZE");

        int totalNum=userService.searchCount(m);
        m.put("OFFSET",(pageNo-1)*pageSize);// 查询分页
        m.put("PAGE_SIZE",pageSize);
        List<String> users=userService.search(m);
        JSONArray array=new JSONArray();
        if(users!=null&&!users.isEmpty()){
            users.forEach(id -> {
                array.add(UserManage.getInstance().get(id).toJSON());
            });
        }
        JSONObject result=new JSONObject();
        result.put("SUCCESS", true);
        result.put("TOTAL_NUM", totalNum);
        result.put("PAGE_NO", pageNo);// 当前页码
        result.put("PAGE_SIZE", pageSize);// 每页条数
        result.put("DATA", array);
        return result.toJSONString();
    }
    /**
     * 用户冻结 解冻
     * */
    @RequestMapping(value = "/user/freeze",method=RequestMethod.POST, produces = { "application/json;charset=UTF-8" })
    public Result<User> freeze(IMChatRequest request, HttpServletResponse response) throws Exception {
        String userId=request.getString("USER_ID");
        String userState=request.getString("USER_STATE");
        User user=UserManage.getInstance().get(userId);
        if(user!=null){
            user.setUserState(Integer.parseInt(userState));
            userService.updateState(user);
        }
        return new Result<>();
    }

    /**
     * 用户冻结 解冻
     * */
    @RequestMapping(value = "/user/roleTypemodify",method=RequestMethod.POST, produces = { "application/json;charset=UTF-8" })
    public Result<User> roleTypemodify(IMChatRequest request, HttpServletResponse response) throws Exception {
        String userId=request.getString("USER_ID");
        String roleType=request.getString("ROLE_TYPE");
        User user=UserManage.getInstance().get(userId);
        if(user!=null){
            user.setRoleType(Integer.parseInt(roleType));
            userService.updateRole(user);
        }
        return new Result<>();
    }

    /**
     * 统计 在线用户 用户总数
     * */
    @RequestMapping(value = "/user/statistics",method=RequestMethod.POST, produces = { "application/json;charset=UTF-8" })
    public String statistics(IMChatRequest request, HttpServletResponse response) throws Exception {
        JSONObject result=new JSONObject();
        result.put("SUCCESS", true);
        result.put("ONLINE_USER_TOTAL", UserManage.getInstance().getOnLineUserNum());
        result.put("USER_TOTAL", UserManage.getInstance().getUserNum());
        return result.toJSONString();
    }

}
