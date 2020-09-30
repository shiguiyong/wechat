package com.common.util;

import java.util.Date;
import java.util.Map;
import java.util.UUID;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import com.alibaba.fastjson.util.Base64;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

/**
 *  登录Token的生成和解析 
 * */
public class TokenUtils {
	// Token的唯一身份标识
	private static final String ID = UUID.randomUUID().toString();
	// 加密密文，私钥
	private static final String SECRET = "yunbamboo";
	// 过期时间，单位毫秒
	private static final int EXPIRE_TIME = 60*60*1000; // 一个小时
	// Token签发者
	private static final String ISSUER = "yunbamboo";
	// 由字符串生成加密key
	private static SecretKey generalKey() {
		// 本地的密码解码
		byte[] encodedKey = Base64.decodeFast(SECRET);
		// 根据给定的字节数组使用AES加密算法构造一个密钥
		SecretKey key = new SecretKeySpec(encodedKey, 0, encodedKey.length, "AES");
		return key;
	}
	/** 创建Token*/
	public static String createToken(Map<String, Object> claims){
		SignatureAlgorithm signatureAlgorithm = SignatureAlgorithm.HS256;
		String id = ID;
		// 生成Token的时间
		long nowTime = System.currentTimeMillis();
		Date issuedAt = new Date(nowTime);
		// 生成签名的时候使用的秘钥secret，切记这个秘钥不能外露，是你服务端的私钥，在任何场景都不应该流露出去，一旦客户端得知这个secret，那就意味着客户端是可以自我签发Token的
		SecretKey key = generalKey();
		// 为payload添加各种标准声明和私有声明
		JwtBuilder builder = Jwts.builder()
				.setClaims(claims) // 如果有私有声明，一定要先设置自己创建的这个私有声明，这是给builder的claim赋值，一旦写在标准的声明赋值之后，就是覆盖了那些标准的声明
				.setId(id) // Token的唯一身份标识，根据业务需要，可以设置为一个不重复的值，主要用来作为一次性token，从而回避重放攻击
				.setIssuedAt(issuedAt) // Token的签发时间
				.setIssuer(ISSUER) // Token签发者
				.signWith(signatureAlgorithm, key); // 设置签名，使用的是签名算法和签名使用的秘钥
		// 设置过期时间
		long expTime = EXPIRE_TIME;
		if (expTime >= 0) {
			long exp = nowTime + expTime;
			builder.setExpiration(new Date(exp));
		}
		return builder.compact();
	}
	 
	/** 解密Token*/
	public static Claims parseToken(String token) throws Exception{
		SecretKey key = generalKey(); // 签名秘钥，和生成的签名的秘钥一模一样
		Claims claims = Jwts.parser() // 得到DefaultJwtParser
					.setSigningKey(key) // 设置签名的秘钥
					.parseClaimsJws(token).getBody(); // 设置需要解析的Token
		return claims;
	}
}
