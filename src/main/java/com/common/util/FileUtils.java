package com.common.util;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.net.URLEncoder;

public class FileUtils {
	
	public static void writeFile(String path, String fileName, byte[] content) {
		try {
			File f = new File(path);
			f.setWritable(true, false);
			if (!f.exists()) {
				f.mkdirs();
			}
			FileOutputStream fos=new FileOutputStream(path + fileName);
			fos.write(content);
			fos.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	/**得到文件后缀名*/
	public static String getFileSuffix(String fileName) {
		int point = fileName.lastIndexOf('.');
		int length = fileName.length();
		if (point == -1 || point == length - 1) {
			return "";
		} else {
			return fileName.substring(point + 1, length);
		}
	}
	
	public static void downloadFile(String fileId, String path, String fileName,HttpServletRequest request,HttpServletResponse response) {
		response.setHeader("content-type", "application/octet-stream");
		response.setContentType("application/octet-stream");
		response.setHeader("Content-Disposition", "attachment;filename=\"" + fileName+"\"");
		String agent = request.getHeader("User-Agent");
		try {
			if(agent.contains("Edge")){//Edge   已测试
				fileName = URLEncoder.encode(fileName,"UTF-8").replaceAll("\\+","%20");
			}else if(agent.contains("Chrome")){//google  已测试
				fileName = new String(fileName.getBytes(), "iso8859-1");
			}else if(agent.contains("Firefox")){//Firefox  待测试
				fileName=URLEncoder.encode(fileName,"UTF-8").replaceAll("\\+","%20");
			}else if(agent.contains("MSIE") || agent.contains("Trident")){//IE11      已测试
				//在IE8以后，微软使用了Trident来作为IE浏览器的标志，兼容老的版本
				fileName = URLEncoder.encode(fileName,"UTF-8").replaceAll("\\+","%20");//处理空格转为加号的问题  
			}else{
				fileName = URLEncoder.encode(fileName,"UTF-8").replaceAll("\\+","%20");//待测试
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		response.setHeader("Content-Disposition", "attachment;filename=\""+ fileName +"\"");
		
		byte[] buff = new byte[1024];
		BufferedInputStream bis = null;
		OutputStream os = null;		
		try {
			os = response.getOutputStream();
			bis = new BufferedInputStream(new FileInputStream(new File(path + fileId)));
			int i = bis.read(buff);
			while (i != -1) {
				os.write(buff, 0, buff.length);
				os.flush();
				i = bis.read(buff);
			}
		} catch (FileNotFoundException e1) {
			//return "系统找不到指定的文件";
		}catch (IOException e) {
			e.printStackTrace();
		} finally {
			if (bis != null) {
				try {
					bis.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
		//return "success";
	}
	
	
	public static byte[] readFile(String path,String fileName){
		File f = new File(path+fileName);
        if (!f.exists()) {
            return null;
        }
        ByteArrayOutputStream bos = new ByteArrayOutputStream((int) f.length());
        BufferedInputStream in = null;
        try {
            in = new BufferedInputStream(new FileInputStream(f));
            int buf_size = 1024;
            byte[] buffer = new byte[buf_size];
            int len = 0;
            while (-1 != (len = in.read(buffer, 0, buf_size))) {
                bos.write(buffer, 0, len);
            }
            return bos.toByteArray();
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            try {
                in.close();
                bos.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return null;
	}

	public static byte[] readFile(File file){
		ByteArrayOutputStream bos = new ByteArrayOutputStream();
		BufferedInputStream in = null;
		try {
			in = new BufferedInputStream(new FileInputStream(file));
			int buf_size = 1024;
			byte[] buffer = new byte[buf_size];
			int len = 0;
			while (-1 != (len = in.read(buffer, 0, buf_size))) {
				bos.write(buffer, 0, len);
			}
			return bos.toByteArray();
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			try {
				in.close();
				bos.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return null;
	}

}
