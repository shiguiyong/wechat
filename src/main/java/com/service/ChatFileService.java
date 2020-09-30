package com.service;

import com.mapper.ChatFileMapper;
import com.model.ChatFile;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;

@Service
public class ChatFileService {

	@Resource
	private ChatFileMapper chatFileMapper;
	
	public void insert(ChatFile chatFile) {
		chatFileMapper.insert(chatFile);
	}

}
