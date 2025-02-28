package com.dapm.ingestion_service.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.Map;

@Document(collection = "ingested_events")
public class IngestedEvent {

    @Id
    private String id;
    private Map<String, Object> rawData; // Store dynamic data
    private LocalDateTime receivedAt;

    public IngestedEvent() {}

    public IngestedEvent(Map<String, Object> rawData) {
        this.rawData = rawData;
        this.receivedAt = LocalDateTime.now();
    }

    public String getId() { return id; }
    public Map<String, Object> getRawData() { return rawData; }
    public LocalDateTime getReceivedAt() { return receivedAt; }
}
