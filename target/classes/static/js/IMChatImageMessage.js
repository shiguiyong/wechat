var IMChat = window.IMChat = IMChat || {};
(function(){
	var imWidth=100;
	var imHeight=180;
	/**
	 * 左侧图片显示
	 * option.src 图片的地址  或者base64编码
	 * option.width 图片实际宽度
	 * option.height 图片实际高度
	 * */
	function LeftImageMessage(option){
		IMChat.Message.call(this);
		this.option=option;
		var _this=this;
		var chatType=option.chatType;
		var chatId=option.chatId;
		var sendId=option.sendId;
		
		var fileId=option.fileId;
		var imageWidth=option.width;
		var imageHeight=option.height;
		
		/**头像*/
		var headImg=$("<img>");
		headImg.css("float","left");
		headImg.css("width","50px");
		headImg.css("height","50px");
		headImg.css("margin-top","5px");
		headImg.css("margin-left","20px");
		headImg.css("border-radius","5px");
		
		this.setUser=function(user){
			if(user.USER_IMG){
				headImg.attr("src","data:image/png;base64,"+user.USER_IMG);
			}else{
				headImg.attr("src","image/logo.png");
			}
		};
		
		if(chatType==1){//普通聊天
			var user=IMChat.userCache.getUser(chatId);
			if(user){
				this.setUser(user);
			}else{
				IMChat.userCache.loadUser(chatId,this);
			}
		}else if(chatType==2){//聊天群聊天
			var user=IMChat.userCache.getUser(sendId);
			if(user){
				this.setUser(user);
			}else{
				IMChat.userCache.loadUser(sendId,this);
			}
		}
		
		var imgDiv=$("<div>");
		imgDiv.addClass("leftImageMessage");
		imgDiv.css("line-height","30px");
		imgDiv.css("padding","0px");
		
		
		if(imWidth<option.width){
			var height = option.height * imWidth / option.width;
			imgDiv.css("width",imWidth);
			imgDiv.css("height",height);
			imgDiv.css("background-size",imWidth+"px "+height+"px");
			this._div.css("height",height+10)
		}else{
			imgDiv.css("width",option.width);
			imgDiv.css("height",option.height);
			imgDiv.css("background-size",option.width+"px "+option.height+"px");
			this._div.css("height",option.height+10)
		}
		
		
		this._div.append(headImg);
		this._div.append(imgDiv);
		
		this.append=function(){
			$("#chatContent").append(this._div);
			this.scrollToBottom();
		};
		
		this.downloadImg=function(){
			var _div=this._div;
			IMChat.Ajax.request({
				type : "POST",
				url : "image/download",
				data:{
					FILE_ID:fileId
				},
				success:function(result){
					console.log(imgDiv);
					if(result.SUCCESS){
						/**图片小于每行高度*/
						if(imageHeight<50){
							imgDiv.css("padding","10px 12px 0px 12px");
							imgDiv.css("width",imageWidth+24);
							imgDiv.css("height",50);
							
							var img=$("<img>");
							img.css("width",imageWidth);
							img.css("height",imageHeight);
							img.attr("src","data:image/png;base64,"+result.IMAGE_FILE);
							imgDiv.append(img);
							
							_div.css("height",60)
						}else{
							imgDiv.css("background-image","url(data:image/png;base64,"+result.IMAGE_FILE+")");
							imgDiv.css("background-repeat","no-repeat");
						}
						
					}
				}
			});
		};
		/**浏览器消息通知*/
		this.notification=function(){
			if(document.hidden){
				IMChat.notification("新消息",{
					body:"[图片]"
				});
			}
		};
        this.receiveMessage=function(chatRoom){
            chatRoom.setLastChat("[图片]");
        };
	}
	/**右侧图片显示*/
	function RightImageMessage(option){
		IMChat.Message.call(this);
		var _this=this;
		_this.option=option;
		var file=option.file;
		var fileId = undefined;
		
		/**头像*/
		var headImg=$("<img>");
		headImg.css("float","right");
		headImg.css("width","50px");
		headImg.css("height","50px");
		headImg.css("margin-top","5px");
		headImg.css("margin-right","20px");
		headImg.css("border-radius","5px");
		
		if(IMChat.user&&IMChat.user.USER_IMG){
			headImg.attr("src","data:image/png;base64,"+IMChat.user.USER_IMG);
		}else{
			headImg.attr("src","image/logo.png");
		}
		var imgDiv=$("<div>");
		imgDiv.addClass("rightImageMessage");
		imgDiv.css("line-height","30px");
		imgDiv.css("padding","0px");
		
		if(imWidth<option.width){
			var height = option.height * imWidth / option.width;
			imgDiv.css("width",imWidth);
			imgDiv.css("height",height);
			imgDiv.css("background-size",imWidth+"px "+height+"px");
			this._div.css("height",height+10)
		}else{
			imgDiv.css("width",option.width);
			imgDiv.css("height",option.height);
			imgDiv.css("background-size",option.width+"px "+option.height+"px");
			this._div.css("height",option.height+10)
		}
		
		/**图片小于每行高度*/
		if(option.height<50){
			imgDiv.css("padding","10px 12px 0px 12px");
			imgDiv.css("width",option.width+24);
			imgDiv.css("height",50);
			
			var img=$("<img>");
			img.css("width",option.width);
			img.css("height",option.height);
			img.attr("src",option.src);
			imgDiv.append(img);
			
			this._div.css("height",60)
		}else{
			imgDiv.css("background-image","url("+option.src+")");
			imgDiv.css("background-repeat","no-repeat");
		}
		
		this._div.append(headImg);
		this._div.append(imgDiv);
		
		this.append=function(){
			$("#chatContent").append(this._div);
			this.scrollToBottom();
		};

		/**图片上传*/
		this.uploadImage=function(chatRoom){
			var formData = new FormData();
			formData.append("FILE", file);
			formData.append("SEND_ID", IMChat.user.USER_ID);
			formData.append("RECEIVE_ID", chatRoom.getChatId());
			formData.append("CHAT_TYPE", chatRoom.getChatType());
			formData.append("IMAGE_WIDTH", _this.option.width);
			formData.append("IMAGE_HEIGHT", _this.option.height);
			request = new XMLHttpRequest();
			request.onreadystatechange = function() {
		        if (request.readyState === 4 && request.status === 200) {
		            var result=JSON.parse(request.responseText);
		            if(result.SUCCESS){
		            	fileId=result.MESSAGE_ID;
                        chatRoom.setLastChatDate(result.CHAT_DATE);
                        chatRoom.setLastChat("[图片]");
                        IMChat.chatRoomListPanel.refresh();
		            }
		        }
		    };
		    request.upload.addEventListener("progress", function(event) {
		        if(event.lengthComputable){
		        	//progressBarChildDiv.css("width",Math.ceil(event.loaded * 100 / event.total) + "%");
		        }
		    }, false);
		    request.open("POST", "image/upload");
		    request.setRequestHeader("TOKEN", IMChat.user.TOKEN); 
		    request.send(formData);
		}
	}
	IMChat.LeftImageMessage=LeftImageMessage;
	IMChat.RightImageMessage=RightImageMessage;
	
})();