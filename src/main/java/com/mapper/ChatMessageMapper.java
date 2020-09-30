package com.mapper;

import org.springframework.stereotype.Repository;

import com.model.ChatMessage;

@Repository
public interface ChatMessageMapper {
	
	void insert(ChatMessage message);

}
