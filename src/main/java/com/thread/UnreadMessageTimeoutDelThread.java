package com.thread;

import com.common.DateConst;
import com.common.manage.ServerConfigManage;
import com.common.util.DateUtils;
import com.service.UnreadMessageService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Date;

/**
 * 未读消息超过指定时间，从系统中删除线程
 * */
public class UnreadMessageTimeoutDelThread implements Runnable{
    private static Logger log = LoggerFactory.getLogger(UnreadMessageTimeoutDelThread.class);
    private UnreadMessageService unreadMessageService;
    @Override
    public void run() {
        Thread.currentThread().setName("Unread-Message-TimeOut-Del");
        try{
            int hour=ServerConfigManage.getInstance().getUnreadMessageTimeOut();
            String dateTime= DateUtils.getForwardHours(new Date(), -hour, DateConst.DATE_TIME_FORMAT_YYYY_MM_DD_HH_MI_SS_SSS);
            unreadMessageService.timeOut(dateTime);
        }catch (Exception e){
            log.error(e.getMessage(),e);
        }
    }

    public UnreadMessageService getUnreadMessageService() {
        return unreadMessageService;
    }

    public void setUnreadMessageService(UnreadMessageService unreadMessageService) {
        this.unreadMessageService = unreadMessageService;
    }
}
