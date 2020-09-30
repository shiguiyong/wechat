var IMChat = window.IMChat = IMChat || {};
(function(){
	var fileWidth=260;
	var fileHeight=100;
	/**左侧文件显示
	 * option.file 上传的文件
	 * option.fileSuffix 文件后缀
	 * option.fileSize 文件大小
	 * */
	function LeftFileMessage(option){
		IMChat.Message.call(this);
		var _this=this;
		var fileId=option.fileId;
		var fileName=option.fileName;
		var fileSize=option.fileSize;
		var messageId=option.messageId;
		var chatType=option.chatType;
		var chatId=option.chatId;
		var sendId=option.sendId;
		
		var headImg=$("<img>");
		
		this.setUser=function(user){
			if(user.USER_IMG){
				headImg.attr("src","data:image/png;base64,"+user.USER_IMG);
			}else{
				headImg.attr("src","image/logo.png");
			}
		};
		
		this.initMessage=function(){
			headImg.css("float","left");
			headImg.css("width","50px");
			headImg.css("height","50px");
			headImg.css("margin-top","5px");
			headImg.css("margin-left","20px");
			headImg.css("border-radius","5px");
			
			if(chatType===1){//普通聊天
				var user=IMChat.userCache.getUser(chatId);
				if(user){
					this.setUser(user);
				}else{
					IMChat.userCache.loadUser(chatId,this);
				}
			}else if(chatType===2){//聊天群聊天
				var user=IMChat.userCache.getUser(sendId);
				if(user){
					this.setUser(user);
				}else{
					IMChat.userCache.loadUser(sendId,this);
				}
			}
			
			var fileDiv=$("<div>");
			fileDiv.addClass("leftTextMessage");

			fileDiv.css("line-height","30px");
			fileDiv.css("padding","6px");
			
			fileDiv.css("width",fileWidth);
			fileDiv.css("height",fileHeight);
			
			var file=$("<div>");
			file.css("background-color","#FFFFFF");
			file.css("width",fileWidth-12);
			file.css("height",fileHeight-12);
			fileDiv.append(file);
			
			var iconDiv=$("<div>");
			iconDiv.css("width",100);
			iconDiv.css("height",fileHeight-12);
			iconDiv.css("position","relative");
			iconDiv.css("text-align","center");
			iconDiv.css("float","left");
			
			var icon=$("<img>");
			icon.css("position","absolute");
			icon.css("top",0);
			icon.css("right",0);
			icon.css("bottom",0);
			icon.css("left",0);
			icon.css("margin","auto");
			icon.css("width",75);
			icon.css("height",75);
			
			icon.attr("src","image/file_word.png");
			iconDiv.append(icon);
			file.append(iconDiv);
			
			var fileInfoDiv=$("<div>");
			fileInfoDiv.css("width",fileWidth-112);
			fileInfoDiv.css("height",fileHeight-12);
			fileInfoDiv.css("float","left");
			
			/**文件名称*/
			var fileNameDiv=$("<div>");
			fileNameDiv.css("width",fileWidth-112);
			fileNameDiv.css("height",40);
			fileNameDiv.css("line-height","40px");
			fileNameDiv.css("font-size","16px");
			fileNameDiv.css("overflow","hidden");
			fileNameDiv.css("white-space","nowrap");
			fileNameDiv.css("text-overflow","ellipsis");
			
			fileNameDiv.text(fileName);
			fileInfoDiv.append(fileNameDiv);
			
			/**文件大小*/
			var fileSizeDiv=$("<div>");
			fileSizeDiv.css("width",fileWidth-112);
			fileSizeDiv.css("height",35);
			fileSizeDiv.css("line-height","35px");
			fileSizeDiv.css("font-size","14px");
			
			var size=$("<span>");
			size.text(_this.formatSize(fileSize));
			fileSizeDiv.append(size);
			
			var line=$("<span>");
			line.text("|");
			line.css("padding","0px 2px");
			fileSizeDiv.append(line);
			
			var download=$("<span>");
			
			download.css("color","#1E90FF");
			download.css("cursor","pointer");
			download.click(function(){
				_this.downloadFile();
			});
			download.text("下载");
			
			fileSizeDiv.append(download);
			fileInfoDiv.append(fileSizeDiv);
			file.append(fileInfoDiv);
			
			this._div.css("height",fileHeight+10);
			
			this._div.append(headImg);
			this._div.append(fileDiv);
		};
		
		this.append=function(){
			$("#chatContent").append(this._div);
			this.scrollToBottom();
		};
		
		this.downloadFile=function(){
	        IMChat.Ajax.downloadFile("file/download",[{name:"FILE_ID",value:fileId},{name:"FILE_NAME",value:fileName}]);
		};
		
		/**浏览器消息通知*/
		this.notification=function(){
			if(document.hidden){
				IMChat.notification("新消息",{
					body:"[文件]"
				});
			}
		};
        this.receiveMessage=function(chatRoom){
            chatRoom.setLastChat("[文件]");
        };
		
		this.initMessage();
	}
	/**右侧文件显示*/
	function RightFileMessage(option){
		IMChat.Message.call(this);
		var _this=this;
		var file=option.file;
		var fileId = undefined;
		var fileName=option.fileName;
		var fileSize=option.fileSize;
		
		var progressBarDiv=undefined;
		var progressBarChildDiv=undefined;
		var cancelButton=undefined;
		var downloadButton=undefined;
		
		var request = undefined;
		var messageId= undefined;
		
		
		this.initMessage=function(){
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
		
			var fileDiv=$("<div>");
			fileDiv.addClass("rightTextMessage");

			fileDiv.css("line-height","30px");
			fileDiv.css("padding","6px");
		
			fileDiv.css("width",fileWidth);
			fileDiv.css("height",fileHeight);
		
			var file=$("<div>");
			file.css("background-color","#FFFFFF");
			file.css("width",fileWidth-12);
			file.css("height",fileHeight-12);
			fileDiv.append(file);
		
			var iconDiv=$("<div>");
			iconDiv.css("width",100);
			iconDiv.css("height",fileHeight-12);
			iconDiv.css("position","relative");
			iconDiv.css("text-align","center");
			iconDiv.css("float","left");
		
			var icon=$("<img>");
			icon.css("position","absolute");
			icon.css("top",0);
			icon.css("right",0);
			icon.css("bottom",0);
			icon.css("left",0);
			icon.css("margin","auto");
			icon.css("width",75);
			icon.css("height",75);
		
			icon.attr("src","image/file_word.png");
			iconDiv.append(icon);
			file.append(iconDiv);
		
			var fileInfoDiv=$("<div>");
			fileInfoDiv.css("width",fileWidth-112);
			fileInfoDiv.css("height",fileHeight-12);
			fileInfoDiv.css("float","left");
		
			/**文件名称*/
			var fileNameDiv=$("<div>");
			fileNameDiv.css("width",fileWidth-112);
			fileNameDiv.css("height",40);
			fileNameDiv.css("line-height","40px");
			fileNameDiv.css("font-size","16px");
			fileNameDiv.css("overflow","hidden");
			fileNameDiv.css("white-space","nowrap");
			fileNameDiv.css("text-overflow","ellipsis");
			
			fileNameDiv.text(fileName);
			fileInfoDiv.append(fileNameDiv);
		
			/**文件大小*/
			var fileSizeDiv=$("<div>");
			fileSizeDiv.css("width",fileWidth-112);
			fileSizeDiv.css("height",35);
			fileSizeDiv.css("line-height","35px");
			fileSizeDiv.css("font-size","14px");
			/**大小显示*/
			var size=$("<span>");
			size.text(_this.formatSize(fileSize));
			fileSizeDiv.append(size);
			
			var line=$("<span>");
			line.text("|");
			line.css("padding","0px 2px");
			fileSizeDiv.append(line);
			
			cancelButton=$("<span>");
			cancelButton.css("color","#1E90FF");
			cancelButton.css("cursor","pointer");
			cancelButton.click(function(){
				if(request){
					request.abort();
				}
			});
			cancelButton.text("取消");
			
			fileSizeDiv.append(cancelButton);
			
			downloadButton=$("<span>");
			downloadButton.css("color","#1E90FF");
			downloadButton.css("cursor","pointer");
			downloadButton.css("display","none");
			downloadButton.click(function(){
				_this.downloadFile();
			});
			
			downloadButton.text("下载");
			
			fileSizeDiv.append(downloadButton);
			
			fileInfoDiv.append(fileSizeDiv);
			
			/**进度条*/
			progressBarDiv=$("<div>");
			progressBarDiv.css("width",fileWidth-112-5);
			progressBarDiv.css("height",5);
			
			progressBarChildDiv=$("<div>");
			progressBarChildDiv.css("width","0%");
			progressBarChildDiv.css("height",5);
			progressBarChildDiv.css("background-color","skyblue");
			
			progressBarDiv.append(progressBarChildDiv);
			fileInfoDiv.append(progressBarDiv);
			
			file.append(fileInfoDiv);
			
			this._div.css("height",fileHeight+10);
			
			this._div.append(headImg);
			this._div.append(fileDiv);
		};
		
		this.append=function(){
			$("#chatContent").append(this._div);
			this.scrollToBottom();
		};
		
		this.uploadFile=function(chatRoom){
			var formData = new FormData();
			formData.append("FILE", file);
			formData.append("SEND_ID", IMChat.user.USER_ID);
			formData.append("RECEIVE_ID", chatRoom.getChatId());
			formData.append("CHAT_TYPE", chatRoom.getChatType());
			request = new XMLHttpRequest();
			request.onreadystatechange = function() {
		        if (request.readyState === 4 && request.status === 200) {
		            progressBarDiv.css("display","none");
		            cancelButton.css("display","none");
		            downloadButton.css("display","");
		            var result=JSON.parse(request.responseText);
		            if(result.SUCCESS){
		            	fileId=result.FILE_ID;
                        chatRoom.setLastChatDate(result.CHAT_DATE);
                        chatRoom.setLastChat("[文件]");
                        IMChat.chatRoomListPanel.refresh();
		            }
		        }
		    };
		    request.upload.addEventListener("progress", function(event) {
		        if(event.lengthComputable){
		        	progressBarChildDiv.css("width",Math.ceil(event.loaded * 100 / event.total) + "%");
		        }
		    }, false);
		    request.open("POST", "file/upload");
		    request.setRequestHeader("TOKEN", IMChat.user.TOKEN);
		    request.send(formData);
		};
		
		this.downloadFile=function(){
	        IMChat.Ajax.downloadFile("file/download",[{name:"FILE_ID",value:fileId},{name:"FILE_NAME",value:fileName}]);
		};
		this.initMessage();
	}
	IMChat.LeftFileMessage=LeftFileMessage;
	IMChat.RightFileMessage=RightFileMessage;
})();