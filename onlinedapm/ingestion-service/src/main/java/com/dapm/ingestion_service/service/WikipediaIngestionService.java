package com.dapm.ingestion_service.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.util.retry.Retry;
import java.time.Duration;

@Service
public class WikipediaIngestionService {

    private static final Logger logger = LoggerFactory.getLogger(WikipediaIngestionService.class);
    private final WebClient.Builder webClientBuilder;

    public WikipediaIngestionService(WebClient.Builder webClientBuilder) {
        this.webClientBuilder = webClientBuilder;
    }

    public void startIngestion(KafkaProducerService producerService, String wikiUrl) {
        WebClient webClient = webClientBuilder.baseUrl(wikiUrl).build();

        webClient.get()
                .retrieve()
                .bodyToFlux(String.class)
                .retryWhen(Retry.backoff(5, Duration.ofSeconds(2)))
                .doOnError(error -> logger.error("Error in Wikipedia stream ingestion: ", error))
                .doOnNext(event -> {
                    try {
                        logger.info("Ingested event: {}", event);
                        producerService.sendEvent("raw_events", event);
                    } catch (Exception e) {
                        logger.error("Error processing event: ", e);
                    }
                })
                .onErrorContinue((throwable, obj) -> logger.warn("Skipped problematic event: {} due to error: {}", obj, throwable))
                .subscribe();
    }
}
