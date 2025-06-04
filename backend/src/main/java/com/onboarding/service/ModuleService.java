package com.onboarding.service;

import com.onboarding.dto.ModuleDTO;
import java.util.List;

/**
 * Service interface for managing modules
 */
public interface ModuleService {
    List<ModuleDTO> getAllModules();

    ModuleDTO getModuleById(String id, String userId);

    List<ModuleDTO> getModulesByType(String type);

    List<ModuleDTO> getModulesBySkills(List<String> skills);

    ModuleDTO createModule(ModuleDTO ModuleDTO);

    ModuleDTO updateModule(String id, ModuleDTO ModuleDTO);

    void deleteModule(String id);
}