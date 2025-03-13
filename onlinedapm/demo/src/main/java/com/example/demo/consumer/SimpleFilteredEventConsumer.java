package com.example.demo.consumer;

import com.example.demo.model.FilteredEvent;
import com.example.demo.repository.FilteredEventRepositoryDemo;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.time.Duration;
import java.util.Collections;
import java.util.Properties;

@Component
public class SimpleFilteredEventConsumer implements CommandLineRunner {

    @Value("${spring.kafka.bootstrap-servers}")
    private String bootstrapServers;

    private final FilteredEventRepositoryDemo filteredEventRepositoryDemo;

    public SimpleFilteredEventConsumer(FilteredEventRepositoryDemo filteredEventRepository) {
        this.filteredEventRepositoryDemo = filteredEventRepository;
    }

    @Override
    public void run(String... args) {
        // Set up properties for the Kafka consumer
        Properties props = new Properties();
        // Use the injected bootstrap servers (should be "kafka:9092" in your docker-compose)
        props.setProperty("bootstrap.servers", bootstrapServers);
        props.setProperty("group.id", "dapm2-consumer-group");
        props.setProperty("key.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");
        props.setProperty("value.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");
        props.setProperty("auto.offset.reset", "earliest");

        KafkaConsumer<String, String> consumer = new KafkaConsumer<>(props);
        // Subscribe to the "filtered_events" topic
        consumer.subscribe(Collections.singletonList("filtered_events"));

        // Start a background thread to consume messages
        Thread consumerThread = new Thread(() -> {
            try {
                while (true) {
                    ConsumerRecords<String, String> records = consumer.poll(Duration.ofMillis(100));
                    for (ConsumerRecord<String, String> record : records) {
                        // Create a new FilteredEvent and save it into MongoDB
                        FilteredEvent event = new FilteredEvent(record.value());
                        filteredEventRepositoryDemo.save(event);
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                consumer.close();
            }
        });
        consumerThread.setDaemon(true); // so it doesn't block application shutdown
        consumerThread.start();
    }
}
