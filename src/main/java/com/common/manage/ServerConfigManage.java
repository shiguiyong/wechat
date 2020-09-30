package com.common.manage;

import com.model.ServerConfig;

/**
 * 服务器参数配置 配置参数由 服务器配置表<SERVER_CONFIG>中
 * */
public class ServerConfigManage {
    private volatile static ServerConfigManage instance = null;
    /**未读消息超时时间  单位小时  UNREAD-MESSAGE-TIMEOUT*/
    private int unreadMessageTimeOut;
    private ServerConfigManage(){}
    
    public static ServerConfigManage getInstance() {
        if (instance== null)  {
            synchronized (ServerConfigManage.class) {
                if (instance== null)  {
                    instance= new ServerConfigManage();
                }
            }
        }
        return instance;
    }
    
    public void update(ServerConfig config){
        this.update(config.getConfigKey(),config.getConfigValue());
    }

    public void update(String key,String value){
        switch (key){
            case "UNREAD-MESSAGE-TIMEOUT":
                this.unreadMessageTimeOut=Integer.parseInt(value);
                break;
            default:
                break;
        }
    }

    public int getUnreadMessageTimeOut() {
        return unreadMessageTimeOut;
    }
}
