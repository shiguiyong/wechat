package com.thread;

import com.alibaba.fastjson.JSONObject;
import com.common.manage.ChatMessageManage;
import com.common.manage.ChatMonitorClientManage;
import com.common.manage.GroupChatManage;
import com.common.manage.UserManage;
import com.model.ChatMessage;
import com.model.ChatMonitorClient;
import com.model.GroupChat;
import com.model.User;
import com.service.ChatMessageService;
import com.service.ChatRoomService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Iterator;
import java.util.Map;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.TimeUnit;

/**
 *  聊天消息管理线程
 *  	1.将聊天消息存储到数据库 聊天消息表<CHAT_MESSAGE>表中
 *      2.聊天消息发送给监控客户端
 *      
 *   从 ChatMessageManage.java 中获取queue 获取聊天消息
 * */
public class DealChatMessageThread implements Runnable{
	
	private Logger log = LoggerFactory.getLogger(DealChatMessageThread.class);
	
	private String threadNum;
	
	private ChatMessageService chatMessageService;
	
	private ChatRoomService chatRoomService;

	public void run() {
		Thread.currentThread().setName(threadNum);
		BlockingQueue<ChatMessage> queue = ChatMessageManage.getInstance().getQueue();
		try {
			while (true) {
				ChatMessage message = queue.poll(1000, TimeUnit.MILLISECONDS);
				if(message!=null) {
					save(message);
                    updateChatRoom(message);
					sendToMonitorClient(message);
				}
				Thread.sleep(1);
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			log.info("DealChatMessageThread 线程结束");
		}
	}
	
	/**1.将聊天消息存储到数据库 聊天消息表<CHAT_MESSAGE>表中*/
	private void save(ChatMessage message) {
		chatMessageService.insert(message);
	}
    /**2.将最近聊天消息更新到 聊天房间表<CHAT_ROOM>表中*/
	private void updateChatRoom(ChatMessage message){
        chatRoomService.updateChatDate(message.getUserId(),message.getChatType(),message.getChatId(),message.getChatDate());
    }
	
	/**3.聊天消息发送给监控客户端*/
	private void sendToMonitorClient(ChatMessage message) {
	    if(message.getUserId().equals(message.getSendId())){
            JSONObject json=message.encode();

            User user=UserManage.getInstance().get(message.getUserId());
            if(user!=null){
                json.put("USER_NAME",user.getUserName());
            }
            if(message.getChatType()==1){
                User chatUser=UserManage.getInstance().get(message.getChatId());
                if(chatUser!=null){
                    json.put("CHAT_NAME",chatUser.getUserName());
                }
            }else if(message.getChatType()==2){
                GroupChat groupChat=GroupChatManage.getInstance().get(message.getChatId());
                if(groupChat!=null){
                    json.put("CHAT_NAME",groupChat.getGroupName());
                }
            }
            
            Map<String, ChatMonitorClient> cache = ChatMonitorClientManage.getInstance().getCache();
            Iterator<Map.Entry<String, ChatMonitorClient>> it = cache.entrySet().iterator();
            while(it.hasNext()){
                Map.Entry<String, ChatMonitorClient> entry = it.next();
                ChatMonitorClient client=entry.getValue();
                client.send(json.toJSONString());
            }
        }
	}

	public String getThreadNum() {
		return threadNum;
	}

	public void setThreadNum(String threadNum) {
		this.threadNum = threadNum;
	}

	public ChatMessageService getChatMessageService() {
		return chatMessageService;
	}

	public void setChatMessageService(ChatMessageService chatMessageService) {
		this.chatMessageService = chatMessageService;
	}

    public void setChatRoomService(ChatRoomService chatRoomService) {
        this.chatRoomService = chatRoomService;
    }
}
