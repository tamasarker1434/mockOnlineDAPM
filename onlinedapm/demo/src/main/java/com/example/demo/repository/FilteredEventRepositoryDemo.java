package com.example.demo.repository;

import com.example.demo.model.FilteredEvent;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FilteredEventRepositoryDemo extends MongoRepository<FilteredEvent, String> {
    // Additional query methods (if needed)
}
