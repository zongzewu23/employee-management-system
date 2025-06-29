package edu.uw.cs.zongzewu.employee_management_system.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.task.AsyncTaskExecutor;
import org.springframework.format.FormatterRegistry;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.servlet.config.annotation.PathMatchConfigurer;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.util.UrlPathHelper;

import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * Web configuration class
 * Configure JSON serialization, static resources, format conversion, etc.
 * Used with CorsConfig
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {
    /**
     * Configure Jackson ObjectMapper
     * Handle JSON serialization and deserialization
     */
    @Bean
    public ObjectMapper objectMapper() {
        return Jackson2ObjectMapperBuilder.json()
                .modules(new JavaTimeModule())
                .propertyNamingStrategy(PropertyNamingStrategies.LOWER_CAMEL_CASE)
                .simpleDateFormat("yyyy-MM-dd HH:mm:ss")
                .build();
    }

    /**
     * configure HTTP message converter
     * Using a custom ObjectMapper
     */
    @Override
    public void configureMessageConverters(List<HttpMessageConverter<?>> converters) {
        MappingJackson2HttpMessageConverter converter = new MappingJackson2HttpMessageConverter();
        converter.setObjectMapper(objectMapper());
        converters.add(0, converter);
    }

    /**
     * configure static resource handling
     * provides service for frontend file construction
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/static/**")
                .addResourceLocations("classpath:/static/");

        registry.addResourceHandler("/images/**")
                .addResourceLocations("classpath:/static/images/");

        registry.addResourceHandler("/assets/**")
                .addResourceLocations("classpath:/static/assets/");

        registry.addResourceHandler("/favicon.ico")
                .addResourceLocations("classpath:/static/");

        System.out.println("Static resource handlers configured");
    }

    /**
     * Configure a custom format converter
     * Process the type conversion of request parameters
     */
    @Override
    public void addFormatters(FormatterRegistry registry) {
        // date
        registry.addConverter(String.class, java.time.LocalDate.class, source -> {
            if (source == null || source.isEmpty()) {
                return null;
            }
            return java.time.LocalDate.parse(source, DateTimeFormatter.ISO_LOCAL_DATE);
        });

        registry.addConverter(String.class, java.time.LocalDateTime.class, source -> {
            if (source == null || source.isEmpty()) {
                return null;
            }
            return java.time.LocalDateTime.parse(source, DateTimeFormatter.ISO_LOCAL_DATE_TIME);
        });

        // Configure the enumeration converter (case insensitive)
        registry.addConverter(String.class, edu.uw.cs.zongzewu.employee_management_system.entity.Employee.EmployeeStatus.class, source -> {
            if (source == null || source.isEmpty()) {
                return null;
            }
            try {
                return edu.uw.cs.zongzewu.employee_management_system.entity.Employee.EmployeeStatus.valueOf(source.toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid employee status: " + source +
                        ". Valid values are: ACTIVE, INACTIVE, TERMINATED");
            }
        });

        System.out.println("Custom formatters configured");
    }

    /**
     * Configures path matching.
     * Enables advanced features such as matrix variables.
     */
    @Override
    public void configurePathMatch(PathMatchConfigurer configurer) {
        // Enable matrix variable support in Spring 6.0+
        // 'setRemoveSemicolonContent' was moved from PathMatchConfigurer to UrlPathHelper.
        UrlPathHelper urlPathHelper = new UrlPathHelper();
        urlPathHelper.setRemoveSemicolonContent(false); // This is where the method now lives.
        configurer.setUrlPathHelper(urlPathHelper); // Set the custom helper on the configurer.

        // 'setUseTrailingSlashMatch' is deprecated in Spring 6.0 and Spring Boot 3.
        // It is recommended to use explicit mappings in your controller,
        // e.g., @GetMapping({"/users", "/users/"})
        // or configure a redirect/rewrite solution.
        // The default behavior is now to not match trailing slashes.
        // The following line is for demonstration purposes but is deprecated:
        // configurer.setUseTrailingSlashMatch(true);

        System.out.println("Path matching configured");
    }


    /**
     * Configure content negotiation
     * Support responses in different formats (JSON, XML, etc.)
     */
    @Override
    public void configureContentNegotiation(org.springframework.web.servlet.config.annotation.ContentNegotiationConfigurer configurer) {
        configurer
                .favorParameter(false) // Do not use request parameter for content negotiation
                // .favorPathExtension(false) // This method is deprecated and should be removed.
                .ignoreAcceptHeader(false) // Use the 'Accept' header for content negotiation
                .defaultContentType(org.springframework.http.MediaType.APPLICATION_JSON) // Default to JSON
                .mediaType("json", org.springframework.http.MediaType.APPLICATION_JSON)
                .mediaType("xml", org.springframework.http.MediaType.APPLICATION_XML);

        System.out.println("Content negotiation configured");
    }

    /**
     * Configure the view resolver (if server-side rendering is required)
     */
    /*
    @Override
    public void configureViewResolvers(ViewResolverRegistry registry) {
        registry.jsp("/WEB-INF/views/", ".jsp");
    }
    */

    /**
     * Configuring asynchronous request processing
     */
    @Override
    public void configureAsyncSupport(org.springframework.web.servlet.config.annotation.AsyncSupportConfigurer configurer) {
        configurer.setDefaultTimeout(30000); // 30 秒超时
        configurer.setTaskExecutor(taskExecutor());

        System.out.println("Async support configured");
    }

    /**
     * Asynchronous Task Executor
     */
    @Bean
    public AsyncTaskExecutor taskExecutor() {
        org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor executor =
                new org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor();
        executor.setCorePoolSize(5);
        executor.setMaxPoolSize(10);
        executor.setQueueCapacity(100);
        executor.setThreadNamePrefix("ems-async-");
        executor.initialize();
        return executor;
    }

    /**
     * Configure interceptors (if needed)
     */
    /*
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new LoggingInterceptor())
                .addPathPatterns("/api/**")
                .excludePathPatterns("/api/auth/**");
    }
    */

    /**
     * Configure parameter parser (if custom parameter parsing is required)
     */
    /*
    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> resolvers) {
        resolvers.add(new CurrentUserArgumentResolver());
    }
    */
}
