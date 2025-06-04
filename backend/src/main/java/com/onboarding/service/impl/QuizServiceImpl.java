package com.onboarding.service.impl;

import com.onboarding.dto.QuizDTO;
import com.onboarding.dto.QuizSubmissionDTO;
import com.onboarding.dto.UserAnswerDTO;
import com.onboarding.dto.QuestionDTO;
import com.onboarding.model.Quiz;
import com.onboarding.model.Question;
import com.onboarding.model.UserQuiz;
import com.onboarding.model.User;
import com.onboarding.model.Achievement;
import com.onboarding.model.Module;
import com.onboarding.model.UserProgress;
import com.onboarding.repository.QuizRepository;
import com.onboarding.repository.UserQuizRepository;
import com.onboarding.repository.UserRepository;
import com.onboarding.repository.AchievementRepository;
import com.onboarding.repository.UserProgressRepository;
import com.onboarding.repository.ModuleRepository;
import com.onboarding.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class QuizServiceImpl implements QuizService {

    private final QuizRepository quizRepository;
    private final UserQuizRepository userQuizRepository;
    private final UserRepository userRepository;
    private final AchievementRepository achievementRepository;
    private final UserProgressRepository userProgressRepository;
    private final ModuleRepository moduleRepository;

    @Autowired
    public QuizServiceImpl(QuizRepository quizRepository, UserQuizRepository userQuizRepository,
            UserRepository userRepository, AchievementRepository achievementRepository,
            UserProgressRepository userProgressRepository, ModuleRepository moduleRepository) {
        this.quizRepository = quizRepository;
        this.userQuizRepository = userQuizRepository;
        this.userRepository = userRepository;
        this.achievementRepository = achievementRepository;
        this.userProgressRepository = userProgressRepository;
        this.moduleRepository = moduleRepository;
    }

    @Override
    public List<QuizDTO> getAllQuizzes() {
        return quizRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public QuizDTO getQuizById(String id) {
        Quiz quiz = quizRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));
        return convertToDTO(quiz);
    }

    @Override
    public List<QuizDTO> getQuizzesByModuleId(String moduleId) {
        return quizRepository.findByModuleId(moduleId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public QuizDTO createQuiz(QuizDTO quizDTO) {
        // TODO: Add validation, e.g., only one quiz per module
        Quiz quiz = convertToEntity(quizDTO);
        Quiz savedQuiz = quizRepository.save(quiz);
        return convertToDTO(savedQuiz);
    }

    @Override
    @Transactional
    public QuizDTO updateQuiz(String id, QuizDTO quizDTO) {
        Optional<Quiz> existingQuiz = quizRepository.findById(id);
        if (existingQuiz.isPresent()) {
            Quiz quizToUpdate = existingQuiz.get();
            updateQuizFromDTO(quizToUpdate, quizDTO);
            Quiz updatedQuiz = quizRepository.save(quizToUpdate);
            return convertToDTO(updatedQuiz);
        } else {
            throw new RuntimeException("Quiz not found with id: " + id);
        }
    }

    @Override
    @Transactional
    public void deleteQuiz(String id) {
        quizRepository.deleteById(id);
    }

    @Override
    @Transactional
    public int submitQuiz(String userId, QuizSubmissionDTO submissionDTO) {
        // 1. Retrieve the Quiz
        Quiz quiz = quizRepository.findById(submissionDTO.getQuizId())
                .orElseThrow(
                        () -> new RuntimeException("Quiz not found with id: " + submissionDTO.getQuizId()));

        // Check if quiz is enabled
        if (!quiz.isEnabled()) {
            throw new RuntimeException("Quiz is not enabled for submission");
        }

        // 2. Calculate the score
        int score = 0;
        Map<String, String> correctAnswers = quiz.getQuestions().stream()
                .collect(Collectors.toMap(Question::getQuestionText, Question::getCorrectAnswer)); // Assuming question
                                                                                                   // text is unique
                                                                                                   // identifier

        for (UserAnswerDTO userAnswer : submissionDTO.getUserAnswers()) {
            // Using question text to match, might need a question ID if text is not unique
            if (correctAnswers.containsKey(userAnswer.getQuestionId())) { // Using questionId from DTO to match with
                                                                          // questionText in map
                if (userAnswer.getSelectedAnswer() != null
                        && userAnswer.getSelectedAnswer().equals(correctAnswers.get(userAnswer.getQuestionId()))) {
                    score++; // Simple scoring: 1 point per correct answer
                }
            }
        }

        // Calculate score as percentage (assuming 1 point per question)
        int maxScore = quiz.getQuestions().size();
        int percentageScore = (maxScore > 0) ? (score * 100) / maxScore : 0;

        // 3. Update UserQuiz
        Optional<UserQuiz> existingUserQuiz = userQuizRepository.findByUserIdAndQuizId(userId,
                submissionDTO.getQuizId());
        UserQuiz userQuiz;

        if (existingUserQuiz.isPresent()) {
            userQuiz = existingUserQuiz.get();
            // Prevent resubmission if already completed, or handle multiple attempts
            if (userQuiz.isCompleted()) {
                throw new RuntimeException("Quiz already completed by user");
            }
            userQuiz.setScore(percentageScore);
            userQuiz.setCompleted(true);
            userQuiz.setCompletedAt(LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME));
        } else {
            userQuiz = new UserQuiz();
            userQuiz.setUserId(userId);
            userQuiz.setQuizId(submissionDTO.getQuizId());
            userQuiz.setScore(percentageScore);
            userQuiz.setCompleted(true);
            userQuiz.setCompletedAt(LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME));
        }

        userQuizRepository.save(userQuiz);

        // 4. Update UserProgress for the module
        UserProgress userProgress = userProgressRepository.findByUserIdAndModuleId(userId, quiz.getModuleId())
                .orElse(new UserProgress(userId, quiz.getModuleId(), "NOT_STARTED", 0));

        userProgress.setQuizCompleted(true); // Mark quiz as completed in UserProgress

        // Recalculate overall completion percentage for the module
        Module module = moduleRepository.findById(quiz.getModuleId())
                .orElseThrow(() -> new RuntimeException("Module not found with id: " + quiz.getModuleId()));

        int totalSections = module.getSubModules().size() + 1; // +1 for the quiz
        int completedSections = userProgress.getCompletedSubModuleIds().size()
                + (userProgress.isQuizCompleted() ? 1 : 0);

        int completionPercentage = totalSections > 0 ? (completedSections * 100) / totalSections : 0;

        userProgress.setCompletionPercentage(completionPercentage);
        userProgress.setLastAccessedAt(LocalDateTime.now());

        // Update module status if completed
        if (completionPercentage == 100) {
            userProgress.setStatus("COMPLETED");
            userProgress.setCompletedAt(LocalDateTime.now());
            // Check and award module completion badges
            checkAndAwardModuleCompletionBadges(userId, module.getId(), userProgress.getStatus());
        } else if (completionPercentage > 0) {
            userProgress.setStatus("IN_PROGRESS");
        } else {
            userProgress.setStatus("NOT_STARTED");
        }

        userProgressRepository.save(userProgress);

        // Check for Perfect Quiz Score badge
        if (score > 0 && score == maxScore) { // Check if the score is equal to the max score (all correct)
            userRepository.findById(userId).ifPresent(user -> {
                String perfectScoreBadgeId = "perfect-quiz-score";
                if (!user.getEarnedAchievementIds().contains(perfectScoreBadgeId)) {
                    user.getEarnedAchievementIds().add(perfectScoreBadgeId);
                    user.setBadgesEarnedCount(user.getBadgesEarnedCount() + 1);
                    userRepository.save(user);
                    // TODO: Potentially log badge earning or send a notification
                }
            });
        }

        return percentageScore;
    }

    private void checkAndAwardModuleCompletionBadges(String userId, String moduleId, String moduleStatus) {
        if ("COMPLETED".equals(moduleStatus)) {
            // Check for Mandatory Modules Completion badge
            Set<String> mandatoryModuleIds = moduleRepository.findByIsMandatoryTrue().stream()
                    .map(module -> module.getId())
                    .collect(Collectors.toSet());

            Set<String> userCompletedModuleIds = userProgressRepository.findByUserId(userId).stream()
                    .filter(progress -> "COMPLETED".equals(progress.getStatus()))
                    .map(UserProgress::getModuleId)
                    .collect(Collectors.toSet());

            boolean allMandatoryCompleted = userCompletedModuleIds.containsAll(mandatoryModuleIds);

            if (allMandatoryCompleted) {
                userRepository.findById(userId).ifPresent(user -> {
                    String mandatoryBadgeId = "mandatory-completion";
                    if (!user.getEarnedAchievementIds().contains(mandatoryBadgeId)) {
                        user.getEarnedAchievementIds().add(mandatoryBadgeId);
                        user.setBadgesEarnedCount(user.getBadgesEarnedCount() + 1);
                        userRepository.save(user);
                    }
                });
            }

            // Check for Self Learned Modules Completion badge
            if (!moduleRepository.findById(moduleId).orElseThrow().isMandatory()) {
                Set<String> nonMandatoryModuleIds = moduleRepository.findAll().stream()
                        .filter(module -> !module.isMandatory())
                        .map(module -> module.getId())
                        .collect(Collectors.toSet());

                Set<String> userCompletedNonMandatoryModuleIds = userProgressRepository.findByUserId(userId).stream()
                        .filter(progress -> "COMPLETED".equals(progress.getStatus()))
                        .map(UserProgress::getModuleId)
                        .filter(nonMandatoryModuleIds::contains)
                        .collect(Collectors.toSet());

                int selfLearnedThreshold = 3;

                if (userCompletedNonMandatoryModuleIds.size() >= selfLearnedThreshold) {
                    userRepository.findById(userId).ifPresent(user -> {
                        String selfLearnedBadgeId = "self-learned-completion";
                        if (!user.getEarnedAchievementIds().contains(selfLearnedBadgeId)) {
                            user.getEarnedAchievementIds().add(selfLearnedBadgeId);
                            user.setBadgesEarnedCount(user.getBadgesEarnedCount() + 1);
                            userRepository.save(user);
                        }
                    });
                }
            }
        }
    }

    private QuizDTO convertToDTO(Quiz quiz) {
        QuizDTO dto = new QuizDTO();
        dto.setId(quiz.getId());
        dto.setTitle(quiz.getTitle());
        dto.setDescription(quiz.getDescription());
        dto.setModuleId(quiz.getModuleId());
        // Assuming Quiz model has these fields based on previous context
        dto.setTimeLimit(quiz.getTimeLimit());
        dto.setPassingScore(quiz.getPassingScore());
        dto.setActive(quiz.isActive());
        dto.setQuestions(quiz.getQuestions().stream()
                .map(this::convertQuestionToDTO)
                .collect(Collectors.toList()));
        return dto;
    }

    private Quiz convertToEntity(QuizDTO dto) {
        Quiz quiz = new Quiz();
        // ID is typically generated by MongoDB, not set from DTO on creation
        quiz.setTitle(dto.getTitle());
        quiz.setDescription(dto.getDescription());
        quiz.setModuleId(dto.getModuleId());
        // Assuming QuizDTO has these fields
        quiz.setTimeLimit(dto.getTimeLimit());
        quiz.setPassingScore(dto.getPassingScore());
        quiz.setActive(dto.isActive());
        if (dto.getQuestions() != null) {
            quiz.setQuestions(dto.getQuestions().stream()
                    .map(this::convertQuestionToEntity)
                    .collect(Collectors.toList()));
        }
        return quiz;
    }

    private void updateQuizFromDTO(Quiz quiz, QuizDTO dto) {
        quiz.setTitle(dto.getTitle());
        quiz.setDescription(dto.getDescription());
        quiz.setModuleId(dto.getModuleId());
        // Assuming QuizDTO has these fields
        quiz.setTimeLimit(dto.getTimeLimit());
        quiz.setPassingScore(dto.getPassingScore());
        quiz.setActive(dto.isActive());
        if (dto.getQuestions() != null) {
            quiz.setQuestions(dto.getQuestions().stream()
                    .map(this::convertQuestionToEntity)
                    .collect(Collectors.toList()));
        }
    }

    // Helper conversion methods for Question
    private QuestionDTO convertQuestionToDTO(Question question) {
        QuestionDTO dto = new QuestionDTO();
        dto.setQuestionText(question.getQuestionText());
        dto.setOptions(question.getOptions());
        dto.setCorrectAnswer(question.getCorrectAnswer());
        return dto;
    }

    private Question convertQuestionToEntity(QuestionDTO dto) {
        Question question = new Question();
        question.setQuestionText(dto.getQuestionText());
        question.setOptions(dto.getOptions());
        question.setCorrectAnswer(dto.getCorrectAnswer());
        return question;
    }
}