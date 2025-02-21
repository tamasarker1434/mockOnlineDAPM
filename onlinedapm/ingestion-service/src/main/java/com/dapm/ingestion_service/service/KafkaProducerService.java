// Corrected KafkaProducerService.java using KafkaTemplate.send() with CompletableFuture

package com.dapm.ingestion_service.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Service;
import java.util.concurrent.CompletableFuture;

@Service
public class KafkaProducerService {

    private static final Logger logger = LoggerFactory.getLogger(KafkaProducerService.class);
    private final KafkaTemplate<String, String> kafkaTemplate;

    public KafkaProducerService(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendEvent(String topic, String message) {
        try {
            CompletableFuture<SendResult<String, String>> future = kafkaTemplate.send(topic, message);

            future.whenComplete((result, ex) -> {
                if (ex != null) {
                    logger.error("Failed to send message [{}] to topic [{}]: {}", message, topic, ex.getMessage(), ex);
                } else {
                    logger.info("Message sent to topic [{}] with offset [{}]", topic, result.getRecordMetadata().offset());
                }
            });

        } catch (Exception e) {
            logger.error("Unexpected error while sending message to Kafka: ", e);
        }
    }
}
