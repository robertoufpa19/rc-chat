import React, { useState, useEffect, useCallback } from 'react';
import { View } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { useRoute } from '@react-navigation/native';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { database } from '../config/firebase'; // Importe sua configuração do Firebase aqui

export default function Chat() {
    const [messages, setMessages] = useState([]);
    const route = useRoute();
    const { id, name } = route.params;

   
    console.warn("id: "+id+ "- usuario: "+ name);

    useEffect(() => {
        async function getMessages() {
            const values = query(collection(database, 'chats'), orderBy('createdAt', 'desc'));

            onSnapshot(values, (snapshot) => {
                setMessages(snapshot.docs.map(doc => ({
                    _id: doc.id,
                    createdAt: doc.data().createdAt.toDate(),
                    text: doc.data().text,
                    user: doc.data().user,
                })));
            });
        }
        getMessages();
    }, []);

    const mensagemEnviada = useCallback((messages = []) => {
        if (messages.length > 0) {
            const newMessage = messages[0];

            setMessages(previousMessages => GiftedChat.append(previousMessages, newMessage));

            try {
                // Adicione a data de criação da mensagem
                const messageToAdd = {
                    ...newMessage,
                    createdAt: serverTimestamp()
                };

                // Adicione a mensagem ao Firestore
                addDoc(collection(database, "chats"), messageToAdd);
            } catch (error) {
                console.error("Erro ao enviar mensagem para o Firebase:", error);
            }
        }
    }, []);

    return (
        <View style={{ flex: 1, padding: 10 }}>
            <GiftedChat
                messages={messages}
                onSend={mensagemEnviada}
                user={{
                    _id: name,
                }}
            placeholder="Digite uma mensagem..."
            renderAvatar={null} // Não exibe avatares
            renderBubble={(props) => ( // Personaliza o estilo das bolhas de mensagem
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: '#0084ff', // Cor de fundo das mensagens enviadas
                    },
                    left: {
                        backgroundColor: '#f0f0f0', // Cor de fundo das mensagens recebidas
                    },
                }}
            />
        )}

            />
        </View>
    );
}
