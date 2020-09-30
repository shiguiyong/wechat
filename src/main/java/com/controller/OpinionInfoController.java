package com.controller;

import com.common.Result;
import com.common.http.IMChatRequest;
import com.model.OpinionInfo;
import com.service.OpinionInfoService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;
import java.util.Date;

/**
 * 意见反馈管理
 * */
@RestController
public class OpinionInfoController {

    @Resource
    private OpinionInfoService opinionInfoService;

    @RequestMapping(value = "/opinion/opinion",method= RequestMethod.POST, produces = { "application/json;charset=UTF-8" })
    public Result<OpinionInfo> opinion(IMChatRequest request, HttpServletResponse response) throws Exception {
        OpinionInfo opinionInfo = new OpinionInfo();
        opinionInfo.decode(request.getJson());
        opinionInfo.setCreateDate(new Date());
        opinionInfo.setOpinionState(0);
        opinionInfo.setUpdateDate(new Date());
        opinionInfoService.insert(opinionInfo);
        return new Result<>();
    }
}
