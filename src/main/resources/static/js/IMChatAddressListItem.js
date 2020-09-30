/**
 * 通讯录列表 item类
 * 
 * ChatItem 聊天列表
 * FriendItem 好友列表
 * */
var IMChat = window.IMChat = IMChat || {};
(function(){
	/**
	 * 字符串分割的item
	 * */
	function StringItem(str,border){
		IMChat.Item.call(this);
		this._item=$("<div>");
		this._item.addClass("addressListItem");
		
		this._item.css("height",30);
		this._item.css("width",260);
		this._item.css("text-align","left");
		this._item.css("font-size","14px");
		this._item.css("line-height","20px");
		this._item.css("color","#828282");
		this._item.css("position","relative");
		this._item.css("border-color","#CFCFCF");
		this._item.css("border-style","solid");
		if(border===true){
			this._item.css("border-width","1px 0px 0px 0px");
		}else{
			this._item.css("border-width","0px 0px 0px 0px");
		}
		
		var span=$("<span>");
		span.css("height","20px");
		span.css("width","100px");
		span.css("margin-top","8px");
		span.css("margin-left","15px");
		span.css("position","absolute");
		span.css("boottom","2px");
		span.text(str);
		this._item.append(span);
	}
	/**
	 * 群聊Item
	 * */
	function GroupChatItem(option){
		IMChat.Item.call(this);
		var item=this;
		var groupId=option.GROUP_ID;
		var groupName=option.GROUP_NAME;
		var groupImg=undefined;
		var numbers={};
		
		this._item=$("<div>");
		this._item.addClass("addressListItem");
		
		this._item.css("height",80);
		this._item.css("width",260);
		
		this._item.hover(function(){//移入
			if($(this).attr("selected")===undefined){
				$(this).css("background-color","#CFCFCF");
			}
		},function(){
			if($(this).attr("selected")===undefined){
				$(this).css("background-color","");
			}
		});

        var contextmenu={
            "send-message":{
                menuId:"send-message",
                name:"发消息",
                handler:function(){
                    IMChat.chatRoomListPanel.openChatRoom(2,groupId,groupName,groupImg);
                }
            },
            "modify-grouchatname":{
                menuId:"modify-grouchatname",
                name:"修改群名称",
                handler:function(){
                    var win=new IMChat.GroupChatModifyNameWin({
                        groupId:groupId,
                        groupName:groupName,
                        sourceType:"GroupChat",
                        source:item
                    });
                    win.show();
                }
            },
            "delete-exit":{
                menuId:"delete-exit",
                name:"删除并退出群组",
                handler:function(){
                    new IMChat.MesaageConfirmWin({
                        title:"删除并退出群组",
                        content:"确定删除并退出 "+groupName+" ?",
                        confirm:function(){
                            item.deleteAndExit();
                        },
                        scope:item
                    }).show()
                }
            }
        };

        this._item.unbind("mousedown").bind("contextmenu", function (e) {
            e.preventDefault();
            return false;
        });
        this._item.unbind("mousedown").bind("mousedown", function (event) {
            if (event.which === 3) {
                $(".contextmenu").hide();
                IMChat.contextmenu.show(contextmenu,event.clientX,event.clientY);
            }
        });
		
		this._item.click(function(){
			item.selected(this);
			$("#emptyPanel").css("display","none");
			$("#chatPanel").css("display","none");
			$("#addressDetailsPanel").css("display","");
			$("#applyInfoListPanel").css("display","none");
			
			$("#addressDetailsTitlePanel").css("border-bottom","1px solid #e6e6e6");
			$("#addressDetailsTitle").text(groupName);
			
			var panel=$("#addressDetailsContentPanel");
			panel.empty();
			/**展示群成员*/
			var content=$("<div>");
			content.css("height",panel.height());
			content.css("width",panel.width());
			
			/**成员面板*/
			var numberPanel=$("<div>");
			numberPanel.css("width",panel.width()-240);
			numberPanel.css("height",panel.height()-150-20);
			numberPanel.css("padding","10px 120px 10px 120px");

			for(var attr in numbers){
				var number=numbers[attr];
				var numberItemPanel=$("<div>");
				numberItemPanel.css("width",120);
				numberItemPanel.css("height",130);
				numberItemPanel.css("float","left");
				numberItemPanel.css("cursor","pointer");
				
				var img=$("<img src='' alt=''>");
				img.css("width",80);
				img.css("height",80);
				img.css("margin-top","8px");
				img.css("border-radius","5px");
				
				var imgData=number.getImg();
				if(imgData){
					img.attr("src","data:image/png;base64,"+imgData);
				}else{
					img.attr("src","image/logo.png");
				}
				numberItemPanel.append(img);
				
				var span=$("<div>");
				span.css("width",100);
				span.css("height",40);
				span.css("padding","0px 10px 0px 10px");
				span.css("overflow","hidden");
				span.css("text-overflow","ellipsis");
				span.css("white-space","nowrap");
				span.css("line-height","40px");
				span.text(number.getName());
				numberItemPanel.append(span);
				
				numberItemPanel.hover(function(){
					this.style.backgroundColor="#E8E8E8";
				},function(){
					this.style.backgroundColor="";
				});
				numberPanel.append(numberItemPanel);
			}
			content.append(numberPanel);
			/**按钮面板*/
			var buttonPanel=$("<div>");
			buttonPanel.css("width",panel.width());
			buttonPanel.css("height",150);
			
			var button=$("<button>");
			button.css("width",150);
			button.css("height",50);
			button.css("font-size","20px");
			button.css("margin-top","10px");
			button.text("发消息");
			
			button.click(function(){
				IMChat.chatRoomListPanel.openChatRoom(2,groupId,groupName,groupImg);
			});
			
			buttonPanel.append(button);
			content.append(buttonPanel);
			
			panel.append(content);
			
			content.resize(function(){
				numberPanel.css("width",content.width()-240);
				numberPanel.css("height",content.height()-150-20);
			});
			
			numberPanel.niceScroll({
			    cursorcolor: "#B5B5B5",
			    cursoropacitymax: 1,
			    touchbehavior: false,
			    cursorwidth: "5px",
			    cursorborder: "0",
			    cursorborderradius: "5px",
			    autohidemode: "cursor"
			});
		});
		
		/**头像区域*/
		var headImgDiv=$("<div>");
		headImgDiv.css("float","left");
		headImgDiv.css("width",80);
		headImgDiv.css("height",80);
		var headImg=$("<img src='' alt=''>");
		headImg.css("position","relative");
		headImg.css("width",50);
		headImg.css("height",50);
		headImg.css("border-radius","5px");
		headImg.css("top","15px");
		headImg.attr("src","image/logo.png");
		headImgDiv.append(headImg);
		
		this._item.append(headImgDiv);
		
		var center=$("<div>");
		center.css("float","left");
		center.css("width",180);
		center.css("height",80);
		center.css("line-height","80px");
		center.css("text-align","left");
		center.css("font-weight","500");
		center.css("font-size","18px");
		center.css("overflow","hidden");
		center.css("white-space","nowrap");
		center.css("text-overflow","ellipsis");
		
		center.text(groupName);
		this._item.append(center);
		this.init=function(){
			this.groupChatImgInit();
			this.groupChatNumberInit();
		};
		/**加载群头像*/
		this.groupChatImgInit=function(){
			IMChat.Ajax.request({
				type : "POST",
				url : "groupchat/qryByGroupId",
				data:{
					GROUP_ID:groupId
				},
				success:function(result){
					if(result.SUCCESS){
						groupImg=result.DATA.GROUP_IMG;
						headImg.attr("src","data:image/png;base64,"+groupImg);
					}
				}
			});
		};
		/**加载群成员*/
		this.groupChatNumberInit=function(){
			IMChat.Ajax.request({
				type : "POST",
				url : "groupchatnumber/qryByGroupId",
				data:{
					GROUP_ID:groupId
				},
				success:function(result){
					if(result.SUCCESS){
						result.DATA.forEach(function(number){
							numbers[number.NUMBER_ID]=new GroupChatNumberItem(number);
						});
						item.numberInit();
					}
				}
			});
		};
		/**成员初始化*/
		this.numberInit=function(){
			for(var attr in numbers){
				numbers[attr].init();
			}
		};
		
		this.getGroupId=function () {
            return groupId;  
        };
		
		this.setGroupName=function(_groupName){
            groupName=_groupName;
            center.text(groupName);
        };

        this.getGroupName=function(){
            return groupName;
        };
        
        this.deleteAndExit=function(){
            IMChat.Ajax.request({
                type : "POST",
                url : "groupchat/deleteNumber",
                data:{
                    GROUP_ID:groupId,
                    NUMBER_ID:IMChat.user.USER_ID
                },
                success:function(result){
                    IMChat.addressListPanel.removeGroupChat(groupId);
                    IMChat.addressListPanel.refresh();
                    var chatRoomItem=IMChat.chatRoomListPanel.getChatRoomItem(groupId,2);
                    if(chatRoomItem){
                        IMChat.chatRoomListPanel.removeChatRoom(chatRoomItem);
                        IMChat.chatRoomListPanel.refresh();
                    }
                    $("#emptyPanel").css("display","");
                    $("#chatPanel").css("display","none");
                    $("#addressDetailsPanel").css("display","none");
                    $("#applyInfoListPanel").css("display","none");
                    IMChat.MessageBox.alert("退群成功");
                }
            });
        };
	}
	/**
	 * 群成员Item
	 * */
	function GroupChatNumberItem(option){
		var groupNickName=option.GROUP_NICK_NAME;
		var numberId=option.NUMBER_ID;
		var img=void 0;
		var userName=void 0;
		this.init=function(){
			IMChat.userCache.loadUser(numberId,this);
		};
		this.getImg=function(){
			return img;
		};
		this.getName=function(){
			if(groupNickName){
				return groupNickName;
			}
			return userName;
		};
		this.setUser=function(user){
			img=user.USER_IMG;
			userName=user.USER_NAME;
		};
	}
	
	/**
	 * 好友用户Item
	 * */
	function FriendItem(option){
		IMChat.Item.call(this);
		var item=this;
		var userId=option.USER_ID;
		var friendId=option.FRIEND_ID;
		var friendName=option.FRIEND_NAME;
		var remarkName=option.REMARK_NAME?option.REMARK_NAME:"";
		var userSex=option.USER_SEX;
		var userDes=option.USER_DES?option.USER_DES:"";
		var userImg=void 0;
		var regionName=option.REGION_NAME;
		
		this._item=$("<div>");
		this._item.addClass("addressListItem");
		
		this._item.css("height",80);
		this._item.css("width",260);
		
		this._item.hover(function(){//移入
			if($(this).attr("selected")===undefined){
				$(this).css("background-color","#CFCFCF");
			}
		},function(){
			if($(this).attr("selected")===undefined){
				$(this).css("background-color","");
			}
		});

        var contextmenu={
            "send-message":{
                menuId:"send-message",
                name:"发消息",
                handler:function(){
                    item.openChatRoom();
                }
            },
            "delete-friend":{
                menuId:"delete-friend",
                name:"删除朋友",
                handler:function(){
                    new IMChat.MesaageConfirmWin({
                        title:"删除朋友",
                        content:"确定删除 "+friendName+" ?",
                        confirm:function(){
                            item.deleteFriend();
                        },
                        scope:item
                    }).show()
                }
            }
        };

        this._item.unbind("mousedown").bind("contextmenu", function (e) {
            e.preventDefault();
            return false;
        });
        this._item.unbind("mousedown").bind("mousedown", function (event) {
            if (event.which === 3) {
                $(".contextmenu").hide();
                IMChat.contextmenu.show(contextmenu,event.clientX,event.clientY);
            }
        });
		
		this._item.click(function(){
			item.selected(this);
			$("#emptyPanel").css("display","none");
			$("#chatPanel").css("display","none");
			$("#addressDetailsPanel").css("display","");
			$("#applyInfoListPanel").css("display","none");
			
			$("#addressDetailsTitlePanel").css("border-bottom","0px solid #e6e6e6");
			$("#addressDetailsTitle").text("");
			
			var panel=$("#addressDetailsContentPanel");
			panel.empty();
			
			/**展示用户信息*/
			var content=$("<div>");
			content.css("height",panel.height());
			content.css("width",panel.width());
			/**空div 占位*/
			var emptyDiv=$("<div>");
			emptyDiv.css("height",30);
			emptyDiv.css("width",panel.width());
			content.append(emptyDiv);
			
			/**用户信息DIV*/
			var infoDiv=$("<div>");
			infoDiv.css("height",120);
			infoDiv.css("width",panel.width()-300);
			infoDiv.css("padding","0px 150px");
			infoDiv.css("text-align","left");
			
			var img=$("<img src='' alt=''>");
			img.css("height",80);
			img.css("width",80);
			img.css("float","right");
			img.css("margin-right","20px");
			img.attr("src","data:image/png;base64,"+userImg);
			infoDiv.append(img);
			
			/**计算名字长度*/
			var strLen=item.getStringPixelWidth(friendName)+5;
			var maxWidth=panel.width()-450;
			var leftDiv=$("<div>");
			leftDiv.css("height",120);
			leftDiv.css("width",strLen<=maxWidth?strLen:maxWidth);
			leftDiv.css("float","left");
			/**用户昵称*/
			var nameDiv=$("<div>");
			nameDiv.css("height",60);
			nameDiv.css("line-height","30px");
			nameDiv.css("font-size","20px");
			nameDiv.css("width",strLen<=maxWidth?strLen:maxWidth);
			nameDiv.text(friendName);
			leftDiv.append(nameDiv);
			/**个性签名*/
			var desDiv=$("<div>");
			desDiv.css("height",60);
			desDiv.css("line-height","30px");
			desDiv.css("font-size","20px");
			desDiv.css("color","#9C9C9C");
			desDiv.css("width",maxWidth);
			desDiv.text(userDes);
			leftDiv.append(desDiv);
			
			infoDiv.append(leftDiv);
			
			var sex=$("<img src='' alt=''>");
			sex.css("height",30);
			sex.css("width",30);
			sex.css("float","right");
			sex.css("margin-right","10px");
			sex.css("float","left");
			if(userSex===1){
				sex.attr("src","image/boy.png");
			}else if(userSex===2){
				sex.attr("src","image/girl.png");
			}else{
				sex.attr("src","image/confidential.png");
			}
			infoDiv.append(sex);
			
			content.append(infoDiv);
			/**属性DIV*/
			var attrDiv=$("<div>");
			attrDiv.css("height",140);
			attrDiv.css("width",panel.width()-300);
			attrDiv.css("padding","0px 150px");
			
			var attrPanel=$("<div>");
			attrPanel.css("height",120);
			attrPanel.css("width",panel.width()-300);
			attrPanel.css("border-color","#CFCFCF");
			attrPanel.css("border-style","solid");
			attrPanel.css("border-width","1px 0px 1px 0px");
			attrPanel.css("padding","10px 0px 10px 0px");
			attrPanel.css("text-align","left");
			/**备注*/
			var remarkNameDiv=$("<div>");
			remarkNameDiv.css("height",40);
			remarkNameDiv.css("line-height","40px");
			remarkNameDiv.css("width",panel.width()-300);
			
			var remarkNameLabelDiv=$("<span>");
			remarkNameLabelDiv.css("height",40);
			remarkNameLabelDiv.css("width",100);
			remarkNameLabelDiv.css("display","block");
			remarkNameLabelDiv.css("text-align","center");
			remarkNameLabelDiv.css("color","#9C9C9C");
			remarkNameLabelDiv.css("float","left");
			remarkNameLabelDiv.html("备&nbsp;&nbsp;&nbsp;&nbsp;注");
			remarkNameDiv.append(remarkNameLabelDiv);
			
			var remarkNameInput=$("<input>");
			remarkNameInput.css("height",38);
			remarkNameInput.css("width",200);
			remarkNameInput.css("display","block");
			remarkNameInput.css("text-align","left");
			remarkNameInput.css("float","left");
			remarkNameInput.css("border","0");
			remarkNameInput.css("outline","none");
			remarkNameInput.css("background-color","rgba(0, 0, 0, 0)");
			remarkNameInput.css("font-size","16px");
			remarkNameInput.attr("placeholder","点击添加备注");
			remarkNameInput.val(remarkName);
			remarkNameInput.focus(function(){
				$(this).css("border-bottom","1px solid #363636");
			});
			remarkNameInput.blur(function(){
				$(this).css("border-bottom","0px solid #363636");
				item.modifyRemarkName($(this).val());
			});
			remarkNameDiv.append(remarkNameInput);
			
			attrPanel.append(remarkNameDiv);
			
			/**地区*/
			var regionDiv=$("<div>");
			regionDiv.css("height",40);
			regionDiv.css("line-height","40px");
			regionDiv.css("width",panel.width()-300);
			
			var regionDivLabelDiv=$("<span>");
			regionDivLabelDiv.css("height",40);
			regionDivLabelDiv.css("width",100);
			regionDivLabelDiv.css("display","block");
			regionDivLabelDiv.css("text-align","center");
			regionDivLabelDiv.css("float","left");
			regionDivLabelDiv.css("color","#9C9C9C");
			regionDivLabelDiv.html("地&nbsp;&nbsp;&nbsp;&nbsp;区");
			regionDiv.append(regionDivLabelDiv);
			
			var regionInput=$("<span>");
			regionInput.css("height",40);
			regionInput.css("width",200);
			regionInput.css("display","block");
			regionInput.css("text-align","left");
			regionInput.css("float","left");
			regionInput.text(regionName);
			regionDiv.append(regionInput);
			
			attrPanel.append(regionDiv);
			
			/**IMChat号*/
			var userIdDiv=$("<div>");
			userIdDiv.css("height",40);
			userIdDiv.css("line-height","40px");
			userIdDiv.css("width",panel.width()-300);
			
			var userIdLabelDiv=$("<span>");
			userIdLabelDiv.css("height",40);
			userIdLabelDiv.css("width",100);
			userIdLabelDiv.css("display","block");
			userIdLabelDiv.css("text-align","center");
			userIdLabelDiv.css("float","left");
			userIdLabelDiv.css("color","#9C9C9C");
			userIdLabelDiv.text("IMChat号");
			userIdDiv.append(userIdLabelDiv);
			
			var userIdInput=$("<span>");
			userIdInput.css("height",40);
			userIdInput.css("width",200);
			userIdInput.css("display","block");
			userIdInput.css("text-align","left");
			userIdInput.css("float","left");
			userIdInput.text(friendId);
			userIdDiv.append(userIdInput);
			
			attrPanel.append(userIdDiv);
			
			
			attrDiv.append(attrPanel);
			content.append(attrDiv);
			/**按钮DIV*/
			var buttonDiv=$("<div>");
			buttonDiv.css("height",100);
			buttonDiv.css("width",panel.width()-300);
			buttonDiv.css("padding","0px 150px");
			buttonDiv.css("text-align","center");
			
			var button=$("<button>");
			button.css("width",150);
			button.css("height",50);
			button.css("font-size","20px");
			button.css("margin-top","20px");
			button.text("发消息");
			
			button.click(function(){
				item.openChatRoom();
			});
			
			buttonDiv.append(button);
			
			content.append(buttonDiv);
			
			panel.append(content);
			
			content.resize(function(){
				infoDiv.css("width",panel.width()-300);
				attrDiv.css("width",panel.width()-300);
				buttonDiv.css("width",panel.width()-300);
			});
		});
		
		/**头像区域*/
		var headImgDiv=$("<div>");
		headImgDiv.css("float","left");
		headImgDiv.css("width",80);
		headImgDiv.css("height",80);
		var headImg=$("<img src='' alt=''>");
		headImg.css("position","relative");
		headImg.css("width",50);
		headImg.css("height",50);
		headImg.css("border-radius","5px");
		headImg.css("top","15px");
		headImg.attr("src","image/logo.png");
		headImgDiv.append(headImg);
		
		this._item.append(headImgDiv);
		
		var center=$("<div>");
		center.css("float","left");
		center.css("width",180);
		center.css("height",80);
		center.css("line-height","80px");
		center.css("text-align","left");
		center.css("font-weight","500");
		center.css("font-size","18px");
		center.css("overflow","hidden");
		center.css("white-space","nowrap");
		center.css("text-overflow","ellipsis");
		center.text(remarkName?remarkName:friendName);
		this._item.append(center);
		
		this.init=function(){
			IMChat.userCache.loadUser(friendId,this);
		};
		this.setUser=function(user){
			userImg=user.USER_IMG;
			headImg.attr("src","data:image/png;base64,"+user.USER_IMG);
		};
		this.getUserImg=function(){
			return userImg;	
		};
		this.getFriendName=function(){
			return remarkName?remarkName:friendName;
		};
		this.getFriendId=function(){
			return friendId;
		};
		this.openChatRoom=function(){
			IMChat.chatRoomListPanel.openChatRoom(1,friendId,remarkName?remarkName:friendName,userImg);
		};
		this.refreshRemarkName=function(r){
			remarkName=r;
			center.text(remarkName?remarkName:friendName);
			var chatRoomItem=IMChat.chatRoomListPanel.getChatRoomItem(friendId,1);
			if(chatRoomItem){
				chatRoomItem.setRoomName(remarkName);
			}
		};
		/**修改备注名*/
		this.modifyRemarkName=function(remarkName){
			IMChat.Ajax.request({
				type : "POST",
				url : "friend/remark",
				data:{
					USER_ID:userId,
					FRIEND_ID:friendId,
					REMARK_NAME:remarkName
				},
				success:function(result){
					item.refreshRemarkName(result.REMARK_NAME);
				}
			});	
		};
		this.deleteFriend=function(){
            IMChat.Ajax.request({
                type : "POST",
                url : "friend/delete",
                data:{
                    USER_ID:userId,
                    FRIEND_ID:friendId
                },
                success:function(result){
                    IMChat.addressListPanel.removeFriend(friendId);
                    IMChat.addressListPanel.refresh();
                    var chatRoomItem=IMChat.chatRoomListPanel.getChatRoomItem(friendId,1);
                    if(chatRoomItem){
                        IMChat.chatRoomListPanel.removeChatRoom(chatRoomItem);
                        IMChat.chatRoomListPanel.refresh();
                    }
                    $("#emptyPanel").css("display","");
                    $("#chatPanel").css("display","none");
                    $("#addressDetailsPanel").css("display","none");
                    $("#applyInfoListPanel").css("display","none");
                    IMChat.MessageBox.alert("删除好友成功");
                }
            });
        }
	}
	IMChat.StringItem=StringItem;
	IMChat.GroupChatItem=GroupChatItem;
	IMChat.FriendItem=FriendItem;
})();