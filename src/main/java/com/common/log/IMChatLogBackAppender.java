package com.common.log;

import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.classic.spi.IThrowableProxy;
import ch.qos.logback.core.UnsynchronizedAppenderBase;
import com.common.DateConst;
import com.common.manage.LogMonitorClientManage;
import com.common.util.DateUtils;

import java.util.Date;

public class IMChatLogBackAppender extends UnsynchronizedAppenderBase<ILoggingEvent> {
    private static String separator=System.getProperty("line.separator");
    public IMChatLogBackAppender(){
        super();
    }
    @Override
    protected void append(ILoggingEvent event) {
        if (event != null && event.getMessage() != null) {
            StringBuilder builder = new StringBuilder();
            IThrowableProxy throwableProxy = event.getThrowableProxy();
            if(throwableProxy!=null){
                builder.append(throwableProxy.getClassName()).append(" ").append(throwableProxy.getMessage()).append(separator);
                for(int i=0; i<throwableProxy.getStackTraceElementProxyArray().length;i++){
                    builder.append(throwableProxy.getStackTraceElementProxyArray()[i].toString()).append(separator);;
                }
            }
            LogMessage message = new LogMessage();
            message.setDateTime(DateUtils.parseDateToStr(new Date(event.getTimeStamp()), DateConst.DATE_TIME_FORMAT_YYYY_MM_DD_HH_MI_SS_SSS));
            message.setThreadName(event.getThreadName());
            message.setLevel(event.getLevel());
            message.setClassName(event.getLoggerName());
            message.setBody(event.getFormattedMessage());
            message.setException(builder.toString());
            LogMonitorClientManage.getInstance().add(message);
        }
    }
}
