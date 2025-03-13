package com.example.demo.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "filtered_events_demo")
public class FilteredEvent {

    @Id
    private String id;
    private String message;
    private LocalDateTime consumedAt;

    public FilteredEvent() {
        this.consumedAt = LocalDateTime.now();
    }

    public FilteredEvent(String message) {
        this.message = message;
        this.consumedAt = LocalDateTime.now();
    }

    // Getters and setters
    public String getId() {
        return id;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public LocalDateTime getConsumedAt() {
        return consumedAt;
    }

    public void setConsumedAt(LocalDateTime consumedAt) {
        this.consumedAt = consumedAt;
    }
}
