package com.controller;

import com.common.Result;
import com.common.http.IMChatRequest;
import com.model.GroupChatNumber;
import com.service.GroupChatNumberService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;
import java.util.List;
/**
 * *群成员 管理
 * */
@RestController
public class GroupChatNumberController {
	@Resource
	private GroupChatNumberService groupChatNumberService;
	
	@RequestMapping(value = "/groupchatnumber/qryByGroupId",method=RequestMethod.POST, produces = { "application/json;charset=UTF-8" })
	public Result<GroupChatNumber> qryByGroupId(IMChatRequest request, HttpServletResponse response) throws Exception {
		String groupId=request.getString("GROUP_ID");
		List<GroupChatNumber> numbers = groupChatNumberService.qryByGroupId(groupId);
		return new Result<GroupChatNumber>(numbers);
	}
}
