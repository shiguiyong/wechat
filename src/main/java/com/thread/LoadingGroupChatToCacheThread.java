package com.thread;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Vector;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.common.manage.GroupChatManage;
import com.model.GroupChat;
import com.model.GroupChatNumber;
import com.service.GroupChatNumberService;
import com.service.GroupChatService;

/**
  *   加载聊天群信息到内存中
 * */
public class LoadingGroupChatToCacheThread implements Runnable{
	
	private Logger log = LoggerFactory.getLogger(LoadingGroupChatToCacheThread.class);
	
	private GroupChatService groupChatService;
	
	private GroupChatNumberService groupChatNumberService;

	@Override
	public void run() {
		log.info("**加载聊天群到内存中**");
		/**每页数据*/
		int limit=10;
		int len=groupChatService.size();
		
		int pageTotalNum=len%limit==0?len/limit:((int)(len/limit)+1);
		Map<String, Object> m=new HashMap<String, Object>();
		m.put("LIMIT", limit);
		for(int i=1;i<=pageTotalNum;i++) {
			m.put("OFFSET", (i-1)*limit);
			List<GroupChat> list = groupChatService.page(m);
			if(list!=null&&!list.isEmpty()) {
				for(GroupChat groupChat:list) {
					List<GroupChatNumber> numbers = groupChatNumberService.qryByGroupId(groupChat.getGroupId());
					groupChat.setNumbers(new Vector<GroupChatNumber>(numbers));
					GroupChatManage.getInstance().add(groupChat);
					log.info("添加聊天群( {} , {} )到缓存中",groupChat.getGroupId(),groupChat.getGroupName());
				}
			}
		}
	}

	public GroupChatService getGroupChatService() {
		return groupChatService;
	}

	public void setGroupChatService(GroupChatService groupChatService) {
		this.groupChatService = groupChatService;
	}

	public GroupChatNumberService getGroupChatNumberService() {
		return groupChatNumberService;
	}

	public void setGroupChatNumberService(GroupChatNumberService groupChatNumberService) {
		this.groupChatNumberService = groupChatNumberService;
	}
	
	
}
