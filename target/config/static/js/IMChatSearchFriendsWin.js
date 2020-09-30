/**
 * 检索好友弹出框
 * */
var IMChat = window.IMChat = IMChat || {};
(function(){
    var WIDTH=900;
    var HEIGHT=650;
    function SearchFriendsWin(){
        var _this=this;
        var condition={};
        var win=$("<div>");
        win.addClass("dialog");
        win.css({
            "display":"none",
            "width":WIDTH,
            "height":HEIGHT,
            "margin-top":"-"+HEIGHT/2+"px",
            "margin-left":"-"+WIDTH/2+"px",
            "background-color":"rgba(235,242,249)"
        });
        /**标题面板*/
        var titlePanel=$("<div>");

        this.titlePanelInit=function(){
            titlePanel.css({
                "width":WIDTH,
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
            title.text("查找");
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
        
        var conditionPanel=$("<div>");
        var input=$("<input>");
        var regionSelectWin=undefined;
        var select=$("<select>");
        var regionInput=$("<input>");/**区域input*/
        var qry=false;
        var searchButton=$("<button>");
        this.conditionPanelInit=function(){
            conditionPanel.css({
                "width":WIDTH,
                "height":100,
                "border-bottom":"1px solid #CFCFCF",
                "color":"#4F4F4F"
            });
            var leftDiv=$("<div>");/**左侧检索框 和 地区条件 性别条件*/
            leftDiv.css({
                "width":WIDTH/10*7,
                "height":100,
                "float":"left"
            });
            var inputDiv=$("<div>");/**输入框所在div*/
            inputDiv.css({
                "width":WIDTH/10*7,
                "height":60
            });
            
            input.css({
                "width":WIDTH/10*7-80,
                "height":40,
                "margin":"8px 30px",
                "outline-style": "none",
                "border": "1px solid #CFCFCF",
                "border-radius": "3px",
                "font-size": "18px",
                "padding": "2px 10px"
            });
            input.attr("type","type").attr("placeholder","请输入IMChat号码/昵称/关键字");
            inputDiv.append(input);
            leftDiv.append(inputDiv);

            var selectDiv=$("<div>");/**所在地的div  性别选择*/
            selectDiv.css({
                "width":WIDTH/10*7,
                "height":40
            });
            /**区域input*/
            regionInput.css({
                "width":300,
                "height":25,
                "margin":"0px 30px",
                "outline-style": "none",
                "border": "1px solid #CFCFCF",
                "border-radius": "3px",
                "font-size": "14px",
                "padding": "2px 10px"
            });
            regionInput.attr("readonly","readonly");
            regionInput.val("所在地:不限");
            selectDiv.append(regionInput);
            regionSelectWin=new RegionSelectWin(regionInput);
            /**性别选择*/
            var sexSelect=$("<div>");
            sexSelect.addClass("select");
            
            select.append('<option value="0" disabled selected style="display: none;">性别</option>');
            select.append('<option value="0">不限</option>');
            select.append('<option value="1">男</option>');
            select.append('<option value="2">女</option>');
            sexSelect.append(select);
            
            selectDiv.append(sexSelect);
            leftDiv.append(selectDiv);
            conditionPanel.append(leftDiv);
            
            var rightDiv =$("<div>");
            rightDiv.css({
                "width":WIDTH/10*3,
                "height":100,
                "float":"left"
            });
            
            searchButton.css({
                "width":WIDTH/10*1.5,
                "height":46,
                "margin":"27px 50px"
            });
            searchButton.text("查询");

            rightDiv.append(searchButton);
            conditionPanel.append(rightDiv);
            
            win.append(conditionPanel);
        };
        this.conditionPanelInit();
        /**检索条件*/
        var searchConditionPanel=$("<div>");
        this.searchConditionPanelInit=function(){
            searchConditionPanel.css({
                "width":WIDTH-40,
                "height":40,
                "border-bottom":"1px solid #CFCFCF",
                "color":"#4F4F4F",
                "line-height":"40px",
                "padding":"0px 20px",
                "font-size":"14px",
                "background-color":"#00CED1"
            });
            searchConditionPanel.text("搜索 :");
            win.append(searchConditionPanel);
        };
        this.searchConditionPanelInit();
        /**结果集列表*/
        var resultPanel=$("<div>");
        this.resultPanelInit=function(){
            resultPanel.css({
                "width":WIDTH-20,
                "height":HEIGHT-30-100-40-2-20,
                "padding":"10px 10px"
            });
            win.append(resultPanel);

            resultPanel.niceScroll({
                cursorcolor: "#B5B5B5",
                cursoropacitymax: 1,
                touchbehavior: false,
                cursorwidth: "5px",
                cursorborder: "0",
                cursorborderradius: "5px",
                autohidemode: "false",
                zindex: "101"
            });
            resultPanel.getNiceScroll(0).scrollend(function(e){
                if((resultPanel[0].scrollTopMax-e.end.y)===0){
                    console.log("到底了");
                }
            });
        };
        this.resultPanelInit();
        
        win.click(function(){
            regionSelectWin.hidden();
        });
        
        $("body").append(win);
        this.show=function(){
            IMChat.transparentMaskLayer.show();
            win.css("display","");
        };
        this.hidden=function(){
            win.css("display","none");
            regionSelectWin.hidden();
            resultPanel.getNiceScroll().hide();
            IMChat.transparentMaskLayer.hidden();
        };
        this.close=function(){
            _this.hidden();
            win.remove();
            regionSelectWin.close();
            resultPanel.getNiceScroll().remove();
        };
        this.search=function(){
            var str="搜索 : ";
            if(select.val()==="1"){
                str+="| 男 ";
            }else if(select.val()==="2"){
                str+="| 女 ";
            }
            str+="| "+regionInput.val();
            searchConditionPanel.text(str);
            
            IMChat.Ajax.request({
                type:"POST",
                url:"friend/search",
                data:condition,
                success:function(result){
                    qry=false;
                    for(var i=0;i<result.DATA.length;i++){
                        new UserPanel(resultPanel,result.DATA[i]);
                        resultPanel.getNiceScroll().resize();
                        resultPanel.getNiceScroll(0).doScrollTop(0);
                    }
                }
            });
        };
        this.clear=function(){
            resultPanel.empty();
        };
        this.bind=function(){
            searchButton.unbind();
            searchButton.click(function(){
                if(qry){
                    return;
                }
                qry=true;
                condition.USER_SEX=select.val();
                if(regionInput.data("code")==="-1"){
                    delete condition.REGION_CODE;
                    delete condition.REGION_TYPE;
                }else{
                    condition.REGION_CODE=regionInput.data("code");
                    condition.REGION_TYPE=regionInput.data("level");
                }
                condition.SEARCH_TEXT=input.val();
                condition.PAGE_NO=1;
                condition.PAGE_SIZE=28;
                _this.clear();
                _this.search();
            });
        };
        this.bind();
    }
    function RegionSelectWin(input){
        var _this=this;
        this.input=input;
        var div=$("<div>");
        var width=input.innerWidth();
        div.css({
            "position": "absolute",
            "width":width,
            "height":110,
            "display":"none",
            "z-index":9999,
            "border": "1px solid #CFCFCF",
            "background-color": "#ffffff",
            "left":0,
            "top":0
        });
        /**国家*/
        var countrySelect=$("<select>");
        countrySelect.css({
            "width":width/2-20,
            "height":40,
            "border": "1px solid #ccc",
            "margin":"10px 10px 5px 10px",
            "float": "left"
        });

        div.append(countrySelect);

        /**省份*/
        var provinceSelect=$("<select>");
        provinceSelect.css({
            "width":width/2-20,
            "height":40,
            "border": "1px solid #ccc",
            "margin":"10px 10px 5px 10px",
            "float": "left"
        });
        provinceSelect.attr("disabled","disabled");
        provinceSelect.append('<option value="-1">不限</option>');
        div.append(provinceSelect);
        
        /**城市*/
        var citySelect=$("<select>");
        citySelect.css({
            "width":width/2-20,
            "height":40,
            "border": "1px solid #ccc",
            "margin":"10px 10px 5px 10px",
            "float": "left"
        });
        citySelect.attr("disabled","disabled");
        citySelect.append('<option value="-1">不限</option>');
        div.append(citySelect);
        
        /**县市 county*/
        var countySelect=$("<select>");
        countySelect.css({
            "width":width/2-20,
            "height":40,
            "border": "1px solid #ccc",
            "margin":"10px 10px 5px 10px",
            "float": "left"
        });
        countySelect.attr("disabled","disabled");
        countySelect.append('<option value="-1">不限</option>');
        div.append(countySelect);

        div.click(function(e){
            e.stopPropagation();
        });
        div.find("select").click(function(e){
            e.stopPropagation();
        });
        $("body").append(div);

        input.click(function(e){
            var offset=$(this).offset();
            var el=$(this);
            div.css({
                "display":"",
                "left":offset.left,
                "top":offset.top+el.outerHeight()+2
            });
            e.stopPropagation();
        });
        this.hidden=function () {
            div.css("display","none");
        };
        this.close=function(){
            div.remove();
        };
        IMChat.Ajax.request({
            type : "POST",
            url : "region/region",
            data:{},
            success:function(result){
                var option=$("<option>");
                option.attr("value","-1");
                option.text("不限");
                countrySelect.append(option);
                
                var list=result.DATA;
                for(var i=0;i<list.length;i++){
                    var ch=$("<option>");
                    ch.attr("value",list[i].REGION_CODE);
                    ch.text(list[i].REGION_NAME);
                    ch.data("PROVINCE_LIST",list[i].PROVINCE_LIST);
                    countrySelect.append(ch);
                }
            }
        });

        countrySelect.change(function(){
            var value=$(this).val();
            if (value=="-1"){
                provinceSelect.attr("disabled","disabled");
                citySelect.attr("disabled","disabled");
                countySelect.attr("disabled","disabled");
                
                provinceSelect.empty();
                
                var defaultOption=$("<option>");
                defaultOption.attr("value","-1");
                defaultOption.text("不限");

                provinceSelect.empty();
                provinceSelect.append(defaultOption);
                citySelect.empty();
                citySelect.append(defaultOption.clone());
                countySelect.empty();
                countySelect.append(defaultOption.clone());
            } else {
                var provinceList=$(this).find("option:selected").data("PROVINCE_LIST");
                if(provinceList&&provinceList.length>0){
                    provinceSelect.removeAttr("disabled");
                    provinceSelect.empty();

                    var defaultOption=$("<option>");
                    defaultOption.attr("value","-1");
                    defaultOption.text("不限");
                    provinceSelect.append(defaultOption);
                    
                    for(var i=0;i<provinceList.length;i++){
                        var option=$("<option>");
                        option.attr("value",provinceList[i].REGION_CODE);
                        option.text(provinceList[i].REGION_NAME);
                        option.data("CITY_LIST",provinceList[i].CITY_LIST);
                        provinceSelect.append(option);
                    }
                }
                citySelect.attr("disabled","disabled");
                countySelect.attr("disabled","disabled");
            }
            _this.setValue();
        });
        provinceSelect.change(function () {
            var value=$(this).val();
            if (value=="-1"){
                citySelect.attr("disabled","disabled");
                countySelect.attr("disabled","disabled");
                citySelect.empty();

                var defaultOption=$("<option>");
                defaultOption.attr("value","-1");
                defaultOption.text("不限");
                citySelect.append(defaultOption);

                citySelect.empty();
                citySelect.append(defaultOption.clone());
                countySelect.empty();
                countySelect.append(defaultOption.clone());
            } else {
                var cityList=$(this).find("option:selected").data("CITY_LIST");
                if(cityList&&cityList.length>0){
                    citySelect.removeAttr("disabled");
                    citySelect.empty();

                    var defaultOption=$("<option>");
                    defaultOption.attr("value","-1");
                    defaultOption.text("不限");
                    citySelect.append(defaultOption);

                    for(var i=0;i<cityList.length;i++){
                        var option=$("<option>");
                        option.attr("value",cityList[i].REGION_CODE);
                        option.text(cityList[i].REGION_NAME);
                        option.data("AREA_LIST",cityList[i].AREA_LIST);
                        citySelect.append(option);
                    }

                    countySelect.empty();
                    countySelect.append(defaultOption.clone());
                }
                countySelect.attr("disabled","disabled");
            }
            _this.setValue();
        });
        citySelect.change(function(){
            var value=$(this).val();
            if (value=="-1"){
                countySelect.attr("disabled","disabled");
                countySelect.empty();

                var defaultOption=$("<option>");
                defaultOption.attr("value","-1");
                defaultOption.text("不限");
                countySelect.append(defaultOption);
            } else {
                var areaList=$(this).find("option:selected").data("AREA_LIST");
                if(areaList&&areaList.length>0){
                    countySelect.removeAttr("disabled");
                    countySelect.empty();

                    var defaultOption=$("<option>");
                    defaultOption.attr("value","-1");
                    defaultOption.text("不限");
                    countySelect.append(defaultOption);

                    for(var i=0;i<areaList.length;i++){
                        var option=$("<option>");
                        option.attr("value",areaList[i].REGION_CODE);
                        option.text(areaList[i].REGION_NAME);
                        countySelect.append(option);
                    }
                }
            }
            _this.setValue();
        });
        countySelect.change(function(){
            _this.setValue();
        });
        this.setValue=function(){
            var str="所在地:";
            str+=countrySelect.find("option:selected").text()+" ";
            this.input.data("code",countrySelect.find("option:selected").attr("value"));
            this.input.data("level",1);
            /**省份*/
            var provinceCode=provinceSelect.find("option:selected").attr("value");
            if(provinceCode!=="-1"){
                str+=provinceSelect.find("option:selected").text()+" ";
                this.input.data("code",provinceCode);
                this.input.data("level",2);
            }
            /**城市*/
            var cityCode=citySelect.find("option:selected").attr("value");
            if(cityCode!=="-1"){
                str+=citySelect.find("option:selected").text()+" ";
                this.input.data("code",cityCode);
                this.input.data("level",3);
            }
            /**县城*/
            var countyCode=countySelect.find("option:selected").attr("value");
            if(countyCode!=="-1"){
                str+=countySelect.find("option:selected").text()+" ";
                this.input.data("code",countyCode);
                this.input.data("level",4);
            }
            this.input.val(str);
        };
    }
    /**用户面板*/
    function UserPanel(panel,userInfo){
        var user = $("<div>");
        user.css({
            "width":200,
            "height":80,
            "float":"left",
            "margin":"5px 10px"
        });
        var leftDiv = $("<div>");
        leftDiv.css({
            "width":80,
            "height":80,
            "line-height":"80px",
            "float":"left",
            "text-align":"center"
        });
        var img=$("<img src='' alt=''>");
        img.css({
            "width":60,
            "height":60,
            "margin-top": "10px",
            "border-radius": "10px"
        });
        img.attr("src","user/img/"+userInfo.USER_ID+"?TOKEN="+IMChat.user.TOKEN);
        leftDiv.append(img);
        user.append(leftDiv);
        
        var rightDiv=$("<div>");
        rightDiv.css({
            "width":120,
            "height":80,
            "float":"left"
        });
        
        var nameDiv=$("<div>");
        nameDiv.css({
            "width":120,
            "height":20,
            "margin-top": "10px",
            "font-size":"14px",
            "overflow": "hidden",
            "white-space": "nowrap",
            "text-overflow": "ellipsis"
        });
        nameDiv.text(userInfo.USER_NAME);
        rightDiv.append(nameDiv);

        var desDiv=$("<div>");
        desDiv.css({
            "width":120,
            "height":20,
            "font-size":"14px",
            "overflow": "hidden",
            "white-space": "nowrap",
            "text-overflow": "ellipsis"
        });
        desDiv.text(userInfo.REGION_NAME);
        rightDiv.append(desDiv);

        var buttonDiv=$("<div>");
        buttonDiv.css({
            "width":120,
            "height":20
        });
        var button = $("<button>");
        button.css({
            "padding": "2px 10px",
            "font-size":"12px"
        });
        button.text(" + 好友");
        button.bind("click",{
            userInfo:userInfo
        },function(e){
            var win=new FriendAddWin(e.data.userInfo);
            win.show();
        });
        buttonDiv.append(button);
        rightDiv.append(buttonDiv);
        
        user.append(rightDiv);
        panel.append(user);
    }
    /**好友添加界面*/
    function FriendAddWin(userInfo){
        var _this=this;
        _this.userInfo=userInfo;
        var width=450;
        var height=400;
        var isFriend=IMChat.addressListPanel.isFriend(userInfo.USER_ID);
        /**透明遮罩*/
        var mask=$("<div></div>");
        mask.addClass("maskLayer");
        mask.css({
            "display" : "none",
            "z-index": 199
        });
        /**弹出框*/
        var win=$("<div>");
        win.addClass("dialog");
        win.css({
            "display":"none",
            "width":width,
            "height":height,
            "margin-top":"-"+height/2+"px",
            "margin-left":"-"+width/2+"px",
            "background-color":"rgba(235,242,249)",
            "z-index": 200
        });
        /**标题*/
        var titlePanel=$("<div>");

        this.titlePanelInit=function(){
            titlePanel.css({
                "width":width,
                "height":30,
                "line-height":"30px",
                "background-color":"rgba(162,205,220)"
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
            title.text(IMChat.user.USER_NAME+" - 添加好友");
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
        
        var centerPanel=$("<div>");
        var textarea=$("<textarea>");
        
        this.centerPanelInit=function(){
            centerPanel.css({
                "width":width,
                "height":height-60
            });
            var userPanel=$("<div>");
            userPanel.css({
                "width":200,
                "height":height-60,
                "float":"left"
            });
            //头像
            var img=$("<img src='' alt=''>");
            img.css({
                "width":100,
                "height":100,
                "margin":"20px 50px 10px 50px",
                "border-radius": "10px"
            });
            img.attr("src","user/img/"+userInfo.USER_ID+"?TOKEN="+IMChat.user.TOKEN);
            userPanel.append(img);
            /**昵称*/
            var nameDiv=$("<div>");
            nameDiv.css({
                "width":100,
                "height":30,
                "line-height":"30px",
                "margin":"2px 50px 2px 50px"
            });
            nameDiv.text(userInfo.USER_NAME);
            userPanel.append(nameDiv);
            /**账号*/
            var idDiv=$("<div>");
            idDiv.css({
                "width":100,
                "height":30,
                "line-height":"30px",
                "margin":"2px 50px 2px 50px"
            });
            idDiv.text(userInfo.USER_ID);
            userPanel.append(idDiv);
            /**性别*/
            var sexDiv=$("<div>");
            sexDiv.css({
                "width":100,
                "height":20,
                "line-height":"20px",
                "font-size":"12px",
                "margin":"0px 50px 0px 50px",
                "color":"#9C9C9C"
            });
            sexDiv.text("性别:"+userInfo.USER_SEX);
            userPanel.append(sexDiv);
            /**所在地*/
            var regionDiv=$("<div>");
            regionDiv.css({
                "width":100,
                "height":20,
                "line-height":"20px",
                "font-size":"12px",
                "margin":"0px 50px 0px 50px",
                "color":"#9C9C9C"
            });
            regionDiv.text("所在地:"+(userInfo.REGION_NAME===undefined?"":userInfo.REGION_NAME));
            userPanel.append(regionDiv);
            
            centerPanel.append(userPanel);
            
            var applyPanel=$("<div>");
            applyPanel.css({
                "width":width-200,
                "height":height-60,
                "float":"left"
            });
            var spanDiv=$("<div>");
            spanDiv.css({
                "width":width-200,
                "height":30,
                "line-height":"30px",
                "margin":"20px 0px 5px 0px"
            });
            spanDiv.text("请输入验证信息:");
            applyPanel.append(spanDiv);
            
            
            textarea.css({
                "width":width-220-10,
                "height":80,
                "line-height":"30px",
                "margin":"5px 20px 5px 0px",
                "padding":"2px",
                "resize": "none"
            });
            textarea.attr("placeholder","我是...");
            applyPanel.append(textarea);

            if(isFriend){
                var labelDiv=$("<div>");
                labelDiv.css({
                    "width":width-200,
                    "height":30,
                    "line-height":"30px",
                    "color":"#00EE00"
                });
                labelDiv.text("已经是好友了");
                applyPanel.append(labelDiv);
            }
            centerPanel.append(applyPanel);
            win.append(centerPanel);
        };
        this.centerPanelInit();
        
        this.buttonPanelInit=function(){
            var buttonPanel=$("<div>");
            buttonPanel.css({
                "width":width,
                "height":30
            });

            var closeButton=$("<button>");
            closeButton.css({
                "height":25,
                "float":"right",
                "margin":"0px 10px 0px 10px",
                "padding": "2px 10px"
            });
            closeButton.text("关闭");
            closeButton.click(function(){
                _this.close();
            });
            buttonPanel.append(closeButton);

            var confirmButton=$("<button>");
            confirmButton.css({
                "height":25,
                "float":"right",
                "padding": "2px 10px"
            });
            confirmButton.text("确认");
            confirmButton.click(function(){
                _this.friendAdd();
            });
            if(isFriend){
                confirmButton.css("display","none");
            }
            buttonPanel.append(confirmButton);
            
            win.append(buttonPanel);
        };
        this.buttonPanelInit();
        
        $("body").append(win).append(mask);

        this.show=function(){
            mask.css("display","");
            win.css("display","");
        };
        this.hidden=function(){
            mask.css("display","none");
            win.css("display","none");
        };
        this.close=function(){
            _this.hidden();
            win.remove();
            mask.remove();
        };
        /**发送添加好友请求*/
        this.friendAdd=function(){
            IMChat.Ajax.request({
                type : "POST",
                url : "applyinfo/apply",
                data:{
                    USER_ID:_this.userInfo.USER_ID,
                    APPLY_USER_ID:IMChat.user.USER_ID,
                    APPEND_MESSAGE:textarea.val()
                },
                success:function(result){
                    _this.close();
                    IMChat.MessageBox.alert("发送好友申请成功");
                }
            });
        };
    }
    IMChat.SearchFriendsWin=SearchFriendsWin;
    IMChat.FriendAddWin=FriendAddWin;
    IMChat.RegionSelectWin=RegionSelectWin;
})();