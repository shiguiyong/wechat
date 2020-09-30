package com.websocket;

import ch.qos.logback.classic.Level;
import com.alibaba.fastjson.JSONObject;
import com.common.manage.ChatMonitorClientManage;
import com.common.manage.IdGenerateManage;
import com.common.manage.LogMonitorClientManage;
import com.common.manage.MessageManage;
import com.common.manage.UserManage;
import com.common.util.SpringUtil;
import com.common.util.StringUtils;
import com.model.ChatMonitorClient;
import com.model.Client;
import com.model.LogMonitorClient;
import com.model.SendMessage;
import com.model.User;
import com.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.Date;

/**
 * clientType 连接客户端类型
 *     1 网页版客户端
 *     2 聊天监控客户端
 *     3 日志监控客户端
 *     4 控制台客户端
 * */
@ServerEndpoint("/websocket/{clientType}/{userId}")
@Component
public class WebSocket {
	
	private Logger log = LoggerFactory.getLogger(WebSocket.class);
	
	@OnOpen
    public void onOpen(Session session, @PathParam("clientType") String clientType, @PathParam("userId") String userId) throws IOException {
        session.getUserProperties().put("USER_ID", userId);
        session.getUserProperties().put("CLIENT_TYPE", clientType);
        switch (clientType) {
            case "1"://网页版客户端
                log.info("新的用户({})连接",userId);
                Client client=new Client();
                client.setUserId(userId);
                client.setSession(session);
                User user = UserManage.getInstance().get(userId);
                if(user!=null) {
                    user.setWebClient(client);
                    user.setOnLine(Boolean.TRUE);
                    session.getUserProperties().put("USER", user);
                    
                    if(user.getUserState()==2){
                        session.close();
                        log.info("用户({})被冻结 拒绝连接",userId);
                    }
                    user.setUserState(1);
                    user.setLastLoginDate(new Date());
                    SpringUtil.getBean(UserService.class).updateState(user);
                }
                break;
            case "2"://聊天监控客户端
                LogMonitorClient logMonitorClient = new LogMonitorClient();
                logMonitorClient.setUserId(userId);
                logMonitorClient.setSession(session);
                logMonitorClient.setLevel(Level.INFO);
                LogMonitorClientManage.getInstance().addClient(logMonitorClient);
                break;
            case "3"://日志监控客户端
                ChatMonitorClient chatMonitorClient = new ChatMonitorClient();
                chatMonitorClient.setUserId(userId);
                chatMonitorClient.setSession(session);
                ChatMonitorClientManage.getInstance().addClient(chatMonitorClient);
                break;
            default:
                break;
        }
    }

    @OnClose
    public void onClose(Session session) throws IOException {
    	String userId=StringUtils.valueOf(session.getUserProperties().get("USER_ID"));
        String clientType=StringUtils.valueOf(session.getUserProperties().get("CLIENT_TYPE"));
        switch (clientType){
            case "1"://网页版客户端
                if(StringUtils.isNotEmpty(userId)) {
                    User user = UserManage.getInstance().get(userId);
                    if(user!=null) {
                        user.setWebClient(null);
                        user.setOnLine(Boolean.FALSE);
                        if(user.getUserState()==1){//在线状态修改
                            user.setUserState(0);
                            user.setLastLoginDate(new Date());
                            SpringUtil.getBean(UserService.class).updateState(user);
                        }
                    }
                    log.info("用户({})连接断开",userId);
                }
                break;
            case "2"://聊天监控客户端
                LogMonitorClientManage.getInstance().removeClient(userId);
            case "3"://志监控客户端
                ChatMonitorClientManage.getInstance().removeClient(userId);
            default:
                break;
        }
    }

    @OnError
    public void onError(Session session, Throwable throwable) {
        log.error("连接异常", throwable);
    }

    @OnMessage
    public void onMessage(Session session, String message) {
        log.debug("接收消息:{}",message);
		Date date=new Date();
		String messageId=IdGenerateManage.getInstance().nextId();
    	try {
    		User user=(User)session.getUserProperties().get("USER");
    		if(user!=null) {
    			JSONObject json = JSONObject.parseObject(message);
    			/**封装客户端消息 添加到客户端消息队列中*/
    			SendMessage sendMessage = new SendMessage();
    			sendMessage.setClient(user.getWebClient());
    			sendMessage.setMessageId(messageId);
    			sendMessage.setMessageType(json.getInteger("MESSAGE_TYPE"));
    			sendMessage.setDate(date);
    			sendMessage.setSendId(json.getString("SEND_ID"));
    			sendMessage.setReceiveId(json.getString("RECEIVE_ID"));
    			MessageManage.getInstance().send(sendMessage);
    		}
		} catch (Exception e) {
			log.error(e.getMessage(), e);
		}
    }

}
