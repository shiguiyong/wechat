package com.common.manage;

import com.common.log.LogMessage;
import com.model.LogMonitorClient;

import java.util.Map;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 日志客户端管理类
 * 用于输出服务器日志到客户端
 * */
public class LogMonitorClientManage {
    private volatile static LogMonitorClientManage instance = null;
    private Map<String, LogMonitorClient> cache=new ConcurrentHashMap<>(1000);
    private BlockingQueue<LogMessage> queue=new ArrayBlockingQueue<>(10000);
    private LogMonitorClientManage(){}
    public static LogMonitorClientManage getInstance() {
        if (instance== null)  {
            synchronized (LogMonitorClientManage.class) {
                if (instance== null)  {
                    instance= new LogMonitorClientManage();
                }
            }
        }
        return instance;
    }
    public void add(LogMessage message){
        queue.add(message);
    }
    public void addClient(LogMonitorClient client){
        cache.put(client.getUserId(),client);
    }
    public void removeClient(String userId){
        cache.remove(userId);
    }
    public BlockingQueue<LogMessage> getQueue() {
        return queue;
    }
    public Map<String, LogMonitorClient> getCache() {
        return cache;
    }
    public LogMonitorClient get(String userId){
        return cache.get(userId);
    }
}
