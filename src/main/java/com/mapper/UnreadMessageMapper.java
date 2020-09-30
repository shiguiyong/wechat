package com.mapper;

import com.model.UnreadMessage;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UnreadMessageMapper {
    void insert(UnreadMessage message);
    void timeOut(String dateTime);
    List<UnreadMessage> qryList(@Param("USER_ID") String userId, @Param("MESSAGE_DATE") String messageDate);
    void delById(String messageId);
}
