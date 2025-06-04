package com.onboarding.controller;

import com.onboarding.dto.QuizDTO;
import com.onboarding.dto.QuizSubmissionDTO;
import com.onboarding.model.Quiz;
import com.onboarding.service.QuizService;
import com.onboarding.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quizzes")
public class QuizController {
    private final QuizService quizService;
    private final UserService userService;

    public QuizController(QuizService quizService, UserService userService) {
        this.quizService = quizService;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<QuizDTO>> getAllQuizzes() {
        return ResponseEntity.ok(quizService.getAllQuizzes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<QuizDTO> getQuizById(@PathVariable String id) {
        return ResponseEntity.ok(quizService.getQuizById(id));
    }

    @GetMapping("/module/{moduleId}")
    public ResponseEntity<List<QuizDTO>> getQuizzesByModuleId(@PathVariable String moduleId) {
        return ResponseEntity.ok(quizService.getQuizzesByModuleId(moduleId));
    }

    @PostMapping
    public ResponseEntity<QuizDTO> createQuiz(
            @RequestHeader("User-Id") String userId,
            @Valid @RequestBody QuizDTO quizDTO) {
        if (!userService.isTrainer(userId)) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(quizService.createQuiz(quizDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<QuizDTO> updateQuiz(
            @RequestHeader("User-Id") String userId,
            @PathVariable String id,
            @Valid @RequestBody QuizDTO quizDTO) {
        if (!userService.isTrainer(userId)) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(quizService.updateQuiz(id, quizDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuiz(
            @RequestHeader("User-Id") String userId,
            @PathVariable String id) {
        if (!userService.isTrainer(userId)) {
            return ResponseEntity.status(403).build();
        }
        quizService.deleteQuiz(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/submit")
    public ResponseEntity<Integer> submitQuiz(
            @RequestHeader("User-Id") String userId, // Assuming user ID is passed in header
            @RequestBody QuizSubmissionDTO submissionDTO) {
        try {
            int score = quizService.submitQuiz(userId, submissionDTO);
            return ResponseEntity.ok(score);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(0); // Return 0 score on error, or a specific
                                                                          // error response
        }
    }
}