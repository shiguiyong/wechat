package com.common.pool;

import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.TimeUnit;

/**
 * * 号码池
 * * 从ID_POOL表获取数据添加到 队列中
 * * 当号码池数量小于队列中的数量 则启动IdGenerateThread线程批量生成新的号码添加到ID_POOL表
 * */
public class IdPool {
	
	private volatile static IdPool instance = null;
	/**在号码池表中获取数据队列*/
	private static BlockingQueue<String> queue=new ArrayBlockingQueue<String>(20);
	
	private IdPool(){}
	
	public static IdPool getInstance() {
		if (instance== null)  {
			synchronized (IdPool.class) {
				if (instance== null)  {
					instance= new IdPool();
				}
			}
		}
		return instance; 
	}
	
	public BlockingQueue<String> getQueue() {
		return queue;
	}
	
	public void put(String id) {
		if(!queue.contains(id)) {
			try {
				queue.put(id);
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
		}
	}
	
	public String get() {
		try {
			return queue.poll(1000,TimeUnit.MILLISECONDS);
		} catch (InterruptedException e) {
			e.printStackTrace();
			return null;
		}
	}

}
