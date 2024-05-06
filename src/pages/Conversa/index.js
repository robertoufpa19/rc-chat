import React, { useState, useEffect } from 'react';
import { Text, Alert, FlatList, View, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { collection, getDocs, query, orderBy, limit, getDoc } from "firebase/firestore"; 
import { db} from "../config/firebase";
import { getAuth } from "firebase/auth";
import { Divider } from '@rneui/themed';

import { Avatar, Icon } from '@rneui/themed';

export default function App({ navigation }) {
  const [userList, setUserList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function buscarUserList() {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const users = [];
        const auth = getAuth();
        const currentUser = auth.currentUser;

        for await (const doc of querySnapshot.docs) {
          const lastMessage = await getLastMessage(doc.id); // Obter a última mensagem para cada usuário
          const userData = { id: doc.id, ...doc.data(), UltimaMsg: lastMessage };
  
          // verificar se o id do usuario autenticado é igual o da lista de usuario
          // se for igual não exibir ele na lista de amigos
          if (currentUser && doc.id !== currentUser.uid) {
            users.push(userData);
          }
        }

        
        setUserList(users);
        setIsLoading(false); // Marca a busca como concluída

      } catch (error) {
        console.error("Erro ao recuperar lista de usuários:", error);
        Alert.alert("Erro", "Erro ao recuperar lista de usuários");
      }
    }

    buscarUserList();
  }, []); // Executar apenas uma vez ao montar o componente

  async function getLastMessage(userId) { 
    const chatQuery = query(
      collection(db, 'chats'),
      orderBy('createdAt', 'desc'),
      limit(1),
    );
    const chatSnapshot = await getDocs(chatQuery);
    if (!chatSnapshot.empty) {
      const lastMessage = chatSnapshot.docs[0].data();
      return lastMessage.text; // Retorna apenas o texto da última mensagem
    }
    return ''; // Retorna vazio se não houver mensagens
  }

  
  return (
    <View margin={10}>
      {isLoading ? ( // Renderiza o ActivityIndicator apenas se isLoading for verdadeiro
        <ActivityIndicator size="large" color="#00BFFF" />
      ) : (
        <FlatList
          margin={5}
          data={userList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Chat", { userId: item.id, userName: item.nome,userFoto: item.fotoPerfil })
              }
            >
              <View style={{ flexDirection: "row", alignItems: "center" }} margin={10}>
                <Image
                  source={
                    item.fotoPerfil
                      ? { uri: item.fotoPerfil }
                      : require("../../images/perfilpadrao.png")
                  }
                  style={{ width: 40, height: 40, borderRadius: 20 }} // Ajuste o tamanho e a forma conforme necessário
                />
                <View style={{ marginLeft: 10 }}>
                  <Text>{item.nome}</Text>
                  <Text>{item.UltimaMsg}</Text>
                </View>
              </View>
              <Divider style={{ marginVertical: 10 }} />
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}
