package com.controller;

import com.alibaba.fastjson.JSONArray;
import com.common.Result;
import com.common.http.IMChatRequest;
import com.common.manage.GroupChatManage;
import com.common.manage.UserManage;
import com.common.pool.IdPool;
import com.model.GroupChat;
import com.model.GroupChatHeadImgGenerate;
import com.model.GroupChatNumber;
import com.model.User;
import com.service.ChatRoomService;
import com.service.GroupChatNumberService;
import com.service.GroupChatService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Vector;

/**
 * *群组聊天 管理
 * */
@RestController
public class GroupChatController {
	private static Logger log = LoggerFactory.getLogger(GroupChatController.class);
	@Resource
	private GroupChatService groupChatService;
	@Resource
	private GroupChatNumberService groupChatNumberService;
    @Resource
    private ChatRoomService chatRoomService;
	
	@RequestMapping(value = "/groupchat/list",method=RequestMethod.POST, produces = { "application/json;charset=UTF-8" })
	public Result<GroupChat> list(IMChatRequest request, HttpServletResponse response) throws Exception {
		String userId=request.getString("USER_ID");
		log.info("查询用户({})的群组列表", userId);
		List<GroupChat> groupChats = groupChatService.qryByUserId(request.getString("USER_ID"));
		return new Result<GroupChat>(groupChats);
	}
	
	@RequestMapping(value = "/groupchat/qryByGroupId",method=RequestMethod.POST, produces = { "application/json;charset=UTF-8" })
	public Result<GroupChat> qryByGroupId(IMChatRequest request, HttpServletResponse response) throws Exception {
		String groupId=request.getString("GROUP_ID");
		GroupChat groupChat=GroupChatManage.getInstance().get(groupId);
		if (groupChat==null){
			groupChat = groupChatService.qryByGroupId(groupId);
			if(groupChat!=null)GroupChatManage.getInstance().add(groupChat);
		}
		return new Result<GroupChat>(groupChat);
	}
	/**
	 * 创建群聊
	 * */
	@RequestMapping(value = "/groupchat/create",method=RequestMethod.POST, produces = { "application/json;charset=UTF-8" })
	public Result<GroupChat> create(IMChatRequest request, HttpServletResponse response) throws Exception {
		Date date = new Date();
		String groupId=IdPool.getInstance().get();

		GroupChat groupChat=new GroupChat();
		groupChat.decode(request.getJson());
		groupChat.setGroupId(groupId);
		groupChat.setCreateDate(date);
		groupChat.setNumbers(new Vector<GroupChatNumber>());
		/**生成群图片*/
		GroupChatHeadImgGenerate generate =new GroupChatHeadImgGenerate();
		User user=UserManage.getInstance().get(groupChat.getUserId());
		generate.addNumber(user.getUserImg());
		
		JSONArray numbers=request.getJSONArray("NUMBERS");
		List<GroupChatNumber> groupChatNumbers = new ArrayList<>(numbers.size());
		for(int i=0;i<numbers.size();i++){
			GroupChatNumber number=new GroupChatNumber();
			number.setGroupId(groupId);
			number.setNumberId(numbers.getString(i));
			number.setJoinDate(date);

			User u=UserManage.getInstance().get(number.getNumberId());
			if(u.getUserImg()==null)continue;
			generate.addNumber(u.getUserImg());
			groupChatNumbers.add(number);
			groupChat.getNumbers().add(number);
		}
		groupChatNumberService.insertBatch(groupChatNumbers);
		/**添加群主*/
		GroupChatNumber number=new GroupChatNumber();
		number.setGroupId(groupId);
		number.setNumberId(groupChat.getUserId());
		number.setJoinDate(date);
		groupChatNumberService.insert(number);
		groupChat.getNumbers().add(number);
		/**生成图片*/
		generate.generate();

		groupChat.setGroupName("群聊("+(numbers.size()+1)+")");
		groupChat.setGroupImg(generate.getBytes());
		groupChatService.insert(groupChat);
		GroupChatManage.getInstance().add(groupChat);
		return new Result<>(groupChat);
	}
	/**修改群聊名称*/
    @RequestMapping(value = "/groupchat/modifyGroupName",method=RequestMethod.POST, produces = { "application/json;charset=UTF-8" })
    public Result<GroupChat> modifyGroupName(IMChatRequest request, HttpServletResponse response) throws Exception {
        String groupId=request.getString("GROUP_ID");
        String groupName=request.getString("GROUP_NAME");
        GroupChat groupChat=GroupChatManage.getInstance().get(groupId);
        if(groupChat!=null){
            groupChat.setGroupName(groupName);
            groupChatService.modifyGroupName(groupId,groupName);
        }
        return new Result<>();
    }

    /**
     * 成员退出群组
     * */
    @RequestMapping(value = "/groupchat/deleteNumber",method=RequestMethod.POST, produces = { "application/json;charset=UTF-8" })
    public Result<GroupChat> deleteNumber(IMChatRequest request, HttpServletResponse response) throws Exception {
        String groupId=request.getString("GROUP_ID");
        String numberId=request.getString("NUMBER_ID");
        GroupChat groupChat= GroupChatManage.getInstance().get(groupId);
        if(groupChat!=null){
            groupChat.removeNumber(numberId);
            groupChatNumberService.deleteNumber(groupId,numberId);
            chatRoomService.delete(numberId,2,groupId);
        }
        return new Result<>();
    }

}
