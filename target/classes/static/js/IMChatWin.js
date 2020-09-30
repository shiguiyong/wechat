var IMChat = window.IMChat = IMChat || {};
(function(){
    /**
     * 账号设置弹框
     * */
    function UserInfoConfigWin(){
        var _this=this;
        var width=460;
        var height=300;
        
        var _nameInput=undefined;
        var _sexSelect=undefined;
        var _regionInput=undefined;
        var _desArea=undefined;
        var _userImg=undefined;
        var regionSelectWin=undefined;
        /**修改后的base64 img 图片*/
        var base64Img=undefined;
        
        var win=$("<div>");
        win.addClass("dialog");
        win.css({
            "display":"none",
            "width":width,
            "height":height,
            "margin-top":"-"+height/4*3+"px",
            "margin-left":"-"+width/2+"px",
            "background-color":"rgba(235,242,249)"
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
            title.text("编辑资料");
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
                "height":height-80
            });
            
            var leftDiv=$("<div>");
            leftDiv.css({
                "width":180,
                "height":height-80,
                "float": "left"
            });
            var img=_userImg=$("<img src='' alt=''>");
            img.css({
                "width":100,
                "height":100,
                "margin":"40px 40px 10px 40px",
                "border-radius": "10px"
            });
            img.attr("src","data:image/png;base64,"+IMChat.user.USER_IMG);
            leftDiv.append(img);
            
            var button=$("<button>");
            button.css({
                "width":100,
                "height":40,
                "margin":"10px 40px",
                "background-color": "#FFFAFA",
                "color": "#363636"
            });
            button.text("更换头像");
            button.click(function(){
                new IMChat.PhotoClip({
                    win:_this
                });
            });
            leftDiv.append(button);

            centerDiv.append(leftDiv);

            var rightDiv=$("<div>");
            rightDiv.css({
                "width":width-180,
                "height":height-80,
                "float": "left"
            });
            //昵称
            var nameDiv=$("<div>");
            nameDiv.css({
                "width":width-180,
                "height":40,
                "line-height":"40px"
            });
            var nameLabel=$("<span>");
            nameLabel.css({
                "width":60,
                "height":40,
                "color":"#696969",
                "text-align":"center",
                "display": "block",
                "float": "left"
            });
            nameLabel.text("昵称");
            nameDiv.append(nameLabel);

            var nameInput=_nameInput=$("<input>");
            nameInput.css({
                "width":180,
                "height":30,
                "margin-top":"5px",
                "padding-left":"2px",
                "float": "left"
            });
            nameInput.val(IMChat.user.USER_NAME);
            nameDiv.append(nameInput);
            rightDiv.append(nameDiv);
            
            //性别
            var sexDiv=$("<div>");
            sexDiv.css({
                "width":width-180,
                "height":40,
                "line-height":"40px"
            });
            var sexLabel=$("<span>");
            sexLabel.css({
                "width":60,
                "height":40,
                "color":"#696969",
                "text-align":"center",
                "display": "block",
                "float": "left"
            });
            sexLabel.text("性别");
            sexDiv.append(sexLabel);

            var sexSelect=_sexSelect=$("<select>");
            sexSelect.css({
                "width":180,
                "height":30,
                "margin-top":"5px",
                "padding-left":"2px",
                "float": "left"
            });
            sexSelect.append($("<option value='1'>男</option>"));
            sexSelect.append($("<option value='2'>女</option>"));
            sexSelect.val(IMChat.user.USER_SEX);
            sexDiv.append(sexSelect);
            rightDiv.append(sexDiv);

            //所在地区
            var regionDiv=$("<div>");
            regionDiv.css({
                "width":width-180,
                "height":40,
                "line-height":"40px"
            });
            var regionLabel=$("<span>");
            regionLabel.css({
                "width":60,
                "height":40,
                "color":"#696969",
                "text-align":"center",
                "display": "block",
                "float": "left"
            });
            regionLabel.text("地区");
            regionDiv.append(regionLabel);

            var regionInput=_regionInput=$("<input>");
            regionInput.css({
                "width":180,
                "height":30,
                "margin-top":"5px",
                "padding-left":"2px",
                "float": "left"
            });
            regionInput.attr("readonly","readonly");
            regionInput.data("code",IMChat.user.REGION_CODE);
            regionInput.val("所在地:"+IMChat.user.REGION_NAME);
            regionDiv.append(regionInput);
            rightDiv.append(regionDiv);

            regionSelectWin=new IMChat.RegionSelectWin(regionInput);
            $(document).click(function(){
                regionSelectWin.hidden();
            });


            //签名
            var desDiv=$("<div>");
            desDiv.css({
                "width":width-180,
                "height":80,
                "line-height":"40px"
            });
            var desLabel=$("<span>");
            desLabel.css({
                "width":60,
                "height":40,
                "color":"#696969",
                "text-align":"center",
                "display": "block",
                "float": "left"
            });
            desLabel.text("签名");
            desDiv.append(desLabel);

            var desArea=_desArea=$("<textarea>");
            desArea.css({
                "width":170,
                "height":80,
                "margin-top":"5px",
                "padding-left":"2px",
                "float": "left",
                "resize":"none",
                "padding":"3px 5px"
            });
            desArea.val(IMChat.user.USER_DES);
            desDiv.append(desArea);
            rightDiv.append(desDiv);
            
            centerDiv.append(rightDiv);
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
            colseButton.text("关闭");
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
            saveButton.text("保存");
            saveButton.click(function(){
                _this.save();
            });
            buttonDiv.append(saveButton);

            win.append(buttonDiv);
        };
        this.initButtonPanel();
        
        $("body").append(win);
        
        this.show=function(){
            IMChat.transparentMaskLayer.show();
            win.css("display","");
        };
        this.hidden=function(){
            win.css("display","none");
            IMChat.transparentMaskLayer.hidden();
        };
        this.close=function(){
            _this.hidden();
            win.remove();
        };
        this.save=function(){
            IMChat.Ajax.request({
                type : "POST",
                url : "user/update",
                data:{
                    USER_ID:IMChat.user.USER_ID,
                    USER_NAME:_nameInput.val(),
                    USER_SEX:_sexSelect.val(),
                    REGION_CODE:_regionInput.data("code"),
                    USER_DES:_desArea.val(),
                    USER_IMG:base64Img
                },
                success:function(result){
                    IMChat.user.USER_NAME=result.DATA.USER_NAME;
                    IMChat.user.USER_SEX=result.DATA.USER_SEX;
                    IMChat.user.REGION_CODE=result.DATA.REGION_CODE;
                    IMChat.user.REGION_NAME=result.DATA.REGION_NAME;
                    IMChat.user.USER_DES=result.DATA.USER_DES;
                    IMChat.user.USER_IMG=result.DATA.USER_IMG;
                    /**刷新头像*/
                    $("#headButton").attr("src","data:image/png;base64,"+IMChat.user.USER_IMG);
                    _this.close();
                    IMChat.MessageBox.alert("用户信息更新成功");
                }
            });
        };
        this.setUserImg=function(userImg){
            base64Img=userImg;
            _userImg.attr("src","data:image/png;base64,"+userImg);
        }
    }
    /**密码修改弹出框*/
    function PasswordChangeWin(){
        var _this=this;
        var width=460;
        var height=300;

        var win=$("<div>");
        win.addClass("dialog");
        win.css({
            "display":"none",
            "width":width,
            "height":height,
            "margin-top":"-"+height/4*3+"px",
            "margin-left":"-"+width/2+"px",
            "background-color":"rgba(235,242,249)"
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
            title.text("密码修改");
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
        
        var centerDiv=$("<div>");
        centerDiv.css({
            "width":width,
            "height":height-80
        });
        /**
         * 添加输入框  
         * */
        this.appendInput=function(labelStr){
            var inputLabel=$("<div>");
            inputLabel.css({
                "width":width-30,
                "height":30,
                "line-height":"30px",
                "margin":"0px 15px"
            });
            inputLabel.text(labelStr);
            centerDiv.append(inputLabel);
            
            var inputInput=$("<div>");
            inputInput.css({
                "width":width-30,
                "margin":"0px 15px"
            });
            var input=$("<input>");
            input.css({
                "border": "1px #aaa solid",
                "border-radius": "4px",
                "width":width-30-40,
                "font-size": "18px",
                "height":40,
                "line-height": "40px",
                "padding": "0 20px"
            });
            input.attr("autocomplete","off").attr("type","password");
            input.attr("maxlength","16").attr("placeholder",labelStr);
            inputInput.append(input);
            centerDiv.append(inputInput);
            return input;
        };
        
        this.initCenterPanel=function(){
            _this._oldPwdInput=_this.appendInput("请输入旧密码");
            _this._oldPwdInput.blur(function(){
                if(_this.checkOldPwd()){
                    _this._oldPwdInput.css({
                        "color": "",
                        "border-color": ""
                    });
                    
                }else{
                    _this._oldPwdInput.css({
                        "color": "#ff5b5b",
                        "border-color": "#ff5b5b"
                    });
                }
            });
            _this._pwdInput=_this.appendInput("请输入新密码");
            _this._pwdInput.blur(function(){
                if(_this.checkPwd()){
                    _this._pwdInput.css({
                        "color": "",
                        "border-color": ""
                    });
                }else{
                    _this._pwdInput.css({
                        "color": "#ff5b5b",
                        "border-color": "#ff5b5b"
                    });
                }
            });
            _this._confirmPwdInput=_this.appendInput("再次输入新密码");
            _this._confirmPwdInput.blur(function(){
                if(_this.checkConfirmPwd()){
                    _this._confirmPwdInput.css({
                        "color": "",
                        "border-color": ""
                    });
                }else{
                    _this._confirmPwdInput.css({
                        "color": "#ff5b5b",
                        "border-color": "#ff5b5b"
                    });
                }
            });
        };
        this.checkOldPwd=function(){
            var value=_this._oldPwdInput.val();
            return value.length!==0;
        };
        this.checkPwd=function(){
            var value=_this._pwdInput.val();
            if(value.length===0){
                IMChat.MessageBox.alert("新密码不能为空");
                return false;
            }
            if(value.length<8){
                IMChat.MessageBox.alert("长度为8-16个字符");
                return false;
            }
            if(/\s/.test(value)){
                IMChat.MessageBox.alert("不能包括空格");
                return false;
            }
            var count = 0;
            /**是否包含字母*/
            if(/[A-Za-z]/.test(value)){
                count++;
            }
            /**是否包含数字*/
            if(/[0-9]+/.test(value)){
                count++;
            }
            /**是否包含特殊字符*/
            if(/[,.<>{}~!@#$%^&*]/.test(value)){
                count++;
            }
            if(count<2){
                IMChat.MessageBox.alert("必须包含字母、数字、符号中至少2种");
                return false;
            }
            var oldPwd=_this._oldPwdInput.val();
            if(oldPwd===value){
                IMChat.MessageBox.alert("新密码与旧密码一致");
                return false;
            }
            return true;
        };
        this.checkConfirmPwd=function(){
            var pwd=_this._pwdInput.val();
            var confirmPwd=_this._confirmPwdInput.val();
            if(pwd!==confirmPwd){
                IMChat.MessageBox.alert("两次密码不一致");
                return false;
            }
            return true;
        };
        win.append(centerDiv);
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
            colseButton.text("关闭");
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
            saveButton.text("保存");
            saveButton.click(function(){
                _this.save();
            });
            buttonDiv.append(saveButton);

            win.append(buttonDiv);
        };
        this.initButtonPanel();

        $("body").append(win);
        this.show=function(){
            IMChat.transparentMaskLayer.show();
            win.css("display","");
        };
        this.hidden=function(){
            win.css("display","none");
            IMChat.transparentMaskLayer.hidden();
        };
        this.close=function(){
            _this.hidden();
            win.remove();
        };
        this.save=function(){
            if(_this.checkOldPwd()){
                _this._oldPwdInput.css({"color": "","border-color": ""});
            }else{
                _this._oldPwdInput.css({"color": "#ff5b5b","border-color": "#ff5b5b"});
                return;
            }
            if(_this.checkPwd()){
                _this._pwdInput.css({"color": "","border-color": ""});
            }else{
                _this._pwdInput.css({"color": "#ff5b5b","border-color": "#ff5b5b"});
                return;
            }
            if(_this.checkConfirmPwd()){
                _this._confirmPwdInput.css({"color": "","border-color": ""});
            }else{
                _this._confirmPwdInput.css({"color": "#ff5b5b","border-color": "#ff5b5b"});
                return;
            }
            var oldPwd=_this._oldPwdInput.val();
            var pwd=_this._pwdInput.val();
            IMChat.Ajax.request({
                type : "POST",
                url : "user/pwdchage",
                data:{
                    USER_ID:IMChat.user.USER_ID,
                    OLD_PWD:oldPwd,
                    PWD:pwd
                },
                success:function(result){
                    _this.close();
                    IMChat.MessageBox.alert("密码修改成功");
                }
            });
        }
    }
    /**意见反馈*/
    function OpinionWin(){
        var _this=this;
        var width=460;
        var height=300;
        var _textArea=undefined;

        var win=$("<div>");
        win.addClass("dialog");
        win.css({
            "display":"none",
            "width":width,
            "height":height,
            "margin-top":"-"+height/4*3+"px",
            "margin-left":"-"+width/2+"px",
            "background-color":"rgba(235,242,249)"
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
            title.text("意见反馈");
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
                "height":height-80
            });
            var textArea=_textArea=$("<textarea>");
            textArea.css({
                "width":width-50,
                "height":height-100,
                "margin":"5px 15px",
                "padding":"5px 10px",
                "resize":"none",
                "border":"1px solid #e6e6e6"
            });
            centerDiv.append(textArea);
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
            colseButton.text("关闭");
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
            saveButton.text("保存");
            saveButton.click(function(){
                _this.save();
            });
            buttonDiv.append(saveButton);

            win.append(buttonDiv);
        };
        this.initButtonPanel();

        $("body").append(win);

        this.show=function(){
            IMChat.transparentMaskLayer.show();
            win.css("display","");
        };
        this.hidden=function(){
            win.css("display","none");
            IMChat.transparentMaskLayer.hidden();
        };
        this.close=function(){
            _this.hidden();
            win.remove();
        };
        this.save=function(){
            var c=_textArea.val();
            if(c===undefined||c===""){
                return;
            }
            IMChat.Ajax.request({
                type : "POST",
                url : "opinion/opinion",
                data:{
                    OPINION_CONTENT:_textArea.val()
                },
                success:function(result){
                    _this.close();
                    IMChat.MessageBox.alert("意见反馈成功");
                }
            });
        };
    }
    /**关于IMChat*/
    function AboutIMChat(){
        var _this=this;
        var width=460;
        var height=300;

        var win=$("<div>");
        win.addClass("dialog");
        win.css({
            "display":"none",
            "width":width,
            "height":height,
            "margin-top":"-"+height/4*3+"px",
            "margin-left":"-"+width/2+"px",
            "background-color":"rgba(235,242,249)"
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
            title.text("关于IMChat");
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
                "height":height-120
            });
            var div=$("<div>");
            div.css({
                "width":width,
                "height":40,
                "line-height":"40px",
                "text-align": "center",
                "margin-top": "40px"
            });
            var versionLabel=$("<span>");
            versionLabel.css({
                "color":"#696969",
                "margin-right": "20px"
            });
            versionLabel.text("版本信息");
            div.append(versionLabel);
            var version=$("<span>");
            version.text("IMChat 1.0.0");
            div.append(version);

            centerDiv.append(div);
            win.append(centerDiv);
        };
        this.initCenterPanel();
        
        $("body").append(win);

        this.show=function(){
            IMChat.transparentMaskLayer.show();
            win.css("display","");
        };
        this.hidden=function(){
            win.css("display","none");
            IMChat.transparentMaskLayer.hidden();
        };
        this.close=function(){
            _this.hidden();
            win.remove();
        };
    }
    /**修改群名称*/
    function GroupChatModifyNameWin(option){
        var _this=this;
        var width=460;
        var height=300;
        var _textArea=undefined;
        var groupId=option.groupId;
        var groupName=option.groupName;
        var sourceType=option.sourceType;
        var source=option.source;

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
            title.text("修改群名称");
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
                "height":height-80
            });
            var textArea=_textArea=$("<textarea>");
            textArea.css({
                "width":width-50,
                "height":height-100,
                "margin":"5px 15px",
                "padding":"5px 10px",
                "resize":"none",
                "border":"1px solid #e6e6e6"
            });
            textArea.val(groupName);
            centerDiv.append(textArea);
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
            IMChat.transparentMaskLayer.show();
            win.css("display","");
        };
        this.hidden=function(){
            win.css("display","none");
            IMChat.transparentMaskLayer.hidden();
        };
        this.close=function(){
            _this.hidden();
            win.remove();
        };
        this.save=function(){
            var c=_textArea.val();
            if(c===undefined||c===""){
                return;
            }
            var groupName=_textArea.val();
            IMChat.Ajax.request({
                type : "POST",
                url : "groupchat/modifyGroupName",
                data:{
                    GROUP_ID:groupId,
                    GROUP_NAME:groupName
                },
                success:function(result){
                    if(sourceType==="ChatRoom"){
                        source.setRoomName(groupName);
                        var groupChatItem=IMChat.addressListPanel.getGroupChat(groupId);
                        if(groupChatItem){
                            groupChatItem.setGroupName(groupName);
                        }
                    }
                    if(sourceType==="GroupChat"){
                        source.setGroupName(groupName);
                        var chatRoomItem=IMChat.chatRoomListPanel.getChatRoomItem(groupId,2);
                        if(chatRoomItem){
                            chatRoomItem.setRoomName(groupName);
                        }
                    }
                    _this.close();
                    IMChat.MessageBox.alert("群名称修改成功");
                }
            });
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
                "text-align": "center"
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
            IMChat.transparentMaskLayer.show();
            win.css("display","");
        };
        this.hidden=function(){
            win.css("display","none");
            IMChat.transparentMaskLayer.hidden();
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
    IMChat.UserInfoConfigWin=UserInfoConfigWin;
    IMChat.PasswordChangeWin=PasswordChangeWin;
    IMChat.OpinionWin=OpinionWin;
    IMChat.AboutIMChat=AboutIMChat;
    IMChat.GroupChatModifyNameWin=GroupChatModifyNameWin;
    IMChat.MesaageConfirmWin=MesaageConfirmWin;
})();