import React, { useState, useEffect, useCallback } from 'react';
import { View, Alert, ActivityIndicator } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { useRoute } from '@react-navigation/native';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase'; // Importe sua configuração do Firebase aqui

export default function Chat() {
    const [messages, setMessages] = useState([]);
    const route = useRoute();
    const { userId, userName } = route.params;

    const [loading, setLoading] = useState(true); // Estado para controlar o ActivityIndicator

    useEffect(() => {
        const unsubscribe = carregarMensagens();
        return () => unsubscribe();
    }, []);

   const carregarMensagens = () => {
    const chatQuery = query(collection(db, 'chats'), orderBy('createdAt', 'desc'));
    return onSnapshot(chatQuery, (snapshot) => {
        const loadedMessages = snapshot.docs.map(doc => ({
            _id: doc.id,
            createdAt: doc.data().createdAt ? doc.data().createdAt.toDate() : new Date(), // Verificação para evitar null
            text: doc.data().text,
            user: doc.data().user,
        }));
        setMessages(loadedMessages); 
        setLoading(false); // Defina o estado de carregamento como falso quando as mensagens forem carregadas
    });
};


    const enviarMensagem = useCallback((messages = []) => {
        if (messages.length > 0) {
            const newMessage = messages[0];

            try {
                // Adicione a data de criação da mensagem
                const messageToAdd = {
                    ...newMessage,
                    createdAt: serverTimestamp(),
                };

                // Adicione a mensagem ao Firestore
                salvarConversaFirestore(userId, userName, messageToAdd);

            } catch (error) {
                console.error("Erro ao enviar mensagem para o Firebase:", error);
            }
        }
    }, [userId, userName]);

    // Salvar mensagem no Firestore
    async function salvarConversaFirestore(userId, userName, message) {
        try {
            await addDoc(collection(db, "chats"), {
                userId: userId,
                text: message.text,
                createdAt: message.createdAt,
                user: message.user,
                userName: userName,
            });
            Alert.alert('Mensagem', 'Mensagem enviada com sucesso!');
        } catch (e) {
            Alert.alert('Erro', 'Erro ao enviar mensagem');
        }
    }

    return (
        <View style={{ flex: 1, padding: 10 }}>
            {loading ? (
                <ActivityIndicator size="large" color="#00BFFF" /> // Exibe o ActivityIndicator enquanto as mensagens estão sendo carregadas
            ) : (
                <GiftedChat
                    messages={messages}
                    onSend={enviarMensagem}
                    user={{
                        _id: userId,
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
            )}
        </View>
    );
}
