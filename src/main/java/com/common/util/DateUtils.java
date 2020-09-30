package com.common.util;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

public class DateUtils {

    /**
    * 格式化日期
    */
    public static String parseDateToStr(Date date, String pattern) {
        DateFormat dateFormat=new SimpleDateFormat(pattern);
        return dateFormat.format(date);
    }
    /**
     * 将date时间 向前推N小时 时间
     * */
    public static String getForwardHours(Date date, int hour, String pattern) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.add(Calendar.HOUR, -1);
        return parseDateToStr(calendar.getTime(),pattern);
    }
    
    
}
