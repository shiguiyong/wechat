package com.mapper;

import com.model.User;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface UserMapper {
	void insert(User user);
	User qryByUserId(String userId);
	User qryImgByUserId(String userId);
	boolean exist(String userId);
	Integer size();
	List<User> page(Map<String, Object> m);
	Integer searchCount(Map<String, Object> m);
	List<String> search(Map<String, Object> m);
    void update(User user);
    void updatePWD(User user);
    void updateState(User user);
    void updateRole(User user);
}
