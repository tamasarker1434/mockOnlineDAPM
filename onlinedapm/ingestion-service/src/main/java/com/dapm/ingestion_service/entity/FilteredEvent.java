package com.dapm.ingestion_service.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.Map;

@Document(collection = "filtered_events")
public class FilteredEvent {

    @Id
    private String id;
    private Map<String, Object> rawData;
    private LocalDateTime filteredAt;

    public FilteredEvent() {
        this.filteredAt = LocalDateTime.now();
    }

    public FilteredEvent(Map<String, Object> rawData) {
        this.rawData = rawData;
        this.filteredAt = LocalDateTime.now();
    }

    public String getId() {
        return id;
    }

    public Map<String, Object> getRawData() {
        return rawData;
    }

    public LocalDateTime getFilteredAt() {
        return filteredAt;
    }
}
