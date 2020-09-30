package com.thread;

import com.common.manage.ThreadManage;
import com.service.GroupChatService;
import com.service.IdPoolService;
import com.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;

/**
 * ID生成线程
 * */
public class IdGenerateThread implements Runnable{
	
	private static Logger log = LoggerFactory.getLogger(IdGenerateThread.class);

	private IdPoolService idPoolService;
	
	private UserService userService;
	
	private GroupChatService groupChatService;

	public void run() {
		log.info("启动生成号码线程");
		try {
			Random random = new Random();
			Set<String> set=new HashSet<String>(100);
			for (int i = 0; i <= 100; i++){
				set.add(String.valueOf(100000+random.nextInt(99999)));
			}
			/**验证号码是否已经存在*/
			List<String> list =new ArrayList<String>(100);
			for(String id:set) {
				if(!idPoolService.exist(id)&&!userService.exist(id)&&!groupChatService.exist(id)) {
					list.add(id);
				}
			}
			if(!list.isEmpty()) {
				idPoolService.insertBatch(list);
			}
			list.clear();
			set.clear();
			ThreadManage.getInstance().finish(this);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public IdPoolService getIdPoolService() {
		return idPoolService;
	}

	public void setIdPoolService(IdPoolService userIdPoolService) {
		this.idPoolService = userIdPoolService;
	}

	public UserService getUserService() {
		return userService;
	}

	public void setUserService(UserService userService) {
		this.userService = userService;
	}

	public GroupChatService getGroupChatService() {
		return groupChatService;
	}

	public void setGroupChatService(GroupChatService groupChatService) {
		this.groupChatService = groupChatService;
	}
}
