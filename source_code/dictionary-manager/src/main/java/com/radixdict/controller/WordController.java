@RestController
@RequestMapping("/api/db/words")
@CrossOrigin(origins = "*") // Giải quyết lỗi CORS đỏ lòm ở Console
public class WordController {
    @Autowired
    private WordRepository repository;
    
    private final RestTemplate restTemplate = new RestTemplate();
    
    // GỌI ĐÚNG ĐỊA CHỈ PYTHON TRÊN RENDER
    private final String PYTHON_ENGINE_URL = "https://radix-dictionary-2.onrender.com/api/words/memory";

    @PostMapping
    public ResponseEntity<?> addWord(@RequestBody WordEntry requestEntry) {
        // Chuẩn hóa chữ thường
        String normalizedWord = requestEntry.getWord().toLowerCase().trim();
        WordEntry existingEntry = repository.findByWord(normalizedWord);
        WordEntry savedEntry;
        
        if (existingEntry != null) {
            existingEntry.setMeaning(requestEntry.getMeaning());
            savedEntry = repository.save(existingEntry);
        } else {
            requestEntry.setWord(normalizedWord);
            savedEntry = repository.save(requestEntry);
        }

        Map<String, Object> pythonPayload = new HashMap<>();
        pythonPayload.put("word", savedEntry.getWord());
        pythonPayload.put("offset", savedEntry.getId());

        try {
            // Java gọi sang Python để cập nhật RAM
            this.restTemplate.postForEntity(PYTHON_ENGINE_URL, pythonPayload, String.class);
        } catch (Exception e) {
            System.err.println("Lỗi đồng bộ Trie Engine: " + e.getMessage());
        }
        return ResponseEntity.ok(savedEntry);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getWordById(@PathVariable Long id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}