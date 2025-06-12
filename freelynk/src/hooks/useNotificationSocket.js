"use client";
import { useEffect, useRef, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export default function useNotificationSocket(userId, onMessage) {
    const clientRef = useRef(null);
    const reconnectTimeoutRef = useRef(null);

    const connect = useCallback(() => {
        if (!userId) return;

        // Nettoyer la connexion existante
        if (clientRef.current) {
            clientRef.current.deactivate();
        }

        const client = new Client({
            webSocketFactory: () => new SockJS(`${process.env.NEXT_PUBLIC_BACKEND_URL}/ws`),

            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,

            onConnect: (frame) => {
                console.log('✅ Connecté au WebSocket:', frame);

                // S'abonner aux notifications
                const subscription = client.subscribe(`/topic/notifications/${userId}`, (message) => {
                    console.log('Notification reçue:', message.body);
                    if (message.body) {
                        try {
                            const notification = JSON.parse(message.body);
                            onMessage(notification);
                        } catch (error) {
                            console.error('Erreur parsing notification:', error);
                        }
                    }
                });

                console.log('🔔 Abonné aux notifications pour:', userId);
            },

            onStompError: (frame) => {
                console.error(' Erreur STOMP:', frame.headers['message']);
                console.error('Détails:', frame.body);
            },

            onWebSocketError: (error) => {
                console.error(' Erreur WebSocket:', error);
            },

            onDisconnect: () => {
                console.log(' Déconnecté du WebSocket');
            },

            // Désactiver les logs de debug en production
            debug: (str) => {
                if (process.env.NODE_ENV === 'development') {
                    console.log('STOMP Debug:', str);
                }
            }
        });

        clientRef.current = client;

        try {
            client.activate();
        } catch (error) {
            console.error('Erreur lors de l\'activation:', error);
        }

    }, [userId, onMessage]);

    useEffect(() => {
        connect();

        // Cleanup function
        return () => {
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
            if (clientRef.current) {
                console.log('🧹 Nettoyage de la connexion WebSocket');
                clientRef.current.deactivate();
            }
        };
    }, [connect]);

    // Fonction pour reconnecter manuellement
    const reconnect = useCallback(() => {
        console.log('🔄 Reconnexion manuelle...');
        connect();
    }, [connect]);

    return { reconnect };
}