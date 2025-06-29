package edu.uw.cs.zongzewu.employee_management_system.config;

import edu.uw.cs.zongzewu.employee_management_system.dto.ApiResponse;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.NoHandlerFoundException;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Handle Spring Security authorization exceptions (403 Forbidden)
     * This handler must come BEFORE the RuntimeException handler
     */
    @ExceptionHandler(AuthorizationDeniedException.class)
    public ResponseEntity<ApiResponse<Void>> handleAuthorizationDenied(
            AuthorizationDeniedException ex, WebRequest request) {
        log.warn("Access denied: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(ApiResponse.error("Access denied. You don't have permission to perform this operation."));
    }

    /**
     * Handling general runtime exceptions
     */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiResponse<Void>> handleRuntimeException(RuntimeException ex, WebRequest request) {
        // Don't handle AuthorizationDeniedException here - let the specific handler above handle it
        if (ex instanceof AuthorizationDeniedException) {
            throw ex; // Re-throw to be handled by the specific handler
        }

        log.error("Runtime exception occurred: {}", ex.getMessage(), ex);

        if(isBusinessException(ex.getMessage())) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(ex.getMessage()));
        }

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.internalError());
    }

    /**
     * handle entity not found exception
     */
    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleEntityNotFoundException(EntityNotFoundException ex, WebRequest request) {
        log.warn("Entity not found: {}", ex.getMessage());
        return ResponseEntity.status((HttpStatus.NOT_FOUND))
                .body(ApiResponse.notFound(ex.getMessage()));
    }

    /**
     * Handle param validation exception
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidationException(MethodArgumentNotValidException ex, WebRequest request) {
        log.warn("Validation failed: {}", ex.getMessage());

        List<String> errors = new ArrayList<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->{
            errors.add(error.getField() + ": " + error.getDefaultMessage());
        });
        ex.getBindingResult().getGlobalErrors().forEach(error -> {
            errors.add(error.getObjectName() + ": " + error.getDefaultMessage());
        });

        String errorMessage = String.join("; ", errors);
        return ResponseEntity.badRequest()
                .body(ApiResponse.validationError(errorMessage));
    }

    /**
     * Handle constraints violation exception
     */
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiResponse<Void>> handleConstraintViolationException(ConstraintViolationException ex, WebRequest request) {
        log.warn("Constraint violation: {}", ex.getMessage());

        String errors = ex.getConstraintViolations()
                .stream()
                .map(ConstraintViolation::getMessage)
                .collect(Collectors.joining("; "));
        return ResponseEntity.badRequest().body(ApiResponse.validationError(errors));
    }

    /**
     * handle DB integrity violation exception
     */
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiResponse<Void>> handleDataIntegrityViolationException(DataIntegrityViolationException ex, WebRequest request) {
        log.error("Data integrity violation: {}", ex.getMessage(), ex);

        String errorMessage = "Data integrity violation";
        if (ex.getMessage() != null) {
            if (ex.getMessage().contains("email")) {
                errorMessage = "Email already exists";
            } else if (ex.getMessage().contains("name")) {
                errorMessage = "Name already exists";
            } else if (ex.getMessage().contains("foreign key")) {
                errorMessage = "Referenced data does not exist";
            }
        }

        return ResponseEntity.badRequest()
                .body(ApiResponse.error(errorMessage));
    }

    /**
     * Handle JSON interpretation exception
     */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiResponse<Void>> handleHttpMessageNotReadableException(HttpMessageNotReadableException ex, WebRequest request) {
        log.warn("JSON parsing error: {}", ex.getMessage());
        return ResponseEntity.badRequest()
                .body(ApiResponse.error("Invalid JSON format"));
    }

    /**
     * Handle method args type mismatch exception
     */
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ApiResponse<Void>> handleMethodArgumentTypeMismatchException(MethodArgumentTypeMismatchException ex, WebRequest request) {
        log.warn("Method argument type mismatch: {}", ex.getMessage());
        String errorMessage = String.format("Invalid value '%s' for parameter '%s'. Expected type: %s",
                ex.getValue(), ex.getName(), Objects.requireNonNull(ex.getRequiredType()).getSimpleName());
        return ResponseEntity.badRequest()
                .body(ApiResponse.error(errorMessage));
    }

    /**
     * handle request that does not support HTTP exception
     */
    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ApiResponse<Void>> handleHttpRequestMethodNotSupportedException(HttpRequestMethodNotSupportedException ex, WebRequest request) {
        log.warn("HTTP method not supported: {}", ex.getMessage());
        String errorMessage = String.format("HTTP method '%s' is not supported for this endpoint. Supported methods: %s",
                ex.getMethod(), String.join(", ", Objects.requireNonNull(ex.getSupportedMethods())));
        return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED)
                .body(ApiResponse.error(errorMessage));
    }

    /**
     * handle 404 exceptions
     */
    @ExceptionHandler(NoHandlerFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleNoHandlerFoundException(NoHandlerFoundException ex, WebRequest request) {
        log.warn("No handler found: {}", ex.getMessage());
        String errorMessage = String.format("Endpoint '%s %s' not found", ex.getHttpMethod(), ex.getRequestURL());
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.notFound(errorMessage));
    }

    /**
     * handle illegal args exception
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<Void>> handleIllegalArgumentException(IllegalArgumentException ex, WebRequest request) {
        log.warn("Illegal argument: {}", ex.getMessage());
        return ResponseEntity.badRequest()
                .body(ApiResponse.error(ex.getMessage()));
    }

    /**
     * handle NPE
     */
    @ExceptionHandler(NullPointerException.class)
    public ResponseEntity<ApiResponse<Void>> handleNullPointerException(NullPointerException ex, WebRequest request) {
        log.error("Null pointer exception: {}", ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("An unexpected error occurred"));
    }

    /**
     * Handle all other exceptions
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGenericException(Exception ex, WebRequest request) {
        log.error("Unexpected exception: {}", ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.internalError());
    }

    /**
     * Determine whether it is a business logic exception
     * These exceptions should return 400 instead of 500
     */
    private boolean isBusinessException(String message) {
        if (message == null) {
            return false;
        }

        String lowerMessage = message.toLowerCase();
        return  lowerMessage.contains("already exists") ||
                lowerMessage.contains("not found") ||
                lowerMessage.contains("invalid") ||
                lowerMessage.contains("cannot delete") ||
                lowerMessage.contains("must be") ||
                lowerMessage.contains("required");
    }
}