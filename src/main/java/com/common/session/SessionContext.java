package com.common.session;

import java.util.HashMap;
import java.util.Map;

public class SessionContext {
	
	private static final ThreadLocal<Map<String, String>> tl = new ThreadLocal<Map<String, String>>();
	
    public static void set(String key, String value){
        Map<String, String> m = (Map<String, String>)tl.get();
        if(m == null){
            m = new HashMap<String, String>();
            tl.set(m);
        }
        m.put(key, value);
    }
    
    public static String get(String key){
    	Map<String, String> m = (Map<String, String>)tl.get();
        if(m == null)
            return null;
        else
            return m.get(key);
    }
    
    public static Integer getInt(String key){
    	return Integer.parseInt(get(key));
    }
    
    public static void clean(){
        Map<String, String> m = (Map<String, String>)tl.get();
        if(m != null)m.clear();
        tl.remove();
    }

}
