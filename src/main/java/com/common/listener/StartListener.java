package com.common.listener;

import com.common.manage.ThreadManage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
/**
 * 项目启动初始化数据到内存中
 * */
public class StartListener implements ApplicationListener<ContextRefreshedEvent> {
    private static Logger log = LoggerFactory.getLogger(StartListener.class);
    public void onApplicationEvent(ContextRefreshedEvent event) {
        ThreadManage.getInstance().init();
        log.info("启动完成");
    }
}