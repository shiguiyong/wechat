package com.common;

public interface MessageType {
	/**保持连接消息*/
	int KEEP_ALIVE=0;
	/**二维码登录通知消息*/
	int LOGIN_NOTIFY=1;
	/**二维码登录确认登录*/
	int LOGIN_CONFIRM=2;
	/**聊天消息*/
	int MESSAGE_CHAT=3;
	/**好友添加消息*/
	int MESSAGE_FRIENT_ADD=4;
	/**好友验证申请消息*/
	int MESSAGE_FRIENT_APPLEY=5;
    /**好友删除*/
    int MESSAGE_FRIENT_DELETE=6;
}
