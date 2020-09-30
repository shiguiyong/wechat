package com.common.manage;

import com.common.util.SpringUtil;
import com.model.ServerConfig;
import com.service.ChatMessageService;
import com.service.ChatRoomService;
import com.service.GroupChatNumberService;
import com.service.GroupChatService;
import com.service.IdPoolService;
import com.service.RegionService;
import com.service.ServerConfigService;
import com.service.UnreadMessageService;
import com.service.UserService;
import com.thread.DealChatMessageThread;
import com.thread.GetIdPoolThread;
import com.thread.IMChatLogAppenderThread;
import com.thread.KeepAliveThread;
import com.thread.LoadingGroupChatToCacheThread;
import com.thread.LoadingRegionToCacheThread;
import com.thread.LoadingUserToCacheThread;
import com.thread.SendMessageToClientThread;
import com.thread.UnreadMessageTimeoutDelThread;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.ScheduledThreadPoolExecutor;
import java.util.concurrent.SynchronousQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;
/**
 * 线程管理类
 * */
public class ThreadManage {

	private static Logger log = LoggerFactory.getLogger(ThreadManage.class);
	
	/**服务器发送消息给客户端 线程数*/
	private static final int SEND_MESSAGE_TO_CLIENT_THREAD_NUM=20;
	
	/**处理聊天消息 线程数*/
	private static final int DEAL_CHAT_MESSAGE_THREAD_NUM=20;
	
	private volatile static ThreadManage instance = null;
	
	/**线程池服务*/
	private ExecutorService service;

    private Map<String, Runnable> cache;
	
	private ThreadManage(){
		service=new ThreadPoolExecutor(SEND_MESSAGE_TO_CLIENT_THREAD_NUM+DEAL_CHAT_MESSAGE_THREAD_NUM+10,200,60L, TimeUnit.SECONDS,new SynchronousQueue<>());
		cache=new ConcurrentHashMap<>(1000);
	}
	
	public static ThreadManage getInstance() { 
		if (instance== null)  {
			synchronized (ThreadManage.class) {
				if (instance== null)  {
					instance= new ThreadManage();
				}
			}
		}
		return instance; 
	}
	
	public void init() {
		IdPoolService idPoolService = SpringUtil.getBean(IdPoolService.class);
		UserService userService = SpringUtil.getBean(UserService.class);
		GroupChatService groupChatService = SpringUtil.getBean(GroupChatService.class);
		GroupChatNumberService groupChatNumberService = SpringUtil.getBean(GroupChatNumberService.class);
		ChatMessageService chatMessageService = SpringUtil.getBean(ChatMessageService.class);
		RegionService regionService = SpringUtil.getBean(RegionService.class);
        ChatRoomService chatRoomService = SpringUtil.getBean(ChatRoomService.class);
		UnreadMessageService unreadMessageService = SpringUtil.getBean(UnreadMessageService.class);
		ServerConfigService serverConfigService = SpringUtil.getBean(ServerConfigService.class);
		//初始化服务器参数配置
        List<ServerConfig> serverConfigList = serverConfigService.qryList();
        if(serverConfigList!=null&&!serverConfigList.isEmpty()){
            for(ServerConfig config:serverConfigList){
                ServerConfigManage.getInstance().update(config);
            }
        }

		CountDownLatch latch = new CountDownLatch(1);
		
		//删除user_id_pool表中已经使用的号码
		idPoolService.delete();
		//初始化 获取用户号码 线程
		GetIdPoolThread getIdPoolThread=new GetIdPoolThread();
		getIdPoolThread.setIdPoolService(idPoolService);
		getIdPoolThread.setUserService(userService);
		getIdPoolThread.setGroupChatService(groupChatService);
		service.execute(getIdPoolThread);

		//初始化 加载地区信息到内存中
		LoadingRegionToCacheThread loadingRegionToCacheThread = new LoadingRegionToCacheThread();
		loadingRegionToCacheThread.setRegionService(regionService);
		loadingRegionToCacheThread.setLatch(latch);
		service.execute(loadingRegionToCacheThread);
		try {
			latch.await();
		} catch (InterruptedException e) {
			e.printStackTrace();
		}

		//初始化  服务器发送消息给客户端线程
		for(int i=0;i<SEND_MESSAGE_TO_CLIENT_THREAD_NUM;i++) {
			SendMessageToClientThread thread=new SendMessageToClientThread();
			thread.setThreadNum("send-message-to-client-"+(i+1));
			thread.setUnreadMessageService(unreadMessageService);
			service.execute(thread);
		}
		
		/*加载用户到内存中*/
		LoadingUserToCacheThread userCacheThread=new LoadingUserToCacheThread();
		userCacheThread.setUserService(userService);
		service.execute(userCacheThread);
		
		/*加载群聊天到内存中*/
		LoadingGroupChatToCacheThread groupChatCacheThread=new LoadingGroupChatToCacheThread();
		groupChatCacheThread.setGroupChatService(groupChatService);
		groupChatCacheThread.setGroupChatNumberService(groupChatNumberService);
		service.execute(groupChatCacheThread);
		
		/*初始化  处理聊天消息 线程*/
		for(int i=0;i<DEAL_CHAT_MESSAGE_THREAD_NUM;i++) {
			DealChatMessageThread thread=new DealChatMessageThread();
			thread.setChatMessageService(chatMessageService);
			thread.setChatRoomService(chatRoomService);
			thread.setThreadNum("deal-chat-message-"+(i+1));
			service.execute(thread);
		}

        IMChatLogAppenderThread imChatLogAppenderThread = new IMChatLogAppenderThread();
        service.execute(imChatLogAppenderThread);

		/*服务器心跳线程*/
        ScheduledThreadPoolExecutor scheduledThreadPoolExecutor=new ScheduledThreadPoolExecutor(2);
        scheduledThreadPoolExecutor.scheduleAtFixedRate(new KeepAliveThread(),1000,3*60*1000,TimeUnit.MILLISECONDS);
        UnreadMessageTimeoutDelThread unreadMessageTimeoutDelThread=new UnreadMessageTimeoutDelThread();
        unreadMessageTimeoutDelThread.setUnreadMessageService(unreadMessageService);
		scheduledThreadPoolExecutor.scheduleAtFixedRate(unreadMessageTimeoutDelThread,1000,5*60*1000,TimeUnit.MILLISECONDS);
        log.info("ThreadManage init success");
	}
	/**
	 *  * 提交线程到连接池  
	 *  * 若该线程存在,则放弃执行
	 * */
	public void submit(Runnable run) {
		String key=run.getClass().toString();
		if(!cache.containsKey(key)) {
			cache.put(key, run);
			service.execute(run);
		}
	}
	
	public void finish(Runnable run) {
		String key=run.getClass().toString();
		cache.remove(key);
	}
}
