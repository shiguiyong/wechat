package com.controller;

import com.alibaba.fastjson.JSONObject;
import com.common.MessageType;
import com.common.Result;
import com.common.http.IMChatRequest;
import com.common.manage.GroupChatManage;
import com.common.manage.IdGenerateManage;
import com.common.manage.MessageManage;
import com.common.manage.UserManage;
import com.model.ApplyInfo;
import com.model.Friend;
import com.model.GroupChat;
import com.model.SendMessage;
import com.model.User;
import com.service.ApplyInfoService;
import com.service.FriendService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;
import java.util.Date;
import java.util.List;
/**
 * 申请信息管理
 * */
@RestController
public class ApplyInfoController {
    
    private static Logger log = LoggerFactory.getLogger(ApplyInfoController.class);

    @Resource
    private ApplyInfoService applyInfoService;
    @Resource
    private FriendService friendService;
    /**
     * 获取用户申请列表
     * 入参 用户标识  USER_ID
     * 
     * */
    @RequestMapping(value = "/applyinfo/list",method= RequestMethod.POST, produces = { "application/json;charset=UTF-8" })
    public Result<ApplyInfo> list(IMChatRequest request, HttpServletResponse response) throws Exception {
        String userId=request.getString("USER_ID");
        log.info("查询用户({})的好友申请列表", userId);
        List<ApplyInfo> friendApplies = applyInfoService.qryByUserId(userId);
        if(friendApplies!=null&&!friendApplies.isEmpty()){
            friendApplies.forEach(applyInfo -> {
                applyInfo.analysis();
                User user= UserManage.getInstance().get(applyInfo.getApplyUserId());
                if(user!=null){
                    applyInfo.setApplyUserName(user.getUserName());
                }
                if(2==applyInfo.getApplyType()){
                    String groupId=applyInfo.get("GROUP_ID");
                    GroupChat groupChat=GroupChatManage.getInstance().get(groupId);
                    if(groupChat!=null){
                        applyInfo.put("GROUP_NAME",groupChat.getGroupName());
                    }
                }
            });
        }
        return new Result<>(friendApplies);
    }

    @RequestMapping(value = "/applyinfo/apply",method=RequestMethod.POST, produces = { "application/json;charset=UTF-8" })
    public String apply(IMChatRequest request, HttpServletResponse response) throws Exception {
        JSONObject result = new JSONObject();
        result.put("SUCCESS",true);
        ApplyInfo apply=new ApplyInfo();
        apply.decode(request.getJson());
        apply.setContent(new JSONObject());
        apply.setApplyState(0);
        apply.setApplyDate(new Date());
        apply.put("APPEND_MESSAGE",request.getString("APPEND_MESSAGE"));
        apply.setApplyContent(apply.getContent().toJSONString());
        applyInfoService.insert(apply);

        User user= UserManage.getInstance().get(apply.getApplyUserId());
        if(user!=null){
            apply.setApplyUserName(user.getUserName());
        }
        //通知客户端 添加好友消息
        SendMessage send = new SendMessage();
        send.setMessageId(IdGenerateManage.getInstance().nextId());
        send.setMessageType(MessageType.MESSAGE_FRIENT_APPLEY);
        send.setReceiveId(apply.getUserId());
        send.put("DATA",apply.encode());

        MessageManage.getInstance().send(send);
        return result.toJSONString();
    }

    @RequestMapping(value = "/applyinfo/deal",method=RequestMethod.POST, produces = { "application/json;charset=UTF-8" })
    public String deal(IMChatRequest request, HttpServletResponse response) throws Exception {
        int applyState=request.getInteger("APPLY_STATE");
        JSONObject result = new JSONObject();
        result.put("SUCCESS",true);
        ApplyInfo applyInfo= applyInfoService.qryByApplyId(request.getInteger("APPLY_ID"));
        if(applyInfo!=null){
            applyInfo.setApplyState(applyState);
            if(applyState==1){
                String userId=applyInfo.getUserId();
                String applyUserId=applyInfo.getApplyUserId();

                if(!friendService.isFriend(applyUserId,userId)){
                    Friend friend=new Friend();
                    friend.setUserId(applyUserId);
                    friend.setFriendId(userId);
                    friend.setRemarkName(null);
                    friend.setCreateDate(new Date());
                    friendService.insert(friend);
                    
                    //通知 申请好友客户端 更新好友列表
                    SendMessage send = new SendMessage();
                    send.setMessageId(IdGenerateManage.getInstance().nextId());
                    send.setMessageType(MessageType.MESSAGE_FRIENT_ADD);
                    send.setReceiveId(applyUserId);
                    send.setDate(new Date());

                    User user= UserManage.getInstance().get(userId);
                    if(user!=null){
                        friend.setFriendName(user.getUserName());
                        friend.setUserSex(user.getUserSex());
                        friend.setRegionCode(user.getRegionCode());
                        friend.setRegionName(user.getRegionName());
                        friend.setUserDes(user.getUserDes());
                        send.put("DATA",friend.encode());
                        MessageManage.getInstance().send(send);
                    }
                }

                if(!friendService.isFriend(userId,applyUserId)){
                    Friend applyFriend=new Friend();
                    applyFriend.setUserId(userId);
                    applyFriend.setFriendId(applyUserId);
                    applyFriend.setRemarkName(null);
                    applyFriend.setCreateDate(new Date());
                    friendService.insert(applyFriend);
                    User user= UserManage.getInstance().get(applyUserId);
                    //返回好友信息给客户端
                    if(user!=null){
                        applyFriend.setFriendName(user.getUserName());
                        applyFriend.setUserSex(user.getUserSex());
                        applyFriend.setRegionCode(user.getRegionCode());
                        applyFriend.setRegionName(user.getRegionName());
                        applyFriend.setUserDes(user.getUserDes());
                        result.put("DATA",applyFriend.encode());
                    }
                }
            }
            applyInfoService.update(applyInfo);
        }
        return result.toJSONString();
    }
}
