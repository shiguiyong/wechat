package com.service;

import com.mapper.ApplyInfoMapper;
import com.model.ApplyInfo;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

@Service
public class ApplyInfoService {
	
	@Resource
	private ApplyInfoMapper applyInfoMapper;
	
	public List<ApplyInfo> qryByUserId(String userId) {
		return applyInfoMapper.qryByUserId(userId);
	}
	
	public void insert(ApplyInfo applyInfo){
		applyInfoMapper.insert(applyInfo);
	}
	
	public ApplyInfo qryByApplyId(int applyId){
		return applyInfoMapper.qryByApplyId(applyId);
	}

	public void update(ApplyInfo applyInfo){
		applyInfoMapper.update(applyInfo);
	}

}
