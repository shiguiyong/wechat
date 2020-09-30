package com.common.manage;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import com.model.GroupChat;
/**
 * 群聊天管理啊
 * */
public class GroupChatManage {
	
	private volatile static GroupChatManage instance = null;
	
	private static Map<String,GroupChat> cache=new ConcurrentHashMap<String, GroupChat>(10000);
	
	private GroupChatManage(){}
	
	public static GroupChatManage getInstance() { 
		if (instance== null)  {
			synchronized (GroupChatManage.class) {
				if (instance== null)  {
					instance= new GroupChatManage();
				}
			}
		}
		return instance; 
	}
	
	public void add(GroupChat groupChat) {
		if(!cache.containsKey(groupChat.getGroupId())) {
			cache.put(groupChat.getGroupId(), groupChat);
		}
	}
	
	public GroupChat get(String groupId) {
		return cache.get(groupId);
	}

}
