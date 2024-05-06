import React, { useState } from 'react';
import { View, TextInput, Alert } from 'react-native';
import { Button,  Image } from '@rneui/themed';

import { styles } from '../Styles/styles';

import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import {db} from '../config/firebase'
import iconUser from '../../images/iconUser.png';


export default function Cadastre({ navigation }) {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
  
    const verificarCampoEmail = () => {
     if (nome.trim() === '') {
         Alert.alert('Erro', 'Por favor, preencha o campo de nome');
      } else if (email.trim() === '') {
        Alert.alert('Erro', 'Por favor, preencha o campo de e-mail');
      } else if (password.trim() === '') {
        Alert.alert('Erro', 'Por favor, preencha o campo de senha');
      } else {

        setLoading(true);
        cadastrarUsuario(email, password);
      
      }
    };
    
    const cadastrarUsuario = async () => {

      const auth = getAuth();
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
    
        if (user) {
          setLoading(false);
          // Passando o ID do usuário para salvar no Firestore
          salvarUsuariosFirestore(user.uid, nome, email, password);
          navigation.navigate('Conversa');
        } else {
          Alert.alert('Erro', 'Erro ao cadastrar usuário');
        }
      } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        Alert.alert('Erro', 'Erro: ' + errorCode);
      }
    };
    
    // Criar a coleção users no Firestore database
    async function salvarUsuariosFirestore(userID, nome, email, password) {
      try {
      await setDoc(doc(db, "users", userID), {
          id: userID, // Adicionando o ID do usuário
          nome: nome,
          email: email,
          fotoPerfil: '',
          senha: password
      });

      
      } catch (e) {
        Alert.alert('Erro', 'Erro ao cadastrar usuário');
        console.error("Erro ao adicionar documento: ", e);
      }
    }


    
  
    return (
      <View style={styles.container}>
          <Image
          source={iconUser}
          style={{ width: 100, height: 100, marginBottom:20 }}
         /> 
        <View style={styles.boxInput}>
        <TextInput
            style={styles.input}
            placeholder="Nome Usuario"
            value={nome}
            onChangeText={text => setNome(text)} 
          />

          <TextInput
            style={styles.input}
            placeholder="E-mail"
            value={email}
            onChangeText={text => setEmail(text)} 
          />
          <TextInput
            style={styles.input}
            placeholder="Senha"
            secureTextEntry
            value={password}
            onChangeText={text => setPassword(text)}
          />
          <Button
           title="Cadastrar"
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
           style={styles.button}
           
            onPress={verificarCampoEmail}
          />
        </View>
      </View>
    );
  }