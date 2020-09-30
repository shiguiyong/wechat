package com.common;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.common.exception.IMChatException;

public class Result<T extends Model>{
	
	private boolean success;
	private String returnCode;
	private String returnMsg;
	private String detailMsg;
	private T data;
	private List<T> rows;
	
	/**
	 * 成功结果
	 * */
	public Result() {
		this.success=true;
		this.returnCode="0000";
        this.returnMsg = "请求成功";
	}
	
	/**
	 * 返回单个对象使用
	 * */
	public Result(T data) {
		this();
		this.data=data;
		this.rows=null;
	}
	/**
	 * 返回列表
	 * */
	public Result(List<T> rows) {
		this();
		this.data=null;
		this.rows=rows;
	}
	
	/**
	 * 异常使用
	 * */
	public Result(String returnCode ,String returnMsg) {
		this.success=false;
		this.returnCode=returnCode;
        this.returnMsg = returnMsg;
	}
	
	public Result(IMChatException exception) {
		this.success=false;
		this.returnCode=exception.getErrCode();
        this.returnMsg = exception.getErrMsg();
        this.detailMsg=IMChatException.getStackTrace(exception);
	}
	

	public JSONObject encode() {
		JSONObject m=new JSONObject();
		m.put("SUCCESS", success);
		m.put("RETURN_CODE", returnCode);
		m.put("RETURN_MSG", returnMsg);
		if(detailMsg!=null)m.put("DETAIL_MSG", detailMsg);
		
		if(data!=null) {
			m.put("DATA", data.encode());
		}else {
			if(rows!=null) {
				List<Map<String, Object>> list=new ArrayList<Map<String,Object>>(rows.size());
				for(Model e:rows) {
					list.add(e.encode());
				}
				m.put("DATA", list);
				m.put("TOTAL", rows.size());
			}else {
				m.put("DATA", new JSONArray());
				m.put("TOTAL", 0);
			}
		}
		return m;
	}

	public void decode(JSONObject json) {
		
	}

	public boolean isSuccess() {
		return success;
	}

	public void setSuccess(boolean success) {
		this.success = success;
	}

	public String getReturnCode() {
		return returnCode;
	}

	public void setReturnCode(String returnCode) {
		this.returnCode = returnCode;
	}

	public String getReturnMsg() {
		return returnMsg;
	}

	public void setReturnMsg(String returnMsg) {
		this.returnMsg = returnMsg;
	}

	public String getDetailMsg() {
		return detailMsg;
	}

	public void setDetailMsg(String detailMsg) {
		this.detailMsg = detailMsg;
	}

	public T getData() {
		return data;
	}

	public void setData(T data) {
		this.data = data;
	}

	public List<T> getRows() {
		return rows;
	}

	public void setRows(List<T> rows) {
		this.rows = rows;
	}

}
