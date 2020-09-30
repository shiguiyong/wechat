package com.common.util;

import java.util.regex.Pattern;

public class StringUtils {
	/**
     * 判断给定的字符串是否为null或者是空的
     * @param string 给定的字符串
     */
    public static boolean isEmpty(String string) {
        return string == null || "".equals(string.trim());
    }
    /**
     * 判断给定的字符串是否不为null且不为空
     * @param string 给定的字符串
     */
    public static boolean isNotEmpty(String string) {
        return !isEmpty(string);
    }
    public static String valueOf(Object obj) {
        return (obj == null) ? "" : obj.toString();
    }
    public static boolean isNumber(String str){
        Pattern pattern = Pattern.compile("^[-\\+]?[\\d]*$");
        return pattern.matcher(str).matches();
    }
    
}
