package com.onboarding.controller;

import com.onboarding.dto.ProgressDTO;
import com.onboarding.service.ProgressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/progress")
public class ProgressController {

    private final ProgressService progressService;

    @Autowired
    public ProgressController(ProgressService progressService) {
        this.progressService = progressService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<ProgressDTO> getTraineeProgress(@PathVariable String userId) {
        ProgressDTO progress = progressService.getTraineeProgress(userId);
        return ResponseEntity.ok(progress);
    }

    @PutMapping("/{userId}")
    public ResponseEntity<ProgressDTO> updateTraineeProgress(
            @PathVariable String userId,
            @RequestBody ProgressDTO ProgressDTO) {
        ProgressDTO updatedProgress = progressService.updateTraineeProgress(userId, ProgressDTO);
        return ResponseEntity.ok(updatedProgress);
    }

    @PostMapping("/{userId}/module/{moduleId}/submodule/{subModuleId}/complete")
    public ResponseEntity<Void> completeSubModule(
            @PathVariable String userId,
            @PathVariable String moduleId,
            @PathVariable String subModuleId) {
        progressService.completeSubModule(userId, moduleId, subModuleId);
        return ResponseEntity.ok().build();
    }
}