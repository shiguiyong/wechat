package com.common.util;

import net.coobird.thumbnailator.Thumbnails;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;

/**
 * 图片处理工具类
 * 借助开源工具包 thumbnailator
 * */
public class ImageUtils {

    public static byte[] compressImage(String data){
        BufferedImage image = base64StringToImage(data);
        if(image!=null){
            try {
                return imageToByte(Thumbnails.of(image).size(200,200).asBufferedImage());
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return null;
    }
    
    public static byte[] compressImage(byte[] data){
        BufferedImage image = byteToImage(data);
        if(image!=null){
            try {
                return imageToByte(Thumbnails.of(image).size(200,200).asBufferedImage());
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return null;
    }

    private static BufferedImage base64StringToImage(String base64String) {
        try {
            byte[] bytes = Base64.getDecoder().decode(base64String);
            ByteArrayInputStream bais = new ByteArrayInputStream(bytes);
            return ImageIO.read(bais);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }
    
    private static BufferedImage byteToImage(byte[] data) {
        try{
            ByteArrayInputStream in = new ByteArrayInputStream(data);
            return ImageIO.read(in);
        }catch (Exception e){
            e.printStackTrace();
        }
        return null;
    }

    private static byte[] imageToByte(BufferedImage image) {
        try{
            ByteArrayOutputStream out=new ByteArrayOutputStream();
            ImageIO.write(image,"PNG",out);
            return out.toByteArray();
        }catch (Exception e){
            e.printStackTrace();
        }
        return null;
    }
    
}
