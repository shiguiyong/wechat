package com.thread;

import com.common.manage.ThreadManage;
import com.common.pool.IdPool;
import com.common.util.SpringUtil;
import com.service.GroupChatService;
import com.service.IdPoolService;
import com.service.UserService;

import java.util.List;

/**
 * *从ID_POOL随机获取数据添加到 com.common.pool.IdPool池中
 * *当ID_POOL 表中号码不足时 自动启动IdGenerateThread 线程生成号码到ID_POOL表中
 * */
public class GetIdPoolThread implements Runnable{
	
	private static int POOL_SIZE=20;
	
	private IdPoolService idPoolService;
	
	private UserService userService;

	private GroupChatService groupChatService;
	
	public void run() {
		Thread.currentThread().setName("GetUserIdPoolThread");
		while (true) {
			try {
				List<String> random = idPoolService.random(POOL_SIZE);
				if(random!=null&&!random.isEmpty()) {
					for(String id:random) {
						/**
						 * ID_POOL 修改状态  标记为待使用
						 * */
						idPoolService.update(id);
						IdPool.getInstance().put(id);
					}
				}
				if(IdPool.getInstance().getQueue().remainingCapacity()>0) {
					/**查询总数*/
					int count = idPoolService.count();
					if(POOL_SIZE>count) {
						IdGenerateThread thread = new IdGenerateThread();
						thread.setIdPoolService(idPoolService);
						thread.setUserService(userService);
						thread.setGroupChatService(groupChatService);
						ThreadManage.getInstance().submit(thread);
					}
				}
				Thread.sleep(1);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}

	public IdPoolService getIdPoolService() {
		return idPoolService;
	}

	public void setIdPoolService(IdPoolService idPoolService) {
		this.idPoolService = idPoolService;
	}

	public void setUserService(UserService userService) {
		this.userService = userService;
	}

	public void setGroupChatService(GroupChatService groupChatService) {
		this.groupChatService = groupChatService;
	}
}
