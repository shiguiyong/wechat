package com.service;

import com.common.util.StringUtils;
import com.mapper.FriendMapper;
import com.model.Friend;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class FriendService {

	@Resource
	private FriendMapper friendMapper;
	/**
	 * 根据用户ID查询好友列表
	 * */
	public List<Friend> qryByUserId(String userId){
		return friendMapper.qryByUserId(userId);
	}
	/**
	 * 插入一条好友记录
	 * */
	public void insert(Friend friend){
		friendMapper.insert(friend);
	}
	/**
	 * 判断 friendId 是否是 userId 用户的好友
	 * */
	public boolean isFriend(String userId,String friendId){
		return friendMapper.isFriend(userId,friendId);
	}
	/**
	 * 根据用户ID 查询所有好友的备注信息
	 * */
	public Map<String,String> qryRemarkByUserId(String userId){
		List<Friend> friendList=friendMapper.qryRemarkByUserId(userId);
		if (friendList!=null&&!friendList.isEmpty()){
			Map<String,String> map=new HashMap<>(friendList.size());
			friendList.forEach(friend -> {
                if(StringUtils.isNotEmpty(friend.getRemarkName())){
                    map.put(friend.getFriendId(),friend.getRemarkName());
                }
            });
			return map;
		}
		return null;
	}
	/**
	 * 更新好友记录
	 * */
	public void update(Friend friend){
		friendMapper.update(friend);
	}
	public Friend qryByUserIdAndFriendId(String userId,String friendId){
		return friendMapper.qryByUserIdAndFriendId(userId,friendId);
	}
	public void delete(String userId,String friendId){
        friendMapper.delete(userId,friendId);
    }

}
