package com.radixdict.controller;

import com.radixdict.entity.WordEntry;
import com.radixdict.repository.WordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/db/words")
public class WordController {

    @Autowired
    private WordRepository repository;
    
    // Công cụ để gọi API của Python
    private final RestTemplate restTemplate = new RestTemplate();
    
    // URL của dịch vụ Python (chạy ở port 8000)
    private final String PYTHON_ENGINE_URL = "http://localhost:8000/api/words/memory";

    @PostMapping
    public ResponseEntity<?> addWord(@RequestBody WordEntry requestEntry) {
        // 1. Lưu từ vào Database trước để lấy ID (Logical Offset)
        WordEntry savedEntry = repository.save(requestEntry);
        
        // 2. Chuẩn bị gói dữ liệu gửi sang Python
        Map<String, Object> pythonPayload = new HashMap<>();
        pythonPayload.put("word", savedEntry.getWord());
        pythonPayload.put("offset", savedEntry.getId()); // Gửi ID làm offset
        
        // 3. Gọi API Python để cập nhật cây Radix trên RAM
        try {
            restTemplate.postForEntity(PYTHON_ENGINE_URL, pythonPayload, String.class);
        } catch (Exception e) {
            // Rollback hoặc ghi log nếu Python đang sập
            System.err.println("Lỗi đồng bộ với Trie Engine: " + e.getMessage());
        }
        
        return ResponseEntity.ok(savedEntry);
    }
}