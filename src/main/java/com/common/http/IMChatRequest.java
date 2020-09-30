package com.common.http;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.common.exception.IMChatException;
import com.common.util.GetRequestJsonUtil;
import com.common.util.StringUtils;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;
import java.io.IOException;

public class IMChatRequest extends HttpServletRequestWrapper{

	private JSONObject json;
	
	public IMChatRequest(HttpServletRequest request) {
		super(request);
		try {
			String jsonStr = GetRequestJsonUtil.getRequestJsonString(request);
			if(StringUtils.isNotEmpty(jsonStr)) {
				json=JSONObject.parseObject(jsonStr);
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	public String getString (String key) {
		return getJson().getString(key);
	}
	public Integer getInteger (String key) {
		return getJson().getInteger(key);
	}
	public JSONArray getJSONArray(String key){
		return getJson().getJSONArray(key);
	}
	public JSONObject getJson() {
		if(json==null) {
			throw new IMChatException("0001","参数异常");
		}
		return json;
	}
	
	public String toJSONString() {
		if(json==null) {
			return "{}";
		}else {
			return json.toJSONString();
		}
	}
}
