package com.thread;

import com.common.MessageType;
import com.common.manage.MessageManage;
import com.common.manage.UserManage;
import com.model.SendMessage;
import com.model.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Date;
import java.util.List;

/**
 * 保持与客户端连接线程
 * */
public class KeepAliveThread implements Runnable{
    private static Logger log = LoggerFactory.getLogger(KeepAliveThread.class);
	public void run() {
        Thread.currentThread().setName("Keep-Alive");
		try {
			List<User> list = UserManage.getInstance().getOnLineUser();
			if(list!=null&&!list.isEmpty()) {
				for(User user:list) {
					SendMessage sendMessage = new SendMessage();
					sendMessage.setClient(user.getWebClient());
	    			sendMessage.setMessageType(MessageType.KEEP_ALIVE);
	    			sendMessage.setDate(new Date());
	    			MessageManage.getInstance().send(sendMessage);
	    			log.debug("发送心跳 给用户{}({})",user.getUserName(),user.getUserId());
				}
			}
		} catch (Exception e) {
		    e.printStackTrace();
		}
	}
}
