package com.radixdict.repository;

import com.radixdict.entity.WordEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WordRepository extends JpaRepository<WordEntry, Long> {
    WordEntry findByWord(String word); 
}