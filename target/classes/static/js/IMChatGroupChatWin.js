var IMChat = window.IMChat = IMChat || {};
(function(){
    var WIDTH=800;
    var HEIGHT=600;
    /**群聊弹框*/
    function GroupChatWin(){
        var _this=this;
        
        var win=$("<div>");
        win.addClass("dialog");
        win.css({
            "display":"none",
            "width":WIDTH+1,
            "height":HEIGHT,
            "margin-top":"-300px",
            "margin-left":"-400px"
        });

        /**左侧面板用于显示所有的用户列表*/
        var input=$("<input>");// 检索框
        var userListPanel=$("<div>");// 好友列表
        var selectedPanel=$("<div>");// 已选择好友列表
        var selectList=[];
        
        this.leftPanelInit=function(){
            var leftPanel=$("<div>");
            leftPanel.css({
                "width":400,
                "height":HEIGHT,
                "float":"left",
                "border-right":"1px solid #CFCFCF"
            });
            /**检索面板*/
            var searchPanel=$("<div>");
            searchPanel.css({
                "width":400,
                "height":80
            });
            /**检索input*/
            var searchInputDiv=$("<div>");
            searchInputDiv.css({
                "position":"relative",
                "top":"20px",
                "height":"42px",
                "line-height":"42px",
                "width":"340px",
                "background-color":"#E8E8E8",
                "border-radius":"10px",
                "left":"30px"
            });
            
            /**检索input 图片div*/
            var searchImageDiv=$("<div>");
            searchImageDiv.css({
                "float":"left",
                "width":"20px",
                "text-align":"center",
                "padding":"0 5px 0 10px",
                "height":"100%"
            });
            /**检索图片*/
            var searchImage=$("<div>");
            searchImage.css({
                "display":"inline-block",
                "width":"22px",
                "height":"24px",
                "margin-top":"10px",
                "background":"url(../image/search.png) no-repeat",
                "background-size":"cover"
            });
            searchImageDiv.append(searchImage);
            searchInputDiv.append(searchImageDiv);

            /**检索框*/
            var searchInput=$("<div>");
            searchInput.css({
                "height":"100%",
                "position":"relative",
                "float":"left"
            });

            input.attr("type","text").attr("maxlength","18").attr("placeholder","搜索");
            input.css({
                "height":"40px",
                "line-height":"40px",
                "padding-left":"5px",
                "color":"#333",
                "border":"0",
                "font-size":"15px",
                "font-weight":"bold",
                "width":"280px",
                "background-color":"#E8E8E8"
            });

            searchInput.append(input);
            searchInputDiv.append(searchInput);
            
            searchPanel.append(searchInputDiv);
            /**好友列表*/
            userListPanel.css({
                "width":"400px",
                "height":"520px"
            });
                
            leftPanel.append(searchPanel);
            leftPanel.append(userListPanel);
            win.append(leftPanel);
        };
        this.leftPanelInit();

        /**右侧面板用于显示已经选择的人员*/
        this.rightPanelInit=function(){
            var rightPanel=$("<div>");
            rightPanel.css({
                "width":400,
                "height":HEIGHT,
                "float":"left"
            });
            /**关闭按钮*/
            var closeDiv=$("<div>");
            closeDiv.css({
                "width":400,
                "height":30
            });
            var close=$("<div>");
            close.css({
                "width":"30px",
                "height":"30px",
                "line-height":"30px",
                "text-align":"center",
                "float":"right",
                "font-size":"20px",
                "color":"#696969",
                "cursor":"pointer"
            });
            close.html("×");
            close.hover(function(){
                $(this).css("background-color","#ff0000");
                $(this).css("color","#ffffff");
            },function(){
                $(this).css("background-color","");
                $(this).css("color","#696969");
            });
            close.click(function(){
                _this.close();
            });
            closeDiv.append(close);
            rightPanel.append(closeDiv);
            /**描述*/
            var desDiv=$("<div>");
            desDiv.css({
                "width":380,
                "height":50,
                "line-height":"50px",
                "padding-left":"20px"
            });
            desDiv.text("请勾选需要添加的联系人");
            rightPanel.append(desDiv);

            /**已选择列表*/
            selectedPanel.css({
                "width":400,
                "height":HEIGHT-140
            });
            rightPanel.append(selectedPanel);
            
            /**确定 取消按钮*/
            var buttonPanel=$("<div>");
            buttonPanel.css({
                "width":400,
                "height":60,
                "line-height":"80px"
            });

            var cancelButton=$("<button>");
            cancelButton.css({
                "float":"right",
                "margin-top":"10px",
                "margin-right":"10px",
                "color": "#4F4F4F",
                "background-color": "#CFCFCF"
            });
            cancelButton.text("取消");
            cancelButton.click(function(){
                _this.close();
            });
            buttonPanel.append(cancelButton);

            var confirmButton=$("<button>");
            confirmButton.css({
                "float":"right",
                "margin-top":"10px",
                "margin-right":"10px"
            });
            confirmButton.text("确定");
            confirmButton.click(function(){
                if(selectList.length===0){
                    return;
                }
                if(selectList.length===1){
                    var userInfo=selectList[0].user;
                    IMChat.chatRoomListPanel.openChatRoom(1,userInfo.getFriendId(),userInfo.getFriendName(),userInfo.getUserImg());
                    _this.close();
                    return;
                }
                if(selectList.length>1){
                    var numbers=[];
                    for(var i=0;i<selectList.length;i++){
                        numbers.push(selectList[i].userId);
                    }
                    IMChat.Ajax.request({
                        type:"POST",
                        url:"groupchat/create",
                        data:{
                            USER_ID:IMChat.user.USER_ID,
                            NUMBERS:numbers
                        },
                        success:function(result){
                            var item=new IMChat.GroupChatItem(result.DATA);
                            IMChat.addressListPanel.addGroupChat(item);
                            IMChat.addressListPanel.refresh();
                            item.init();
                            IMChat.chatRoomListPanel.openChatRoom(2,result.DATA.GROUP_ID,result.DATA.GROUP_NAME,result.DATA.GROUP_IMG);
                            IMChat.MessageBox.alert("群创建成功");
                        },
                        error:function(result){

                        }
                    });
                    _this.close();
                }
            });
            buttonPanel.append(confirmButton);

            rightPanel.append(buttonPanel);
            win.append(rightPanel);
        };
        this.rightPanelInit();
        
        $("body").append(win);
        this.show=function(){
            IMChat.transparentMaskLayer.show();
            win.css("display","");
        };
        this.hidden=function(){
            win.css("display","none");
            userListPanel.getNiceScroll().hide();
            selectedPanel.getNiceScroll().hide();
            IMChat.transparentMaskLayer.hidden();
        };
        this.close=function(){
            _this.hidden();
            userListPanel.getNiceScroll().remove();
            selectedPanel.getNiceScroll().remove();
            win.remove();
        };
        /**选择的好友*/
        this.addUser=function(userItem,user,checked){
            if(checked){
                var item=new SelectUserItem(userItem,selectedPanel,user);
                selectList.push({
                    userId:user.getFriendId(),
                    user:user,
                    item:item
                });
                
            }else{
                for(var i=0;i<selectList.length;i++){
                    if(selectList[i].userId===user.getFriendId()){
                        selectList[i].item.removeItem();
                        selectList.splice(i, 1);
                        break;
                    }
                }
            }
        };
        /**移除选择用户*/
        this.removerUser=function(userId){
            for(var i=0;i<selectList.length;i++){
                if(selectList[i].userId===userId){
                    selectList[i].item.removeItem();
                    selectList.splice(i, 1);
                    break;
                }
            }
        };
        this.afterrender=function(){
            var userList=IMChat.addressListPanel.getFriendList();
            userList.forEach(function (user) {
                new UserItem(_this,userListPanel,user);
            });
            userListPanel.niceScroll({
                cursorcolor: "#B5B5B5",
                cursoropacitymax: 1,
                touchbehavior: false,
                cursorwidth: "5px",
                cursorborder: "0",
                cursorborderradius: "5px",
                autohidemode: "cursor"
            });
            userListPanel.getNiceScroll().resize();
            userListPanel.getNiceScroll(0).doScrollTop(0);

            selectedPanel.niceScroll({
                cursorcolor: "#B5B5B5",
                cursoropacitymax: 1,
                touchbehavior: false,
                cursorwidth: "5px",
                cursorborder: "0",
                cursorborderradius: "5px",
                autohidemode: "cursor"
            });
        };
        this.afterrender();
    }
    function UserItem(win,panel,user){
        var _this=this;
        this.win=win;
        var userInfo=user;
        var item=$("<div>");
        item.css({
            "width":"340px",
            "height":"70px",
            "padding":"0px 30px"
        });
        
        /**左侧头像*/
        var leftDiv=$("<div>");
        leftDiv.css({
            "float":"left",
            "width":"50px",
            "height":"70px",
            "position":"relative",
            "text-align":"center"
        });
        var img=$("<img>");
        img.css({
            "position":"relative",
            "width":"50px",
            "height":"50px",
            "border-radius":"5px",
            "top":"10px"
        });
        img.attr("src","data:image/png;base64,"+user.getUserImg());
        leftDiv.append(img);
        item.append(leftDiv);
        /**用户名称*/
        var nameDiv=$("<div>");
        nameDiv.css({
            "float":"left",
            "width":"220px",
            "height":"70px",
            "line-height":"70px",
            "padding":"0px 10px",
            "font-size":"20px",
            "overflow": "hidden",
            "white-space": "nowrap",
            "text-overflow": "ellipsis"
        });
        nameDiv.text(user.getFriendName());
        item.append(nameDiv);
        
        var rightDiv=$("<div>");
        rightDiv.css({
            "float":"right",
            "width":"50px",
            "height":"70px",
            "line-height":"70px",
            "text-align": "right"
        });
        
        var radioDiv=$("<div>");
        radioDiv.addClass("radio");
        radioDiv.css({
            "margin-top": "10px"
        });
        var input=$("<input>");
        input.attr("id","radio-"+user.getFriendId()).attr("name","radio-"+user.getFriendId()).attr("type","radio");
        radioDiv.append(input);

        var label=$("<label>");
        label.attr("for","radio-"+user.getFriendId());
        label.addClass("radio-label");
        label.bind("click",{},function(e){
            e.stopPropagation();
            input.prop("checked",!input.prop("checked"));
            _this.selected();
            return false;
        });
        radioDiv.append(label);
        
        rightDiv.append(radioDiv);
        item.append(rightDiv);
        /**绑定事件*/
        item.click(function () {
            input.prop("checked",!input.prop("checked"));
            _this.selected();
        });
        panel.append(item);
        
        this.selected=function () {
            _this.win.addUser(_this,userInfo,input.prop("checked"));
        };
        this.cancelSelected=function(){
            input.prop("checked",false);
            _this.win.removerUser(userInfo.getFriendId());
        };

        item.hover(function(){
            $(this).css("background-color","#C8C8C8");
        },function(){
            $(this).css("background-color","");
        });
    }
    /**选择的用户item*/
    function SelectUserItem(userItem,panel,user){
        var _this=this;
        _this.userItem=userItem;
        var item=$("<div>");
        item.css({
            "width":"340px",
            "height":"70px",
            "padding":"0px 30px"
        });
        /**左侧头像*/
        var leftDiv=$("<div>");
        leftDiv.css({
            "float":"left",
            "width":"50px",
            "height":"70px",
            "position":"relative",
            "text-align":"center"
        });
        var img=$("<img>");
        img.css({
            "position":"relative",
            "width":"50px",
            "height":"50px",
            "border-radius":"5px",
            "top":"10px"
        });
        img.attr("src","data:image/png;base64,"+user.getUserImg());
        leftDiv.append(img);
        item.append(leftDiv);

        /**用户名称*/
        var nameDiv=$("<div>");
        nameDiv.css({
            "float":"left",
            "width":"220px",
            "height":"70px",
            "line-height":"70px",
            "padding":"0px 10px",
            "font-size":"20px",
            "overflow": "hidden",
            "white-space": "nowrap",
            "text-overflow": "ellipsis"
        });
        nameDiv.text(user.getFriendName());
        item.append(nameDiv);
        /**删除按钮*/
        var rightDiv=$("<div>");
        rightDiv.css({
            "float":"right",
            "width":"50px",
            "height":"70px",
            "line-height":"70px",
            "text-align": "right"
        });

        var radioDiv=$("<div>");
        radioDiv.addClass("radio");

        var input=$("<input>");
        input.attr("id","radio-"+user.getFriendId()).attr("name","radio-"+user.getFriendId()).attr("type","radio");
        input.prop("disabled",true);
        radioDiv.append(input);

        var label=$("<label>");
        label.attr("for","radio-"+user.getFriendId());
        label.addClass("radio-label");
        label.bind("click",{},function(){
            item.remove();
            _this.userItem.cancelSelected();
            return false;
        });
        radioDiv.append(label);

        rightDiv.append(radioDiv);
        item.append(rightDiv);
        
        panel.append(item);
        
        this.removeItem=function(){
            item.remove();
        };
    }
    IMChat.GroupChatWin=GroupChatWin;
})();