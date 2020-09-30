package com.common;

import java.io.Serializable;

import com.alibaba.fastjson.JSONObject;

public interface Model extends Serializable{
	
	public JSONObject encode();
	
	public void decode(JSONObject json);
}
