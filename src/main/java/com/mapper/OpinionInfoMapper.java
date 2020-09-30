package com.mapper;

import com.model.OpinionInfo;
import org.springframework.stereotype.Repository;

@Repository
public interface OpinionInfoMapper {
    void insert(OpinionInfo info);
}
