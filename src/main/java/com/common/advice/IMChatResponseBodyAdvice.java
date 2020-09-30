package com.common.advice;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.MethodParameter;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;

import com.alibaba.fastjson.JSONObject;
import com.common.Result;

@ControllerAdvice
public class IMChatResponseBodyAdvice implements ResponseBodyAdvice<Object> {
	private static Logger log = LoggerFactory.getLogger(IMChatResponseBodyAdvice.class);
	@Override
	public boolean supports(MethodParameter returnType, Class<? extends HttpMessageConverter<?>> converterType) {
		return true;
	}
	@Override
	public Object beforeBodyWrite(Object body, MethodParameter returnType, MediaType selectedContentType,
			Class<? extends HttpMessageConverter<?>> selectedConverterType, ServerHttpRequest request,ServerHttpResponse response) {
		if(body instanceof Result) {
			Object result = JSONObject.toJSON(((Result<?>)body).encode());
			log.debug("请求:{},返回结果:{}",request.getURI().toString(),result);
			return result;
		}
		return body;
	}
}
