import React, { useState, useEffect } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { Table, TableHead, TableBody, TableRow, TableCell, Paper, Typography } from '@mui/material';

const RealtimeTable = function() {
    const [events, setEvents] = useState([]);

    useEffect(function() {
        // Create a SockJS connection to your Spring Boot WebSocket endpoint
        var socket = new SockJS('http://localhost:8080/ws');
        var stompClient = new Client({
            webSocketFactory: function() { return socket; },
            debug: function(str) { console.log(str); },
            onConnect: function() {
                console.log('Connected to WebSocket');
                // Subscribe to /topic/events
                stompClient.subscribe('/topic/events', function(message) {
                    if (message.body) {
                        try {
                            var eventData = JSON.parse(message.body);
                            setEvents(function(prevEvents) {
                                return prevEvents.concat(eventData);
                            });
                        } catch (error) {
                            console.error('Error parsing WebSocket message:', error);
                        }
                    }
                });
            },
            onStompError: function(frame) {
                console.error('Broker error: ' + frame.headers['message']);
                console.error('Details: ' + frame.body);
            }
        });
        stompClient.activate();

        // Cleanup on unmount
        return function cleanup() {
            stompClient.deactivate();
        };
    }, []);

    // Build the table header
    var header = React.createElement(
        TableHead,
        null,
        React.createElement(
            TableRow,
            null,
            React.createElement(TableCell, null, 'ID'),
            React.createElement(TableCell, null, 'Raw Data'),
            React.createElement(TableCell, null, 'Received At')
        )
    );

    // Build the table body
    var body = React.createElement(
        TableBody,
        null,
        events.map(function(event, index) {
            return React.createElement(
                TableRow,
                { key: index },
                React.createElement(TableCell, null, event.id),
                React.createElement(
                    TableCell,
                    null,
                    React.createElement(
                        'pre',
                        { style: { margin: 0 } },
                        JSON.stringify(event.rawData, null, 2)
                    )
                ),
                React.createElement(TableCell, null, event.receivedAt)
            );
        })
    );

    // Build the table element
    var table = React.createElement(
        Table,
        null,
        header,
        body
    );

    // Wrap in a Paper component with a title
    return React.createElement(
        Paper,
        { style: { padding: 20, margin: 20 } },
        React.createElement(
            Typography,
            { variant: "h6", gutterBottom: true },
            "Real-Time Ingested Events"
        ),
        table
    );
};

export default RealtimeTable;
