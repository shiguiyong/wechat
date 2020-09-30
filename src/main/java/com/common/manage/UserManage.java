package com.common.manage;

import com.model.User;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * * 用户管理
 * * 缓存所有的用户
 * */
public class UserManage {
	
	private volatile static UserManage instance = null;
	
	private static Map<String,User> cache=new ConcurrentHashMap<>(10000);
	
	private UserManage(){}
	
	public static UserManage getInstance() { 
		if (instance== null)  {
			synchronized (UserManage.class) {
				if (instance== null)  {
					instance= new UserManage();
				}
			}
		}
		return instance; 
	}
	
	public void add(User user) {
		if(!cache.containsKey(user.getUserId())) {
			cache.put(user.getUserId(), user);
		}
	}
	/**
	 * 根据用户ID获取用户
	 * */
	public User get(String userId) {
		return cache.get(userId);
	}
	
	public int size() {
		return cache.size();
	}
	public List<User> getAllUser() {
		List<User> list=new ArrayList<User>(cache.size());
		for(Map.Entry<String,User> entry:cache.entrySet()) {
			User user=entry.getValue();
			list.add(user);
		}
		return list;
	}
	/**
	 * 获取在线用户
	 * */
	public List<User> getOnLineUser() {
		List<User> list=new ArrayList<User>(cache.size());
		for(Map.Entry<String,User> entry:cache.entrySet()) {
			User user=entry.getValue();
			if(user.isOnLine()) {
				list.add(user);
			}
		}
		return list;
	}
    /**在线用户数量*/
    public int getOnLineUserNum() {
        int count=0;
        for(Map.Entry<String,User> entry:cache.entrySet()) {
            User user=entry.getValue();
            if(user.isOnLine()) {
                count++;
            }
        }
        return count;
    }
    /**所有用户数量*/
    public int getUserNum() {
        return cache.size();
    }
	
	public void close(){
		for(Map.Entry<String,User> entry:cache.entrySet()) {
			User user=entry.getValue();
			if(user.isOnLine()) {
				user.getWebClient().close();
			}
		}
	}
}
