package com.thread;

import com.common.log.LogMessage;
import com.common.manage.LogMonitorClientManage;
import com.model.LogMonitorClient;

import java.util.Iterator;
import java.util.Map;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.TimeUnit;

/**
 * 日志试试输出线程
 * 
 * 将系统日志输出到 LogClientManage管理的日志客户端日志
 * */
public class IMChatLogAppenderThread implements Runnable{

    @Override
    public void run() {
        BlockingQueue<LogMessage> queue= LogMonitorClientManage.getInstance().getQueue();
        try{
            while (true){
                LogMessage log=queue.poll(100, TimeUnit.MILLISECONDS);
                if(log!=null){
                    Map<String, LogMonitorClient> cache = LogMonitorClientManage.getInstance().getCache();
                    Iterator<Map.Entry<String, LogMonitorClient>> it = cache.entrySet().iterator();
                    String jsonLog=log.toJSONString();
                    while(it.hasNext()){
                        Map.Entry<String, LogMonitorClient> entry = it.next();
                        LogMonitorClient client=entry.getValue();
                        if(log.getLevel().isGreaterOrEqual(client.getLevel())){
                            client.send(jsonLog);
                        }
                    }
                }
                Thread.sleep(1);
            }
        }catch (Exception e){
            e.printStackTrace();
        }
    }
}
