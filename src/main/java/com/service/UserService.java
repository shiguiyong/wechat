package com.service;

import com.mapper.UserMapper;
import com.model.User;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;
import java.util.Map;

@Service
public class UserService {
	@Resource
	private UserMapper userMapper;
	public void insert(User user) {
		userMapper.insert(user);
	}
	/**
	 * * 查询用户 不包含头像
	 * */
	public User qryByUserId(String userId) {
		return userMapper.qryByUserId(userId);
	}
	/**
	 * * 查询用户 包含头像信息
	 * */
	public User qryImgByUserId(String userId) {
		return userMapper.qryImgByUserId(userId);
	}
	/**
	 * *查询用户是否存在
	 * */
	public boolean exist(String userId) {
		return userMapper.exist(userId);
	}
	/**
	 * * 查询用户总数量
	 * */
	public Integer size() {
		return userMapper.size();
	}
	/**
	 * *分页查询用户
	 * */
	public List<User> page(Map<String, Object> m){
		return userMapper.page(m);
	}
	/**
	 * 根据条件检索用户 总数量
	 * */
	public Integer searchCount(Map<String, Object> m) { return userMapper.searchCount(m); }
	/**
	 * 根据条件检索用户
	 * */
	public List<String> search(Map<String, Object> m) { return userMapper.search(m); }
	
	public void update(User user){
        userMapper.update(user);
    }

    public void updatePWD(User user){
        userMapper.updatePWD(user);
    }

    public void updateState(User user){
        userMapper.updateState(user);
    }

    public void updateRole(User user){
        userMapper.updateRole(user);
    }
}
