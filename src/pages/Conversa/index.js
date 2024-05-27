import React, { useState, useEffect } from 'react';
import { Text, Alert, FlatList, View, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { collection, getDocs, query, orderBy, limit, getDoc, onSnapshot } from "firebase/firestore"; 
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

        for (const doc of querySnapshot.docs) {
          const userData = { id: doc.id, ...doc.data() };
          if (currentUser && doc.id !== currentUser.uid) {
            // Adiciona o listener de mensagens
            listenToUltimaMensagem(currentUser.uid, doc.id, (ultimaMensagem) => {
              const updatedUserData = { ...userData, ultimaMensagem };
              setUserList((prevUsers) => {
                const otherUsers = prevUsers.filter(user => user.id !== doc.id);
                return [...otherUsers, updatedUserData];
              });
            });
          }
        }

        setIsLoading(false); // Marca a busca como concluída

      } catch (error) {
        console.log("Erro ao recuperar lista de usuários:", error);
        
        Alert.alert("Erro", "Erro ao recuperar lista de usuários");
      }
    }

    buscarUserList();
  }, []); // Executar apenas uma vez ao montar o componente

  function listenToUltimaMensagem(idRemetente, idDestinatario, callback) {
    const mensagensRef = collection(db, 'chats', idRemetente, idDestinatario);
    const ultimaMensagemQuery = query(mensagensRef, orderBy('createdAt', 'desc'), limit(1));
    return onSnapshot(ultimaMensagemQuery, (querySnapshot) => {
      if (!querySnapshot.empty) {
        const ultimaMensagemDoc = querySnapshot.docs[0];
        callback(ultimaMensagemDoc.data().text);
      } else {
        callback("Nenhuma mensagem");
      }
    }, (error) => {
      console.log("Erro ao recuperar a última mensagem:", error);
      callback("Erro ao carregar mensagem");
    });
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
                <View style={{ marginLeft: 10, flex: 1 }}>
                  <Text>{item.nome}</Text>
                  <Text numberOfLines={1}  style={{ maxWidth: '75%' }}>
                  {item.ultimaMensagem}
                  </Text>
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
