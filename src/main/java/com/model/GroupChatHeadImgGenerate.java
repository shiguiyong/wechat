package com.model;

import java.awt.Color;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.imageio.ImageIO;

/**
 * *群头像生成
 * *群头像200*200 
 * 
 *    群人数 3  成品字
 *       4 一脚一个
 *       5 分三行 第一行一个 第二行2个 第三行2个
 *       6 分二行 每行三个
 *       7 分三行
 *       8 分三行
 *       9 九宫格
 */
public class GroupChatHeadImgGenerate {
	
	private int width=200;
	
	private int height=200;
	
	/**群成员头像*/
	private List<BufferedImage> groupNumber;
	
	private BufferedImage groupImg;
	
	public GroupChatHeadImgGenerate() {
		this.groupNumber = new ArrayList<BufferedImage>(9);
	}
	
	private BufferedImage bytesToBufferedImage(byte[] bytes) {
		ByteArrayInputStream in = new ByteArrayInputStream(bytes);
		try {
			BufferedImage image = ImageIO.read(in);
			in.close();
			return image;
		} catch (IOException e) {
			e.printStackTrace();
		} 
		return null;
	}
	
	public void generate() {
		try {
			this.groupImg = new BufferedImage(width, height, BufferedImage.TYPE_INT_ARGB);
			Graphics2D gd = groupImg.createGraphics();
			gd = groupImg.createGraphics();
			
			gd.setColor(new Color(200, 200, 200));
			gd.fillRect(0, 0, width, height );
			
			
			switch (groupNumber.size()) {
				case 0:break;
				case 1:drawOne(gd);break;
				case 2:drawTwo(gd);break;
				case 3:drawThree(gd);break;
				case 4:drawFour(gd);break;
				case 5:drawFive(gd);break;
				case 6:drawSix(gd);break;
				case 7:drawSeven(gd);break;
				case 8:drawEight(gd);break;
				case 9:
				default:
					drawNine(gd);
					break;
			}
			gd.dispose();
		} catch (Exception e) {
			e.printStackTrace();
			this.groupImg=null;
		}
	}
	private void drawOne(Graphics2D gd) {
		gd.drawImage(groupNumber.get(0), 50, 50, 100, 100, null);
	}
	private void drawTwo(Graphics2D gd) {
		gd.drawImage(groupNumber.get(0), 6, 55, 91, 91, null);
		gd.drawImage(groupNumber.get(1), 103, 55, 91, 91, null);
	}
	private void drawThree(Graphics2D gd) {
		gd.drawImage(groupNumber.get(0), 55, 6, 91, 91, null);
		
		gd.drawImage(groupNumber.get(1), 6, 103, 91, 91, null);
		gd.drawImage(groupNumber.get(2), 103, 103, 91, 91, null);
	}
	private void drawFour(Graphics2D gd) {
		gd.drawImage(groupNumber.get(0), 6, 6, 91, 91, null);
		gd.drawImage(groupNumber.get(1), 103, 6, 91, 91, null);
		
		gd.drawImage(groupNumber.get(2), 6, 103, 91, 91, null);
		gd.drawImage(groupNumber.get(3), 103, 103, 91, 91, null);
	}
	private void drawFive(Graphics2D gd) {
		gd.drawImage(groupNumber.get(0), 40, 40, 60, 60, null);
		gd.drawImage(groupNumber.get(1), 105, 40, 60, 60, null);
		
		gd.drawImage(groupNumber.get(2), 5, 105, 60, 60, null);
		gd.drawImage(groupNumber.get(3), 70, 105, 60, 60, null);
		gd.drawImage(groupNumber.get(4), 135, 105, 60, 60, null);
	}
	private void drawSix(Graphics2D gd) {
		gd.drawImage(groupNumber.get(0), 5, 40, 60, 60, null);
		gd.drawImage(groupNumber.get(1), 70, 40, 60, 60, null);
		gd.drawImage(groupNumber.get(2), 135, 40, 60, 60, null);
		
		gd.drawImage(groupNumber.get(3), 5, 105, 60, 60, null);
		gd.drawImage(groupNumber.get(4), 70, 105, 60, 60, null);
		gd.drawImage(groupNumber.get(5), 135, 105, 60, 60, null);
	}
	
	private void drawSeven(Graphics2D gd) {
		gd.drawImage(groupNumber.get(0), 70, 5, 60, 60, null);
		
		gd.drawImage(groupNumber.get(1), 5, 70, 60, 60, null);
		gd.drawImage(groupNumber.get(2), 70, 70, 60, 60, null);
		gd.drawImage(groupNumber.get(3), 135, 70, 60, 60, null);
		
		gd.drawImage(groupNumber.get(4), 5, 135, 60, 60, null);
		gd.drawImage(groupNumber.get(5), 70, 135, 60, 60, null);
		gd.drawImage(groupNumber.get(6), 135, 135, 60, 60, null);
	}
	private void drawEight(Graphics2D gd) {
		gd.drawImage(groupNumber.get(0), 40, 5, 60, 60, null);
		gd.drawImage(groupNumber.get(1), 105, 5, 60, 60, null);
		
		gd.drawImage(groupNumber.get(2), 5, 70, 60, 60, null);
		gd.drawImage(groupNumber.get(3), 70, 70, 60, 60, null);
		gd.drawImage(groupNumber.get(4), 135, 70, 60, 60, null);
		
		gd.drawImage(groupNumber.get(5), 5, 135, 60, 60, null);
		gd.drawImage(groupNumber.get(6), 70, 135, 60, 60, null);
		gd.drawImage(groupNumber.get(7), 135, 135, 60, 60, null);
	}
	private void drawNine(Graphics2D gd) {
		gd.drawImage(groupNumber.get(0), 5, 5, 60, 60, null);
		gd.drawImage(groupNumber.get(1), 70, 5, 60, 60, null);
		gd.drawImage(groupNumber.get(2), 135, 5, 60, 60, null);
		
		gd.drawImage(groupNumber.get(3), 5, 70, 60, 60, null);
		gd.drawImage(groupNumber.get(4), 70, 70, 60, 60, null);
		gd.drawImage(groupNumber.get(5), 135, 70, 60, 60, null);
		
		gd.drawImage(groupNumber.get(6), 5, 135, 60, 60, null);
		gd.drawImage(groupNumber.get(7), 70, 135, 60, 60, null);
		gd.drawImage(groupNumber.get(8), 135, 135, 60, 60, null);
	}
	
	public byte[] getBytes() {
		if(groupImg==null) {
			return null;
		}
		ByteArrayOutputStream out =new ByteArrayOutputStream();
		try {
			ImageIO.write(groupImg,"PNG",out);
			out.close();
			return out.toByteArray();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return null;
	}
	
	public void addNumber(byte[] bytes) {
		groupNumber.add(bytesToBufferedImage(bytes));
	}

}
