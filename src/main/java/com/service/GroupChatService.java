package com.service;

import com.mapper.GroupChatMapper;
import com.model.GroupChat;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;
import java.util.Map;

@Service
public class GroupChatService {

	@Resource
	private GroupChatMapper groupChatMapper;
	
	public void insert(GroupChat groupChat){
		groupChatMapper.insert(groupChat);
	}
	
	/**
	 * *根据用户ID查询群列表
	 * */
	public List<GroupChat> qryByUserId(String userId){
		return groupChatMapper.qryByUserId(userId);
	}
	
	public GroupChat qryByGroupId(String groupId) {
		return groupChatMapper.qryByGroupId(groupId);
	}
	
	/**
	 * * 查询群总数量
	 * */
	public Integer size() {
		return groupChatMapper.size();
	}
	
	/**
	 * *分页查询用户
	 * */
	public List<GroupChat> page(Map<String, Object> m){
		return groupChatMapper.page(m);
	}

	public boolean exist(String groupId) {
		return groupChatMapper.exist(groupId);
	}
	
	public void modifyGroupName(String groupId,String groupName){
        groupChatMapper.modifyGroupName(groupId,groupName);
    }

}
