package com.model;

import com.alibaba.fastjson.JSONObject;
import com.common.Model;

import java.util.Date;
/**
 * 聊天文件表
 * */
public class ChatFile implements Model{
	private static final long serialVersionUID = 7304274514902000374L;
	/**文件标识(FILE_ID)*/
	private String fileId;
	/**文件名称(FILE_NAME)*/
	private String fileName;
	/**文件后缀(FILE_SUFFIX)*/
	private String fileSuffix;
	/**文件大小(FILE_SIZE)*/
	private long fileSize;
	/**创建时间(CREATE_DATE)*/
	private Date createDate;
	/**图片宽度(IMAGE_WIDTH)*/
	private int imageWidth;
	/**图片高度(IMAGE_HEIGHT)*/
	private int imageHeight;
	@Override
	public JSONObject encode() {
		JSONObject json = new JSONObject();
		json.put("FILE_ID", fileId);
		json.put("FILE_NAME", fileName);
		json.put("FILE_SUFFIX", fileSuffix);
		json.put("FILE_SIZE", fileSize);
		json.put("CREATE_DATE", createDate);
		json.put("IMAGE_WIDTH", imageWidth);
		json.put("IMAGE_HEIGHT", imageHeight);
		return json;
	}
	@Override
	public void decode(JSONObject json) {}
	public String getFileId() {
		return fileId;
	}
	public void setFileId(String fileId) {
		this.fileId = fileId;
	}
	public String getFileName() {
		return fileName;
	}
	public void setFileName(String fileName) {
		this.fileName = fileName;
	}
	public String getFileSuffix() {
		return fileSuffix;
	}
	public void setFileSuffix(String fileSuffix) {
		this.fileSuffix = fileSuffix;
	}
	public long getFileSize() {
		return fileSize;
	}
	public void setFileSize(long fileSize) {
		this.fileSize = fileSize;
	}
	public Date getCreateDate() {
		return createDate;
	}
	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}
	public int getImageWidth() {
		return imageWidth;
	}
	public void setImageWidth(int imageWidth) {
		this.imageWidth = imageWidth;
	}
	public int getImageHeight() {
		return imageHeight;
	}
	public void setImageHeight(int imageHeight) {
		this.imageHeight = imageHeight;
	}
}
