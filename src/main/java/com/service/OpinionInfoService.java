package com.service;

import com.mapper.OpinionInfoMapper;
import com.model.OpinionInfo;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;

@Service
public class OpinionInfoService {
    @Resource
    private OpinionInfoMapper opinionInfoMapper;

    public void insert(OpinionInfo info){
        opinionInfoMapper.insert(info);
    }
    
}
