package com.mapper;

import com.model.GroupChatNumber;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface GroupChatNumberMapper {

	void insert(GroupChatNumber number);

	void insertBatch(List<GroupChatNumber> numbers);
	
	List<GroupChatNumber> qryByGroupId(String groupId);
	
	List<Map<String, Object>> qryHeadImgByGroupId(String groupId);

    void deleteNumber(@Param("GROUP_ID") String groupId, @Param("NUMBER_ID") String numberId);

}
