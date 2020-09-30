package com.thread;

import com.common.manage.RegionManage;
import com.common.manage.UserManage;
import com.model.User;
import com.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * *加载用户信息到内存中
 * */
public class LoadingUserToCacheThread implements Runnable{
	
	private Logger log = LoggerFactory.getLogger(LoadingUserToCacheThread.class);
	
	private UserService userService;
	
	public void run() {
		log.info("**加载用户到内存中**");
		/**每页数据*/
		int limit=10;
		int len=userService.size();
		
		int pageTotalNum=len%limit==0?len/limit:((int)(len/limit)+1);
		Map<String, Object> m=new HashMap<String, Object>();
		m.put("LIMIT", limit);
		for(int i=1;i<=pageTotalNum;i++) {
			m.put("OFFSET", (i-1)*limit);
			List<User> list = userService.page(m);
			if(list!=null&&!list.isEmpty()) {
				for(User user:list) {
					String regionName=RegionManage.getInstance().getRegionName(user.getRegionCode());
					user.setRegionName(regionName);
					user.setUserState(0);
					user.setOnLine(Boolean.FALSE);
					UserManage.getInstance().add(user);
					log.info("添加 {} 用户( {} , {} )到缓存中",regionName,user.getUserId(),user.getUserName());
				}
			}
		}
	}

	public UserService getUserService() {
		return userService;
	}

	public void setUserService(UserService userService) {
		this.userService = userService;
	}

}
