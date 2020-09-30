package com.model;

import javax.websocket.Session;

/**
 * 聊天监控客户端
 * */
public class ChatMonitorClient {
    /**用户标识*/
    private String userId;
    private Session session;
    
    public void send(String message){
        if(session!=null){
            session.getAsyncRemote().sendText(message);
        }
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public Session getSession() {
        return session;
    }

    public void setSession(Session session) {
        this.session = session;
    }
}
