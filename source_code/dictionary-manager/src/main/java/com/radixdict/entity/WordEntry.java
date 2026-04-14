package com.radixdict.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "word_entry")
public class WordEntry {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Đây chính là "offset" mà Python sẽ lưu
    
    @Column(unique = true, nullable = false)
    private String word;
    
    @Column(columnDefinition = "TEXT")
    private String meaning;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getWord() { return word; }
    public void setWord(String word) { this.word = word; }
    public String getMeaning() { return meaning; }
    public void setMeaning(String meaning) { this.meaning = meaning; }
}