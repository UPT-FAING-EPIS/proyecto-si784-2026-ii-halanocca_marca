package com.cloudscope.infrastructure.adapters.in.web;

import com.cloudscope.infrastructure.adapters.out.persistence.jpa.SpringDataUserRepository;
import com.cloudscope.infrastructure.adapters.out.persistence.jpa.UserEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.io.File;
import java.io.RandomAccessFile;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.lang.management.ManagementFactory;
import com.sun.management.OperatingSystemMXBean;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = {"*"})
public class AdminController {

    private final SpringDataUserRepository userRepository;

    public AdminController(SpringDataUserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/users")
    public ResponseEntity<?> getUsers() {
        List<UserEntity> users = userRepository.findAll();
        List<Map<String, Object>> response = new ArrayList<>();
        for (UserEntity u : users) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", u.getId());
            map.put("name", u.getFirstName() + " " + u.getLastName());
            map.put("email", u.getEmail());
            map.put("role", u.getPassword().equals("google_sso_oauth_placeholder") ? "viewer" : "user");
            map.put("lastLogin", new Date()); // Simulated, we do not store lastLogin right now
            response.add(map);
        }
        // Always include demo admin for the UI
        response.add(Map.of("id", "admin", "name", "Admin User", "email", "admin", "role", "admin", "lastLogin", new Date()));
        return ResponseEntity.ok(response);
    }

    @GetMapping("/metrics")
    public ResponseEntity<?> getMetrics() {
        OperatingSystemMXBean osBean = ManagementFactory.getPlatformMXBean(OperatingSystemMXBean.class);
        double cpu = osBean.getCpuLoad();
        if (cpu < 0) cpu = 0.0;
        
        long totalMem = osBean.getTotalMemorySize();
        long freeMem = osBean.getFreeMemorySize();
        double memory = ((double) (totalMem - freeMem) / totalMem) * 100;

        Map<String, Object> metrics = new HashMap<>();
        metrics.put("cpu", Math.round(cpu * 100));
        metrics.put("memory", Math.round(memory));
        metrics.put("network", (int) (Math.random() * 30 + 10)); // simulated bandwidth
        metrics.put("requests", (int) (Math.random() * 5)); // simulated RPS
        metrics.put("errors", 0);
        metrics.put("dbConnections", 1);
        metrics.put("activeUsers", userRepository.count() + 1);
        metrics.put("uptime", ManagementFactory.getRuntimeMXBean().getUptime() / 1000);
        
        return ResponseEntity.ok(metrics);
    }

    @GetMapping("/logs")
    public ResponseEntity<?> getLogs() {
        List<Map<String, Object>> logs = new ArrayList<>();
        File file = new File("logs/cloudscope.log");
        if (!file.exists()) {
            return ResponseEntity.ok(logs);
        }
        
        try (RandomAccessFile raf = new RandomAccessFile(file, "r")) {
            long fileLength = raf.length();
            long position = fileLength - 1;
            int lines = 0;
            StringBuilder builder = new StringBuilder();
            
            while (position >= 0 && lines < 50) {
                raf.seek(position);
                int c = raf.read();
                if (c == '\n') {
                    if (builder.length() > 0) {
                        String line = builder.reverse().toString();
                        Map<String, Object> logMap = parseLogLine(line);
                        if (logMap != null) {
                            logs.add(0, logMap); // Add to beginning to keep chronological order
                            lines++;
                        }
                        builder.setLength(0);
                    }
                } else if (c != '\r') {
                    builder.append((char) c);
                }
                position--;
            }
            if (builder.length() > 0) {
                String line = builder.reverse().toString();
                Map<String, Object> logMap = parseLogLine(line);
                if (logMap != null) {
                    logs.add(0, logMap);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return ResponseEntity.ok(logs);
    }

    private Map<String, Object> parseLogLine(String line) {
        // Simple regex to extract Spring Boot log parts
        // 2026-09-29T16:28:05.000Z  INFO 1 --- [main] c.c.CloudscopeApplication : Started CloudscopeApplication
        try {
            Map<String, Object> log = new HashMap<>();
            log.put("id", UUID.randomUUID().toString().substring(0, 8));
            
            String type = "DEBUG";
            if (line.contains(" ERROR ")) type = "ERROR";
            else if (line.contains(" WARN ")) type = "WARN";
            else if (line.contains(" INFO ")) type = "INFO";
            
            String source = "System";
            if (line.contains("tomcat")) source = "Tomcat";
            if (line.contains("postgres") || line.contains("hibernate") || line.contains("jdbc")) source = "Database";
            if (line.contains("Security")) source = "Auth";
            if (line.contains("Project")) source = "Storage";
            if (line.contains("Controller")) source = "API";
            
            log.put("type", type);
            log.put("source", source);
            log.put("message", line.length() > 150 ? line.substring(0, 150) + "..." : line);
            log.put("timestamp", new Date()); // Simplification
            log.put("requestId", "-");
            return log;
        } catch (Exception e) {
            return null;
        }
    }
}

