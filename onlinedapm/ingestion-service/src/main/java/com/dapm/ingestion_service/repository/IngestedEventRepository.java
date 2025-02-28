package com.dapm.ingestion_service.repository;

import com.dapm.ingestion_service.entity.IngestedEvent;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IngestedEventRepository extends MongoRepository<IngestedEvent, String> {
}
