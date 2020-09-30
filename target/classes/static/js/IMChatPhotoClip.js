var IMChat = window.IMChat = IMChat || {};
(function(){
    /**图片裁剪*/
    IMChat.PhotoClip=function PhotoClip(option){
        var _this=this;
        this._win=option.win;
        var width=760;
        var height=500;
        var photoClip=undefined;
        
        var clipPanel=$("<div>");
        clipPanel.addClass("dialog");
        clipPanel.css({
            "width": width,
            "height": height,
            "margin-left": "-"+(width/2)+"px",
            "margin-top": "-"+(height/2)+"px",
            "border": "1px solid #CFCFCF",
            "z-index": 1000
        });
        
        this.initTitlePanel=function(){
            var titlePanel=$("<div>");
            titlePanel.css({
                "width": width,
                "height": 30,
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
            title.text("图片裁剪");
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
            clipPanel.append(titlePanel);
        };
        this.initCenterPanel=function(){
            var centerPanel=$("<div>");
            centerPanel.css({
                "width": width,
                "height": height-30-40,
                "user-select": "none"
            });
            centerPanel.attr("id","photoClipArea");
            
            clipPanel.append(centerPanel);
        };
        this.initButtonPanel=function(){
            var buttonPanel=$("<div>");
            buttonPanel.css({
                "width": width,
                "height": 40,
                "line-height": "40px",
                "user-select": "none"
            });
            buttonPanel.attr("id","clipArea");

            var fileButton=$("<a>");
            fileButton.addClass("photoclip-file");
            fileButton.css({
                "margin-left": "10px",
                "margin-top": "5px"
            });
            fileButton.append("选择文件");
            fileButton.append("<input type=\"file\" name=\"\" id=\"photoClipFileId\">");
            buttonPanel.append(fileButton);
            
            var confirmButton=$("<button>");
            confirmButton.css({
                "margin-right": "10px",
                "margin-top": "5px",
                "float": "right"
            });
            confirmButton.attr("id","photoClipConfirm");
            confirmButton.text("确认");
            buttonPanel.append(confirmButton);
            clipPanel.append(buttonPanel);
        };
        this.initTitlePanel();
        this.initCenterPanel();
        this.initButtonPanel();
        $("body").append(clipPanel);
        
        this.initAfter=function(){
            photoClip=new bjj.PhotoClip("#photoClipArea", {
                size: [300, 300], // 截取框的宽和高组成的数组。默认值为[260,260]
                outputSize: [300, 300], // 输出图像的宽和高组成的数组。默认值为[0,0]，表示输出图像原始大小
                //outputType: "jpg", // 指定输出图片的类型，可选 "jpg" 和 "png" 两种种类型，默认为 "jpg"
                file: "#photoClipFileId", // 上传图片的<input type="file">控件的选择器或者DOM对象
                ok: "#photoClipConfirm", // 确认截图按钮的选择器或者DOM对象
                loadStart: function(file) {}, // 开始加载的回调函数。this指向 fileReader 对象，并将正在加载的 file 对象作为参数传入
                loadComplete: function(src) {}, // 加载完成的回调函数。this指向图片对象，并将图片地址作为参数传入
                loadError: function(event) {}, // 加载失败的回调函数。this指向 fileReader 对象，并将错误事件的 event 对象作为参数传入
                clipFinish: function(dataURL) {
                    _this._win.setUserImg(dataURL.split(",")[1]);
                    _this.close();
                } // 裁剪完成的回调函数。this指向图片对象，会将裁剪出的图像数据DataURL作为参数传入
            });
        };
        this.initAfter();
        
        this.hidden=function(){
            clipPanel.css("display","none");
        };
        this.close=function(){
            clipPanel.css("display","none");
            if (photoClip){
                photoClip.destroy();
            }
            clipPanel.remove();
        };
    };
})();