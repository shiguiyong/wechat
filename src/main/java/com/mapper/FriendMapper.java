package com.mapper;

import com.model.Friend;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FriendMapper {
	List<Friend> qryByUserId(String userId);
	void insert(Friend friend);
	boolean isFriend(@Param("USER_ID")String userId, @Param("FRIEND_ID")String friendId);
	List<Friend> qryRemarkByUserId(String userId);
	void update(Friend friend);
	Friend qryByUserIdAndFriendId(@Param("USER_ID")String userId,@Param("FRIEND_ID")String friendId);
    void delete(@Param("USER_ID")String userId,@Param("FRIEND_ID")String friendId);
}
