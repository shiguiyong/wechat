package com.thread;

import com.common.MessageType;
import com.common.manage.*;
import com.model.*;
import com.service.UnreadMessageService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Vector;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.TimeUnit;
/**
 *  服务器发送消息给客户端线程
 *   从 MessageManage 中获取queue 获取发送消息
 * */
public class SendMessageToClientThread implements Runnable{
	
	private Logger log = LoggerFactory.getLogger(SendMessageToClientThread.class);

	private UnreadMessageService unreadMessageService;
	
	private String threadNum;

	public void run() {
		Thread.currentThread().setName(threadNum);
		BlockingQueue<SendMessage> queue = MessageManage.getInstance().getQueue();
		try {
			while (true) {
				SendMessage message = queue.poll(1000, TimeUnit.MILLISECONDS);
				if(message!=null) {
					deal(message);
				}
				Thread.sleep(1);
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			log.info("SendMessageToClientThread 线程结束");
		}
	}
	
	private void deal(SendMessage message) {
		int messageType = message.getMessageType();
		switch (messageType) {
			case MessageType.KEEP_ALIVE://心跳消息
				message.getClient().send(message);
				break;
			case MessageType.MESSAGE_CHAT://聊天消息
				this.dealMessageChat(message);
				break;
			case MessageType.MESSAGE_FRIENT_ADD:
			case MessageType.MESSAGE_FRIENT_APPLEY:
            case MessageType.MESSAGE_FRIENT_DELETE:
				this.defaultDeal(message);
				break;
			default:
				
				break;
		}
	}
	/**默认消息处理*/
	private void defaultDeal(SendMessage message){
		String receiveId = message.getReceiveId();
		User user=UserManage.getInstance().get(receiveId);
		if(user.isOnLine()) {
			user.send(message);
		}
	}
	/**
	 *   处理聊天消息
	 * */
	private void dealMessageChat(SendMessage message) {
		String receiveId = message.getReceiveId();
		if(message.getChatType()==1) {//普通聊天
			this.sendMessage(receiveId, message);
		} else if(message.getChatType()==2) {//群聊天
			GroupChat groupChat = GroupChatManage.getInstance().get(receiveId);
			if(groupChat!=null) {
                String sendId = message.getSendId();
				Vector<GroupChatNumber> numbers = groupChat.getNumbers();
				for(GroupChatNumber number:numbers) {
					if(number.getNumberId().equals(sendId)) {
						continue;
					}
					this.sendMessage(number.getNumberId(), message);
				}
			}
		}
	}
	
	private void sendMessage(String userId,SendMessage message) {
		User user=UserManage.getInstance().get(userId);
		if(user.isOnLine()) {
			user.send(message);
            //封装聊天消息 发送个聊天消息管理器
            ChatMessage chatMessage=new ChatMessage();
            chatMessage.setMessageId(IdGenerateManage.getInstance().nextId());
            chatMessage.setUserId(userId);
            chatMessage.setChatType(message.getChatType());
            if(message.getChatType()==1) {
                chatMessage.setChatId(message.getSendId());
            }else if(message.getChatType()==2){
                chatMessage.setChatId(message.getReceiveId());
            }
            chatMessage.setSendId(message.getSendId());
            chatMessage.setChatDate(message.getDate());
            chatMessage.setContentType(message.getContentType());
            chatMessage.setChatContent(message.getChatContent());
            ChatMessageManage.getInstance().add(chatMessage);
		}else {
			//将聊天消息插入未读消息表中
			UnreadMessage unreadMessage = new UnreadMessage();
            unreadMessage.setMessageId(IdGenerateManage.getInstance().nextId());
            unreadMessage.setUserId(userId);
			unreadMessage.setMessageDate(message.getDate());
			unreadMessage.setMessageContent(message.toJSONString());
			unreadMessageService.insert(unreadMessage);
		}
	}
	public String getThreadNum() {
		return threadNum;
	}
	public void setThreadNum(String threadNum) {
		this.threadNum = threadNum;
	}
    public UnreadMessageService getUnreadMessageService() {
        return unreadMessageService;
    }
    public void setUnreadMessageService(UnreadMessageService unreadMessageService) {
        this.unreadMessageService = unreadMessageService;
    }
}
