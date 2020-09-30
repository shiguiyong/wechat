package com.mapper;

import com.model.ChatRoom;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface ChatRoomMapper {
	int insert(ChatRoom chatRoom);
	List<ChatRoom> qryByUserId(String userId);
	List<ChatRoom> qryGroupChatRoomByUserId(String userId);
	ChatRoom qryByUserIdAndChatId(@Param("USER_ID") String userId, 
                                  @Param("CHAT_TYPE")Integer chatType,
                                  @Param("CHAT_ID")String chatId);
    int qryMaxSortIndex(@Param("USER_ID") String userId);
    void updateStickSign(@Param("USER_ID") String userId, 
                         @Param("CHAT_TYPE") Integer chatType,
                         @Param("CHAT_ID") String chatId,
                         @Param("STICK_SIGN") int stickSign,
                         @Param("SORT_INDEX") int sortIndex);
    void delete(@Param("USER_ID") String userId,
                @Param("CHAT_TYPE") Integer chatType,
                @Param("CHAT_ID") String chatId);
    void updateChatDate(@Param("USER_ID") String userId,
                        @Param("CHAT_TYPE") Integer chatType,
                        @Param("CHAT_ID") String chatId,
                        @Param("LAST_CHAT_DATE") Date lastChatDate);
}
