package com.model;

import com.alibaba.fastjson.JSONObject;
import com.common.Model;

public class ServerConfig implements Model {
    /**配置标识(CONFIG_KEY)*/
    private String configKey;
    /**配置值(CONFIG_VALUE)*/
    private String configValue;

    @Override
    public JSONObject encode() {
        return null;
    }
    @Override
    public void decode(JSONObject json) {

    }

    public String getConfigKey() {
        return configKey;
    }

    public void setConfigKey(String configKey) {
        this.configKey = configKey;
    }

    public String getConfigValue() {
        return configValue;
    }

    public void setConfigValue(String configValue) {
        this.configValue = configValue;
    }


}
