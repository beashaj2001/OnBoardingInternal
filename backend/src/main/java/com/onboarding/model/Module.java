package com.onboarding.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.util.List;

@Data
@Document(collection = "modules")
public class Module {
    @Id
    private String id;
    private String title;
    private String description;
    private String duration;
    private String image;
    private String type; // "3d", "video", "text"
    private String completionMode; // Added: "MANDATORY", "SELF_LEARNED", "NON_MANDATORY"
    private List<String> prerequisites;
    private List<String> skills;
    private String quizId;

    @DBRef
    private List<SubModule> subModules;
    private int completionRate;
    private int order;
    private boolean active = true;
    private boolean isMandatory = true; // Keep for potential backward compatibility or derive from completionMode

    public Module() {
    }

    public Module(String title, String description, String type, String duration) {
        this.title = title;
        this.description = description;
        this.type = type;
        this.duration = duration;
        // Consider setting a default completionMode here if necessary
    }
}