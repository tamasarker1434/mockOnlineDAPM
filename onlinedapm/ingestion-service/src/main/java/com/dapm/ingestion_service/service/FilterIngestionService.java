package com.dapm.ingestion_service.service;

import com.dapm.ingestion_service.repository.FilteredEventRepository;
import com.dapm.ingestion_service.repository.IngestedEventRepository;
import com.dapm.ingestion_service.entity.FilteredEvent;
import com.dapm.ingestion_service.entity.IngestedEvent;
import org.bson.Document;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.util.retry.Retry;

import java.time.Duration;
import java.util.Map;

@Service
public class FilterIngestionService {

    private static final Logger logger = LoggerFactory.getLogger(FilterIngestionService.class);
    private final WebClient.Builder webClientBuilder;
    private final KafkaProducerService producerService;
    private final FilteredEventRepository filteredEventRepository;
    private final IngestedEventRepository ingestedEventRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public FilterIngestionService(WebClient.Builder webClientBuilder,
                                  KafkaProducerService producerService,
                                  FilteredEventRepository filteredEventRepository,
                                  IngestedEventRepository ingestedEventRepository,
                                  SimpMessagingTemplate messagingTemplate) {
        this.webClientBuilder = webClientBuilder;
        this.producerService = producerService;
        this.filteredEventRepository = filteredEventRepository;
        this.ingestedEventRepository = ingestedEventRepository;
        this.messagingTemplate = messagingTemplate;
    }

    /**
     * Starts ingestion from the given URL and applies filter criteria.
     * All events are stored in ingested_events.
     * Events matching the criteria are stored in filtered_events and published to Kafka & WebSocket.
     */
    public void startFilterIngestion(String url, Map<String, Object> filterCriteria) {
        WebClient webClient = webClientBuilder.baseUrl(url).build();

        webClient.get()
                .retrieve()
                .bodyToFlux(String.class)
                .retryWhen(Retry.backoff(5, Duration.ofSeconds(2)))
                .doOnError(error -> logger.error("Error during ingestion: ", error))
                .doOnNext(event -> {
                    try {
                        // Convert to document
                        Document doc = Document.parse(event);
                        IngestedEvent ingestedEvent = new IngestedEvent(doc);
                        ingestedEventRepository.save(ingestedEvent);

                        boolean matches = filterCriteria.entrySet().stream()
                                .allMatch(entry -> doc.containsKey(entry.getKey()) && entry.getValue().toString().equals(doc.get(entry.getKey()).toString()));

                        if (matches) {
                            FilteredEvent filteredEvent = new FilteredEvent(doc);
                            filteredEventRepository.save(filteredEvent);
                            producerService.sendEvent("filtered_events", event);
                            messagingTemplate.convertAndSend("/topic/filtered-events", filteredEvent);
                        }
                    } catch (Exception e) {
                        logger.error("Error processing event: ", e);
                    }
                })
                .onErrorContinue((throwable, obj) ->
                        logger.warn("Skipping problematic event: {} due to error: {}", obj, throwable))
                .subscribe();
    }
}
