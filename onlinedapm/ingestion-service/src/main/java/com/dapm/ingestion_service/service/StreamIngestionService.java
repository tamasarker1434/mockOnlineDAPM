package com.dapm.ingestion_service.service;

import com.dapm.ingestion_service.entity.IngestedEvent;
import com.dapm.ingestion_service.repository.IngestedEventRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.util.retry.Retry;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@Service
public class StreamIngestionService {

    private static final Logger logger = LoggerFactory.getLogger(StreamIngestionService.class);
    private final WebClient.Builder webClientBuilder;
    private final KafkaProducerService producerService;
    private final IngestedEventRepository ingestedEventRepository;  //Add MongoDB repository
    private final SimpMessagingTemplate messagingTemplate;
    public StreamIngestionService(WebClient.Builder webClientBuilder,
                                  KafkaProducerService producerService,
                                  IngestedEventRepository ingestedEventRepository,
                                  SimpMessagingTemplate messagingTemplate) {
        this.webClientBuilder = webClientBuilder;
        this.producerService = producerService;
        this.ingestedEventRepository = ingestedEventRepository;
        this.messagingTemplate = messagingTemplate;
    }

    public void startIngestion(String sourceUrl) {
        WebClient webClient = webClientBuilder.baseUrl(sourceUrl).build();

        webClient.get()
                .retrieve()
                .bodyToFlux(String.class)
                .retryWhen(Retry.backoff(5, Duration.ofSeconds(2)))
                .doOnError(error -> logger.error("Error in Wikipedia stream ingestion: ", error))
                .doOnNext(event -> {
                    try {
                        //logger.info("Ingested event: {}", event);

                        //Store dynamically in MongoDB
                        Map<String, Object> rawData = new HashMap<>();
                        rawData.put("event", event);
                        rawData.put("source", sourceUrl);
                        IngestedEvent ingestedEvent = new IngestedEvent(rawData);
                        ingestedEventRepository.save(new IngestedEvent(rawData));

                        //Publish event to Kafka
                        producerService.sendEvent("raw_events", event);

                        // Broadcast the ingested event via WebSocket to topic "/topic/events"
                        messagingTemplate.convertAndSend("/topic/events", ingestedEvent);
                    } catch (Exception e) {
                        logger.error("Error processing event: ", e);
                    }
                })
                .onErrorContinue((throwable, obj) -> logger.warn("Skipped problematic event: {} due to error: {}", obj, throwable))
                .subscribe();
    }
}
