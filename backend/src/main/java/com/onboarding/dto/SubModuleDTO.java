package com.onboarding.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

import com.onboarding.model.Resource;

@Data
public class SubModuleDTO {
    private String id;

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Content type is required")
    private String contentType;

    private String content;
    private String type;
    private String duration;
    private String videoUrl;
    private List<ResourceDto> resources;
    private int order;
    private boolean isActive = true;

    // Fields for User Progress on the submodule
    private String status; // e.g., not-started, in-progress, completed
    private Integer completionPercentage;
}