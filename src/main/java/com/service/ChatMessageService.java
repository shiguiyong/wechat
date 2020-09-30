package com.service;

import com.mapper.ChatMessageMapper;
import com.model.ChatMessage;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;

@Service
public class ChatMessageService {

	@Resource
	private ChatMessageMapper chatMessageMapper;
	
	public void insert(ChatMessage message) {
		chatMessageMapper.insert(message);
	}

}
