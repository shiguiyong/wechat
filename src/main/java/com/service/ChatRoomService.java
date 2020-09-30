package com.service;

import com.mapper.ChatRoomMapper;
import com.model.ChatRoom;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.Date;
import java.util.List;

@Service
public class ChatRoomService {
	@Resource
	private ChatRoomMapper chatRoomMapper;
	public int insert(ChatRoom chatRoom) {
		return chatRoomMapper.insert(chatRoom);
	}
	/**
	 * * 查询聊天房间
	 * */
	public List<ChatRoom> qryByUserId(String userId){
		return chatRoomMapper.qryByUserId(userId);
	}
	public ChatRoom qryByUserIdAndChatId(String userId,Integer chatType,String chatId) {
		return chatRoomMapper.qryByUserIdAndChatId(userId,chatType,chatId);
	}
    /**查询最大置顶排序编码*/
    public int qryMaxSortIndex(String userId) {
        return chatRoomMapper.qryMaxSortIndex(userId);
    }
    /**
     * 跟新置顶状态
     * */
    public void updateStickSign(String userId,Integer chatType,String chatId,int stickSign,int sortIndex) {
        chatRoomMapper.updateStickSign(userId,chatType,chatId,stickSign,sortIndex);
    }
    /**
     * 删除聊天房间
     * */
    public void delete(String userId,Integer chatType,String chatId) {
        chatRoomMapper.delete(userId,chatType,chatId);
    }
    
    public void updateChatDate(String userId, Integer chatType, String chatId, Date lastChatDate){
        chatRoomMapper.updateChatDate(userId,chatType,chatId,lastChatDate);
    }
}
