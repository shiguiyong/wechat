package com.controller;

import com.common.Result;
import com.common.http.IMChatRequest;
import com.common.manage.GroupChatManage;
import com.common.manage.UserManage;
import com.model.ChatRoom;
import com.model.GroupChat;
import com.model.User;
import com.service.ChatRoomService;
import com.service.FriendService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * 聊天室 管理
 * */
@RestController
public class ChatRoomController {
	
	private static Logger log = LoggerFactory.getLogger(ChatRoomController.class);

	@Resource
	private ChatRoomService chatRoomService;
	@Resource
	private FriendService friendService;
	
	@RequestMapping(value = "/chatroom/list",method=RequestMethod.POST, produces = { "application/json;charset=UTF-8" })
	public Result<ChatRoom> list(IMChatRequest request, HttpServletResponse response) throws Exception {
		String userId=request.getString("USER_ID");
		log.info("查询用户({})的群组列表", userId);
		List<ChatRoom> chatRooms = chatRoomService.qryByUserId(userId);
		if(chatRooms!=null&&!chatRooms.isEmpty()) {
			//查询好友的备注
			Map<String,String> remark= friendService.qryRemarkByUserId(userId);
			chatRooms.forEach(chatRoom -> {
				if(chatRoom.getChatType()==1){
					User user=UserManage.getInstance().get(chatRoom.getChatId());
					if(user!=null){
						chatRoom.setRoomName(user.getUserName());
					}
					if(remark!=null&&remark.containsKey(chatRoom.getChatId())){
						chatRoom.setRoomName(remark.get(chatRoom.getChatId()));
					}
				}else if (chatRoom.getChatType()==2){
					GroupChat groupChat=GroupChatManage.getInstance().get(chatRoom.getChatId());
					if(groupChat!=null){
						chatRoom.setRoomName(groupChat.getGroupName());
					}
				}
				
			});
		}
		Collections.sort(chatRooms);  
		return new Result<ChatRoom>(chatRooms);
	}
	/**
	 * 创建聊天房间
	 * */
	@RequestMapping(value = "/chatroom/create",method=RequestMethod.POST, produces = { "application/json;charset=UTF-8" })
	public Result<ChatRoom> create(IMChatRequest request, HttpServletResponse response) throws Exception {
		String userId=request.getString("USER_ID");
		int chatType=request.getInteger("CHAT_TYPE");
		String chatId=request.getString("CHAT_ID");
		ChatRoom chatRoom = chatRoomService.qryByUserIdAndChatId(userId, chatType, chatId);
		if(chatRoom==null) {
			chatRoom=new ChatRoom();
			chatRoom.setUserId(userId);
			chatRoom.setChatType(chatType);
			chatRoom.setChatId(chatId);
			chatRoom.setCreateDate(new Date());
			chatRoom.setStickSign(0);
			chatRoom.setSortIndex(0);
			chatRoom.setLastChatDate(new Date());
			chatRoom.setRoomName("");
			if(chatType==1) {
				User user = UserManage.getInstance().get(chatId);
				if(user!=null) {
					chatRoom.setRoomName(user.getUserName());
				}
			}else if(chatType==2){
				GroupChat chat=GroupChatManage.getInstance().get(chatId);
				if(chat!=null) {
					chatRoom.setRoomName(chat.getGroupName());
				}
			}
			chatRoomService.insert(chatRoom);
		}
		return new Result<ChatRoom>(chatRoom);
	}
    /**
     * 聊天房间置顶 或者 取消置顶
     * */
    @RequestMapping(value = "/chatroom/stickSign",method=RequestMethod.POST, produces = { "application/json;charset=UTF-8" })
    public Result<ChatRoom> stickSign(IMChatRequest request, HttpServletResponse response) throws Exception {
        String userId = request.getString("USER_ID");
        int chatType = request.getInteger("CHAT_TYPE");
        String chatId = request.getString("CHAT_ID");
	    int stickSign = request.getInteger("STICK_SIGN");
        ChatRoom chatRoom = chatRoomService.qryByUserIdAndChatId(userId, chatType, chatId);
        if(chatRoom!=null) {
            chatRoom.setStickSign(stickSign);
            if(stickSign==1){
                int sortIndex=chatRoomService.qryMaxSortIndex(userId);
                chatRoom.setSortIndex(sortIndex+1);
            }else{
                chatRoom.setSortIndex(0);
            }
            chatRoomService.updateStickSign(userId, chatType, chatId,chatRoom.getStickSign(),chatRoom.getSortIndex());
            return new Result<>(chatRoom);
        }
	    return new Result<>();
    }
    /**
     * 删除聊天
     * */
    @RequestMapping(value = "/chatroom/delete",method=RequestMethod.POST, produces = { "application/json;charset=UTF-8" })
    public Result<ChatRoom> delete(IMChatRequest request, HttpServletResponse response) throws Exception {
        String userId = request.getString("USER_ID");
        int chatType = request.getInteger("CHAT_TYPE");
        String chatId = request.getString("CHAT_ID");
        chatRoomService.delete(userId,chatType,chatId);
        return new Result<>();
    }

}
