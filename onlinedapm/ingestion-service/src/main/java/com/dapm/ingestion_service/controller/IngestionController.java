package com.dapm.ingestion_service.controller;

import com.dapm.ingestion_service.service.WikipediaIngestionService;
import com.dapm.ingestion_service.service.KafkaProducerService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class IngestionController {

    private final WikipediaIngestionService ingestionService;
    private final KafkaProducerService producerService;

    public IngestionController(WikipediaIngestionService ingestionService, KafkaProducerService producerService) {
        this.ingestionService = ingestionService;
        this.producerService = producerService;
    }

    @GetMapping("/start-ingestion")
    public String startIngestion() {
        ingestionService.startIngestion(producerService);
        return "Wikipedia event ingestion started!";
    }
}
