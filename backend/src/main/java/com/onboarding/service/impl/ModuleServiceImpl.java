package com.onboarding.service.impl;

import com.onboarding.dto.ModuleDTO;
import com.onboarding.dto.SubModuleDTO;
import com.onboarding.model.Module;
import com.onboarding.model.SubModule;
import com.onboarding.repository.ModuleRepository;
import com.onboarding.service.ModuleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import java.util.List;
import java.util.stream.Collectors;

import com.onboarding.dto.ResourceDto;
import com.onboarding.model.Resource;
import com.onboarding.repository.SubModuleRepository;
import com.onboarding.model.UserQuiz;
import com.onboarding.repository.QuizRepository;
import com.onboarding.repository.UserQuizRepository;
import com.onboarding.model.UserProgress;
import com.onboarding.repository.UserProgressRepository;

@Service
public class ModuleServiceImpl implements ModuleService {

    private final ModuleRepository moduleRepository;
    private final SubModuleRepository subModuleRepository;
    private final MongoTemplate mongoTemplate;
    private final QuizRepository quizRepository;
    private final UserQuizRepository userQuizRepository;
    private final UserProgressRepository userProgressRepository;

    @Autowired
    public ModuleServiceImpl(ModuleRepository moduleRepository, SubModuleRepository subModuleRepository,
            MongoTemplate mongoTemplate, QuizRepository quizRepository, UserQuizRepository userQuizRepository,
            UserProgressRepository userProgressRepository) {
        this.moduleRepository = moduleRepository;
        this.subModuleRepository = subModuleRepository;
        this.mongoTemplate = mongoTemplate;
        this.quizRepository = quizRepository;
        this.userQuizRepository = userQuizRepository;
        this.userProgressRepository = userProgressRepository;
    }

