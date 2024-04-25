import React, { useState, useEffect } from 'react';
import { Text, Alert, FlatList, View, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { collection, getDocs } from "firebase/firestore"; 
import { db } from "../config/firebase"
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
        querySnapshot.forEach((doc) => {
          // Para cada documento, extraia os dados e adicione à lista de usuários
          users.push({ id: doc.id, ...doc.data() });
        });
        setUserList(users);
        setIsLoading(false); // Marca a busca como concluída
      } catch (error) {
        console.error("Erro ao recuperar lista de usuários:", error);
        Alert.alert("Erro", "Erro ao recuperar lista de usuários");
      }
    }
    buscarUserList();
  }, []); // Executar apenas uma vez ao montar o componente

  
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
                navigation.navigate("Chat", { userId: item.id, userName: item.nome })
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
                  <Text>Oi {item.UltimaMsg}</Text>
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
