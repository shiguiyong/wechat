package com.common.manage;

import com.model.ChatMonitorClient;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 聊天监控客户端管理类
 * 用于输出聊天日志到客户端
 * */
public class ChatMonitorClientManage {
    private volatile static ChatMonitorClientManage instance = null;
    private Map<String, ChatMonitorClient> cache=new ConcurrentHashMap<>(1000);
    private ChatMonitorClientManage(){}
    public static ChatMonitorClientManage getInstance() {
        if (instance== null)  {
            synchronized (ChatMonitorClientManage.class) {
                if (instance== null)  {
                    instance= new ChatMonitorClientManage();
                }
            }
        }
        return instance;
    }
    public void addClient(ChatMonitorClient client){
        cache.put(client.getUserId(),client);
    }
    public void removeClient(String userId){
        cache.remove(userId);
    }
    public Map<String, ChatMonitorClient> getCache() {
        return cache;
    }
}
