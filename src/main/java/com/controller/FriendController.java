package com.controller;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.common.MessageType;
import com.common.Result;
import com.common.http.IMChatRequest;
import com.common.manage.IdGenerateManage;
import com.common.manage.MessageManage;
import com.common.manage.UserManage;
import com.common.util.StringUtils;
import com.model.Friend;
import com.model.SendMessage;
import com.model.User;
import com.service.ChatRoomService;
import com.service.FriendService;
import com.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 聊天好友信息 管理类
 * */
@RestController
public class FriendController {
	private static Logger log = LoggerFactory.getLogger(FriendController.class);
	@Resource
	private FriendService friendService;
	@Resource
	private UserService userService;
    @Resource
	private ChatRoomService chatRoomService;
	
	@RequestMapping(value = "/friend/list",method=RequestMethod.POST, produces = { "application/json;charset=UTF-8" })
	public Result<Friend> list(IMChatRequest request, HttpServletResponse response) throws Exception {
		String userId=request.getString("USER_ID");
		log.info("查询用户({})的好友列表", userId);
		List<Friend> friends = friendService.qryByUserId(userId);
		if(friends!=null&&!friends.isEmpty()){
			friends.forEach(friend -> {
				User user=UserManage.getInstance().get(friend.getFriendId());
				if(user!=null){
					friend.setFriendName(user.getUserName());
					friend.setUserSex(user.getUserSex());
					friend.setRegionCode(user.getRegionCode());
					friend.setRegionName(user.getRegionName());
					friend.setUserDes(user.getUserDes());
				}
			});
		}
		return new Result<Friend>(friends);
	}

	@RequestMapping(value = "/friend/search",method=RequestMethod.POST, produces = { "application/json;charset=UTF-8" })
	public String search(IMChatRequest request, HttpServletResponse response) throws Exception {
		int userSex=request.getInteger("USER_SEX");
		Map<String,Object> m = new HashMap<>();
		String searchText=request.getString("SEARCH_TEXT");
		if(StringUtils.isNotEmpty(searchText)){
		    if(StringUtils.isNumber(searchText)){
                m.put("USER_ID",searchText);
            }else{
                m.put("USER_NAME",searchText);
            }
        }
		if(userSex!=0){
			m.put("USER_SEX",userSex);
		}
		String regionCode= request.getString("REGION_CODE");
		if(StringUtils.isNotEmpty(regionCode)){
            String regionType= request.getString("REGION_TYPE");
            if("1".equals(regionType)){
                m.put("REGION_CODE",regionCode.substring(0,3));
            }else if("2".equals(regionType)){
                m.put("REGION_CODE",regionCode.substring(0,5));
            }else if("3".equals(regionType)){
                m.put("REGION_CODE",regionCode.substring(0,7));
            }else{
                m.put("REGION_CODE",regionCode);
            }
		}
        int pageNo= request.getInteger("PAGE_NO");
        int pageSize= request.getInteger("PAGE_SIZE");
		
        int totalNum=userService.searchCount(m);

        m.put("OFFSET",(pageNo-1)*pageSize);// 查询分页
        m.put("PAGE_SIZE",pageSize);
        List<String> users=userService.search(m);
        
        JSONArray array=new JSONArray();
        if(users!=null&&!users.isEmpty()){
            users.forEach(userId -> {
                array.add(UserManage.getInstance().get(userId).toJSON());
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
	 * 修改好友的备注名称
	 * */
	@RequestMapping(value = "/friend/remark",method=RequestMethod.POST, produces = { "application/json;charset=UTF-8" })
	public String remark(IMChatRequest request, HttpServletResponse response) throws Exception {
		String userId = request.getString("USER_ID");
		String friendId = request.getString("FRIEND_ID");
		String remarkName = request.getString("REMARK_NAME");
		Friend friend=friendService.qryByUserIdAndFriendId(userId,friendId);
		if(friend!=null){
			friend.setRemarkName(remarkName);
			friendService.update(friend);
		}
		JSONObject result=new JSONObject();
		result.put("SUCCESS", true);
		if(StringUtils.isNotEmpty(remarkName)){
            result.put("REMARK_NAME", remarkName);
        }else{
		    User user=UserManage.getInstance().get(friendId);
		    if(user!=null){
                result.put("REMARK_NAME", user.getUserName());
            }else{
                result.put("REMARK_NAME", "");
            }
        }
		return result.toJSONString();
	}
    /**
     * 删除好友
     * */
    @RequestMapping(value = "/friend/delete",method=RequestMethod.POST, produces = { "application/json;charset=UTF-8" })
    public Result<Friend> delete(IMChatRequest request, HttpServletResponse response) throws Exception {
        String userId = request.getString("USER_ID");
        String friendId = request.getString("FRIEND_ID");
        friendService.delete(userId,friendId);
        chatRoomService.delete(userId,1,friendId);
        friendService.delete(friendId,userId);
        chatRoomService.delete(friendId,1,userId);
        // 通知好友 删除好友
        SendMessage send = new SendMessage();
        send.setMessageId(IdGenerateManage.getInstance().nextId());
        send.setMessageType(MessageType.MESSAGE_FRIENT_DELETE);
        send.setSendId(userId);
        send.setReceiveId(friendId);
        MessageManage.getInstance().send(send);
	    return new Result<>();
    }

}
