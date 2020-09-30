package com.model;

import ch.qos.logback.classic.Level;

import javax.websocket.Session;

/**
 * 日志客户端
 * */
public class LogMonitorClient {

    /**用户标识*/
    private String userId;
    private Session session;
    /**日志级别*/
    private Level level;
    
    public void send(String log){
        if(session!=null){
            session.getAsyncRemote().sendText(log);
        }
    }

    public Session getSession() {
        return session;
    }

    public void setSession(Session session) {
        this.session = session;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public Level getLevel() {
        return level;
    }

    public void setLevel(Level level) {
        this.level = level;
    }
}
