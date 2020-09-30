/**
 * 聊天列表 item类
 * ChatRoomItem 聊天列表
 * */
var IMChat = window.IMChat = IMChat || {};
(function(){
	/**聊天列表的 item*/
	function ChatRoomItem(option){
		IMChat.Item.call(this);
		var item=this;
		var chatId=option.CHAT_ID;
		/**1 普通聊天 2 群聊*/
		var chatType=option.CHAT_TYPE;
		var userId=option.USER_ID;
		var chatImg=option.CHAT_IMG===undefined?undefined:option.CHAT_IMG;
		var roomName=option.ROOM_NAME;
		
		/**消息内容*/
		var messageList=[];
		var stickSign=option.STICK_SIGN;
		var sortIndex=option.SORT_INDEX;
		var lastChatDate=new Date(option.LAST_CHAT_DATE);
		/**聊天列表 头像属性*/
		var headImg=undefined;
		var lastChatDateDiv=undefined;
		var unreadMessageNumDiv=undefined;
		var roomNameDiv=undefined;
		var unreadMessageNum=0;
		var lastChat=undefined;
		
		/**初始换Item*/
		this.initItem=function(){
			this._item=$("<div>");
			this._item.addClass("chatRoomListItem");
			this._item.css("height",80);
			this._item.css("width",260);
			if(stickSign===1){
				this._item.css("background-color","#CFCFCF");
				this._item.attr("stickSign",true);
			}
			
			/**头像区域*/
			var headImgDiv=$("<div>");
			headImgDiv.css("float","left");
			headImgDiv.css("width",80);
			headImgDiv.css("height",80);
			headImgDiv.css("position","relative");
			
			headImg=$("<img src='' alt=''>");
			headImg.css("position","relative");
			headImg.css("width",50);
			headImg.css("height",50);
			headImg.css("border-radius","5px");
			headImg.css("top","15px");
			
			if(chatImg){
				headImg.attr("src","data:image/png;base64,"+chatImg);
			}else{
				headImg.attr("src","image/logo.png");
			}
			headImgDiv.append(headImg);
			
			unreadMessageNumDiv=$("<div>");
			unreadMessageNumDiv.css("position","absolute");
			unreadMessageNumDiv.css("color","white");
			unreadMessageNumDiv.css("font-size","14px");
			
			unreadMessageNumDiv.css("text-align","center");
			unreadMessageNumDiv.css("top","2px");
			unreadMessageNumDiv.css("right","5px");
			unreadMessageNumDiv.css("width","24px");
			unreadMessageNumDiv.css("height","24px");
			unreadMessageNumDiv.css("line-height","24px");
			unreadMessageNumDiv.css("background-color","red");
			unreadMessageNumDiv.css("-webkit-border-radius","24px");
			unreadMessageNumDiv.css("border-radius","24px");
			unreadMessageNumDiv.css("display","none");
			
			unreadMessageNumDiv.text(0);
			headImgDiv.append(unreadMessageNumDiv);
			
			this._item.append(headImgDiv);

			/**昵称和最近聊天内容*/
			var center=$("<div>");
			center.css("float","left");
			center.css("width",120);
			center.css("height",80);
			roomNameDiv=$("<div>");
			roomNameDiv.css("width","120px");
			roomNameDiv.css("height","35px");
			roomNameDiv.css("line-height","35px");
			roomNameDiv.css("text-align","left");
			roomNameDiv.css("font-size","16px");
			roomNameDiv.css("margin-top","10px");
			roomNameDiv.css("overflow","hidden");
			roomNameDiv.css("white-space","nowrap");
			roomNameDiv.css("text-overflow","ellipsis");
			roomNameDiv.text(roomName);//聊天房间名称
			center.append(roomNameDiv);
			
			lastChat=$("<div>");
			lastChat.css("width","120px");
			lastChat.css("height","25px");
			lastChat.css("line-height","25px");
			lastChat.css("text-align","left");
			lastChat.css("font-size","14px");
			lastChat.css("color","#363636");
			lastChat.css("overflow","hidden");
			lastChat.css("white-space","nowrap");
			lastChat.css("text-overflow","ellipsis");
			lastChat.text("");//最近聊天内容
			center.append(lastChat);
			
			this._item.append(center);
			
			var right=$("<div>");
			right.css("float","left");
			right.css("width",60);
			right.css("height",80);
			
			lastChatDateDiv=$("<div>");
			lastChatDateDiv.css("width",50);
			lastChatDateDiv.css("height",35);
			lastChatDateDiv.css("line-height","35px");
			lastChatDateDiv.css("text-align","right");
			lastChatDateDiv.css("font-size","14px");
			lastChatDateDiv.css("margin-top","10px");
			lastChatDateDiv.css("padding-right","10px");
			lastChatDateDiv.text("");//最近聊天时间
			right.append(lastChatDateDiv);
			
			this._item.append(right);
		};
		this.initItem();
		this._item.hover(function(){//移入
			if($(this).attr("selected")===undefined){
				$(this).css("background-color","#C8C8C8");
			}
		},function(){
			if($(this).attr("selected")===undefined){
				if(stickSign===1){
					$(this).css("background-color","#CFCFCF");
				}else{
					$(this).css("background-color","");
				}
			}
		});

        this._item.unbind("mousedown").bind("contextmenu", function (e) {
            e.preventDefault();
            return false;
        });
        this._item.unbind("mousedown").bind("mousedown", function (event) {
            if (event.which === 3) {
                $(".contextmenu").hide();
                IMChat.contextmenu.show(item.contextmenu(),event.clientX,event.clientY);
            }
        });
        var contextmenu={
            "stick":{
                menuId:"stick",
                name:"置顶",
                handler:function () {
                    IMChat.Ajax.request({
                        type : "POST",
                        url : "chatroom/stickSign",
                        data:{
                            USER_ID:userId,
                            CHAT_TYPE:chatType,
                            CHAT_ID:chatId,
                            STICK_SIGN:1
                        },
                        success:function(result){
                            item.setStickSign(result.DATA.STICK_SIGN);
                            item.setSortIndex(result.DATA.SORT_INDEX);
                            IMChat.chatRoomListPanel.refresh();
                        }
                    });
                },
                scope:item
            },
            "cancel-stick":{
                menuId:"cancel-stick",
                name:"取消置顶",
                handler:function () {
                    IMChat.Ajax.request({
                        type : "POST",
                        url : "chatroom/stickSign",
                        data:{
                            USER_ID:userId,
                            CHAT_TYPE:chatType,
                            CHAT_ID:chatId,
                            STICK_SIGN:0
                        },
                        success:function(result){
                            item.setStickSign(result.DATA.STICK_SIGN);
                            item.setSortIndex(result.DATA.SORT_INDEX);
                            IMChat.chatRoomListPanel.refresh();
                        }
                    });
                },
                scope:item
            },
            "modify-grouchatname":{
                menuId:"modify-grouchatname",
                name:"修改群名称",
                handler:function () {
                    var win=new IMChat.GroupChatModifyNameWin({
                        groupId:chatId,
                        groupName:roomName,
                        sourceType:"ChatRoom",
                        source:item
                    });
                    win.show();
                },
                scope:item
            },
            "delete-chat":{
                menuId:"delete-chat",
                name:"删除聊天",
                handler:function () {
                    IMChat.Ajax.request({
                        type : "POST",
                        url : "chatroom/delete",
                        data:{
                            USER_ID:userId,
                            CHAT_TYPE:chatType,
                            CHAT_ID:chatId
                        },
                        success:function(result){
                            if(IMChat.selectedChatRoom===item){
                                $("#emptyPanel").css("display","");
                                $("#chatPanel").css("display","none");
                                $("#addressDetailsPanel").css("display","none");
                                $("#applyInfoListPanel").css("display","none");
                            }
                            IMChat.chatRoomListPanel.removeChatRoom(item);
                            IMChat.chatRoomListPanel.refresh();
                        }
                    });
                },
                scope:item
            }
        };
        this.contextmenu=function(){
            var menus={
                "delete-chat":contextmenu["delete-chat"]
            };
            if(stickSign===0){// 默认
                menus["stick"]=contextmenu["stick"];
            }else if(stickSign===1){// 置顶
                menus["cancel-stick"]=contextmenu["cancel-stick"];
            }
            if(chatType===2){
                menus["modify-grouchatname"]=contextmenu["modify-grouchatname"];
            }
            return menus;
        };
        
		this.showPanel=function(){
			$("#emptyPanel").css("display","none");
			$("#chatPanel").css("display","");
			$("#addressDetailsPanel").css("display","none");
			$("#applyInfoListPanel").css("display","none");
		};
		this._item.click(function(){
			item.selected(this);
			IMChat.selectedChatRoom=item;
			item.showPanel();
			unreadMessageNumDiv.css("display","none");
			unreadMessageNum=0;
			$("#chatTitle").text(roomName);
			
			$("#chatContent div.message").detach();
			/**
			 * 按照倒叙添加 最新的消息添加到底部
			 * */
			for(var i=messageList.length;i>0;i--){
				var message=messageList[i-1];
				if(i===messageList.length){
					$("#chatContent").append(message._div);
				}else{
					$($("#chatContent div.message:first")[0]).before(message._div);
				}
			}
			if(messageList.length>0){
				messageList[messageList.length-1].scrollToBottom();
			}
		});
		/**初始化头像*/
		this.init=function(){
			if(chatType===1){
				IMChat.userCache.loadUser(chatId,this);
			} 
			if(chatType===2){
				IMChat.Ajax.request({
					type : "POST",
					url : "groupchat/qryByGroupId",
					data:{
						GROUP_ID:chatId
					},
					success:function(result){
						if(result.SUCCESS){
							chatImg=result.DATA.GROUP_IMG;
							headImg.attr("src","data:image/png;base64,"+result.DATA.GROUP_IMG);
						}
					}
				});
			} 
		};
		this.create=function(){
			IMChat.Ajax.request({
				type : "POST",
				url : "chatroom/create",
				data:{
					USER_ID:IMChat.user.USER_ID,
					CHAT_TYPE:chatType,
					CHAT_ID:chatId
				},
				success:function(result){
					item.setLastChatDate(result.DATA.LAST_CHAT_DATE);
				}
			});
		};
		this.addMeaasge=function(message){
			messageList.push(message);
		};
		this.getChatId=function(){
			return chatId;
		};
		this.getChatType=function(){
			return chatType;
		};
		this.getStickSign=function(){
			return stickSign;
		};
        this.setStickSign=function(_stickSign){
            stickSign=_stickSign;
            if(stickSign===0){
                this._item.css("background-color","");
                this._item.removeAttr("stickSign");
            }
            if(stickSign===1){
                this._item.css("background-color","#CFCFCF");
                this._item.attr("stickSign",true);
            }
        };
		this.getSortIndex=function(){
			return sortIndex;
		};
        this.setSortIndex=function(_sortIndex){
            sortIndex=_sortIndex;
        };
		this.getLastChatDate=function(){
			return lastChatDate;
		};
		this.setLastChat=function(_lastChat){
            lastChat.html(_lastChat);
        };
		this.setLastChatDate=function(chatDate){
			lastChatDate=chatDate;
			this.refreshChatDate();
		};
		/**打开房间*/
		this.open=function(){
			$('#chatRoomButton').trigger("click");
			this._item.trigger("click");
		};
		/**刷新聊天时间*/
		this.refreshChatDate=function(){
			var newTime=new Date();
			var date=new Date(lastChatDate);
			
			var today=new Date(newTime.getFullYear()+"/"+(newTime.getMonth()+1)+"/"+newTime.getDate());
			if((today.getTime()-lastChatDate)>0 && (today.getTime()-lastChatDate)<=86400000) {  
	            lastChatDateDiv.text("昨天");
	        } else if((today.getTime()-lastChatDate)<=0){
	        	lastChatDateDiv.text(date.getHours()+":"+(date.getMinutes()<10?("0"+date.getMinutes()):date.getMinutes()));
	        } else{
	        	var year = date.getFullYear().toString().substr(2, 2);
	            var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
	            var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
	        	lastChatDateDiv.text(year+"/"+month+"/"+day);
	        }
		};
		this.setUser=function(user){
			chatImg=user.USER_IMG;
			headImg.attr("src","data:image/png;base64,"+user.USER_IMG);
		};
		this.refreshChatDate();
		this.addUnreadMessageNum=function(){
			unreadMessageNum++;
			unreadMessageNumDiv.text(unreadMessageNum);
			unreadMessageNumDiv.css("display","");
		};
		this.setRoomName=function(value){
			roomName=value;
			roomNameDiv.text(roomName);
			if(IMChat.selectedChatRoom===item){
				$("#chatTitle").text(roomName);
			}
		};
		this.getClass=function(){
		    return "ChatRoomItem";
        };

	}
	/**验证消息*/
	function ApplyInfoItem(){
		IMChat.Item.call(this);
		var item = this;
		var stickSign=0;
		var sortIndex=0;
		var lastChatDate=new Date(0);
		var unreadMessageNumDiv=undefined;
		var unreadMessageNum=0;
		/**消息内容*/
		var messageList=[];
		
		/**初始换Item*/
		this.initItem=function(){
			this._item=$("<div>");
			this._item.addClass("chatRoomListItem");
			this._item.css({
				"height":80,
				"width":260
			});

			/**头像区域*/
			var headImgDiv=$("<div>");
			headImgDiv.css("float","left");
			headImgDiv.css("width",80);
			headImgDiv.css("height",80);
			headImgDiv.css("position","relative");

			var headImg=$("<img src='' alt=''>");
			headImg.css("position","relative");
			headImg.css("width",50);
			headImg.css("height",50);
			headImg.css("border-radius","5px");
			headImg.css("top","15px");
			headImg.attr("src","image/apply_message.png");
			headImgDiv.append(headImg);

			unreadMessageNumDiv=$("<div>");
			unreadMessageNumDiv.css("position","absolute");
			unreadMessageNumDiv.css("color","white");
			unreadMessageNumDiv.css("font-size","14px");

			unreadMessageNumDiv.css("text-align","center");
			unreadMessageNumDiv.css("top","2px");
			unreadMessageNumDiv.css("right","5px");
			unreadMessageNumDiv.css("width","24px");
			unreadMessageNumDiv.css("height","24px");
			unreadMessageNumDiv.css("line-height","24px");
			unreadMessageNumDiv.css("background-color","red");
			unreadMessageNumDiv.css("-webkit-border-radius","24px");
			unreadMessageNumDiv.css("border-radius","24px");
			unreadMessageNumDiv.css("display","none");

			unreadMessageNumDiv.text(0);
			headImgDiv.append(unreadMessageNumDiv);

			this._item.append(headImgDiv);

			/**昵称和最近聊天内容*/
			var center=$("<div>");
			center.css("float","left");
			center.css("width",120);
			center.css("height",80);
			var roomNameDiv=$("<div>");
			roomNameDiv.css("width","120px");
			roomNameDiv.css("height","35px");
			roomNameDiv.css("line-height","35px");
			roomNameDiv.css("text-align","left");
			roomNameDiv.css("font-size","16px");
			roomNameDiv.css("margin-top","10px");
			roomNameDiv.css("overflow","hidden");
			roomNameDiv.css("white-space","nowrap");
			roomNameDiv.css("text-overflow","ellipsis");
			roomNameDiv.text("验证消息");//聊天房间名称
			center.append(roomNameDiv);

			var lastChat=$("<div>");
			lastChat.css("width","120px");
			lastChat.css("height","25px");
			lastChat.css("line-height","25px");
			lastChat.css("text-align","left");
			lastChat.css("font-size","14px");
			lastChat.css("color","#363636");
			lastChat.css("overflow","hidden");
			lastChat.css("white-space","nowrap");
			lastChat.css("text-overflow","ellipsis");
			lastChat.text("");//最近聊天内容
			center.append(lastChat);

			this._item.append(center);
			
		};
		this.initItem();
		this._item.hover(function(){//移入
			if($(this).attr("selected")===undefined){
				$(this).css("background-color","#C8C8C8");
			}
		},function(){
			if($(this).attr("selected")===undefined){
				if(stickSign===1){
					$(this).css("background-color","#CFCFCF");
				}else{
					$(this).css("background-color","");
				}
			}
		});
		this.showPanel=function(){
			$("#emptyPanel").css("display","none");
			$("#chatPanel").css("display","none");
			$("#addressDetailsPanel").css("display","none");
			$("#applyInfoListPanel").css("display","");
		};
		this._item.click(function(){
			item.selected(this);
			IMChat.selectedChatRoom=item;
			item.showPanel();
			unreadMessageNumDiv.css("display","none");
			unreadMessageNum=0;
		});
		
		this.init=function(){};
		this.getStickSign=function(){
			return stickSign;
		};
		this.getSortIndex=function(){
			return sortIndex;
		};
		this.getLastChatDate=function(){
			return lastChatDate;
		};
		this.setLastChatDate=function(chatDate){
			lastChatDate=chatDate;
		};
		/**验证消息初始化*/
		this.messageInit=function(){
			IMChat.Ajax.request({
				type : "POST",
				url : "applyinfo/list",
				data:{
					USER_ID:IMChat.user.USER_ID
				},
				success:function(result){
					if(result.DATA&&result.DATA.length>0){
						for(var i=0;i<result.DATA.length;i++){
							messageList.push(new ApplyInfo(result.DATA[i]));
						}
					}
				}
			});
		};
        this.getClass=function(){
            return "ApplyInfoItem";
        };
		this.addMeaasge=function(message){
			messageList.push(message);
		};
		this.getMeaasge=function(){
			return messageList;
		};
		this.addUnreadMessageNum=function(){
			unreadMessageNum++;
			unreadMessageNumDiv.text(unreadMessageNum);
			unreadMessageNumDiv.css("display","");
		};
	}
	/**认证消息*/
	function ApplyInfo(option){
		var _this=this;
		var applyId=option.APPLY_ID;
		var applyUserId=option.APPLY_USER_ID;
		var applyUserName=option.APPLY_USER_NAME;
		var appendMessage=option.APPEND_MESSAGE===undefined?"":option.APPEND_MESSAGE;
		var applyState=option.APPLY_STATE;
		var applyType=option.APPLY_TYPE;
		
		var listPanel=$("#applyInfoListContentPanel");
		var div=$("<div>");
		
		div.css({
			"width":"100%",
			"height":"100px",
			"margin-top":"5px"
		});
		var info=$("<div>");
		info.css({
			"height": "100px",
			"margin": "0px 150px",
			"background-color":"rgb(249 249 250)",
			"border":"1px solid #e6e6e6",
            "border-radius": "5px"
		});
		var img=$("<img src='' alt=''>");
		img.css({
			"width":80,
			"height":80,
			"float": "left",
			"margin-top": "10px",
			"margin-left": "20px",
			"border-radius": "10px"
		});
        img.attr("src","image/logo.png");
		info.append(img);
		/**昵称 认证消息 群昵称*/
		var centerDiv=$("<div>");
        centerDiv.css({
            "width":240,
            "height":80,
            "float": "left",
            "margin-top": "10px",
            "margin-left": "10px"
        });
        var label=$("<div>");
        label.css({
            "width":240,
            "height":40,
            "line-height":"40px",
            "text-align":"left"
        });
        if(applyType===1){
			label.html("<span style='color:#00BFFF;'>"+applyUserName+"</span><span style='font-size:14px;'> 来自好友申请</span>");
		}else if(applyType===2){
			label.html("<span style='color:#00BFFF;'>"+applyUserName+"</span><span> 申请加入群 </span><span style='color:#00BFFF;'>"+option.GROUP_NAME+"</span>");
		}else{
			label.html(applyUserName);
		}
        centerDiv.append(label);
        /**附加消息*/
        var appendLabel=$("<div>");
        appendLabel.css({
            "width":240,
            "height":40,
            "line-height":"40px",
            "text-align":"left",
            "font-size":"14px"
        });
        appendLabel.html("<span style='color:#B5B5B5'>附加消息:</span>"+appendMessage);
        centerDiv.append(appendLabel);
        
        info.append(centerDiv);
        
        /**按钮*/
		var buttonDiv=$("<div>");
		buttonDiv.css({
			"width":150,
			"height":80,
			"line-height":"80px",
			"float": "right",
			"margin-top": "10px",
			"margin-left": "10px"
		});
		
		var agreeBut=$("<button>");//initial
		agreeBut.css({
			"display":applyState===0?"initial":"none"
		});
		agreeBut.text("同意");
		agreeBut.click(function(){
			_this.deal(1);
		});
		buttonDiv.append(agreeBut);
		
		var denyBut=$("<button>");
		denyBut.css({
			"display":applyState===0?"initial":"none",
			"margin-left": "10px"
		});
		denyBut.text("拒绝");
		denyBut.click(function(){
			_this.deal(2);
		});
		buttonDiv.append(denyBut);
		
		var stateLabel=$("<span>");
		stateLabel.css({
			"display":applyState!==0?"initial":"none",
			"color":"#B5B5B5"
		});
		stateLabel.text(applyState===0?"":applyState===1?"已同意":"已拒绝");
		buttonDiv.append(stateLabel);
		
		info.append(buttonDiv);
		
		div.append(info);
		listPanel.append(div);
		this.setUser=function(user){
            img.attr("src","data:image/png;base64,"+user.USER_IMG);
        };
        IMChat.userCache.loadUser(applyUserId,this);
        /**处理申请状态*/
        this.deal=function(state){
        	IMChat.Ajax.request({
				type : "POST",
				url : "applyinfo/deal",
				data:{
					APPLY_ID:applyId,
					APPLY_STATE:state
				},
				success:function(result){
					applyState=state;
					_this.refresh();
					if(result.DATA){
						var friendItem=new IMChat.FriendItem(result.DATA);
						IMChat.addressListPanel.addFriend(friendItem);
						friendItem.init();
						IMChat.addressListPanel.refresh();
						//打开聊天
						friendItem.openChatRoom();
						
						var item=IMChat.chatRoomListPanel.getChatRoom(friendItem.getFriendId(),IMChat.user.USER_ID,1,"");

						var message=new IMChat.RightTextMessage({
							content:"我通过了你的朋友验证请求,现在我们可以开始聊天了"
						});
						message.sendMessage(item);
						message.append();
						item.addMeaasge(message);
					}
				}
			});	
		};
        this.refresh=function(){
			agreeBut.css({
				"display":applyState===0?"initial":"none"
			});
			denyBut.css({
				"display":applyState===0?"initial":"none"
			});
			stateLabel.css({
				"display":applyState!==0?"initial":"none"
			});
			stateLabel.text(applyState===0?"":applyState===1?"已同意":"已拒绝");
		};
	}
	IMChat.ChatRoomItem=ChatRoomItem;
	IMChat.ApplyInfoItem=ApplyInfoItem;
	IMChat.ApplyInfo=ApplyInfo;
})();