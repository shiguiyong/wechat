package com.common.log;

import ch.qos.logback.classic.Level;
import com.alibaba.fastjson.JSONObject;

public class LogMessage {
    /**日志时间*/
    private String dateTime;
    /**线程名称*/
    private String threadName;
    /**日志级别*/
    private Level level;
    /**类名*/
    private String className;
    private String body;
    private String exception;

    @Override
    public String toString() {
        StringBuilder builder= new StringBuilder();
        builder.append(dateTime).append(" ");
        builder.append("[").append(threadName).append("] ");
        builder.append(level.toString()).append("  ");
        builder.append(className).append("- ");
        builder.append(body);
        if(exception!=null){
            builder.append(exception);
        }
        return builder.toString();
    }
    public String toJSONString() {
        JSONObject json = new JSONObject(10);
        json.put("dateTime",dateTime);
        json.put("threadName",threadName);
        json.put("level",level.toString());
        json.put("className",className);
        json.put("body",body);
        json.put("exception",exception);
        return json.toJSONString();
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public String getDateTime() {
        return dateTime;
    }

    public void setDateTime(String dateTime) {
        this.dateTime = dateTime;
    }

    public String getThreadName() {
        return threadName;
    }

    public void setThreadName(String threadName) {
        this.threadName = threadName;
    }

    public String getClassName() {
        return className;
    }

    public void setClassName(String className) {
        this.className = className;
    }

    public Level getLevel() {
        return level;
    }

    public void setLevel(Level level) {
        this.level = level;
    }

    public String getException() {
        return exception;
    }

    public void setException(String exception) {
        this.exception = exception;
    }
}
