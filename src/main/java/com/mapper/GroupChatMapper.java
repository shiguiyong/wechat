package com.mapper;

import com.model.GroupChat;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface GroupChatMapper {
	void insert(GroupChat groupChat);
	List<GroupChat> qryByUserId(String userId);
	GroupChat qryByGroupId(String groupId);
	Integer size();
	List<GroupChat> page(Map<String, Object> m);
	boolean exist(String groupId);
    void modifyGroupName(@Param("GROUP_ID") String groupId, @Param("GROUP_NAME") String groupName);
}
