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
@CrossOrigin(origins = "*")
public class WordController {

    @Autowired
    private WordRepository repository;
    
    private final RestTemplate restTemplate = new RestTemplate();
    
    private final String PYTHON_ENGINE_URL = "http://trie-engine:8000/api/words/memory";
    
    @PostMapping
    public ResponseEntity<?> addWord(@RequestBody WordEntry requestEntry) {
        // 1. Chuẩn hóa: Ép chuỗi thành chữ thường và cắt khoảng trắng
        String normalizedWord = requestEntry.getWord().toLowerCase().trim();
        
        // 2. Tìm xem từ này đã tồn tại trong DB chưa
        WordEntry existingEntry = repository.findByWord(normalizedWord);
        WordEntry savedEntry;
        
        if (existingEntry != null) {
            // NẾU ĐÃ CÓ: Chỉ cập nhật nghĩa tiếng Việt
            existingEntry.setMeaning(requestEntry.getMeaning());
            savedEntry = repository.save(existingEntry);
        } else {
            // NẾU CHƯA CÓ: Thêm mới hoàn toàn
            requestEntry.setWord(normalizedWord);
            savedEntry = repository.save(requestEntry);
        }
        
        // 3. Gọi Python để cập nhật/hồi sinh từ trên RAM
        Map<String, Object> pythonPayload = new HashMap<>();
        pythonPayload.put("word", savedEntry.getWord());
        pythonPayload.put("offset", savedEntry.getId());
        
        try {
            restTemplate.postForEntity(PYTHON_ENGINE_URL, pythonPayload, String.class);
        } catch (Exception e) {
            System.err.println("Lỗi đồng bộ Trie Engine: " + e.getMessage());
        }
        
        return ResponseEntity.ok(savedEntry);
    }
}