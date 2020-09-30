var IMChat = window.IMChat = IMChat || {};
(function(){
	/**聊天框最大宽度*/
	var maxWidth=500;
	/**左侧文本消息展示*/
	function LeftTextMessage(option){
		IMChat.Message.call(this);
		var chatType=option.chatType;
		var chatId=option.chatId;
		var sendId=option.sendId;
		
		/**头像*/
		var headImg=$("<img src='' alt=''>");
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
		
		if(chatType===1){//普通聊天
			IMChat.userCache.loadUser(chatId,this);
		}else if(chatType===2){//聊天群聊天
			var user=IMChat.userCache.getUser(sendId);
			if(user){
				this.setUser(user);
			}else{
				IMChat.userCache.loadUser(sendId,this);
			}
		}
		
		var textDiv=$("<div>");
		textDiv.addClass("leftTextMessage");

		textDiv.css("line-height","30px");
		textDiv.css("padding-top","10px");
		
		var text=option.content;
		
		var lineArr=text.split("\n");
		var emojiLineArr=[];
		/**
		 * 文字的总行数 
		 * 每行高30px 
		 * 若1行高50px
		 * */
		var lineCount=lineArr.length;
		/**计算每行的宽度 包含表情*/
		var targetWidth=30;
		/**分析每一行的emoji数量*/
		var lineEmojiInfoList = this.parseLineEmojiInfo(lineArr);

		/**计算出最长度的行 位置*/
		var lineWidthArr=[];
		var maxLength = 0;
		var maxLengthLinePosition = 0;
		for(var i=0;i<lineArr.length;i++){
			// 将表情替换成""
			var str=lineArr[i];
			// 替换表情 为html
			var newStr=lineArr[i];
			var emojiList=lineEmojiInfoList[i];
			// 去掉表情
			for(var m=0;m<emojiList.length;m++){
				str=str.replace(emojiList[m],"");
			}
			for(var m=0;m<emojiList.length;m++){
				var emoji=IMChat.emojiManage.getEmoji(emojiList[m]);
				var emojiTitle=emoji.alt.substring(1,emoji.alt.length-1);
				newStr=newStr.replace(emojiList[m],'<img title="'+emojiTitle+'" src="'+emoji.src+'" style="width: 28px; height: 28px; cursor: pointer; vertical-align:text-top;" alt="">');
			}
			var pixelWidth=this.getStringPixelWidth(str)+28*emojiList.length+24;
			if(maxLength<pixelWidth){
				maxLength=pixelWidth;
				maxLengthLinePosition=i;
			}
			lineWidthArr.push(pixelWidth);
			emojiLineArr.push(newStr);
		}
				
		textDiv.html(emojiLineArr.join("<br>"));
		
		// 如果最长的一行宽度超过了最大宽度，就要重新计算高度
		var contentWidth = maxWidth - 24;
		if(maxLength>maxWidth){
			targetWidth=maxWidth;
			var totalLine = 0;
            for (var m=0;m<lineWidthArr.length;m++){
                var ret = parseInt(lineWidthArr[m] / contentWidth);
                var l = ret === 0 ? ret : ret + 1;
                totalLine += l === 0 ? 1 : l;
            }
            lineCount=totalLine;
		}else{
			targetWidth=maxLength;
		}
		
		if(lineCount===1){
			textDiv.css("width",targetWidth);
			textDiv.css("height",50);
			this._div.css("height",60);
		}else{
			textDiv.css("width",targetWidth);
			textDiv.css("height",lineCount*30+20);
			this._div.css("height",lineCount*30+30);
		}
		this._div.append(headImg);
		this._div.append(textDiv);
		
		this.append=function(){
			$("#chatContent").append(this._div);
			this.scrollToBottom();
		};
		/**浏览器消息通知*/
		this.notification=function(){
			if(document.hidden){
				IMChat.notification("新消息",{
					icon:headImg.attr("src"),
					body:text
				});
			}
		};
        this.receiveMessage=function(chatRoom){
            chatRoom.setLastChat(text);
        };
	}
	/**
	 * 右侧文本消息展示
	 * */
	function RightTextMessage(option){
		IMChat.Message.call(this);
		/**头像*/
		var headImg=$("<img src='' alt=''>");
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
		
		var textDiv=$("<div>");
		textDiv.addClass("rightTextMessage");

		textDiv.css("line-height","30px");
		textDiv.css("padding-top","10px");
		var text=option.content;
		
		var lineArr=text.split("\n");
		var emojiLineArr=[];
		/**
		 * 文字的总行数 
		 * 每行高30px 
		 * 若1行高50px
		 * */
		var lineCount=lineArr.length;
		/**计算每行的宽度 包含表情*/
		var targetWidth=30;
		/**分析每一行的emoji数量*/
		var lineEmojiInfoList = this.parseLineEmojiInfo(lineArr);
		
		/**计算出最长度的行 位置*/
		var lineWidthArr=[];
		var maxLength = 0;
		var maxLengthLinePosition = 0;
		for(var i=0;i<lineArr.length;i++){
			// 将表情替换成""
			var str=lineArr[i];
			// 替换表情 为html
			var newStr=lineArr[i];
			var emojiList=lineEmojiInfoList[i];
			// 去掉表情
			for(var m=0;m<emojiList.length;m++){
				str=str.replace(emojiList[m],"");
			}
			for(var m=0;m<emojiList.length;m++){
				var emoji=IMChat.emojiManage.getEmoji(emojiList[m]);
				var emojiTitle=emoji.alt.substring(1,emoji.alt.length-1);
				newStr=newStr.replace(emojiList[m],'<img title="'+emojiTitle+'" src="'+emoji.src+'" style="width: 28px; height: 28px; cursor: pointer; vertical-align:text-top;" alt="">');
			}
			var pixelWidth=this.getStringPixelWidth(str)+28*emojiList.length+24;
			if(maxLength<pixelWidth){
				maxLength=pixelWidth;
				maxLengthLinePosition=i;
			}
			lineWidthArr.push(pixelWidth);
			emojiLineArr.push(newStr);
		}
		var emojiHtml=emojiLineArr.join("<br>");
		textDiv.html(emojiHtml);
		
		// 如果最长的一行宽度超过了最大宽度，就要重新计算高度
		var contentWidth = maxWidth - 24;
		if(maxLength>maxWidth){
			targetWidth=maxWidth;
			var totalLine = 0;
            for (var m=0;m<lineWidthArr.length;m++){
                var ret = parseInt(lineWidthArr[m] / contentWidth);
                var l = ret === 0 ? ret : ret + 1;
                totalLine += l === 0 ? 1 : l;
            }
            lineCount=totalLine;
		}else{
			targetWidth=maxLength;
		}
		
		if(lineCount===1){
			textDiv.css("width",targetWidth);
			textDiv.css("height",50);
			this._div.css("height",60);
		}else{
			textDiv.css("width",targetWidth);
			textDiv.css("height",lineCount*30+20);
			this._div.css("height",lineCount*30+30);
		}
		this._div.append(headImg);
		this._div.append(textDiv);
		this.append=function(){
			$("#chatContent").append(this._div);
			this.scrollToBottom();
		};
		/**发送消息给服务器*/
		this.sendMessage=function(chatRoom){
			if(chatRoom==null)return;
			IMChat.Ajax.request({
				type : "POST",
				url : "message/receive",
				data:{
					MESSAGE_TYPE:3,
					SEND_ID:IMChat.user.USER_ID,
					RECEIVE_ID:chatRoom.getChatId(),
					CHAT_TYPE:chatRoom.getChatType(),
					CONTENT_TYPE:1,
					CHAT_CONTENT:text
				},
				success:function(result){
					// 返回消息ID   MESSAGE_ID
                    chatRoom.setLastChatDate(result.CHAT_DATE);
                    chatRoom.setLastChat(text);
                    IMChat.chatRoomListPanel.refresh();
				}
			});
		};
	}
	IMChat.LeftTextMessage=LeftTextMessage;
	IMChat.RightTextMessage=RightTextMessage;
})();