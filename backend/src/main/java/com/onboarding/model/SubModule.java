package com.onboarding.model;

import lombok.Data;
import java.util.List;

import com.onboarding.model.Resource;
import com.onboarding.model.Module;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document("subModules")
public class SubModule {
    private String id;
    private String title;
    private String description;
    private String contentType;
    private String content;
    private int order;
    private boolean active = true;
    private String type;
    private String duration;
    private String status;
    private int progress;
    private String difficulty;
    private String estimatedTime;
    private String thumbnail;
    private List<String> prerequisites;
    private String videoUrl;
    private List<Resource> resources;

    @DBRef
    private Module module;
}