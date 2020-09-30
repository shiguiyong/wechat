package com.service;

import com.mapper.ServerConfigMapper;
import com.model.ServerConfig;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

@Service
public class ServerConfigService {
    @Resource
    private ServerConfigMapper serverConfigMapper;

    public void update(ServerConfig serverConfig){
        serverConfigMapper.update(serverConfig);
    }

    public List<ServerConfig> qryList(){
        return serverConfigMapper.qryList();
    }
}
