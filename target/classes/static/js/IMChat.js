;(function($, h, c) {
	var a = $([]),
	e = $.resize = $.extend($.resize, {}),
	i,
	k = "setTimeout",
	j = "resize",
	d = j + "-special-event",
	b = "delay",
	f = "throttleWindow";
	e[b] = 250;
	e[f] = true;
	$.event.special[j] = {
		setup: function() {
			if (!e[f] && this[k]) {
				return false;
			}
			var l = $(this);
			a = a.add(l);
			$.data(this, d, {
				w: l.width(),
				h: l.height()
			});
			if (a.length === 1) {
				g();
			}
		},
		teardown: function() {
			if (!e[f] && this[k]) {
				return false;
			}
			var l = $(this);
			a = a.not(l);
			l.removeData(d);
			if (!a.length) {
				clearTimeout(i);
			}
		},
		add: function(l) {
			if (!e[f] && this[k]) {
				return false;
			}
			var n;
			function m(s, o, p) {
				var q = $(this),
				r = $.data(this, d);
				r.w = o !== c ? o: q.width();
				r.h = p !== c ? p: q.height();
				n.apply(this, arguments);
			}
			if ($.isFunction(l)) {
				n = l;
				return m;
			} else {
				n = l.handler;
				l.handler = m;
			}
		}
	};
	function g() {
		i = h[k](function() {
			a.each(function() {
				var n = $(this),
				m = n.width(),
				l = n.height(),
				o = $.data(this, d);
				if (m !== o.w || l !== o.h) {
					n.trigger(j, [o.w = m, o.h = l]);
				}
			});
			g();
		},
		e[b]);
	}
})(jQuery, window);
var IMChat = window.IMChat = IMChat || {};
(function(){
	/**登陆标识*/
	IMChat.login=false;
	/**当前选择的聊天房间*/
	IMChat.selectedChatRoom=undefined;
	
	/**连接通道是否打开*/
	IMChat.isSocketOpen=false;
    /**聊天房间初始化*/
    IMChat.isRoomInit=false;
    /**好友初始化*/
    IMChat.isFriendInit=false;
    
	/**消息响应*/
	var messageTypeList=[{
		messageType:0,/**心跳*/
		deal:function(){
		}
	},{
		messageType:3,/**聊天消息*/
		deal:function(event,message){
			var sendId=message.SEND_ID;
			var receiveId=message.RECEIVE_ID;
			var chatType=message.CHAT_TYPE;
			var contentType=message.CONTENT_TYPE;
			var chatContent=message.CHAT_CONTENT;
			var roomName=message.ROOM_NAME;
			IMChat.chatRoomListPanel.chatRoomRreceive(sendId,receiveId,chatType,contentType,chatContent,roomName,message);
		}
	},{
		messageType:4,/**好友添加消息*/
		deal:function(event,message){
			var friendItem=new IMChat.FriendItem(message.DATA);
			IMChat.addressListPanel.addFriend(friendItem);
			friendItem.init();
			IMChat.addressListPanel.refresh();
		}
	},{
		messageType:5,/**验证申请消息*/
		deal:function(event,message){
			var apply=new IMChat.ApplyInfo(message.DATA);
			IMChat.chatRoomListPanel.applyInfoItem.addMeaasge(apply);
			if(IMChat.selectedChatRoom!==IMChat.chatRoomListPanel.applyInfoItem){
				IMChat.chatRoomListPanel.applyInfoItem.addUnreadMessageNum();
			}
		}
	},{
        messageType:6,/**好友删除*/
        deal:function(event,message){
            var sendId=message.SEND_ID;
            //删除好友
            IMChat.addressListPanel.removeFriend(sendId);
            IMChat.addressListPanel.refresh();
            var item=IMChat.chatRoomListPanel.getChatRoomItem(sendId,1);
            if(item){//删除聊天室
                if(IMChat.selectedChatRoom===item){
                    $("#emptyPanel").css("display","");
                    $("#chatPanel").css("display","none");
                    $("#addressDetailsPanel").css("display","none");
                    $("#applyInfoListPanel").css("display","none");
                }
                IMChat.chatRoomListPanel.removeChatRoom(item);
                IMChat.chatRoomListPanel.refresh();
            }
        }
    }];
	IMChat.messageType={};
	for(var i=0;i<messageTypeList.length;i++){
		var messageType=messageTypeList[i];
		IMChat.messageType[messageType.messageType]=messageType.deal;
	}
	/**
	 * 用于与服务器通讯
	 * */
	function Chat(){
		/**避免ws重复连接*/
		var lockReconnect = false;
		/**与服务器连接*/
		var socket=null;
        /**服务器状态 1 正常 2关闭 */
        var serverState=1;
		/**创建与服务器的连接*/
		this.createWebSocket=function(){
			try{
		        if('WebSocket' in window){
		        	socket = new WebSocket("ws://"+window.location.host+"/websocket/1/"+IMChat.user.USER_ID+"?TOKEN="+IMChat.user.TOKEN);
		        }else{
                    IMChat.MessageBox.alert("您的浏览器不支持websocket协议,建议使用新版谷歌、火狐等浏览器，请勿使用IE10以下浏览器，360浏览器请使用极速模式，不要使用兼容模式！"); 
		        }
		        IMChat.chat.initEventHandle();
		    }catch(e){
		    	IMChat.chat.reconnect();
		    }
		};
		this.initEventHandle=function(){
			socket.onclose = function(){
			    if(serverState===1){
                    IMChat.chat.reconnect();
                }
			};
			
			socket.onerror = function(e) {
                if(serverState===1){
                    IMChat.chat.reconnect();
                }
			};
			
			socket.onopen=function(){
                IMChat.isSocketOpen=true;
			    if(window.main&&IMChat.isSocketOpen&&IMChat.isFriendInit&&IMChat.isRoomInit){
                    window.main.initUnreadMessage();
                }
				IMChat.heartCheck.reset().start();
			};
			/**
			 * 接收消息
			 * 如果获取到消息，心跳检测重置
			 * 拿到任何消息都说明当前连接是正常的
			 * */
			socket.onmessage=function(event){
				IMChat.heartCheck.reset().start();
				if(event.data){
					var message=$.parseJSON(event.data);
					IMChat.chat.receiveMessage(event,message.MESSAGE_TYPE,message);
				}
			};
		};
		/**
		 * event 接收消息事件
		 * data 接收消息
		 * content 消息内容
		 * */
		this.receiveMessage=function(event,messageType,message){
			if(IMChat.messageType[messageType]){
				IMChat.messageType[messageType](event,message);
			}
		};
		this.close=function(){
			if(socket!=null){
				try {
					socket.close();
				} catch (e) {
					console.log(e);
				}
			}
		};
		this.sendMessage=function(message){
			try {
				if(socket!=null){
					socket.send(JSON.stringify(message));
				}
			} catch (e) {
				console.log(e);
			}
		};
		/**开始重连*/
		this.reconnect=function(){
			if(lockReconnect) return;
		    lockReconnect = true;
		    setTimeout(function () {//没连接上会一直重连，设置延迟避免请求过多
		    	console.log("开始重连");
		        IMChat.chat.createWebSocket();
		        lockReconnect = false;
		    }, 2000);
		}
	}
	IMChat.chat=new Chat();
	/**心跳检测*/
	function HeartCheck(){
		/**2分钟发一次心跳*/	
		this.timeout = 120000;
		this.timeoutObj = undefined;
		this.serverTimeoutObj = undefined;
		
		this.reset=function(){
			clearTimeout(this.timeoutObj);
	        clearTimeout(this.serverTimeoutObj);
	        return this;
		};
		
		this.start=function(){
			var self = this;
	        this.timeoutObj = setTimeout(function(){
	        	IMChat.chat.sendMessage({
	        		MESSAGE_TYPE:0
	        	});
	            self.serverTimeoutObj = setTimeout(function(){//如果超过一定时间还没重置，说明后端主动断开了
	            	IMChat.chat.close();
	            }, self.timeout)
	        }, this.timeout);
		};
	}
	/**心跳检测*/
	IMChat.heartCheck=new HeartCheck();
	function HttpHeartCheck(){
		/**20分钟发一次心跳*/
		this.timeout = 20*60*1000;
		this.timeoutObj = undefined;

		this.reset=function(){
			clearTimeout(this.timeoutObj);
			clearTimeout(this.serverTimeoutObj);
			return this;
		};

		this.start=function(){
			this.timeoutObj = setTimeout(function(){
				IMChat.Ajax.request({
					type : "POST",
					url : "token/check",
					data:{
						USER_ID:IMChat.user.USER_ID
					},
					success:function(result){
						IMChat.user.TOKEN=result.TOKEN;
					}
				});
			},this.timeout);
		}
	}
	IMChat.httpHeartCheck=new HttpHeartCheck();
	/**
	 * AddressListPanel 通讯录列表
	 * */
	function AddressListPanel(){
		/**群聊*/
		this._groupChatList=[];
		/**好友*/
		this._friendList=[];
		this._panel=$("#addressListPanel");
		
		this._groupChatStr=new IMChat.StringItem("群聊",true);
		this._friendStr=new IMChat.StringItem("好友",true);
		
		this.addGroupChat=function(item){
			this._groupChatList.push(item);
		};
        this.removeGroupChat=function(groupId){
            for(var i=0;i<this._groupChatList.length;i++){
                var groupChatItem=this._groupChatList[i];
                if(groupId===groupChatItem.getGroupId()){
                    this._groupChatList.splice(i,1);
                    break;
                }
            }
        };
		this.addFriend=function(item){
			this._friendList.push(item);
		};
        this.removeFriend=function(friendId){
            for(var i=0;i<this._friendList.length;i++){
                var friendItem=this._friendList[i];
                if(friendId===friendItem.getFriendId()){
                    this._friendList.splice(i,1);
                    break;
                }
            }
        };
		
		this.refresh=function(){
			$("#addressListPanel .addressListItem").detach();
			/**群组列表*/
			if(this._groupChatList.length>0){
				this._panel.append(this._groupChatStr.getItem());
				for(var i=0;i<this._groupChatList.length;i++){
					this._panel.append(this._groupChatList[i].getItem());
				}
			}
			/**好友列表*/
			if(this._friendList.length>0){
				this._panel.append(this._friendStr.getItem());
				for(var i=0;i<this._friendList.length;i++){
					this._panel.append(this._friendList[i].getItem());
				}
			}
			if($("#addressListPanel .addressListItem[selected=selected]").length===0){
				this.doScrollTop();
			}
		};
		/**
		 * 加载头像
		 * 修改批量加载
		 * */
		this.userInit=function(){
			this._friendList.forEach(function(userItem){
				userItem.init();
			});
		};
		/**加载群聊头像*/
		this.groupChatInit=function(){
			this._groupChatList.forEach(function(groupChatItem){
				groupChatItem.init();
			});
		};
		this.getFriendList=function(){
			return this._friendList;
		};
		/**判断用户是否是好友*/
		this.isFriend=function (userId) {
			if(userId===IMChat.user.USER_ID){
				return true;
			}
			for(var i=0;i<this._friendList.length;i++){
				if(userId===this._friendList[i].getFriendId()){
					return true;
				}
			}
			return false;
		};
		this.doScrollTop=function(){
			this._panel.getNiceScroll(0).resize();
			this._panel.getNiceScroll(0).doScrollTop(0);
		};
		this.getGroupChat=function(groupId){
		    var groupChatItem=undefined;
		    for(var i=0;i<this._groupChatList.length;i++){
		        var item=this._groupChatList[i];
		        if(groupId===item.getGroupId()){
                    groupChatItem=item;
                    break;
                }
            }
		    return groupChatItem;
        };
        this.getFriendChat=function(friendId){
            var friendItem=undefined;
            for(var i=0;i<this._friendList.length;i++){
                var item=this._friendList[i];
                if(friendId===item.getFriendId()){
                    friendItem=item;
                    break;
                }
            }
            return friendItem;
        };
        this.getGroupChatFromServer=function(groupId){
			var groupChatItem=undefined;
			IMChat.Ajax.request({
				type : "POST",
				url : "groupchat/qryByGroupId",
				data:{
					GROUP_ID:groupId
				},
				async:false,
				success:function(result){
					if(result.SUCCESS){
						groupChatItem=new IMChat.GroupChatItem(result.DATA);
						IMChat.addressListPanel.addGroupChat(groupChatItem);
						IMChat.addressListPanel.refresh();
					}
				}
			});
			return groupChatItem;
		}
	}
	/**
	 * ChatRoomListPanel 最近聊天列表
	 * */
	function ChatRoomListPanel(){
		var _this=this;
		this._chatRoomList=[];
		this._panel=$("#chatRoomListPanel");
		/**验证消息*/
		this.applyInfoItem=new IMChat.ApplyInfoItem();
		this._chatRoomList.push(this.applyInfoItem);
		this.applyInfoItem.messageInit();
		this.addChatRoom=function(item){
			_this._chatRoomList.push(item);
		};
        this.removeChatRoom=function(item){
            for(var i=0;i<this._chatRoomList.length;i++){
                var chatRoomItem=this._chatRoomList[i];
                if("ChatRoomItem"===chatRoomItem.getClass()
                    && item.getChatType() === chatRoomItem.getChatType()
                    && item.getChatId() === chatRoomItem.getChatId() ){
                    this._chatRoomList.splice(i,1);
                    if(IMChat.selectedChatRoom===item){
                        IMChat.selectedChatRoom=undefined;
                    }
                    break;
                }
            }
        };
		/**刷新聊天列表*/
		this.refresh=function(){
			$("#chatRoomListPanel .chatRoomListItem").detach();
			/**排序*/
			this._chatRoomList.sort(function(a,b){
				if(a.getStickSign()===b.getStickSign()){
					if(a.getStickSign()===1) {
						return a.getSortIndex()-b.getSortIndex();
					}
					if(a.getStickSign()===0) {
						return b.getLastChatDate()-a.getLastChatDate();
					}
					return 0;
				}else{
					return b.getStickSign()-a.getStickSign();
				}
			});
			if(this._chatRoomList.length>0){
				for(var i=0;i<this._chatRoomList.length;i++){
					_this._panel.append(_this._chatRoomList[i].getItem());
				}
			}
		};
		/**初始化聊天房间*/
		this.chatRoomInit=function(){
			_this._chatRoomList.forEach(function(chatRoomItem){
				chatRoomItem.init();
			});
		};
		/**打开聊天房间*/
		this.openChatRoom=function(chatType,chatId,roomName,chatImg){
			var flag=true;
			for(var i=0;i<_this._chatRoomList.length;i++){
				var chatRoomItem=this._chatRoomList[i];
				if("ChatRoomItem"===chatRoomItem.getClass()&&chatType===chatRoomItem.getChatType()&&chatId===chatRoomItem.getChatId()){
					chatRoomItem.open();
					flag=false;
					break;
				}
			}
			if(flag){
				var chatRoomItem=new IMChat.ChatRoomItem({
						CHAT_ID: chatId,
						CHAT_TYPE: chatType,
						USER_ID: IMChat.user.USER_ID,
						STICK_SIGN: 0,
						SORT_INDEX: 0,
						LAST_CHAT_DATE: new Date().getTime(),
						ROOM_NAME: roomName,
						CHAT_IMG: chatImg
					});
				chatRoomItem.create();
				IMChat.chatRoomListPanel.addChatRoom(chatRoomItem);
				IMChat.chatRoomListPanel.refresh();
				chatRoomItem.open();
			}
		};
		this.getChatRoom=function(sendId,receiveId,chatType,roomName){
			var flag=true;
			var item=undefined;
			var chatId=sendId;
			if(chatType===2){
				chatId=receiveId;
			}
			for(var i=0;i<this._chatRoomList.length;i++){
				var chatRoomItem=this._chatRoomList[i];
				if("ChatRoomItem"===chatRoomItem.getClass()&&chatType===chatRoomItem.getChatType()&&chatId===chatRoomItem.getChatId()){
					item=chatRoomItem;
					flag=false;
					break;
				}
			}
			if(flag){
			    // 获取好友名称 或者备注名称
                if(roomName===undefined){
                    if(chatType===1){
                        var friendItem=IMChat.addressListPanel.getFriendChat(chatId);
                        if(friendItem){
                            roomName=friendItem.getFriendName();
                        }
                    }
                    if(chatType===2){
                        var groupChatItem=IMChat.addressListPanel.getGroupChat(chatId);
                        if(groupChatItem){
                            roomName=groupChatItem.getGroupName();
                        }
                    }
                }
                if(roomName===undefined){
					var groupChatItem=IMChat.addressListPanel.getGroupChatFromServer(chatId);
					if(groupChatItem){
						roomName=groupChatItem.getGroupName();
					}
				}
                
				var chatRoomItem=new IMChat.ChatRoomItem({
					CHAT_ID: chatId,
					CHAT_TYPE: chatType,
					USER_ID: IMChat.user.USER_ID,
					STICK_SIGN: 0,
					SORT_INDEX: 0,
					LAST_CHAT_DATE: new Date().getTime(),
					ROOM_NAME: roomName===undefined?"":roomName
				});
				chatRoomItem.create();
				chatRoomItem.init();
				
				IMChat.chatRoomListPanel.addChatRoom(chatRoomItem);
				IMChat.chatRoomListPanel.refresh();
				item=chatRoomItem;
			}
			return item;
		};
		/**房间接收消息*/
		this.chatRoomRreceive=function(sendId,receiveId,chatType,contentType,chatContent,roomName,data){
			var chatId=sendId;
			if(chatType===2){
				chatId=receiveId;
			}
			var chatRoomItem=_this.getChatRoom(sendId,receiveId,chatType,roomName);
            chatRoomItem.setLastChatDate(data.DATE);
			var message=undefined;
			if(contentType===1){
				message=new IMChat.LeftTextMessage({
					chatId:chatId,
					chatType:chatType,
					content:chatContent,
					sendId:sendId
				});
                message.receiveMessage(chatRoomItem);
			}else if(contentType===2){
				message=new IMChat.LeftImageMessage({
					chatId:chatId,
					chatType:chatType,
					sendId:sendId,
					fileId:data.FILE_ID,
					width:data.IMAGE_WIDTH-0,
					height:data.IMAGE_HEIGHT-0
				});
				message.downloadImg();
                message.receiveMessage(chatRoomItem);
			}else if(contentType===3){
				message=new IMChat.LeftFileMessage({
					chatId:chatId,
					chatType:chatType,
					sendId:sendId,
					fileId:data.FILE_ID,
	        		fileName:data.FILE_NAME,
	        		fileSuffix: data.FILE_SUFFIX,
	        		fileSize: data.FILE_SIZE,
	        		messageId:data.MESSAGE_ID
	        	});
                message.receiveMessage(chatRoomItem);
			}
			chatRoomItem.addMeaasge(message);
			if(chatRoomItem===IMChat.selectedChatRoom){
				chatRoomItem.open();
			}else{
				chatRoomItem.addUnreadMessageNum();
			}
			if(message){/**浏览器消息通知*/
				message.notification();
			}
            IMChat.chatRoomListPanel.refresh();
		};
		this.getChatRoomItem=function(chatId,chatType){
			for(var i=0;i<this._chatRoomList.length;i++){
				var chatRoomItem=this._chatRoomList[i];
				if("ChatRoomItem"===chatRoomItem.getClass()&&chatType===chatRoomItem.getChatType()&&chatId===chatRoomItem.getChatId()){
					return chatRoomItem;
				}
			}
			return undefined;
		};
	}
	/**聊天主界面*/
	function Main(){
		var main=this;
		this.login=function(data){
            IMChat.transparentMaskLayer.show();
			IMChat.Ajax.request({
				type : "POST",
				url : "login",
				data:data,
				success:function(result){
					if(result.SUCCESS){
						IMChat.login=true;
						IMChat.user={
							USER_ID:result.USER_ID,
							USER_NAME:result.USER_NAME,
							USER_SEX:result.USER_SEX,
							REGION_CODE:result.REGION_CODE,
							REGION_NAME:result.REGION_NAME,
							USER_DES:result.USER_DES,
							USER_IMG:result.USER_IMG,
							TOKEN:result.TOKEN,
                            ROLE_TYPE:result.ROLE_TYPE
						};
						/**好友列表*/
						IMChat.addressListPanel=new AddressListPanel();
						IMChat.chatRoomListPanel=new ChatRoomListPanel();
						/**替换当前用户头像*/
						$("#headButton").attr("src","data:image/png;base64,"+IMChat.user.USER_IMG);
						main.chatRoomListPanelInit();
						main.addressListPanelInit();
						IMChat.chat.createWebSocket();
						// 服务器控制台
                        if(result.ROLE_TYPE>0){
                            IMChat.floatingMenu=IMChat.FloatingMenu();
                        }
                        $("#login").css("display","none");
                        $("#main").css("display","");
					}
				},
                error:function(result){
                    IMChat.MessageBox.alert(result.RETURN_MSG);
                    IMChat.transparentMaskLayer.hidden();
                }
			});
		};
		/**加载最近聊天列表初始化*/
		this.chatRoomListPanelInit=function(){
			IMChat.Ajax.request({
				type : "POST",
				url : "chatroom/list",
				data:{
					USER_ID:IMChat.user.USER_ID
				},
				success:function(result){
					if(result.SUCCESS){
						for(var i=0;i<result.DATA.length;i++){
							IMChat.chatRoomListPanel.addChatRoom(new IMChat.ChatRoomItem(result.DATA[i]));
						}
						IMChat.chatRoomListPanel.refresh();
						IMChat.chatRoomListPanel.chatRoomInit();
						IMChat.isRoomInit=true;
                        if(window.main&&IMChat.isSocketOpen&&IMChat.isFriendInit&&IMChat.isRoomInit){
                            window.main.initUnreadMessage();
                        }
					}
				}
			});
		};
		/**加载好友列表初始化*/
		this.addressListPanelInit=function(){
			/**请求获取群组列表*/
			IMChat.Ajax.request({
				type : "POST",
				url : "groupchat/list",
				data:{
					USER_ID:IMChat.user.USER_ID
				},
				success:function(result){
					if(result.SUCCESS){
						for(var i=0;i<result.DATA.length;i++){
							IMChat.addressListPanel.addGroupChat(new IMChat.GroupChatItem(result.DATA[i]));
						}
						IMChat.addressListPanel.refresh();
						IMChat.addressListPanel.groupChatInit();
                        IMChat.isFriendInit=true;
                        if(window.main&&IMChat.isSocketOpen&&IMChat.isFriendInit&&IMChat.isRoomInit){
                            window.main.initUnreadMessage();
                        }
					}
				}
			});
			/**请求获取好友列表*/
			IMChat.Ajax.request({
				type : "POST",
				url : "friend/list",
				data:{
					USER_ID:IMChat.user.USER_ID
				},
				success:function(result){
					if(result.SUCCESS){
						for(var i=0;i<result.DATA.length;i++){
							IMChat.addressListPanel.addFriend(new IMChat.FriendItem(result.DATA[i]));
						}
						IMChat.addressListPanel.refresh();
						/**加载头像*/
						IMChat.addressListPanel.userInit();
						IMChat.addressListPanel.doScrollTop();
					}
				}
			});
		};
		/**加载未读消息*/
		this.initUnreadMessage=function(){
            IMChat.Ajax.request({
                type : "POST",
                url : "unreadMessage",
                data:{
                    USER_ID:IMChat.user.USER_ID
                },
                success:function(result){
                    IMChat.transparentMaskLayer.hidden();
                }
            });
        };
	}
	function Message(){
		this._div=$("<div>");
		this._div.css("width","100%");
		this._div.css("margin","6px 0px 6px 0px");
		this._div.addClass("message");
		
		/**滚动到聊天区域底部*/
		this.scrollToBottom=function(){
			var height=0;
			$("#chatContent .message").each(function(index,element){
				height+=element.clientHeight+12;
			});
            var chatContent=$("#chatContent");
            chatContent.getNiceScroll().resize();
            chatContent.getNiceScroll(0).doScrollTop(height);
		};
		/**分析每一行的emoji数量*/
		this.parseLineEmojiInfo=function(lineArr){
			var lineEmojiInfoList=[];
			for (var i = 0; i < lineArr.length; i++){
				var text=lineArr[i];
				var emojiList=[];
				var emoji="";
				for(var m=0;m<text.length;m++){
					var c=text[m];
					if(emoji!==""){
						emoji+=c;
					}
					if(c==="["){
						emoji+=c;
					}
					if(c==="]"){
						emojiList.push(emoji);
						emoji="";
					}
				}
				lineEmojiInfoList.push(emojiList);
			}
			return lineEmojiInfoList;
		};
		
		/**获取字符串的像素宽度*/
		this.getStringPixelWidth=function(str){
			return IMChat.getStringPixelWidth(str);
		};
		var units = [ 'B', 'K', 'M', 'G', 'TB' ];
		this.formatSize=function(size){
			var unit;
			while ( (unit = units.shift()) && size > 1024 ) {
			      size = size / 1024;
			}
			return (unit === 'B' ? size : size.toFixed(1)) + unit;
		};
	}
	function Item(){
		this._item=void 0;
		this.getItem=function(){
			return this._item;
		};
		this.selected=function(item){
			var parent=$(item).parent();
			parent.children("div[selected]").css("background-color","");
			parent.children("div[sticksign]").css("background-color","#CFCFCF");
			parent.children("div[selected]").removeAttr("selected");
			$(item).attr("selected",true);
			$(item).css("background-color","#B5B5B5");
		};
		/**获取字符串的像素宽度*/
		this.getStringPixelWidth=function(str){
			return IMChat.getStringPixelWidth(str);
		};
	}
	/**获取字符串的像素宽度*/
	IMChat.getStringPixelWidth=function(str){
		$("body").append("<div id='labelText' style='line-height:1.2;white-space:nowrap;top:0;left:0;position:fixed;display:none;visibility:visible;'>");
		var add = $('#labelText');
		add.css({
			'font-size': '20px',
			'font-family': '"Microsoft YaHei", "Microsoft YaHei", serif !important;'
		}).html(str);
		var ret = {'width': add.width(), 'height': add.height()};
		add.remove();
		return ret.width+1;
	};
	/**用于处理所有的网络请求*/
	IMChat.Ajax={
			request:function(option){
				$.ajax({
					type : option.type,
					url : option.url,
					data:JSON.stringify(option.data),
					contentType: "application/json",
					dataType: "json",
					async:option.async===undefined?true:option.async,
					beforeSend:function(request){
						if(IMChat.user){
							request.setRequestHeader("TOKEN", IMChat.user.TOKEN); 
						}
					},
					success:function(result){
						if(result.SUCCESS){
							option.success(result);
						}else{
							if(option.error){
                                option.error(result);
                            }else{
							    if(result.RETURN_MSG){
                                    IMChat.MessageBox.alert(result.RETURN_MSG);
                                }
                            }
						}
					}
				});
				IMChat.httpHeartCheck.reset().start();
			},
			/**下载文件*/
			downloadFile:function(url,list){
				var form = $("<form></form>").attr("action", url).attr("method", "post").attr("target", "nm_iframe");
				if(list){
					for(var i=0;i<list.length;i++){
						form.append($("<input>").attr("type", "hidden").attr("name", list[i].name).attr("value", list[i].value));
					}
				}
				form.append($("<input>").attr("type", "hidden").attr("name", "TOKEN").attr("value", IMChat.user.TOKEN));
		        form.appendTo('body').submit().remove();
			}
	};
	/**告警弹框*/
    IMChat.MessageBox={
        /**
         * 告警提示框
         * 第一个参数是提示信息
         * 第二个(可选)参数是显示的时间，默认2000
         * */
        timer: undefined,
        alert:function(msg, time){
            window.clearTimeout(this.timer);
            var alertPanel=$("#alertPanel");
            alertPanel.text(msg);
            var width = alertPanel.width();
            alertPanel.css({
                'margin-left': -(width+30) / 2 + 'px',
                "display": ""
            });
            this.timer = setTimeout(function() {
                    alertPanel.css({
                        'display': 'none'
                    });
                    }, time===undefined?2000:time);
        }
    };
	/**发送编辑框内的消息*/
	IMChat.sendMessage=function(){
		var content=window.editor.txt.getContent();
		window.editor.txt.clear();
		if(content!=null&&content!==""&&content!==undefined){
			var message=new IMChat.RightTextMessage({
				content:content
			});
			message.sendMessage(IMChat.selectedChatRoom);
			message.append();
			IMChat.selectedChatRoom.addMeaasge(message);
		}
		$("#emojiListPanel").css("display","none");
	};
	/**文件选择后 上传文件到服务器*/
	IMChat.sendFileMessage=function(file){
		if(file.size>1024*1024*10){
			IMChat.MessageBox.alert("发送的文件大小不能大于10M");
			return;
		}
		var fileName = file.name;
		var fileSuffix = fileName.substring(fileName.lastIndexOf('.')+1, fileName.length).toUpperCase();
		/**上传文件图片*/
        if (fileSuffix === 'PNG' || fileSuffix === 'JPG' || fileSuffix === 'JPEG' || fileSuffix === 'GIF') {
        	var reader = new FileReader();
    		reader.onload = function() {
    			  /**文件地址*/
    			  var dataURL = reader.result;
    			  var image = new Image();
    			  image.src = dataURL;
    			  image.onload=function(){
    				  var message=new IMChat.RightImageMessage({
    					  	file:file,
    						src:dataURL,
    						width: image.width,
    						height: image.height,
    						fileSuffix:fileSuffix
    				  });
    				  message.uploadImage(IMChat.selectedChatRoom);
    				  message.append();
    		          IMChat.selectedChatRoom.addMeaasge(message);
    			  };
    		};
    		reader.readAsDataURL(file);
        }else{/**其余类型文件*/
        	var message=new IMChat.RightFileMessage({
        		file:file,
        		fileName:file.name,
        		fileSuffix: fileSuffix,
        		fileSize: file.size
        	});
        	message.uploadFile(IMChat.selectedChatRoom);
        	message.append();
        	IMChat.selectedChatRoom.addMeaasge(message);
        }
	};
	/**图片延迟加载*/
	function ImageLoad(img,userId){
		window.setTimeout(function(){
			IMChat.Ajax.request({
				type : "POST",
				url : "user/qryById",
				data:{
					USER_ID:userId
				},
				success:function(result){
					if(result.SUCCESS){
						img.attr("src","data:image/png;base64,"+result.DATA.USER_IMG);
					}
				}
			});
			
		},1);
	}
	/**
	 * 菜单
	 * */
	function Menu(option){
		this._menuList=option.menuList;
		var height=this._menuList.length*40;
		var width=option.width?160:option.width;
		var menu=$("<ul>");
		menu.addClass("contextmenu");
		menu.css({
			"position": "absolute",
			"display": "none",
			"margin": 0,
			"padding": 0,
			"background-color":"#29292a",
			"overflow": "hidden",
			"z-index": 999999,
			"width": width,
			"height": height
		});
		this._menuList.forEach(function(m){
			var li=$("<li>");
			li.css({
				"margin": "0px",
				"padding": "0px 20px",
				"height": 40,
				"line-height": "40px",
				"color":"#828282",
				"cursor":"pointer"
			});
			li.hover(function(){
				$(this).css("background-color","#363637");
			},function(){
				$(this).css("background-color","");
			});
			li.bind("click",m,function (e) {
				e.data.handler();
			});
			li.text(m.name);
			menu.append(li);
		});
		
		$("body").append(menu);
		this.show=function(top,left){
			menu.css({
				"display":"block",
				"left":left,
				"top":top
			});
		}
	}
	/**右侧悬浮菜单*/
	function FloatingMenu(){
	    var menu=$("<div>");
        menu.css({
            "position": "absolute",
            "z-index": "9999",
            "bottom": "100px",
            "right": "0",
            "width": "100px",
            "height":"40px",
            "background-color":"#26292c"
        });
        var consoleItem=$("<div>");
        consoleItem.css({
            "width": "100px",
            "height":"40px",
            "line-height":"40px",
            "cursor": "pointer"
        });
        consoleItem.click(function(){
            window.localStorage.setItem("USER_ID",IMChat.user.USER_ID);
            window.localStorage.setItem("USER_NAME",IMChat.user.USER_NAME);
            window.localStorage.setItem("USER_SEX",IMChat.user.USER_SEX);
            window.localStorage.setItem("REGION_CODE",IMChat.user.REGION_CODE);
            window.localStorage.setItem("REGION_NAME",IMChat.user.REGION_NAME);
            window.localStorage.setItem("USER_DES",IMChat.user.USER_DES);
            window.localStorage.setItem("USER_IMG",IMChat.user.USER_IMG);
            window.localStorage.setItem("TOKEN",IMChat.user.TOKEN);
            window.localStorage.setItem("ROLE_TYPE",IMChat.user.ROLE_TYPE);
            window.open("/console");
        });
        var consoleIcon=$("<img src='' alt=''>");
        consoleIcon.css({
            "width": 30,
            "height":30,
            "margin-top": "5px",
            "margin-left": "5px",
            "margin-right": "5px",
            "float": "left"
        });
        consoleIcon.attr("src","image/console.png");
        consoleItem.append(consoleIcon);
        var consoleText=$("<span>");
        consoleText.css({
            "display": "block",
            "float": "left",
            "color":"#ffffff"
        });
        consoleText.text("控制台");
        consoleItem.append(consoleText);
        menu.append(consoleItem);
        
	    $("body").append(menu);
    }
    /**右键菜单*/
    function Contextmenu(){
        var menu=$("<ul>");
        menu.addClass("contextmenu");
        menu.css({
            "position": "absolute",
            "display": "none",
            "margin": 0,
            "padding": 0,
            "background-color":"#FFFFFF",
            "overflow": "hidden",
            "z-index": 999999,
            "width": 150,
            "height": 210,
            "font-size":"12px"
        });
        var menuList=[{
            menuId:"send-message",
            name:"发消息"
        },{
            menuId:"stick",
            name:"置顶"
        },{
            menuId:"cancel-stick",
            name:"取消置顶"
        },{
            menuId:"modify-grouchatname",
            name:"修改群名称"
        },{
            menuId:"delete-chat",
            name:"删除聊天"
        },{
            menuId:"delete-friend",
            name:"删除朋友"
        },{
            menuId:"delete-exit",
            name:"删除并退出群组"
        }];

        var menus=[];
        menuList.forEach(function(m){
            var li=$("<li>");
            li.css({
                "margin": "0px",
                "padding": "0px 20px",
                "height": 30,
                "line-height": "30px",
                "color":"#2c3133",
                "cursor":"default"
            });
            li.hover(function(){
                $(this).css("background-color","#C2C2C2");
            },function(){
                $(this).css("background-color","");
            });
            li.text(m.name);
            li.menuId=m.menuId;
            menus.push(li);
            menu.append(li);
        });

        $("body").append(menu);
        this.show=function(menuMap,x,y){
            var i=0;
            menus.forEach(function(item){
                item.css("display","none");
                if(menuMap[item.menuId]){
                    item.unbind("click");
                    item.bind("click",menuMap[item.menuId],function(e){
                        if(e.data.handler){
                            e.data.handler.call(e.data.scope);
                        }
                    });
                    item.css("display","");
                    i++;
                }
            });
            menu.css({
                "display":"block",
                "left":x,
                "top":y,
                "height": 30*i
            });
        }
    }

	IMChat.Main=Main;
	IMChat.Message=Message;
	IMChat.Item=Item;
	IMChat.ImageLoad=ImageLoad;
	IMChat.Menu=Menu;
    IMChat.FloatingMenu=FloatingMenu;
	IMChat.emojiManage={
			list:[
	        	{alt:"[微笑]",src:"emoji/0.png"},{alt:"[撇嘴]",src:"emoji/1.png"},{alt:"[色]",src:"emoji/2.png"},{alt:"[发呆]",src:"emoji/3.png"},
	        	{alt:"[得意]",src:"emoji/4.png"},{alt:"[流泪]",src:"emoji/5.png"},{alt:"[害羞]",src:"emoji/6.png"},{alt:"[闭嘴]",src:"emoji/7.png"},
	        	{alt:"[睡]",src:"emoji/8.png"},{alt:"[大哭]",src:"emoji/9.png"},{alt:"[尴尬]",src:"emoji/10.png"},{alt:"[发怒]",src:"emoji/11.png"},
	        	{alt:"[调皮]",src:"emoji/12.png"},{alt:"[呲牙]",src:"emoji/13.png"},{alt:"[惊讶]",src:"emoji/14.png"},{alt:"[难过]",src:"emoji/15.png"},
	        	{alt:"[酷]",src:"emoji/16.png"},{alt:"[冷汗]",src:"emoji/17.png"},{alt:"[抓狂]",src:"emoji/18.png"},{alt:"[吐]",src:"emoji/19.png"},
	        	{alt:"[偷笑]",src:"emoji/20.png"},{alt:"[愉快]",src:"emoji/21.png"},{alt:"[白眼]",src:"emoji/22.png"},{alt:"[傲慢]",src:"emoji/23.png"},
	        	{alt:"[饥饿]",src:"emoji/24.png"},{alt:"[困]",src:"emoji/25.png"},{alt:"[惊恐]",src:"emoji/26.png"},{alt:"[流汗]",src:"emoji/27.png"},
	        	{alt:"[憨笑]",src:"emoji/28.png"},{alt:"[悠闲]",src:"emoji/29.png"},{alt:"[奋斗]",src:"emoji/30.png"},{alt:"[咒骂]",src:"emoji/31.png"},
	        	{alt:"[疑问]",src:"emoji/32.png"},{alt:"[嘘]",src:"emoji/33.png"},{alt:"[晕]",src:"emoji/34.png"},{alt:"[疯了]",src:"emoji/35.png"},
	        	{alt:"[衰]",src:"emoji/36.png"},{alt:"[骷髅]",src:"emoji/37.png"},{alt:"[敲打]",src:"emoji/38.png"},{alt:"[再见]",src:"emoji/39.png"},
	        	{alt:"[擦汗]",src:"emoji/40.png"},{alt:"[抠鼻]",src:"emoji/41.png"},{alt:"[鼓掌]",src:"emoji/42.png"},{alt:"[糗大了]",src:"emoji/43.png"},
	        	{alt:"[坏笑]",src:"emoji/44.png"},{alt:"[左哼哼]",src:"emoji/45.png"},{alt:"[右哼哼]",src:"emoji/46.png"},{alt:"[哈欠]",src:"emoji/47.png"},
	        	{alt:"[鄙视]",src:"emoji/48.png"},{alt:"[委屈]",src:"emoji/49.png"},{alt:"[快哭了]",src:"emoji/50.png"},{alt:"[阴险]",src:"emoji/51.png"},
	        	{alt:"[亲亲]",src:"emoji/52.png"},{alt:"[吓]",src:"emoji/53.png"},{alt:"[可怜]",src:"emoji/54.png"},{alt:"[菜刀]",src:"emoji/55.png"},
	        	{alt:"[西瓜]",src:"emoji/56.png"},{alt:"[啤酒]",src:"emoji/57.png"},{alt:"[篮球]",src:"emoji/58.png"},{alt:"[乒乓]",src:"emoji/59.png"},
	        	{alt:"[咖啡]",src:"emoji/60.png"},{alt:"[饭]",src:"emoji/61.png"},{alt:"[猪头]",src:"emoji/62.png"},{alt:"[玫瑰]",src:"emoji/63.png"},
	        	{alt:"[凋谢]",src:"emoji/64.png"},{alt:"[嘴唇]",src:"emoji/65.png"},{alt:"[爱心]",src:"emoji/66.png"},{alt:"[心碎]",src:"emoji/67.png"},
	        	{alt:"[蛋糕]",src:"emoji/68.png"},{alt:"[闪电]",src:"emoji/69.png"},{alt:"[炸弹]",src:"emoji/70.png"},{alt:"[刀]",src:"emoji/71.png"},
	        	{alt:"[足球]",src:"emoji/72.png"},{alt:"[瓢虫]",src:"emoji/73.png"},{alt:"[便便]",src:"emoji/74.png"},{alt:"[月亮]",src:"emoji/75.png"},
	        	{alt:"[太阳]",src:"emoji/76.png"},{alt:"[礼物]",src:"emoji/77.png"},{alt:"[拥抱]",src:"emoji/78.png"},{alt:"[强]",src:"emoji/79.png"},
	        	{alt:"[弱]",src:"emoji/80.png"},{alt:"[握手]",src:"emoji/81.png"},{alt:"[胜利]",src:"emoji/82.png"},{alt:"[抱拳]",src:"emoji/83.png"},
	        	{alt:"[勾引]",src:"emoji/84.png"},{alt:"[拳头]",src:"emoji/85.png"},{alt:"[差劲]",src:"emoji/86.png"},{alt:"[爱你]",src:"emoji/87.png"},
	        	{alt:"[NO]",src:"emoji/88.png"},{alt:"[OK]",src:"emoji/89.png"},{alt:"[爱情]",src:"emoji/90.png"},{alt:"[飞吻]",src:"emoji/91.png"},
	        	{alt:"[跳跳]",src:"emoji/92.png"},{alt:"[发抖]",src:"emoji/93.png"},{alt:"[怄火]",src:"emoji/94.png"},{alt:"[转圈]",src:"emoji/95.png"},
	        	{alt:"[磕头]",src:"emoji/96.png"},{alt:"[回头]",src:"emoji/97.png"},{alt:"[跳绳]",src:"emoji/98.png"},{alt:"[投降]",src:"emoji/99.png"},
	        	{alt:"[激动]",src:"emoji/100.png"},{alt:"[乱舞]",src:"emoji/101.png"},{alt:"[献吻]",src:"emoji/102.png"},{alt:"[左太极]",src:"emoji/103.png"},
	        	{alt:"[右太极]",src:"emoji/104.png"}
		],
		getList:function(){
			return this.list;
		},
		getEmoji:function(alt){
			var emoji=void 0;
			for(var i=0;i<this.list.length;i++){
				if(alt===this.list[i].alt){
					emoji=this.list[i];
					break;
				}
			}
			return emoji;
		}	
	};
	
	/**用户缓存*/
	IMChat.userCache={
		data:{},
		loadUser:function(userId,obj){
			if(this.data[userId]===undefined){
				this.data[userId]={};
				this.data[userId].list=[];
				if(obj){
					this.data[userId].list.push(obj);
				}
				IMChat.Ajax.request({
					type : "POST",
					url : "user/qryById",
					data:{
						USER_ID:userId
					},
					success:function(result){
						if(result.SUCCESS){
							IMChat.userCache.addUser(result.DATA);
						}
					}
				});
			}else{
				if(obj){
					this.data[userId].list.push(obj);
					obj.setUser(this.data[userId]);
				}
			}
		},
		addUser:function(user){
			var userId=user.USER_ID;
			this.data[userId].USER_ID=userId;
			this.data[userId].USER_NAME=user.USER_NAME;
			this.data[userId].REGION_CODE=user.REGION_CODE;
			this.data[userId].REGION_NAME=user.REGION_NAME;
			this.data[userId].USER_SEX=user.USER_SEX;
			this.data[userId].USER_DES=user.USER_DES;
			this.data[userId].USER_IMG=user.USER_IMG;
			this.refreshUser(userId);
		},
		refreshUser:function(userId){
			var user=this.data[userId];
			var list=user.list;
			for(var l=list.length-1;l>=0;l--){
				list[l].setUser(user);
			}
		},
		getUser:function(userId){
			return this.data[userId];
		}
	};
	IMChat.clientInfo=function() {
        var ua = navigator.userAgent,
            isWindowsPhone = /(?:Windows Phone)/.test(ua),
            isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone,
            isAndroid = /(?:Android)/.test(ua),
            isFireFox = /(?:Firefox)/.test(ua),
            isChrome = /(?:Chrome|CriOS)/.test(ua),
            isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tablet)/.test(ua)),
            isPhone = /(?:iPhone)/.test(ua) && !isTablet,
            isPc = !isPhone && !isAndroid && !isSymbian;
        return {
            isTablet: isTablet,
            isPhone: isPhone,
            isAndroid : isAndroid,
            isPc : isPc
        };
    }();
	/**初始化方法*/
	IMChat.load=function(){
		$("#pwdRegisterButton").click(function(){
			window.open("/register");
		});

		$("#loginButton").bind("click",function(){
		    if(!IMChat.clientInfo.isPc){
                IMChat.MessageBox.alert("请使用PC端浏览器",2000);
            }
			var user=$.trim($("#userId").val());
            var pwd=$("#userPwd").val();
			if(user===""||user===undefined){
			    IMChat.MessageBox.alert("请输入账号",1500);
			    return;
            }
            if(pwd===""||pwd===undefined){
                IMChat.MessageBox.alert("请输入密码",1500);
                return;
            }
            delete window.main;
            var main=window.main=new IMChat.Main();
			main.login({
				USER_ID:user,
				USER_PWD:pwd,
                CLIENT_TYPE:1
			});
		});

		$('#chatRoomListPanel').niceScroll({
		    cursorcolor: "#B5B5B5",
		    cursoropacitymax: 1,
		    touchbehavior: false,
		    cursorwidth: "5px",
		    cursorborder: "0",
		    cursorborderradius: "5px",
		    autohidemode: "cursor"
		});

		$('#addressListPanel').niceScroll({
		    cursorcolor: "#B5B5B5",
		    cursoropacitymax: 1,
		    touchbehavior: false,
		    cursorwidth: "5px",
		    cursorborder: "0",
		    cursorborderradius: "5px",
		    autohidemode: "cursor"
		});

		$('#searchResultListPanel').niceScroll({
		    cursorcolor: "#B5B5B5",
		    cursoropacitymax: 1,
		    touchbehavior: false,
		    cursorwidth: "5px",
		    cursorborder: "0",
		    cursorborderradius: "5px",
		    autohidemode: "cursor"
		});

		$('#chatContent').niceScroll({
		    cursorcolor: "#B5B5B5",
		    cursoropacitymin: 0,
		    cursoropacitymax: 1,
		    touchbehavior: false,
		    cursorwidth: "5px",
		    cursorborder: "0",
		    cursorborderradius: "5px",
		    autohidemode:"cursor",
		    smoothscroll: true
		});


		$("#sendButton").click(function(){
			IMChat.sendMessage();
		});

		var editor=window.editor=new IMChat.Editor("#chatMessageEditorMenu","#chatMessageEditorPanel");
		editor.customConfig.sendMessage=function(){
			IMChat.sendMessage();
		};
		editor.create();

		$('#chatMessageEditor').niceScroll({
			cursorcolor: "#B5B5B5",
			cursoropacitymin: 0,
			cursoropacitymax: 1,
			touchbehavior: false,
			cursorwidth: "5px",
			cursorborder: "0",
			cursorborderradius: "5px",
			autohidemode: "cursor"
		});

		$('#applyInfoListContentPanel').niceScroll({
			cursorcolor: "#B5B5B5",
			cursoropacitymin: 0,
			cursoropacitymax: 1,
			touchbehavior: false,
			cursorwidth: "5px",
			cursorborder: "0",
			cursorborderradius: "5px",
			autohidemode: "cursor"
		});
		/**最近聊天按钮*/
		$('#chatRoomButton').click(function(){
			if($("#chatRoomButton").attr("selected")!=="selected"){
				$("#friendButton").removeAttr("selected").removeClass("friendButtonActive").addClass("friendButtonNormal");
				$(this).attr("selected","selected").removeClass("chatRoomButtonNormal").addClass("chatRoomButtonActive");
				$("#chatRoomListPanel").css("display","");
				$("#addressListPanel").css("display","none");
				$("#searchResultListPanel").css("display","none");
				if(IMChat.selectedChatRoom!==undefined){
					IMChat.selectedChatRoom.showPanel();
				}
				$("#addressDetailsPanel").css("display","none");
			}
		});
		$('#friendButton').click(function(){
			if($("#friendButton").attr("selected")!=="selected"){
				$("#chatRoomButton").removeAttr("selected").removeClass("chatRoomButtonActive").addClass("chatRoomButtonNormal");
				$(this).attr("selected","selected").removeClass("friendButtonNormal").addClass("friendButtonActive");
				$("#chatRoomListPanel").css("display","none");
				$("#addressListPanel").css("display","");
				$("#searchResultListPanel").css("display","none");
				
				$("#chatPanel").css("display","none");
				$("#addressDetailsPanel").css("display","");
				if($("#addressListPanel .addressListItem[selected=selected]").length===0){
					IMChat.addressListPanel.doScrollTop();
				}
			}
		});

		$("#addressDetailsContentPanel").resize(function(e){
			var panel=this;
			if(panel.firstChild&&panel.firstChild.nodeName==="DIV"){
				$("#addressDetailsContentPanel div:first").css({
                    "height":$(panel).height(),
                    "width":$(panel).width()
                });
			}
		});
		
		window.onbeforeunload = function() {
			IMChat.chat.close();
		};
		IMChat.resizePanel();
		$(window).resize(function(){
			IMChat.resizePanel();
		});
		
		$("#searchButton").click(function(){
			var win=new IMChat.GroupChatWin();
			win.show();
		});
		
		$("#searchFriendButton").click(function(){
            
            var win = new IMChat.SearchFriendsWin();
			win.show();
		});
		
		$("#listButton").click(function(e){
            $(".contextmenu").hide();
			var menu=$(this).data("menu");
			if(!menu){
				menu=new IMChat.Menu({
					width:160,
					menuList:[{
						name:"账号设置",
						handler:function(){
							var win=new IMChat.UserInfoConfigWin();
							win.show();
						}
					},{
                        name:"密码修改",
                        handler:function(){
                            var win=new IMChat.PasswordChangeWin();
                            win.show();
                        }
                    },{
						name:"意见反馈",
						handler:function(){
                            var win=new IMChat.OpinionWin();
                            win.show();
						}
					},{
						name:"关于IMChat",
						handler:function(){
                            var win=new IMChat.AboutIMChat();
                            win.show();
						}
					}]
				});
				$(this).data("menu",menu);
			}
			var offset=$(this).offset();
			var width=$(this).outerWidth(true);
			menu.show(offset.top-160+42,offset.left+width+24);
			e.stopPropagation();
		});
		$(document).click(function(){
			$(".contextmenu").hide();
		});
        $(document).bind("contextmenu",function(e){
            return false;
        });
        IMChat.contextmenu=new Contextmenu();
        $("#userId").keypress(function(e){
            if(e.which===13){
                $("#userPwd").focus();
            }
        });
        $("#userPwd").keypress(function(e){
            if(e.which===13){
                $("#loginButton").trigger("click");
            }
        });
	};
	/**浏览器消息通知*/
	IMChat.notification=function(title, options){
		if ("Notification" in window) {
			if(Notification.permission==="granted"){//允许通知
				new Notification(title, options);
			} else if (Notification.permission === 'denied') {//拒绝通知
				
			} else {//请求获取通知权限
				Notification.requestPermission().then(function(PERMISSION){
					if (PERMISSION === 'granted') {
						new Notification(title, options);
					}
				});
			}
		}
	};
	/**计算各个panel 宽度 高度*/
	IMChat.resizePanel=function(){
	    var body=$("body");
		var height=body.height();
		height=height<=600?600:height;
		
		var chatWidth=1200;
		
		var optionWidth=80;
		var titleHeight=80;
		var listWidth=260;
		
        $("#panel").css({
            "height":height,
            "width":chatWidth
        });
		/**左侧操作面板*/
		$("#optionPanel").css({
            "height":height,
            "width":optionWidth
        });
		/**中间列表面板*/
		$("#listPanel").css({
            "height":height,
            "width":listWidth
        });

		$("#searchListPanel").css({
            "height":titleHeight,
            "width":listWidth
        });

		$("#listViewPanel").css({
            "height":height-titleHeight,
            "width":listWidth
        });
		/**聊天列表*/
		$("#chatRoomListPanel").css({
            "height":height-titleHeight,
            "width":listWidth
        });
		/**好友列表*/
		$("#addressListPanel").css({
            "height":height-titleHeight,
            "width":listWidth
        });
		/**搜索列表*/
		$("#searchResultListPanel").css({
            "height":height-titleHeight,
            "width":listWidth
        });
		
		$("#chatPanel").css({
            "height":height,
            "width":chatWidth-listWidth-optionWidth
        });
		
		$("#addressDetailsPanel").css({
            "height":height,
            "width":chatWidth-listWidth-optionWidth
        });
		
		$("#chatContentPanel").css({
            "height":height-240-80,
            "width":chatWidth-listWidth-optionWidth
        });
		
		$("#chatContent").css({
            "height":height-240-80,
            "width":chatWidth-listWidth-optionWidth
        });
		
		$("#chatMessageEditorPanel").css("width",chatWidth-listWidth-optionWidth);
		
		$("#addressDetailsContentPanel").css({
            "height":height-80,
            "width":chatWidth-listWidth-optionWidth
        });

		$("#applyInfoListPanel").css({
			"height":height,
			"width":chatWidth-listWidth-optionWidth
		});

		$("#applyInfoListContentPanel").css({
			"height":height-80,
			"width":chatWidth-listWidth-optionWidth
		});
	};
	/**透明的遮罩层*/
	IMChat.transparentMaskLayer={
		show:function(){
			$("#maskLayer").css("display","");
		},
		hidden:function(){
			$("#maskLayer").css("display","none");
		}
	};
	IMChat.test=function(url,data){
		IMChat.Ajax.request({
			type : "POST",
			url : url,
			data:data,
			success:function(result){
				console.log(result);
			}
		});
	};
	
})();