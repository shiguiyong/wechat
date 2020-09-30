package com.service;

import com.mapper.IdPoolMapper;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

@Service
public class IdPoolService {

	@Resource
	private IdPoolMapper userIdPoolMapper;
	
	public List<String> random(int size){
		return userIdPoolMapper.random(size);
	}
	
	public void update(String id){
		userIdPoolMapper.update(id);
	}
	
	public void delete() {
		userIdPoolMapper.delete();
	}
	
	public int count() {
		return userIdPoolMapper.count();
	}

	public boolean exist(String id) {
		return userIdPoolMapper.exist(id);
	}
	
	public void insertBatch(List<String> list) {
		userIdPoolMapper.insertBatch(list);
	}
	
}
