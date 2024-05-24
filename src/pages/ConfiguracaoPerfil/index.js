import React, { useState, useEffect } from 'react';
import { View, TextInput, Alert, Text, TouchableOpacity, Image } from 'react-native';
import { Button } from '@rneui/themed';

import * as ImagePicker from 'expo-image-picker';


import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";

import { styles } from '../Styles/styles';
import atualizarFotoPerfil from '../../images/ic_atualizar_foto48.png'; // Imagem padrão da foto de perfil

export default function Login({ navigation }) {
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [emailUsuario, setEmailUsuario] = useState('');
  const [loading, setLoading] = useState(false); // botão salvar

  const [fotoPerfil, setFotoPerfil] = useState(null); // Estado para armazenar a foto de perfil
  const auth = getAuth();
  const db = getFirestore();

  const verificarCampos = async () => {
    if (nomeUsuario.trim() === '') {
      Alert.alert('Erro', 'Por favor, preencha o campo nome');
    } else {
      try {
        setLoading(true);
       
        const user = auth.currentUser;
        const idUsuarioLogado = user.uid;

        // Referência ao documento do usuário na coleção "users"
        const userDocRef = doc(db, "users", idUsuarioLogado);

        // Atualizar o nome do usuário no documento
        await updateDoc(userDocRef, {
          nome: nomeUsuario,
          fotoPerfil: fotoPerfil
        });

        Alert.alert('Sucesso', 'Dados atualizado com sucesso!');
      } catch (error) {
        console.error("Erro ao atualizar o nome do usuário:", error);
        Alert.alert('Erro', 'Erro ao atualizar o dados do usuário. Por favor, tente novamente.');
      } finally {
       
        setLoading(false);
      }
    }
  };

 // Função para selecionar uma imagem da galeria
const selecionarImagem = async () => { 
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      console.log(result);
      setFotoPerfil(result.assets[0].uri);
    } else {
      Alert.alert('Atenção', 'Você não selecionou uma foto!');
    }

  };
  

  // Função para obter dados do usuário logado
  async function getUserData(idUsuarioLogado) {
    try {
      // Referência ao documento do usuário na coleção "users"
      const userDocRef = doc(db, "users", idUsuarioLogado);

      // Obter o documento do usuário
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        // Dados do usuário
        const userData = userDoc.data();
        console.log("Dados do usuário:", userData);
        // Atualizar os estados com os dados do usuário
        setNomeUsuario(userData.nome || '');
        setEmailUsuario(userData.email || '');
        // Verificar se a foto de perfil está disponível
        if (userData.fotoPerfil) {
          setFotoPerfil(userData.fotoPerfil); // Define a foto de perfil do usuário
        } else {
          setFotoPerfil(null); // Define a foto de perfil padrão
        }
      } else {
        console.log("Nenhum documento encontrado para o usuário com ID:", idUsuarioLogado);
      }
    } catch (error) {
      console.error("Erro ao obter os dados do usuário:", error);
    }
  }

  // Obter o usuário autenticado
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const idUsuarioLogado = user.uid; // Obtém o ID do usuário logado
        getUserData(idUsuarioLogado); // Chama a função para obter os dados do usuário
      } else {
        console.log("Nenhum usuário logado."); 
      }
    });

    return () => unsubscribe();
  }, [auth]);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={selecionarImagem}>
        {fotoPerfil ? (
          <Image source={{ uri: fotoPerfil }} style={{ width: 100, height: 100, marginBottom: 20, borderRadius: 50 }} />
        ) : (
          <Image source={atualizarFotoPerfil} style={{ width: 100, height: 100, marginBottom: 20 }} />
        )}
      </TouchableOpacity>

      <View style={styles.boxInput}>
        <TextInput
          style={styles.input}
          placeholder="nome"
          value={nomeUsuario}
          onChangeText={text => setNomeUsuario(text)}
        />

        <TextInput
          style={styles.input}
          placeholder="e-mail"
          value={emailUsuario}
          color="#999899"
          editable={false}
          onChangeText={text => setEmailUsuario(text)}
        />

        <Button
          title="Salvar"
          loading={loading} // Use o estado de loading aqui
          titleStyle={{ fontWeight: '700' }}
          buttonStyle={{
            backgroundColor: '#00BFFF',
            borderColor: 'transparent',
            borderWidth: 4,
            borderRadius: 10,
            paddingVertical: 10,
          }}
          containerStyle={{
            width: 200,
            marginHorizontal: 70,
            marginVertical: 10,
          }}
          onPress={verificarCampos} 
        />

        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.textSair}>Sair</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
