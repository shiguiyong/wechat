package com.common.manage;

import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;

import com.model.ChatMessage;

/**
 * 聊天消息管理类
 * 
 * DealChatMessageThread.java 线程处理队列中的消息 
 * */
public class ChatMessageManage {
	private volatile static ChatMessageManage instance = null;
	/**聊天消息队列*/
	private static BlockingQueue<ChatMessage> queue=new ArrayBlockingQueue<ChatMessage>(10000);
	private ChatMessageManage(){}
	public static ChatMessageManage getInstance() { 
		if (instance== null)  {
			synchronized (ChatMessageManage.class) {
				if (instance== null)  {
					instance= new ChatMessageManage();
				}
			}
		}
		return instance; 
	}
	public void add(ChatMessage message) {
		queue.add(message);
	}
	public BlockingQueue<ChatMessage> getQueue() {
		return queue;
	}
}
