package com.service;

import com.mapper.UnreadMessageMapper;
import com.model.UnreadMessage;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

@Service
public class UnreadMessageService {
    @Resource
    private UnreadMessageMapper unreadMessageMapper;

    public void insert(UnreadMessage message){
        unreadMessageMapper.insert(message);
    }
    
    public void timeOut(String dateTime){
        unreadMessageMapper.timeOut(dateTime);
    }
    
    public List<UnreadMessage> qryList(String userId,String messageDate){
        return unreadMessageMapper.qryList(userId,messageDate);
    }

    public void delById(String messageId){
        unreadMessageMapper.delById(messageId);
    }
}
