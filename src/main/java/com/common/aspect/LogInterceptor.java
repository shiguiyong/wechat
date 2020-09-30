package com.common.aspect;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class LogInterceptor {
    private Logger log = LoggerFactory.getLogger(LogInterceptor.class);
    /** 定义默认切入点*/
    @Pointcut("execution(* com.controller.*.*(..))")
    private void anyMethod() {
    }
    /** 定义手动切点*/
    @Pointcut(value = "@annotation(LogThread)")
    private void pointcut() {
    }
    @Around(value = "anyMethod() || pointcut()")
    public Object around(ProceedingJoinPoint point) throws Throwable {
        Object object = null;
        long start=System.currentTimeMillis();
        try {
            object = point.proceed(); // 执行该方法
        } catch (Exception e) {
            e.printStackTrace();
        }
        long end = System.currentTimeMillis();
        String tragetClassName = point.getSignature().getDeclaringTypeName();
        String methodName = point.getSignature().getName();
        long total = end - start;
        if(total>10)log.info("调用 {}.{} 方法耗时 {}",tragetClassName,methodName,total);
        return object;
    }
    
}
