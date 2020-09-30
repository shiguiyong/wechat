package com.controller;

import com.alibaba.fastjson.JSONObject;
import com.common.DateConst;
import com.common.Result;
import com.common.http.IMChatRequest;
import com.common.manage.ChatMessageManage;
import com.common.manage.UserManage;
import com.common.util.DateUtils;
import com.model.ChatMessage;
import com.model.SendMessage;
import com.model.UnreadMessage;
import com.model.User;
import com.service.UnreadMessageService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;
import java.util.Date;
import java.util.List;

/**读取未读消息*/
@RestController
public class UnreadMessageController {
    @Resource
    private UnreadMessageService unreadMessageService;

    @RequestMapping(value = "/unreadMessage",method= RequestMethod.POST, produces = { "application/json;charset=UTF-8" })
    public Result<User> unreadMessage(IMChatRequest request, HttpServletResponse response) throws Exception {
        String userId = request.getString("USER_ID");
        String dateTime = DateUtils.parseDateToStr(new Date(), DateConst.DATE_TIME_FORMAT_YYYY_MM_DD_HH_MI_SS_SSS);
        List<UnreadMessage> unreadMessageList = unreadMessageService.qryList(userId,dateTime);
        if(unreadMessageList!=null&&!unreadMessageList.isEmpty()){
            User user= UserManage.getInstance().get(userId);
            if(user!=null){
                for (UnreadMessage message:unreadMessageList){
                    SendMessage sendMessage = new SendMessage();
                    sendMessage.decode(JSONObject.parseObject(message.getMessageContent()));
                    if(user.isOnLine()){
                        user.send(sendMessage);
                        //封装聊天消息 发送个聊天消息管理器
                        ChatMessage chatMessage=new ChatMessage();
                        chatMessage.setMessageId(message.getMessageId());
                        chatMessage.setUserId(userId);
                        chatMessage.setChatType(sendMessage.getChatType());
                        if(sendMessage.getChatType()==1) {
                            chatMessage.setChatId(sendMessage.getSendId());
                        }else if(sendMessage.getChatType()==2){
                            chatMessage.setChatId(sendMessage.getReceiveId());
                        }
                        chatMessage.setSendId(sendMessage.getSendId());
                        chatMessage.setChatDate(sendMessage.getDate());
                        chatMessage.setContentType(sendMessage.getContentType());
                        chatMessage.setChatContent(sendMessage.getChatContent());
                        ChatMessageManage.getInstance().add(chatMessage);
                        unreadMessageService.delById(message.getMessageId());
                    }
                }
            }
        }
        return new Result<>();
    }
    
}
