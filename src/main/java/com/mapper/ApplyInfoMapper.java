package com.mapper;

import com.model.ApplyInfo;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplyInfoMapper {
	List<ApplyInfo> qryByUserId(String userId);
	void insert(ApplyInfo applyInfo);
	ApplyInfo qryByApplyId(int applyId);
	void update(ApplyInfo applyInfo);
}