    @Override
    public List<ModuleDTO> getAllModules() {
        return moduleRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ModuleDTO getModuleById(String id, String userId) {
        Module module = moduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Module not found"));
        System.out.println("Module Found before fetching submodules:");
        System.out.println(module.toString());

        Query query = new Query(Criteria.where("module.$id").is(id));
        List<SubModule> subModules = mongoTemplate.find(query, SubModule.class);

        System.out.println("Fetched submodules count: " + (subModules != null ? subModules.size() : 0));
        if (subModules != null) {
            subModules.forEach(sub -> System.out.println("Fetched SubModule: " + sub.toString()));
        }

        module.setSubModules(subModules);

        System.out.println("Module object after setting submodules:");
        System.out.println(module.toString());

        UserQuiz userQuiz = null;
        if (module.getQuizId() != null && userId != null) {
            userQuiz = userQuizRepository.findByUserIdAndQuizId(userId, module.getQuizId()).orElse(null);
        }

        UserProgress userProgress = null;
        if (userId != null) {
            userProgress = userProgressRepository.findByUserIdAndModuleId(userId, id).orElse(null);
        }

        ModuleDTO moduleDTO = convertToDTO(module, userQuiz, userProgress);
        System.out.println("Final ModuleDTO before returning:");
        System.out.println(moduleDTO.toString());

        return moduleDTO;
    }

    @Override
    public List<ModuleDTO> getModulesByType(String type) {
        return moduleRepository.findByType(type).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ModuleDTO> getModulesBySkills(List<String> skills) {
        return moduleRepository.findBySkillsIn(skills).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ModuleDTO createModule(ModuleDTO ModuleDTO) {
        Module module = convertToEntity(ModuleDTO);
        Module savedModule = moduleRepository.save(module);
        return convertToDTO(savedModule);
    }

    @Override
    @Transactional
    public ModuleDTO updateModule(String id, ModuleDTO ModuleDTO) {
        Module existingModule = moduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Module not found"));

        updateModuleFromDTO(existingModule, ModuleDTO);
        Module updatedModule = moduleRepository.save(existingModule);
        return convertToDTO(updatedModule);
    }

    @Override
    @Transactional
    public void deleteModule(String id) {
        moduleRepository.deleteById(id);
    }

    private ModuleDTO convertToDTO(Module module, UserQuiz userQuiz, UserProgress userProgress) {
        ModuleDTO dto = new ModuleDTO();
        dto.setId(module.getId());
        dto.setTitle(module.getTitle());
        dto.setDescription(module.getDescription());
        dto.setType(module.getType());
        dto.setSkills(module.getSkills());
        dto.setOrder(module.getOrder());
        dto.setActive(module.isActive());
        dto.setQuizId(module.getQuizId());
        dto.setDuration(module.getDuration());
        dto.setCompletionMode(module.getCompletionMode());

        // Set overall module progress from UserProgress
        if (userProgress != null) {
            dto.setUserProgressId(userProgress.getId());
            dto.setCompletionPercentage(userProgress.getCompletionPercentage());
            dto.setStatus(userProgress.getStatus());
            dto.setLastAccessedAt(
                    userProgress.getLastAccessedAt() != null ? userProgress.getLastAccessedAt().toString() : null);
        } else {
            // Default values if no user progress found
            dto.setUserProgressId(null);
            dto.setCompletionPercentage(0);
            dto.setStatus("NOT_STARTED");
            dto.setLastAccessedAt(null);
        }

        if (userQuiz != null) {
            dto.setAssessmentCompleted(userQuiz.isCompleted());
            dto.setAssessmentScore(userQuiz.getScore());
        } else {
            dto.setAssessmentCompleted(false);
            dto.setAssessmentScore(null);
        }

        if (module.getSubModules() != null) {
            List<String> completedSubModuleIds = userProgress != null ? userProgress.getCompletedSubModuleIds()
                    : new java.util.ArrayList<>();
            dto.setSubModules(module.getSubModules().stream()
                    .map(sub -> convertSubModuleToDTO(sub, completedSubModuleIds))
                    .collect(Collectors.toList()));
        }
        return dto;
    }

    private ModuleDTO convertToDTO(Module module) {
        ModuleDTO dto = new ModuleDTO();
        dto.setId(module.getId());
        dto.setTitle(module.getTitle());
        dto.setDescription(module.getDescription());
        dto.setType(module.getType());
        dto.setSkills(module.getSkills());
        dto.setOrder(module.getOrder());
        dto.setActive(module.isActive());
        dto.setQuizId(module.getQuizId());
        dto.setDuration(module.getDuration());
        dto.setCompletionMode(module.getCompletionMode());

        // Default values for user progress when not fetched
        dto.setUserProgressId(null);
        dto.setCompletionPercentage(0);
        dto.setStatus("NOT_STARTED");
        dto.setLastAccessedAt(null);
        dto.setAssessmentCompleted(false);
        dto.setAssessmentScore(null);

        if (module.getSubModules() != null) {
            // When user progress is not available, assume no submodules are completed
            List<String> completedSubModuleIds = new java.util.ArrayList<>();
            dto.setSubModules(module.getSubModules().stream()
                    .map(sub -> convertSubModuleToDTO(sub, completedSubModuleIds))
                    .collect(Collectors.toList()));
        }
        return dto;
    }

    private SubModuleDTO convertSubModuleToDTO(SubModule subModule, List<String> completedSubModuleIds) {
        SubModuleDTO dto = new SubModuleDTO();
        dto.setId(subModule.getId());
        dto.setTitle(subModule.getTitle());
        dto.setDescription(subModule.getDescription());
        dto.setContentType(subModule.getContentType());
        dto.setContent(subModule.getContent());
        dto.setOrder(subModule.getOrder());
        dto.setActive(subModule.isActive());
        dto.setType(subModule.getType());
        dto.setDuration(subModule.getDuration());
        dto.setVideoUrl(subModule.getVideoUrl());
        if (subModule.getResources() != null) {
            dto.setResources(subModule.getResources().stream()
                    .map(this::convertResourceToDTO)
                    .collect(Collectors.toList()));
        }

        // Set submodule status based on user progress
        if (completedSubModuleIds.contains(subModule.getId())) {
            dto.setStatus("completed"); // Use frontend's status strings
            dto.setCompletionPercentage(100);
        } else {
            dto.setStatus("not-started"); // Or 'in-progress' if you track that level
            dto.setCompletionPercentage(0);
        }

        // Note: videoProgress and contentProgress are currently frontend state
        // and not persisted per submodule in backend UserProgress

        return dto;
    }

    private ResourceDto convertResourceToDTO(Resource resource) {
        ResourceDto dto = new ResourceDto();
        dto.setTitle(resource.getTitle());
        dto.setDescription(resource.getDescription());
        dto.setType(resource.getType());
        dto.setUrl(resource.getUrl());
        return dto;
    }

    private Module convertToEntity(ModuleDTO dto) {
        Module module = new Module();
        module.setTitle(dto.getTitle());
        module.setDescription(dto.getDescription());
        module.setType(dto.getType());
        module.setSkills(dto.getSkills());
        module.setOrder(dto.getOrder());
        module.setActive(dto.isActive());
        module.setQuizId(dto.getQuizId());
        if (dto.getSubModules() != null) {
            module.setSubModules(dto.getSubModules().stream()
                    .map(this::convertSubModuleToEntity)
                    .collect(Collectors.toList()));
        }
        return module;
    }

    private SubModule convertSubModuleToEntity(SubModuleDTO dto) {
        SubModule subModule = new SubModule();
        subModule.setTitle(dto.getTitle());
        subModule.setDescription(dto.getDescription());
        subModule.setContentType(dto.getContentType());
        subModule.setContent(dto.getContent());
        subModule.setOrder(dto.getOrder());
        subModule.setActive(dto.isActive());
        return subModule;
    }

    private void updateModuleFromDTO(Module module, ModuleDTO dto) {
        module.setTitle(dto.getTitle());
        module.setDescription(dto.getDescription());
        module.setType(dto.getType());
        module.setSkills(dto.getSkills());
        module.setOrder(dto.getOrder());
        module.setActive(dto.isActive());
        module.setQuizId(dto.getQuizId());
    }
}