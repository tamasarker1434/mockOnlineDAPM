package com.dapm.ingestion_service.controller;

import com.dapm.ingestion_service.service.StreamIngestionService;
import com.dapm.ingestion_service.service.KafkaProducerService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.Map;
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/ingestion") // Keep endpoint organized under /ingestion
public class IngestionController {

    private final StreamIngestionService ingestionService;
    private final KafkaProducerService producerService;

    public IngestionController(StreamIngestionService ingestionService, KafkaProducerService producerService) {
        this.ingestionService = ingestionService;
        this.producerService = producerService;
    }

    @PostMapping("/start-ingestion")  // Changed from GET to POST to accept request body
    public ResponseEntity<String> startIngestion(@RequestBody Map<String, String> request) {
        String sourceUrl = request.get("url");

        if (sourceUrl == null || sourceUrl.isEmpty()) {
            return ResponseEntity.badRequest().body("Error: Wikipedia URL is required.");
        }

        ingestionService.startIngestion(producerService, sourceUrl);
        return ResponseEntity.ok("Ingestion started for URL: " + sourceUrl);
    }
}
