package com.mapper;

import org.springframework.stereotype.Repository;

import com.model.ChatFile;

@Repository
public interface ChatFileMapper {
	void insert(ChatFile chatFile);
}
