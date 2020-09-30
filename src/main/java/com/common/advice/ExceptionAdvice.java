package com.common.advice;

import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

import com.common.Result;
import com.common.exception.IMChatException;

@ControllerAdvice
public class ExceptionAdvice {
	@ResponseBody
    @ExceptionHandler(value = Exception.class)
    public Object errorHandler(Exception ex) {
    	ex.printStackTrace();
    	IMChatException myException = null;
    	if(ex instanceof IMChatException) {
    		myException = (IMChatException) ex;
    	}else {
    		myException = new IMChatException(ex);
    	}
        return new Result(myException).encode().toJSONString();
    }
}
