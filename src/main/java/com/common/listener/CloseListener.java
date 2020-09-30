package com.common.listener;

import com.common.manage.UserManage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextClosedEvent;
/**
 * 项目关闭释放资源
 * */
public class CloseListener implements ApplicationListener<ContextClosedEvent> {
    private static Logger log = LoggerFactory.getLogger(CloseListener.class);
    public void onApplicationEvent(ContextClosedEvent event) {
        UserManage.getInstance().close();
        log.info("程序关闭");
    }
}
