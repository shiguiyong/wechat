package com.common.filter;

import com.common.exception.IMChatException;
import com.common.http.IMChatRequest;
import com.common.session.SessionContext;
import com.common.util.StringUtils;
import com.common.util.TokenUtils;
import eu.bitwalker.useragentutils.Browser;
import eu.bitwalker.useragentutils.OperatingSystem;
import eu.bitwalker.useragentutils.UserAgent;
import io.jsonwebtoken.Claims;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@WebFilter(asyncSupported = true, filterName = "ChatFilter", urlPatterns = { "*" })
public class IMChatFilter implements Filter{
	private Logger log = LoggerFactory.getLogger(IMChatFilter.class);
	/**后缀*/
	private Set<String> suffixs;
	/**过滤请求*/
	private Set<String> unFilter;
	/**不升级请求*/
	private Set<String> unUpgradeRequest;
	
	public void init(FilterConfig config) throws ServletException {
		suffixs=new HashSet<String>(100);
		suffixs.add("css");
		suffixs.add("js");
		suffixs.add("png");
		suffixs.add("jpg");
		suffixs.add("ico");
		suffixs.add("html");

		unFilter=new HashSet<String>(100);
		unFilter.add("/");
		unFilter.add("/login");
		unFilter.add("/register");
        unFilter.add("/console");
		unFilter.add("/test");
		
		unUpgradeRequest=new HashSet<String>(100);
		unUpgradeRequest.add("/file/upload");
		unUpgradeRequest.add("/file/download");
		unUpgradeRequest.add("/image/upload");
	}

	public void doFilter(ServletRequest req, ServletResponse resp, FilterChain chain) throws IOException, ServletException {
		if(req instanceof HttpServletRequest) {
			HttpServletRequest request=(HttpServletRequest) req;
			HttpServletResponse response=(HttpServletResponse) resp;
			String url = request.getRequestURI();

			String suffix=getSuffix(url);
			if(suffixs.contains(suffix)){
				chain.doFilter(request, response);
				return;
			}
			
			if(unFilter.contains(url)) {
				chain.doFilter(request, response);
				return;
			}
			//注册账号
			if(url.contains("/register/register")) {
				IMChatRequest chatRequest=new IMChatRequest(request);
				chain.doFilter(chatRequest, response);
				return;
			}
			log.debug("过滤url:{}",url);
			String token=this.getToken(request);
			if(StringUtils.isEmpty(token)) {
				this.print(request);
				throw new IMChatException("9998","获取token失败");
			}
			//解析token
			Claims claims=null;
			try {
				claims = TokenUtils.parseToken(token);
			} catch (Exception e) {
				this.print(request);
				throw new IMChatException("9997","token失效");
			}
			SessionContext.set("USER_ID", claims.get("USER_ID", String.class));
			SessionContext.set("USER_NAME", claims.get("USER_NAME", String.class));
			Date date=new Date();
			if(date.compareTo(claims.getExpiration())>0) {
				this.print(request);
				throw new IMChatException("9997","token失效");
			}
			if(unUpgradeRequest.contains(url)) {
				chain.doFilter(request, response);
				return;
			}
			
			IMChatRequest chatRequest=new IMChatRequest(request);
			chain.doFilter(chatRequest, response);
			
		} else {
			chain.doFilter(req, resp);
		}
	}

	public void destroy() {
		
	}
	
	private String getToken(HttpServletRequest request) {
		String token=request.getHeader("TOKEN");
		if(StringUtils.isEmpty(token)) {
			token=request.getParameter("TOKEN");
		}
		return token;
	}

    private String getSuffix(String url){
		int index=0;
		if((index=url.lastIndexOf("."))>0){
			return url.substring(index+1, url.length());
		}else{
			return null;
		}
	}

	private void print(HttpServletRequest request){
		log.info("-------------------------------------------------------------------------------------------------------");
		log.info("获取本地IP:{}",request.getLocalAddr());
		log.info("获取本地名称:{}",request.getLocalName());
		log.info("获取本地端口号:{}",request.getLocalPort());
		log.info("用户的语言环境:{}",request.getLocale());

		log.info("context路径:{}",request.getContextPath());
		log.info("协议:{}",request.getProtocol());
		log.info("远程IP:{}",request.getRemoteAddr());
		log.info("远程端口:{}",request.getRemotePort());
		log.info("远程用户:{}",request.getRemoteUser());

		String agent=request.getHeader("User-Agent");
		//解析agent字符串
		UserAgent userAgent = UserAgent.parseUserAgentString(agent);
		//获取浏览器对象
		Browser browser = userAgent.getBrowser();
		//获取操作系统对象
		OperatingSystem operatingSystem = userAgent.getOperatingSystem();

		log.info("浏览器名:{}", browser.getName());
		log.info("浏览器类型:{}", browser.getBrowserType());
		log.info("浏览器家族:{}", browser.getGroup());
		log.info("浏览器生产厂商:{}", browser.getManufacturer());
		log.info("浏览器使用的渲染引擎:{}", browser.getRenderingEngine());
		log.info("浏览器版本:{}", userAgent.getBrowserVersion());

		log.info("操作系统名:{}", operatingSystem.getName());
		log.info("访问设备类型:{}", operatingSystem.getDeviceType());
		log.info("操作系统家族:{}", operatingSystem.getGroup());
		log.info("操作系统生产厂商:{}", operatingSystem.getManufacturer());
	}

}
