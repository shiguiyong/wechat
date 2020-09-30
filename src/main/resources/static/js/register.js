var side=$("#side");
side.css("background-image","url(data/01-1.jpg)");
var n = 1, count=4;
function showAuto() {
    n = n >= count ? 1 : ++n;
    side.css("background-image","url(data/01-"+n+".jpg)");
}
setInterval("showAuto()", 4000);
/**获取焦点*/
var username=$("#username");
username.focus(function(){
	$("#usernameinput .input-ok").css("display","none");
	$("#usernameinput .error-tips").css("display","none");
	$("#usernameinput #username").removeClass("error");
	$("#usernameinput .error-tips-wrap").addClass("slideup");
});
/**失去焦点*/
username.blur(function(){
	var value=$(this).val();
	if(value.length===0){
		$("#usernameinput .input-ok").css("display","none");
		$("#usernameinput .error-tips").css("display","");
		$("#usernameinput .error-tips-wrap").removeClass("slideup");
		$("#usernameinput #username").addClass("error");
	}else{
		$("#usernameinput .input-ok").css("display","");
		$("#usernameinput .error-tips").css("display","none");
		$("#usernameinput #username").removeClass("error");
	}
});

$("#userpwd").focus(function(){
	$("#userpwdinput .input-ok").css("display","none");
	$("#userpwdinput .password-tips-group").css("display","");
	$("#userpwdinput .password-tips-group").removeClass("slideup");
	$("#userpwdinput .error-tips").css("display","none");
});
$("#userpwd").blur(function(){
	var value=$(this).val();
	$("#userpwdinput .password-tips-group").css("display","none");
	$("#userpwdinput .password-tips-group").addClass("slideup");
	
	if(value.length===0){
		$("#userpwdinput .error-tips").text("密码不能为空");
		$("#userpwdinput .error-tips").css("display","");
	}else{
		if(/\s/.test(value)){
			$("#userpwdinput .error-tips").text("不能包括空格");
			$("#userpwdinput .error-tips").css("display","");
			return;
		}
		if(value.length<8){
			$("#userpwdinput .error-tips").text("长度为8-16个字符");
			$("#userpwdinput .error-tips").css("display","");
			return;
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
			$("#userpwdinput .error-tips").text("必须包含字母、数字、符号中至少2种");
			$("#userpwdinput .error-tips").css("display","");
			return;
		}
		$("#userpwdinput .input-ok").css("display","");
	}
});

$("#userpwd").live('input propertychange', function(){
	var value=$(this).val();
	$("#userpwdinput .password-raw").text(value);
	if(/\s/.test(value)){
		$($("#userpwdinput .password-tips")[0]).removeClass("ok");
	}else{
		$($("#userpwdinput .password-tips")[0]).addClass("ok");
	}
	/**密码长度检测 大于8 */
	if(value.length>=8){
		$($("#userpwdinput .password-tips")[1]).addClass("ok");
	}else{
		$($("#userpwdinput .password-tips")[1]).removeClass("ok");
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
	if(count>=2){
		$($("#userpwdinput .password-tips")[2]).addClass("ok");
	}else{
		$($("#userpwdinput .password-tips")[2]).removeClass("ok");
	}
});
$("#userpwdinput .eye").mousedown(function(){
	$("#userpwd").focus();
	$("#userpwdinput .password-raw").css("display","");
});
$("#userpwdinput .eye").mouseup(function(){
	$("#userpwd").focus();
	$("#userpwdinput .password-raw").css("display","none");
});
$("#filewriter").click(function(){
	window.location.href="register/filewriter?ID="+$.trim($("#imchatNumber").text());
});
$("#get_acc").click(function(){
	$("#get_acc").focus();
	var username=$("#username").val();
	var userpwd=$("#userpwd").val();
	if(username.length===0){
		return;
	}
	if(/\s/.test(userpwd)){
		return;
	}
	if(userpwd.length<8){
		return;
	}
	var count = 0;
	/**是否包含字母*/
	if(/[A-Za-z]/.test(userpwd)){
		count++;
	}
	/**是否包含数字*/
	if(/[0-9]+/.test(userpwd)){
		count++;
	}
	/**是否包含特殊字符*/
	if(/[,.<>{}~!@#$%^&*]/.test(userpwd)){
		count++;
	}
	if(count<2){
		return;
	}
	$.ajax({
		type : "POST",
		url : "register/register",
		data:JSON.stringify({
			USER_NAME:username,
			USER_PWD:userpwd
		}),
		contentType: "application/json",
		dataType: "json",
		success:function(result){
			if(result.SUCCESS){
				$("#registerBox").css("display","none");
				$("#registerBox").empty();
				$("#imchatNumber").text(result.USER_ID);
				$("#mainBox").css("display","");
			}
			console.log(result);
		}
	});
});

$("#loginbtn").click(function(){
	window.location.href = 'http://localhost:8888';
});

