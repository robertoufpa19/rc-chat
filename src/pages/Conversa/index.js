import React, { useState, useEffect } from 'react';
import { Text, Alert, FlatList, View, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { collection, getDocs, query, orderBy, limit, getDoc } from "firebase/firestore"; 
import { db} from "../config/firebase";
import { getAuth } from "firebase/auth";
import { Divider } from '@rneui/themed';
import { Avatar, Icon } from '@rneui/themed';
import { styles } from '../Styles/styles';
import logoContato from '../../images/ic_contato_branco64.png'; 

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
        
          const userData = { id: doc.id, ...doc.data() };
          // verificar se o id do usuario autenticado é igual o da lista de usuario
          // se for igual não exibir ele na lista de conversas
          if (currentUser && doc.id !== currentUser.uid) {
            const ultimaMensagem = await getUltimaMensagem(currentUser.uid, doc.id);
            users.push({ ...userData, ultimaMensagem });
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

  async function getUltimaMensagem(idRemetente, idDestinatario) {
    try {
      const mensagensRef = collection(db, 'chats', idRemetente, idDestinatario);
      const ultimaMensagemQuery = query(mensagensRef, orderBy('createdAt', 'desc'), limit(1));
      const querySnapshot = await getDocs(ultimaMensagemQuery);

      if (!querySnapshot.empty) {
        const ultimaMensagemDoc = querySnapshot.docs[0];
        return ultimaMensagemDoc.data().text;
      } else {
        return "Nenhuma mensagem";
      }
    } catch (error) {
      console.error("Erro ao recuperar a última mensagem:", error);
      return "Erro ao carregar mensagem";
    }
  }
  
  return (
    <View style={{ flex: 1, margin: 10 }}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#00BFFF" />
      ) : (
        <FlatList
          contentContainerStyle={{ paddingBottom: 100 }} // Ajuste para evitar sobreposição com o botão flutuante
          data={userList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Chat", { userId: item.id, userName: item.nome, userFoto: item.fotoPerfil })
              }
            >
              <View style={{ flexDirection: "row", alignItems: "center", margin: 10 }}>
                <Image
                  source={
                    item.fotoPerfil
                      ? { uri: item.fotoPerfil }
                      : require("../../images/perfilpadrao.png")
                  }
                  style={{ width: 40, height: 40, borderRadius: 20 }}
                />
                <View style={{ marginLeft: 10 }}>
                  <Text>{item.nome}</Text>
                  <Text>{item.ultimaMensagem}</Text>
                </View>
              </View>
              <Divider style={{ marginVertical: 10 }} />
            </TouchableOpacity>
          )}
        />
      )}

      <TouchableOpacity style={styles.floatingButton} onPress={() => navigation.navigate('Contato')}>
        <Image
          source={logoContato}
          style={{ width: 20, height: 20 }}
        />
      </TouchableOpacity>
    </View>
  );
}
