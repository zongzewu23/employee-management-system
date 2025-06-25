package edu.uw.cs.zongzewu.employee_management_system.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.Page;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApiResponse<T> {

    private boolean success;
    private String message;
    private T data;
    private String error;
    private LocalDateTime timeStamp;

    /**
     * Private constructor, forced to use static method to create
     *
     * @param success
     * @param message
     * @param data
     * @param error
     */
    private ApiResponse(boolean success, String message, T data, String error) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.error = error;
        this.timeStamp = LocalDateTime.now();
    }

    /**
     * Success response with data
     */
    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(true, "Success", data, null);
    }

    /**
     * success with data and message
     *
     * @param message
     * @param data
     * @param <T>
     * @return
     */
    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(true, message, data, null);
    }

    /**
     * success with only a message
     *
     * @param message
     * @param <T>
     * @return
     */
    public static <T> ApiResponse<T> success(String message) {
        return new ApiResponse<>(true, message, null, null);
    }

    /**
     * fail with error
     *
     * @param error
     * @param <T>
     * @return
     */
    public static <T> ApiResponse<T> error(String error) {
        return new ApiResponse<>(false, null, null, error);
    }

    /**
     * fail with message and error
     *
     * @param message
     * @param error
     * @param <T>
     * @return
     */
    public static <T> ApiResponse<T> error(String message, String error) {
        return new ApiResponse<>(false, message, null, error);
    }

    /**
     * Creating an error response from an exception
     *
     * @param exception
     * @param <T>
     * @return
     */
    public static <T> ApiResponse<T> error(Exception exception) {
        return new ApiResponse<>(false, "An error occurred", null, exception.getMessage());
    }

    /**
     * validation response failure
     *
     * @param error
     * @param <T>
     * @return
     */
    public static <T> ApiResponse<T> validationError(String error) {
        return new ApiResponse<>(false, "Validation failed", null, error);
    }

    /**
     * no resource found
     */
    public static <T> ApiResponse<T> notFound(String resource) {
        return new ApiResponse<>(false, "Resource not found", null, resource + " not found");
    }

    /**
     * no authorization
     */
    public static <T> ApiResponse<T> unauthorized() {
        return new ApiResponse<>(false, "Unauthorized", null, "Access denied");
    }

    /**
     * no authorization with message
     */
    public static <T> ApiResponse<T> unauthorized(String message) {
        return new ApiResponse<>(false, "Unauthorized", null, message);
    }

    /**
     * access forbidden
     */
    public static <T> ApiResponse<T> forbidden() {
        return new ApiResponse<>(false, "Forbidden", null, "Access forbidden");
    }

    /**
     * server internal error response
     */
    public static <T> ApiResponse<T> internalError() {
        return new ApiResponse<>(false, "Internal server error", null, "Something went wrong");
    }

    public static <T> ApiResponse<PageResponse<T>> paged(PageResponse<T> pageData) {
        return new ApiResponse<>(true, "Success", pageData, null);
    }

    /**
     * page response data structure
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PageResponse<T> {
        private List<T> content;
        private int page;
        private int size;
        private long totalElements;
        private int totalPages;
        private boolean first;
        private boolean last;

        /**
         * create form Spring Data Page object
         */
        public static <T> PageResponse<T> from(Page<T> page) {
            return new PageResponse<>(
                    page.getContent(),
                    page.getNumber(),
                    page.getSize(),
                    page.getTotalElements(),
                    page.getTotalPages(),
                    page.isFirst(),
                    page.isLast()
            );
        }
    }
}
