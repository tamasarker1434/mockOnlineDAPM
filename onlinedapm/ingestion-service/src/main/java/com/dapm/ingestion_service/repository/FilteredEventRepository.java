package com.dapm.ingestion_service.repository;

import com.dapm.ingestion_service.entity.FilteredEvent;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FilteredEventRepository extends MongoRepository<FilteredEvent, String> {
}
