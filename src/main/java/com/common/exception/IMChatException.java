package com.common.exception;

import java.io.PrintWriter;
import java.io.StringWriter;

public class IMChatException extends RuntimeException{
	private static final long serialVersionUID = 1L;
	private StringBuffer backStacks = new StringBuffer();
	private String errCode = "9999";
	private String errMsg = "未知异常";
	  
	public IMChatException(Throwable e){
	    super(e);
	    this.backStacks.append(getStackTrace(e));
	}
	public IMChatException(String errCode, String msg) {
		super("errCode:" + errCode + ",errMsg:" + msg);
		this.errCode = errCode;
		this.errMsg = msg;
	}
	public static final String getStackTrace(Throwable e) {
		StringWriter sw = new StringWriter();
		PrintWriter out = new PrintWriter(sw);
		e.printStackTrace(out);
		return sw.toString();
	}
	public StringBuffer getBackStacks() {
		return backStacks;
	}
	public void setBackStacks(StringBuffer backStacks) {
		this.backStacks = backStacks;
	}
	public String getErrCode() {
		return errCode;
	}
	public void setErrCode(String errCode) {
		this.errCode = errCode;
	}
	public String getErrMsg() {
		return errMsg;
	}
	public void setErrMsg(String errMsg) {
		this.errMsg = errMsg;
	}
	
}
