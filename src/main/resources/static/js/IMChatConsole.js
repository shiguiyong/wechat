var IMChatConsole = window.IMChatConsole = IMChatConsole || {};
(function(){
    /**当前正在显示的界面*/
    IMChatConsole.openTabId=undefined;
    /**所有面板*/
    IMChatConsole.cards={};

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
                IMChatConsole.Ajax.request({
                    type : "POST",
                    url : "token/check",
                    data:{
                        USER_ID:IMChatConsole.user.USER_ID
                    },
                    success:function(result){
                        IMChatConsole.user.TOKEN=result.TOKEN;
                    }
                });
            },this.timeout);
        }
    }
    IMChatConsole.httpHeartCheck=new HttpHeartCheck();
    
    /**当前日志级别*/
    IMChatConsole.logLevel="INFO";
    function Menu(){
        var _this=this;
        var ul=$("<ul>");
        
        var menuList=[{
            tabId:"home",
            icon:"image/home.png",
            name:"首页",
            active:true,
            handler:function(){
                if (IMChatConsole.cards[this.tabId]===undefined){
                    IMChatConsole.cards[this.tabId]=new HomeCard();
                }else{
                    IMChatConsole.cards[this.tabId].show();
                }
            }
        },{
            tabId:"usermanage",
            icon:"image/usermanage.png",
            name:"用户管理",
            handler:function(){
                if (IMChatConsole.cards[this.tabId]===undefined){
                    IMChatConsole.cards[this.tabId]=new UserManageCard();
                }else{
                    IMChatConsole.cards[this.tabId].show();
                }
            }
        },{
            tabId:"logmonitor",
            icon:"image/logmonitor.png",
            name:"日志监控",
            handler:function(){
                if (IMChatConsole.cards[this.tabId]===undefined){
                    IMChatConsole.cards[this.tabId]=new LogMonitorCard();
                }else{
                    IMChatConsole.cards[this.tabId].show();
                }
            }
        },{
            tabId:"chatmonitor",
            icon:"image/chatmonitor.png",
            name:"聊天监控",
            handler:function(){
                if (IMChatConsole.cards[this.tabId]===undefined){
                    IMChatConsole.cards[this.tabId]=new ChatMonitorCard();
                }else{
                    IMChatConsole.cards[this.tabId].show();
                }
            }
        },{
            tabId:"setting",
            icon:"image/setting.png",
            name:"服务器设置",
            handler:function(){
                if (IMChatConsole.cards[this.tabId]===undefined){
                    IMChatConsole.cards[this.tabId]=new SetingCard();
                }else{
                    IMChatConsole.cards[this.tabId].show();
                }
            }
        }];

        /**选择菜单*/
        this.openMenu=function(el,menu){
            if(IMChatConsole.openTabId!==menu.tabId){
                if(IMChatConsole.openTabId!==undefined){
                    IMChatConsole.cards[IMChatConsole.openTabId].hide();
                }
                IMChatConsole.openTabId=menu.tabId;
                $("#tabTitle").text(menu.name);
                menu.handler();
                ul.find("li.active").removeClass("active");
                el.addClass("active");
            }
        };
        /**初始化菜单*/
        this.initMenu=function(){
            menuList.forEach(function (m) {
                var li=$("<li>");
                var a=$("<a>");
                var img=$("<img src='' alt=''>");
                img.attr("src",m.icon);
                a.append(img);
                var span=$("<span>");
                span.text(m.name);
                a.append(span);
                li.append(a);
                if(m.active===true){
                    li.addClass("active");
                    _this.openMenu(li,m);
                }
                li.bind("click",m,function(e){
                    _this.openMenu($(this),e.data);
                });
                ul.append(li);
            });
            $("#menu").append(ul);
        };
        this.initMenu();
    }
    function Card(){
        this._card=$("<div>");
        this.appendCard=function(){
            $("#cards").append(this._card);
        }
    }
    /**首页*/
    function HomeCard(){
        Card.call(this);
        var _this=this;
        this._card.addClass("home-card");
        /**用户信息*/
        this.userPanel={
            init:function(){
                var userPanel=$("<div>");
                userPanel.addClass("user-panel");
                var headImg=$("<img src='' alt=''>");
                headImg.css({
                    "width":100,
                    "height":100,
                    "border-radius": "10px",
                    "margin-left": "30px",
                    "margin-top": "50px",
                    "float": "left"
                });
                headImg.attr("src","data:image/png;base64,"+IMChatConsole.user.USER_IMG);
                userPanel.append(headImg);
                
                var div=$("<div>");
                div.css({
                    "width":"calc(100% - 150px)",
                    "height":150,
                    "margin-left": "20px",
                    "margin-top": "50px",
                    "float": "left"
                });
                div.append($("<p>"+IMChatConsole.user.USER_NAME+"</p>"));
                div.append($("<p>"+(IMChatConsole.user.USER_SEX==="1"?"男":"女")+"</p>"));
                div.append($("<p>"+IMChatConsole.user.REGION_NAME+"</p>"));
                userPanel.append(div);

                var time=$("<div>");
                time.css({
                    "width":"calc(100%)",
                    "height":40,
                    "line-height":"40px",
                    "float": "left",
                    "text-align": "center",
                    "margin-top": "10px",
                    "font-size":"20px"
                });
                time.text("0000-00-00 00:00:00");
                userPanel.append(time);
                new IMChatClock(time);
                _this._card.append(userPanel);
            }
        };
        this.userPanel.init();
        /**聊天监控*/
        this.chatMonitorPanel={
            init:function(){
                var chatMonitorPanel=$("<div>");
                chatMonitorPanel.addClass("chatmonitor-panel");
                var title=$("<div>");
                title.addClass("title");
                title.text("聊天监控");
                chatMonitorPanel.append(title);

                var messagePanel=this.messagePanel=$("<div>");
                messagePanel.addClass("content");
                chatMonitorPanel.append(messagePanel);
                _this._card.append(chatMonitorPanel);

                messagePanel.niceScroll({
                    cursorcolor: "#B5B5B5",
                    cursoropacitymin: 0,
                    cursoropacitymax: 1,
                    touchbehavior: false,
                    cursorwidth: "5px",
                    cursorborder: "0",
                    cursorborderradius: "5px",
                    autohidemode: "cursor"
                });
            },
            appendMessage:function(message){
                var panel=$("<div>");
                panel.css({
                    "width":"calc(100% - 20px)",
                    "padding": "0px 10px"
                });
                var titlePanel=$("<div>");
                titlePanel.css({
                    "width":"100%",
                    "height": "20px",
                    "line-height": "20px"
                });
                // 发送时间  发送者 --> 接受这
                titlePanel.append(IMChatConsole.DateFormat(new Date(message.CHAT_DATE),"yyyy-MM-dd hh:mm:ss.S"));
                titlePanel.append("<span style='color: #38ff12'> "+message.USER_NAME+"("+message.USER_ID+")</span>");
                titlePanel.append("<span> \u21E2 </span>");
                titlePanel.append("<span style='color: #06b7ff'> "+message.CHAT_NAME+"("+message.CHAT_ID+")</span>");
                panel.append(titlePanel);
                var messagePanel=$("<div>");
                messagePanel.css({
                    "width":"calc(100% - 20px)",
                    "line-height": "20px",
                    "word-wrap": "break-word",
                    "padding":"0px 10px",
                    "color":"#38ff12"
                });
                messagePanel.text(message.CHAT_CONTENT);
                panel.append(messagePanel);
                this.messagePanel.append(panel);

                this.messagePanel.getNiceScroll().resize();
                this.messagePanel.getNiceScroll(0).doScrollTop(this.messagePanel[0].scrollHeight);
            }
        };
        this.chatMonitorPanel.init();
        /**统计信息*/
        this.statisticsPanel={
            init:function(){
                var statisticsPanel=$("<div>");
                statisticsPanel.addClass("statistics-panel");
                var title=$("<div>");
                title.addClass("title");
                title.text("统计信息");
                statisticsPanel.append(title);
                
                var div=$("<div>");
                div.addClass("content");
                /**总用户数*/
                var users=$("<div>");
                users.css({
                    "width" :120,
                    "height" : 100,
                    "background-color":"#3bbec0",
                    "margin": "30px calc((100% - 240px)/4)",
                    "float": "left",
                    "border-radius": "5px"
                });
                users.append("<p style='padding-left: 5px;'>总用户数</p>");
                users.append("<p id='userTotal' style='font-size: 50px;font-weight: 300;color: #169f1d;padding-left: 5px;'>66</p>");
                div.append(users);

                /**在线户数*/
                var onlineUsers=$("<div>");
                onlineUsers.css({
                    "width" :120,
                    "height" : 100,
                    "background-color":"#3bbec0",
                    "margin": "30px calc((100% - 240px)/4)",
                    "float": "left",
                    "border-radius": "5px"
                });
                onlineUsers.append("<p style='padding-left: 5px;'>在线户数</p>");
                onlineUsers.append("<p id='onLineUserTotal' style='font-size: 50px;font-weight: 300;color: #169f1d;padding-left: 5px;'>0</p>");
                div.append(onlineUsers);
                
                statisticsPanel.append(div);
                _this._card.append(statisticsPanel);
            },
            refresh:function () {//刷新用户总数 和在线用户
                IMChatConsole.Ajax.request({
                    type : "POST",
                    url : "user/statistics",
                    data:{},
                    success:function(result){
                        $("#onLineUserTotal").text(result.ONLINE_USER_TOTAL);
                        $("#userTotal").text(result.USER_TOTAL);
                        window.setTimeout(function () {
                            IMChatConsole.cards['home'].statisticsPanel.refresh();
                        },60000);
                    }
                });
            }
        };
        this.statisticsPanel.init();
        this.statisticsPanel.refresh();
        /**日志监控*/
        this.logMonitorPanel={
            init:function(){
                var logMonitorPanel=$("<div>");
                logMonitorPanel.addClass("logmonitor-panel");
                this.titlePanel=$("<div>");
                this.titlePanel.addClass("title");
                this.titlePanel.html("实时日志 <span style='background-color: #0aff07;padding:2px 5px;border-radius: 2px;'>"+IMChatConsole.logLevel+"</span>");
                logMonitorPanel.append(this.titlePanel);

                var logPanel=this.logPanel=$("<div>");
                logPanel.addClass("content");
                
                logMonitorPanel.append(logPanel);
                _this._card.append(logMonitorPanel);

                logPanel.niceScroll({
                    cursorcolor: "#B5B5B5",
                    cursoropacitymin: 0,
                    cursoropacitymax: 1,
                    touchbehavior: false,
                    cursorwidth: "5px",
                    cursorborder: "0",
                    cursorborderradius: "5px",
                    autohidemode: "cursor"
                });
            },
            log:function(log){
                this.logPanel.append(log);
                this.logPanel.getNiceScroll().resize();
                this.logPanel.getNiceScroll(0).doScrollTop(this.logPanel[0].scrollHeight);
            },
            setTitle:function(title){
                this.titlePanel.empty();
                this.titlePanel.append(title);
            }
        };
        this.logMonitorPanel.init();
        this.appendCard();
        
        this.hide=function(){
            this._card.css("display","none");
        };
        this.show=function(){
            this._card.css("display","");
        };
    }
    function UserManageCard(){
        Card.call(this);
        var _this=this;
        this._userListPanel=undefined;
        this._condition={};
        this._card.addClass("usermanage-card");
        
        this.initConditionPanel=function(){
            // 条件面板
            var conditionPanel=$("<div>");
            conditionPanel.addClass("condition-panel");
            // IMChat账号
            var idInput=$("<input>");
            idInput.css({
                "width": 205,
                "height":30,
                "line-height": "30px",
                "border": 0,
                "padding-left": "5px",
                "margin-left": "20px",
                "border-radius": "2px"
            });
            idInput.attr("placeholder","请输入IMChat账号");
            conditionPanel.append(idInput);
            //昵称
            var nameInput=$("<input>");
            nameInput.css({
                "width": 205,
                "height":30,
                "line-height": "30px",
                "border": 0,
                "padding-left": "5px",
                "margin-left": "20px",
                "border-radius": "2px"
            });
            nameInput.attr("placeholder","请输入昵称");
            conditionPanel.append(nameInput);
            //在线
            var checkBoxLabel=$("<label>");
            checkBoxLabel.css({
                "width": 205,
                "height":30,
                "line-height": "30px",
                "border": 0,
                "margin-left": "20px",
                "border-radius": "2px"
            });
            var checkbox=$("<input>");
            checkbox.css({
                "margin-right": "5px"
            });
            checkbox.attr("type","checkbox");
            checkbox.change(function(){
                if(checkbox.prop("checked")){
                    _this._condition.USER_STATE="1";
                }else{
                    delete _this._condition.USER_STATE;
                }
            });
            checkBoxLabel.append(checkbox);
            checkBoxLabel.append("在线");
            conditionPanel.append(checkBoxLabel);

            //查询按钮
            var qryButton=$("<button>");
            qryButton.css({
                "width": 80,
                "height":30,
                "margin-top": "5px",
                "margin-right": "160px",
                "float": "right"
            });
            qryButton.text("查询");
            qryButton.click(function(){
                _this._condition.PAGE_NO=1;
                _this._condition.PAGE_SIZE=30;
                var userId=idInput.val();
                if(userId.length>0){
                    _this._condition.USER_ID=userId;
                }else{
                    delete _this._condition.USER_ID;
                }
                var userName=nameInput.val();
                if(userName.length>0){
                    _this._condition.USER_NAME=userName;
                }else{
                    delete _this._condition.USER_NAME;
                }
                _this.qry();
            });
            conditionPanel.append(qryButton);
            this._card.append(conditionPanel);
        };
        this.initConditionPanel();
        
        this.initTablePanel=function(){
            var tablePanel=$("<div>");
            tablePanel.addClass("table-panel");
            // 表头
            var tableTheadPanel=$("<div>");
            tableTheadPanel.addClass("table-thead-panel");

            var tableThead=$("<table>");
            tableThead.attr("border","0").attr("cellpadding","0").attr("cellspacing","0");
            tableThead.addClass("table");
            
            var tr=$("<tr>");
            
            var th1=$("<th>");
            th1.attr("width",100);
            th1.text("IMChat账号");
            tr.append(th1);

            var th2=$("<th>");
            th2.attr("width",150);
            th2.text("昵称");
            tr.append(th2);

            var th3=$("<th>");
            th3.attr("width",50);
            th3.text("性别");
            tr.append(th3);

            var th4=$("<th>");
            th4.attr("width",200);
            th4.text("地区");
            tr.append(th4);

            var th5=$("<th>");
            th5.text("签名");
            tr.append(th5);

            var th6=$("<th>");
            th6.attr("width",80);
            th6.text("状态");
            tr.append(th6);

            var th7=$("<th>");
            th7.attr("width",120);
            th7.text("角色");
            tr.append(th7);

            var th8=$("<th>");
            th8.attr("width",300);
            th8.text("操作");
            tr.append(th8);

            tableThead.append(tr);
            tableTheadPanel.append(tableThead);
            tablePanel.append(tableTheadPanel);
            // 用户列表
            var tableTbodyPanel=$("<div>");
            tableTbodyPanel.addClass("table-tbody-panel");
            
            var listTable=$("<table>");
            listTable.attr("border","0").attr("cellpadding","0").attr("cellspacing","0");
            listTable.addClass("table");

            this._userListPanel=$("<tbody>");
            listTable.append(this._userListPanel);
            
            tableTbodyPanel.append(listTable);
            tablePanel.append(tableTbodyPanel);

            
            this._card.append(tablePanel);

            tableTbodyPanel.niceScroll({
                cursorcolor: "#B5B5B5",
                cursoropacitymin: 0,
                cursoropacitymax: 1,
                touchbehavior: false,
                cursorwidth: "5px",
                cursorborder: "0",
                cursorborderradius: "5px",
                autohidemode: "cursor"
            });
        };
        this.initTablePanel();
        this.appendCard();
        
        this.addUser=function(userInfo){
            var tr=$("<tr>");
            tr.attr("title",userInfo.USER_NAME);
            
            var td1=$("<td>");
            td1.attr("width",100).attr("align","center");
            td1.text(userInfo.USER_ID);
            tr.append(td1);

            var td2=$("<td>");
            td2.css({
                "max-width": "150px",
                "overflow": "hidden",
                "text-overflow":"ellipsis",
                "white-space": "nowrap"
            });
            td2.attr("width",150).attr("align","center");
            td2.text(userInfo.USER_NAME);
            tr.append(td2);

            var td3=$("<td>");
            td3.attr("width",50).attr("align","center");
            td3.text(userInfo.USER_SEX);
            tr.append(td3);

            var td4=$("<td>");
            td4.attr("width",200);
            td4.css({
                "max-width": "200px",
                "overflow": "hidden",
                "text-overflow":"ellipsis",
                "white-space": "nowrap"
            });
            td4.text(userInfo.REGION_NAME);
            tr.append(td4);

            var td5=$("<td>");
            td5.text(userInfo.USER_DES);
            tr.append(td5);

            var td6=$("<td>");
            td6.attr("width",80).attr("align","center");
            if(userInfo.USER_STATE===1){
                td6.text("在线");
            }else if(userInfo.USER_STATE===2){
                td6.text("冻结");
            }else{
                td6.text("不在线");
            }
            tr.append(td6);

            var td7=$("<td>");
            td7.attr("width",120).attr("align","center");
            if(userInfo.ROLE_TYPE===1){
                td7.text("普通管理员");
            }else if(userInfo.ROLE_TYPE===2){
                td7.text("超级管理员");
            }else{
                td7.text("普通角色");
            }
            tr.append(td7);

            var td8=$("<td>");
            td8.attr("width",300);
            if(IMChatConsole.user.ROLE_TYPE===1||IMChatConsole.user.ROLE_TYPE===2){
                // 冻结 
                var freezeBtn=$("<button>");
                if(userInfo.USER_STATE===2){
                    freezeBtn.addClass("disabled");
                }
                freezeBtn.text("冻结");
                td8.append(freezeBtn);
                // 解封 
                var deArchiveBtn=$("<button>");
                deArchiveBtn.css({
                    "margin-left": "5px",
                    "background-color": "#00FFFF"
                });
                if(userInfo.USER_STATE!==2){
                    deArchiveBtn.addClass("disabled");
                }
                deArchiveBtn.text("解封");
                td8.append(deArchiveBtn);
                // 修改角色 查询聊天记录
                if(IMChatConsole.user.ROLE_TYPE===2){
                    var roleBtn=$("<button>");
                    roleBtn.css({
                        "margin-left": "5px",
                        "background-color": "#00FF00"
                    });
                    roleBtn.text("修改角色");
                    roleBtn.click(function(){
                        console.log(userInfo);
                        var win=new RoleWin({
                            USER_ID:userInfo.USER_ID,
                            ROLE_TYPE:userInfo.ROLE_TYPE,
                            CARD:_this
                        });
                        win.show();
                    });
                    td8.append(roleBtn);
                }

                freezeBtn.bind('click',{USER_ID:userInfo.USER_ID,USER_NAME:userInfo.USER_NAME},function(e){
                    if(freezeBtn.is(".disabled")){
                        return;
                    }
                    var userId=e.data.USER_ID;
                    var win = new MesaageConfirmWin({
                        title:'冻结',
                        content:'确认冻结'+e.data.USER_NAME+'用户?',
                        confirm:function(){
                            IMChatConsole.Ajax.request({
                                type : "POST",
                                url : "user/freeze",
                                data:{
                                    USER_ID:userId,
                                    USER_STATE:2
                                },
                                success:function(result){
                                    deArchiveBtn.removeClass("disabled");
                                    freezeBtn.addClass("disabled");
                                }
                            });
                        },
                        scope:_this
                    });
                    win.show();
                });

                deArchiveBtn.bind('click',{USER_ID:userInfo.USER_ID,USER_NAME:userInfo.USER_NAME},function(e){
                    if(deArchiveBtn.is(".disabled")){
                        return;
                    }
                    var userId=e.data.USER_ID;
                    var win = new MesaageConfirmWin({
                        title:'冻结',
                        content:'确认冻结'+e.data.USER_NAME+'用户?',
                        confirm:function(){
                            IMChatConsole.Ajax.request({
                                type : "POST",
                                url : "user/freeze",
                                data:{
                                    USER_ID:userId,
                                    USER_STATE:0
                                },
                                success:function(result){
                                    deArchiveBtn.addClass("disabled");
                                    freezeBtn.removeClass("disabled");
                                }
                            });
                        },
                        scope:_this
                    });
                    win.show();
                });
            }
            if(userInfo.ROLE_TYPE===2||userInfo.USER_ID===IMChatConsole.user.USER_ID){
                td8.empty();
            }
            tr.append(td8);
            _this._userListPanel.append(tr);
        };
        
        this.hide=function(){
            this._card.css("display","none");
        };
        this.show=function(){
            this._card.css("display","");
        };
        this.qry=function () {
            IMChatConsole.Ajax.request({
                type : "POST",
                url : "user/qry",
                data:_this._condition,
                success:function(result){
                    var userList=result.DATA;
                    if(userList){
                        _this._userListPanel.empty();
                        for(var i=0;i<userList.length;i++){
                            var userInfo=userList[i];
                            _this.addUser(userInfo);
                        }
                    }
                }
            });
        };
    }
    function LogMonitorCard(){
        Card.call(this);
        var _this=this;
        this._card.addClass("logmonitor-card");
        /**标题面板*/
        this.titlePanel=$("<div>");
        this.titlePanel.addClass("title-panel");
        this.titlePanel.append("实时日志 <span style='background-color: #0aff07;padding:2px 5px;border-radius: 2px;'>"+IMChatConsole.logLevel+"</span>");
        this._card.append(this.titlePanel);
        /**日志面板*/
        this.logPanel=$("<div>");
        this.logPanel.addClass("log-panel");
        this._card.append(this.logPanel);
        /**按钮面板*/
        this.buttonPanel=$("<div>");
        this.buttonPanel.addClass("button-panel");
        this.buttonPanel.css({
            "text-align": "center"
        });
        /**info*/
        var infoButton=$("<button>");
        infoButton.css({
            "background-color": "#0aff07",
            "margin-right": "10px"
        });
        infoButton.text("INFO");
        infoButton.click(function(){
            IMChatConsole.Ajax.request({
                type : "POST",
                url : "log/level",
                data:{
                    USER_ID:IMChatConsole.user.USER_ID,
                    LEVEL:"INFO"
                },
                success:function(result){
                    IMChatConsole.logLevel="INFO";
                   _this.setTitle("实时日志 <span style='background-color: #0aff07;padding:2px 5px;border-radius: 2px;'>"+IMChatConsole.logLevel+"</span>");
                }
            });
        });
        this.buttonPanel.append(infoButton);
        /**debug*/
        var debugButton=$("<button>");
        debugButton.css({
            "background-color": "#0aff07",
            "margin-right": "10px"
        });
        debugButton.text("DEBUG");
        debugButton.click(function(){
            IMChatConsole.Ajax.request({
                type : "POST",
                url : "log/level",
                data:{
                    USER_ID:IMChatConsole.user.USER_ID,
                    LEVEL:"DEBUG"
                },
                success:function(result){
                    IMChatConsole.logLevel="DEBUG";
                    _this.setTitle("实时日志 <span style='background-color: #0aff07;padding:2px 5px;border-radius: 2px;'>"+IMChatConsole.logLevel+"</span>");
                }
            });
        });
        this.buttonPanel.append(debugButton);
        /**warn*/
        var warnButton=$("<button>");
        warnButton.css({
            "background-color": "#cd9b1d",
            "margin-right": "10px"
        });
        warnButton.text("WARN");
        warnButton.click(function(){
            IMChatConsole.Ajax.request({
                type : "POST",
                url : "log/level",
                data:{
                    USER_ID:IMChatConsole.user.USER_ID,
                    LEVEL:"WARN"
                },
                success:function(result){
                    IMChatConsole.logLevel="WARN";
                    _this.setTitle("实时日志 <span style='background-color: #cd9b1d;padding:2px 5px;border-radius: 2px;'>"+IMChatConsole.logLevel+"</span>");
                }
            });
        });
        this.buttonPanel.append(warnButton);
        /**error*/
        var errorButton=$("<button>");
        errorButton.css({
            "background-color": "#cd2c1b",
            "margin-right": "10px"
        });
        errorButton.click(function(){
            IMChatConsole.Ajax.request({
                type : "POST",
                url : "log/level",
                data:{
                    USER_ID:IMChatConsole.user.USER_ID,
                    LEVEL:"ERROR"
                },
                success:function(result){
                    IMChatConsole.logLevel="ERROR";
                    _this.setTitle("实时日志 <span style='background-color: #cd2c1b;padding:2px 5px;border-radius: 2px;'>"+IMChatConsole.logLevel+"</span>");
                }
            });
        });
        errorButton.text("ERROR");
        this.buttonPanel.append(errorButton);
        /**清屏*/
        var clearButton=$("<button>");
        clearButton.text("清屏");
        clearButton.click(function(){
            _this.logPanel.empty();
            if(IMChatConsole.cards["home"]){
                IMChatConsole.cards["home"].logMonitorPanel.logPanel.empty();
            }
        });
        this.buttonPanel.append(clearButton);
        
        this._card.append(this.buttonPanel);
        this.appendCard();

        this.logPanel.niceScroll({
            cursorcolor: "#B5B5B5",
            cursoropacitymin: 0,
            cursoropacitymax: 1,
            touchbehavior: false,
            cursorwidth: "5px",
            cursorborder: "0",
            cursorborderradius: "5px",
            autohidemode: "cursor"
        });
        
        this.log=function(log){
            this.logPanel.append(log);
            this.logPanel.getNiceScroll().resize();
            this.logPanel.getNiceScroll(0).doScrollTop(this.logPanel[0].scrollHeight);
        };
        
        this.setTitle=function(title){
            this.titlePanel.empty();
            this.titlePanel.append(title);
            if(IMChatConsole.cards["home"]){
                IMChatConsole.cards["home"].logMonitorPanel.setTitle(title);
            }
        };
        this.hide=function(){
            this._card.css("display","none");
            this.logPanel.getNiceScroll().hide();
        };
        this.show=function(){
            this._card.css("display","");
            this.logPanel.getNiceScroll().show();
        };
    }
    function ChatMonitorCard(){
        Card.call(this);
        this._card.addClass("chatmonitor-card");

        var chatPanel=$("<div>");
        chatPanel.addClass("chat-panel");
        this._card.append(chatPanel);
        this.appendCard();

        chatPanel.niceScroll({
            cursorcolor: "#B5B5B5",
            cursoropacitymin: 0,
            cursoropacitymax: 1,
            touchbehavior: false,
            cursorwidth: "5px",
            cursorborder: "0",
            cursorborderradius: "5px",
            autohidemode: "cursor"
        });

        this.appendMessage=function (message) {
            var panel=$("<div>");
            panel.css({
                "width":"calc(100% - 20px)",
                "padding": "0px 10px"
            });
            var titlePanel=$("<div>");
            titlePanel.css({
                "width":"100%",
                "height": "20px",
                "line-height": "20px"
            });
            // 发送时间  发送者 --> 接受这
            titlePanel.append(IMChatConsole.DateFormat(new Date(message.CHAT_DATE),"yyyy-MM-dd hh:mm:ss.S"));
            titlePanel.append("<span style='color: #38ff12'> "+message.USER_NAME+"("+message.USER_ID+")</span>");
            titlePanel.append("<span> \u21E2 </span>");
            titlePanel.append("<span style='color: #06b7ff'> "+message.CHAT_NAME+"("+message.CHAT_ID+")</span>");
            panel.append(titlePanel);
            var messagePanel=$("<div>");
            messagePanel.css({
                "width":"calc(100% - 20px)",
                "line-height": "20px",
                "word-wrap": "break-word",
                "padding":"5px 10px",
                "color":"#38ff12"
            });
            messagePanel.text(message.CHAT_CONTENT);
            panel.append(messagePanel);
            chatPanel.append(panel);

            chatPanel.getNiceScroll().resize();
            chatPanel.getNiceScroll(0).doScrollTop(chatPanel[0].scrollHeight);
        };
        this.hide=function(){
            this._card.css("display","none");
            chatPanel.getNiceScroll().hide();
        };
        this.show=function(){
            this._card.css("display","");
            chatPanel.getNiceScroll().show();
        };
    }
    /**设置界面*/
    function SetingCard(){
        Card.call(this);
        this._card.addClass("seting-card");
        //设置未读消息保存时长
        this.unreadSaveTime=function(){
            var unreadSaveTimeDiv=$("<div>");
            unreadSaveTimeDiv.addClass("unread-save-time");

            var labelDiv=$("<div>");
            labelDiv.addClass("label");
            labelDiv.text("未读消息保留时长(小时)");
            unreadSaveTimeDiv.append(labelDiv);

            var deaDiv=$("<div>");
            deaDiv.addClass("des-label");
            deaDiv.text("未读消息保存超过时间就会删除,对方无法再接收到消息");
            unreadSaveTimeDiv.append(deaDiv);

            var inputDiv=$("<div>");
            inputDiv.addClass("input-label");
            var input=$("<input>");
            input.css({
                "width": 100,
                "height": 30,
                "padding": "0 5px"
            });
            input.val(IMChatConsole.config.getunreadMessageTimeOut());
            input.blur(function(){
                var value=$(this).val();
                IMChatConsole.config.update(input,"UNREAD-MESSAGE-TIMEOUT",value);
            });
            inputDiv.append(input);
            unreadSaveTimeDiv.append(inputDiv);
            
            this._card.append(unreadSaveTimeDiv);
        };
        this.unreadSaveTime();
        
        this.appendCard();
        this.hide=function(){
            this._card.css("display","none");
        };
        this.show=function(){
            this._card.css("display","");
        };
    }
    /**时钟*/
    function IMChatClock(time){
        (function Clock() {
            var datetime = new Date();
            var year = datetime.getFullYear();
            var month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
            var date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
            var hour = datetime.getHours()< 10 ? "0" + datetime.getHours() : datetime.getHours();
            var minute = datetime.getMinutes()< 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();
            var second = datetime.getSeconds()< 10 ? "0" + datetime.getSeconds() : datetime.getSeconds();
            time.html(year + "-" + month + "-" + date+" "+hour+":"+minute+":"+second);
            setTimeout(Clock, 1000);
        })();
    }
    /**接收日志*/
    function ReceiveLog(){
        var _this=this;
        var socket=null;
        this.createWebSocket=function(){
            try{
                if('WebSocket' in window){
                    socket = new WebSocket("ws://"+window.location.host+"/websocket/2/"+IMChatConsole.user.USER_ID+"?TOKEN="+IMChatConsole.user.TOKEN);
                }
                _this.initEventHandle();
            }catch(e){
                console.log(e);
            }
        };
        this.initEventHandle=function(){
            socket.onclose = function(){
                console.log("wws连接关闭 "+new Date().toUTCString());
            };
            socket.onerror = function(e) {
                console.log("wws连接错误 !"+new Date().toUTCString());
                console.log(e);
            };
            socket.onopen=function(){
                console.log("wws连接成功 "+new Date().toUTCString());
            };
            socket.onmessage=function(event){
                if(event.data){
                    /**向首页 日志监控模块输出日志*/
                    var json=$.parseJSON(event.data);
                    var log="<p>"+json.dateTime;
                    log+=" ["+json.threadName+"] ";
                    log+="<span style='color: #ffda0a'>"+json.level+"</span>  ";
                    log+="<span style='color: #398bff'>"+json.className+"</span>: ";
                    log+=json.body;
                    if(json.exception){
                        log+="<br>";
                        log+="<span style='color: #ff3b31'>";
                        log+=json.exception;
                        log+="</span>";
                    }
                    log+="</p>";
                    
                    if(IMChatConsole.cards["home"]){
                        IMChatConsole.cards["home"].logMonitorPanel.log(log);
                    }
                    if(IMChatConsole.cards["logmonitor"]){
                        IMChatConsole.cards["logmonitor"].log(log);
                    }
                }
            };
        };
    }
    /**服务器配置*/
    function Config(){
        var _this=this;
        this.unreadMessageTimeOut=1;
        this.getunreadMessageTimeOut=function(){
            return this.unreadMessageTimeOut;
        };
        this.setunreadMessageTimeOut=function(unreadMessageTimeOut){
            this.unreadMessageTimeOut=unreadMessageTimeOut;
        };
        this.init=function(){
            IMChatConsole.Ajax.request({
                type : "POST",
                url : "serverconfig/qry",
                success:function(result){
                    if(result["UNREAD-MESSAGE-TIMEOUT"]){
                        _this.setunreadMessageTimeOut(result["UNREAD-MESSAGE-TIMEOUT"]);
                    }
                }
            });
        };
        this.update=function(input,key,value){
            IMChatConsole.Ajax.request({
                type : "POST",
                url : "serverconfig/update",
                data:{
                    CONFIG_KEY:key,
                    CONFIG_VALUE:value
                },
                success:function(result){
                    IMChatConsole.MessageBox.alert("服务器配置更新成功");
                    IMChatConsole.config.setunreadMessageTimeOut(value);
                },
                error:function(result){
                    input.val(IMChatConsole.config.getunreadMessageTimeOut());
                    IMChatConsole.MessageBox.alert(result.RETURN_MSG);
                }
            });
        }
    }
    /**接收聊天消息*/
    function ReceiveChatMessage(){
        var _this=this;
        var socket=null;
        this.createWebSocket=function(){
            try{
                if('WebSocket' in window){
                    socket = new WebSocket("ws://"+window.location.host+"/websocket/3/"+IMChatConsole.user.USER_ID+"?TOKEN="+IMChatConsole.user.TOKEN);
                }
                _this.initEventHandle();
            }catch(e){
                console.log(e);
            }
        };
        this.initEventHandle=function(){
            socket.onclose = function(){
                console.log("wws连接关闭 "+new Date().toUTCString());
            };
            socket.onerror = function(e) {
                console.log("wws连接错误 !"+new Date().toUTCString());
                console.log(e);
            };
            socket.onopen=function(){
                console.log("wws连接成功 "+new Date().toUTCString());
            };
            socket.onmessage=function(event){
                if(event.data){
                    console.log(event);
                    var message=$.parseJSON(event.data);
                    if(IMChatConsole.cards["home"]){
                        IMChatConsole.cards["home"].chatMonitorPanel.appendMessage(message);
                    }
                    if(IMChatConsole.cards["chatmonitor"]){
                        IMChatConsole.cards["chatmonitor"].appendMessage(message);
                    }
                }
            };
        };
    }
    /**
     * 消息确认弹框
     * option.title 弹出框标题
     * option.content 弹出框内容
     * option.confirm 确认回调函数
     * option.scope option.confirm函数指向this
     * */
    function MesaageConfirmWin(option){
        var _this=this;
        var width=460;
        var height=300;

        var _title=option.title;
        var _content=option.content;
        var confirmFt=option.confirm;
        var scope=option.scope;

        var win=$("<div>");
        win.addClass("dialog");
        win.css({
            "display":"none",
            "width":width,
            "height":height,
            "margin-top":"-"+height/4*3+"px",
            "margin-left":"-"+width/2+"px",
            "background-color":"#EBF2F9"
        });
        //标题面板
        var titlePanel=$("<div>");
        this.titlePanelInit=function(){
            titlePanel.css({
                "width":width,
                "height":30,
                "line-height":"30px"
            });
            /**logo 显示*/
            var logo=$('<img alt="" src="">');
            logo.css({
                "width":25,
                "height":25,
                "float":"left",
                "margin":"3px 10px 2px 10px"
            });
            logo.attr("src","image/logo.png");
            titlePanel.append(logo);
            /**标题*/
            var title = $("<span>");
            title.css({
                "width":200,
                "height":30,
                "float":"left",
                "font-size":"14px"
            });
            title.text(_title);
            titlePanel.append(title);

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
            titlePanel.append(close);
            win.append(titlePanel);
        };
        this.titlePanelInit();
        this.initCenterPanel=function(){
            var centerDiv=$("<div>");
            centerDiv.css({
                "width":width,
                "height":height-80,
                "line-height":(height-80)+"px",
                "text-align": "center",
                "color":"#000000"
            });
            centerDiv.text(_content);
            win.append(centerDiv);
        };
        this.initCenterPanel();

        this.initButtonPanel=function(){
            var buttonDiv=$("<div>");
            buttonDiv.css({
                "width":width,
                "height":50
            });
            var colseButton=$("<button>");
            colseButton.css({
                "margin-top":"10px",
                "margin-right":"15px",
                "float": "right"
            });
            colseButton.text("取消");
            colseButton.click(function(){
                _this.close();
            });
            buttonDiv.append(colseButton);

            var saveButton=$("<button>");
            saveButton.css({
                "margin-top":"10px",
                "margin-right":"15px",
                "float": "right"
            });
            saveButton.text("确定");
            saveButton.click(function(){
                _this.save();
            });
            buttonDiv.append(saveButton);

            win.append(buttonDiv);
        };
        this.initButtonPanel();

        $("body").append(win);

        this.show=function(){
            IMChatConsole.transparentMaskLayer.show();
            win.css("display","");
        };
        this.hidden=function(){
            win.css("display","none");
            IMChatConsole.transparentMaskLayer.hidden();
        };
        this.close=function(){
            _this.hidden();
            win.remove();
        };
        this.save=function(){
            if(scope){
                confirmFt.call(scope);
            }else{
                confirmFt.call(this);
            }
            this.close();
        };
    }
    /**角色修改*/
    function RoleWin(option){
        var _this=this;
        var width=460;
        var height=300;
        
        var userId=option.USER_ID;
        var roleType=option.ROLE_TYPE;
        var card=option.CARD;
        
        var win=$("<div>");
        win.addClass("dialog");
        win.css({
            "display":"none",
            "width":width,
            "height":height,
            "margin-top":"-"+height/4*3+"px",
            "margin-left":"-"+width/2+"px",
            "background-color":"#EBF2F9"
        });
        //标题面板
        var titlePanel=$("<div>");
        this.titlePanelInit=function(){
            titlePanel.css({
                "width":width,
                "height":30,
                "line-height":"30px"
            });
            /**logo 显示*/
            var logo=$('<img alt="" src="">');
            logo.css({
                "width":25,
                "height":25,
                "float":"left",
                "margin":"3px 10px 2px 10px"
            });
            logo.attr("src","image/logo.png");
            titlePanel.append(logo);
            /**标题*/
            var title = $("<span>");
            title.css({
                "width":200,
                "height":30,
                "float":"left",
                "font-size":"14px",
                "color":"#2c3133"
            });
            title.text("修改角色");
            titlePanel.append(title);

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
            titlePanel.append(close);
            win.append(titlePanel);
        };
        this.titlePanelInit();
        this.initCenterPanel=function(){
            var centerDiv=$("<div>");
            centerDiv.css({
                "width":width-100,
                "height":height-120,
                "line-height":"40px",
                "text-align": "left",
                "color":"#2c3133",
                "padding":"20px 50px"
            });
            
            centerDiv.append('<label><input type="checkbox"/ roleType="0"><span>普通角色</span></label><br/>');
            centerDiv.append('<label><input type="checkbox"/ roleType="1"><span>普通管理员</span></label><br/>');
            centerDiv.append('<label><input type="checkbox"/ roleType="2"><span>超级管理员</span></label><br/>');

            centerDiv.find(":checkbox").click(function(){
                centerDiv.find(":checkbox").attr("checked",false);
                $(this).attr("checked",true);
            });
            centerDiv.find(":checkbox[roleType="+roleType+"]").attr("checked",true);
            win.append(centerDiv);
        };
        this.initCenterPanel();

        this.initButtonPanel=function(){
            var buttonDiv=$("<div>");
            buttonDiv.css({
                "width":width,
                "height":50
            });
            var colseButton=$("<button>");
            colseButton.css({
                "margin-top":"10px",
                "margin-right":"15px",
                "float": "right"
            });
            colseButton.text("取消");
            colseButton.click(function(){
                _this.close();
            });
            buttonDiv.append(colseButton);

            var saveButton=$("<button>");
            saveButton.css({
                "margin-top":"10px",
                "margin-right":"15px",
                "float": "right"
            });
            saveButton.text("确定");
            saveButton.click(function(){
                _this.save();
            });
            buttonDiv.append(saveButton);

            win.append(buttonDiv);
        };
        this.initButtonPanel();

        $("body").append(win);

        this.show=function(){
            IMChatConsole.transparentMaskLayer.show();
            win.css("display","");
        };
        this.hidden=function(){
            win.css("display","none");
            IMChatConsole.transparentMaskLayer.hidden();
        };
        this.close=function(){
            _this.hidden();
            win.remove();
        };
        this.save=function(){
            var roleType=win.find(":checkbox:checked").attr("roleType");
            IMChatConsole.Ajax.request({
                type : "POST",
                url : "user/roleTypemodify",
                data:{
                    USER_ID:userId,
                    ROLE_TYPE:roleType
                },
                success:function(result){
                    card.qry();
                    IMChatConsole.MessageBox.alert("角色修改成功");
                }
            });
            this.close();
        };
    }
    
    IMChatConsole.Ajax={
        request:function(option){
            $.ajax({
                type : option.type,
                url : option.url,
                data:JSON.stringify(option.data),
                contentType: "application/json",
                dataType: "json",
                beforeSend:function(request){
                    if(IMChatConsole.user){
                        request.setRequestHeader("TOKEN", IMChatConsole.user.TOKEN);
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
                                IMChatConsole.MessageBox.alert(result.RETURN_MSG);
                            }
                        }
                    }
                }
            });
            IMChatConsole.httpHeartCheck.reset().start();
        }
    };
    IMChatConsole.DateFormat=function(date,pattern){
        var o = {
            "M+" : date.getMonth()+1,                 //月份
            "d+" : date.getDate(),                    //日
            "h+" : date.getHours(),                   //小时
            "m+" : date.getMinutes(),                 //分
            "s+" : date.getSeconds(),                 //秒
            "q+" : Math.floor((date.getMonth()+3)/3), //季度
            "S"  : date.getMilliseconds()             //毫秒
        };
        if(/(y+)/.test(pattern)){
            pattern=pattern.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
        }

        for(var k in o){
            if(new RegExp("("+ k +")").test(pattern)){
                pattern = pattern.replace(RegExp.$1, (RegExp.$1.length===1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
            }
        }
        return pattern;
    };
    /**告警弹框*/
    IMChatConsole.MessageBox={
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
    /**透明的遮罩层*/
    IMChatConsole.transparentMaskLayer={
        show:function(){
            $("#maskLayer").css("display","");
        },
        hidden:function(){
            $("#maskLayer").css("display","none");
        }
    };
    IMChatConsole.load=function(){
        var userId=window.localStorage.getItem("USER_ID");
        if(userId===undefined||userId===null||userId===""){
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
            $("#loginButton").bind("click",function(){
                var user=$("#userId").val();
                var pwd=$("#userPwd").val();
                if(user===""||user===undefined){
                    IMChatConsole.MessageBox.alert("请输入账号",1500);
                    return;
                }
                if(pwd===""||pwd===undefined){
                    IMChatConsole.MessageBox.alert("请输入密码",1500);
                    return;
                }
                IMChatConsole.Ajax.request({
                    type : "POST",
                    url : "login",
                    data:{
                        USER_ID:user,
                        USER_PWD:pwd,
                        CLIENT_TYPE:4
                    },
                    success:function(result){
                        if(result.SUCCESS){
                            IMChatConsole.user={
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
                            IMChatConsole.initMain();
                        }
                    }
                });
            });
        }else{
            var userName=window.localStorage.getItem("USER_NAME");
            var userImg=window.localStorage.getItem("USER_IMG");
            var userSex=window.localStorage.getItem("USER_SEX");
            var regionName=window.localStorage.getItem("REGION_NAME");
            var token=window.localStorage.getItem("TOKEN");
            var roleType=parseInt(window.localStorage.getItem("ROLE_TYPE"));
            IMChatConsole.user={
                USER_ID:userId,
                USER_NAME:userName,
                USER_IMG:userImg,
                USER_SEX:userSex,
                REGION_NAME:regionName,
                TOKEN:token,
                ROLE_TYPE:roleType
            };
            IMChatConsole.initMain();
            window.localStorage.clear();
        }
    };
    /**初始化主界面*/
    IMChatConsole.initMain=function(){
        var userInfo=$("#userInfo");
        var headImg=$("<img src='' alt=''>");
        headImg.css({
            "width": 40,
            "height": 40,
            "border-radius": "20px",
            "margin-top": "5px",
            "margin-right": "10px",
            "float": "left"
        });

        headImg.attr("src","data:image/png;base64,"+IMChatConsole.user.USER_IMG);
        userInfo.append(headImg);

        var userNameLabel=$("<div>");
        userNameLabel.css({
            "width": 80,
            "height": 50,
            "line-height": "50px",
            "float": "left"
        });
        userNameLabel.text(IMChatConsole.user.USER_NAME);
        userInfo.append(userNameLabel);

        $(document).bind("contextmenu",function(){return false;});
        $("#header").bind("selectstart",function(){return false;});
        $("#menu").bind("selectstart",function(){return false;});
        /**加载服务器配置参数*/
        IMChatConsole.config=new Config();
        IMChatConsole.config.init();
        /**创建菜单*/
        IMChatConsole.menu=new Menu();
        /**创建接收日志*/
        IMChatConsole.receiveLog=new ReceiveLog();
        IMChatConsole.receiveLog.createWebSocket();
        /**创建接收聊天消息*/
        IMChatConsole.receiveChatMessage=new ReceiveChatMessage();
        IMChatConsole.receiveChatMessage.createWebSocket();
        /**token检查心跳*/
        IMChatConsole.httpHeartCheck.reset().start();
        $("#login").css("display","none");
        $("#main").css("display","");
    };
})();