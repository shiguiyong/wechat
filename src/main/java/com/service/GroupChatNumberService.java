package com.service;

import com.mapper.GroupChatNumberMapper;
import com.model.GroupChatNumber;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;
import java.util.Map;

@Service
public class GroupChatNumberService {

	@Resource
	private GroupChatNumberMapper groupChatNumberMapper;

	public void insert(GroupChatNumber number){
		groupChatNumberMapper.insert(number);
	}
	public void insertBatch(List<GroupChatNumber> numbers){
		groupChatNumberMapper.insertBatch(numbers);
	}
	
	public List<GroupChatNumber> qryByGroupId(String groupId) {
		return groupChatNumberMapper.qryByGroupId(groupId);
	}
	
	public List<Map<String, Object>> qryHeadImgByGroupId(String groupId) {
		return groupChatNumberMapper.qryHeadImgByGroupId(groupId);
	}
	
	public void deleteNumber(String groupId,String numberId){
        groupChatNumberMapper.deleteNumber(groupId,numberId);
    }

}
