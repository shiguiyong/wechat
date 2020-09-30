package com.mapper;

import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IdPoolMapper {
	List<String> random(int size);
	void update(String id);
	void delete();
	int count();
	boolean exist(String id);
	void insertBatch(List<String> list);
}
