package com.common.manage;

import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;

import com.model.SendMessage;
/**
 * 发送给客户端消息管理类
 * 
 * SendMessageToClientThread.java 线程处理队列中的消息 
 * */
public class MessageManage {
	
	private volatile static MessageManage instance = null;
	
	/**客户端消息队列*/
	private static BlockingQueue<SendMessage> queue=new ArrayBlockingQueue<SendMessage>(10000);
	
	private MessageManage(){}
	
	public static MessageManage getInstance() { 
		if (instance== null)  {
			synchronized (MessageManage.class) {
				if (instance== null)  {
					instance= new MessageManage();
				}
			}
		}
		return instance; 
	}
	
	public void send(SendMessage message) {
		queue.add(message);
	}
	
	public BlockingQueue<SendMessage> getQueue() {
		return queue;
	}
}
