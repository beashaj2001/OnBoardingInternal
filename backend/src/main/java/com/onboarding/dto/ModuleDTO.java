package com.onboarding.dto;

import lombok.Data;

import java.util.List;
import java.util.ArrayList;

@Data
public class ModuleDTO {
    private String id;
    private String title;
    private String description;
    private String duration;
    private String image;
    private String type;
    private String completionMode; // Added: "MANDATORY", "SELF_LEARNED", "NON_MANDATORY"
    private boolean isMandatory;
    private int order;
    private boolean active;

    // Fields for User Progress on the module
    private String userProgressId;
    private Integer completionPercentage;
    private String status; // e.g., NOT_STARTED, IN_PROGRESS, COMPLETED
    private String lastAccessedAt;

    // Fields for Module Assessment (Quiz)
    private String quizId;
    private boolean hasAssessment;
    private Boolean assessmentCompleted;
    private Integer assessmentScore;

    private String displayTag;
    private List<String> skills = new ArrayList<>();
    private List<SubModuleDTO> subModules = new ArrayList<>();

    public ModuleDTO() {
    }

    public ModuleDTO(String id, String title, String description, String duration, String image,
            String type, boolean isMandatory, int order, boolean active) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.duration = duration;
        this.image = image;
        this.type = type;
        this.isMandatory = isMandatory;
        this.order = order;
        this.active = active;
        this.status = "NOT_STARTED";
        this.completionPercentage = 0;
        this.hasAssessment = false;
        this.assessmentCompleted = false;
        this.assessmentScore = null;
        this.userProgressId = null;
        this.completionPercentage = null;
        this.lastAccessedAt = null;
        this.quizId = null;
        this.displayTag = null;
        this.skills = new ArrayList<>();
        this.subModules = new ArrayList<>();
    }
}