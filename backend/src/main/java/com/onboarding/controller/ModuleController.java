package com.onboarding.controller;

import com.onboarding.dto.ModuleDTO;
import com.onboarding.service.ModuleService;
import com.onboarding.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/modules")
public class ModuleController {
    private final ModuleService moduleService;
    private final UserService userService;

    public ModuleController(ModuleService moduleService, UserService userService) {
        this.moduleService = moduleService;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<ModuleDTO>> getAllModules() {
        return ResponseEntity.ok(moduleService.getAllModules());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ModuleDTO> getModuleById(
            @RequestHeader("User-Id") String userId, // Add this line
            @PathVariable String id) {
        return ResponseEntity.ok(moduleService.getModuleById(id, userId)); // Change this line
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<ModuleDTO>> getModulesByType(@PathVariable String type) {
        return ResponseEntity.ok(moduleService.getModulesByType(type));
    }

    @GetMapping("/skills")
    public ResponseEntity<List<ModuleDTO>> getModulesBySkills(@RequestParam List<String> skills) {
        return ResponseEntity.ok(moduleService.getModulesBySkills(skills));
    }

    @PostMapping
    public ResponseEntity<ModuleDTO> createModule(
            @RequestHeader("User-Id") String userId,
            @Valid @RequestBody ModuleDTO ModuleDTO) {
        if (!userService.isTrainer(userId)) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(moduleService.createModule(ModuleDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ModuleDTO> updateModule(
            @RequestHeader("User-Id") String userId,
            @PathVariable String id,
            @Valid @RequestBody ModuleDTO ModuleDTO) {
        if (!userService.isTrainer(userId)) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(moduleService.updateModule(id, ModuleDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteModule(
            @RequestHeader("User-Id") String userId,
            @PathVariable String id) {
        if (!userService.isTrainer(userId)) {
            return ResponseEntity.status(403).build();
        }
        moduleService.deleteModule(id);
        return ResponseEntity.ok().build();
    }
}