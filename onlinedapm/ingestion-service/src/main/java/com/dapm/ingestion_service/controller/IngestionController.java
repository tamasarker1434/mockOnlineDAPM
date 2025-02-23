package com.dapm.ingestion_service.controller;

import com.dapm.ingestion_service.service.WikipediaIngestionService;
import com.dapm.ingestion_service.service.KafkaProducerService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.Map;
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/ingestion") // Keep endpoint organized under /ingestion
public class IngestionController {

    private final WikipediaIngestionService ingestionService;
    private final KafkaProducerService producerService;

    public IngestionController(WikipediaIngestionService ingestionService, KafkaProducerService producerService) {
        this.ingestionService = ingestionService;
        this.producerService = producerService;
    }

    @PostMapping("/start-ingestion")  // Changed from GET to POST to accept request body
    public ResponseEntity<String> startIngestion(@RequestBody Map<String, String> request) {
        String wikiUrl = request.get("url");

        if (wikiUrl == null || wikiUrl.isEmpty()) {
            return ResponseEntity.badRequest().body("Error: Wikipedia URL is required.");
        }

        ingestionService.startIngestion(producerService, wikiUrl);
        return ResponseEntity.ok("Ingestion started for URL: " + wikiUrl);
    }
}
