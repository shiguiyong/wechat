package com.mapper;

import com.model.ServerConfig;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServerConfigMapper {
    void update(ServerConfig serverConfig);
    List<ServerConfig> qryList();
}
