import React, { useState } from 'react';
import { View, TextInput, Alert } from 'react-native';
import { Button } from '@rneui/themed';

import { styles } from '../Styles/styles';

import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc } from 'firebase/firestore';

import {db} from '../config/firebase'



export default function Cadastre({ navigation }) {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
  
    const verificarCampoEmail = () => {
     if (nome.trim() === '') {
         Alert.alert('Erro', 'Por favor, preencha o campo de nome');
      } else if (email.trim() === '') {
        Alert.alert('Erro', 'Por favor, preencha o campo de e-mail');
      } else if (password.trim() === '') {
        Alert.alert('Erro', 'Por favor, preencha o campo de senha');
      } else {
  
        cadastrarUsuario(email, password);
      
      }
    };
    
  
    const cadastrarUsuario = async () => {
    
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        salvarUsuariosFirestore(nome, email, password);

  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    Alert.alert('Erro', 'erro: '+errorCode);
    // ..
  });

};



// criar a coleção users no firestore database
async function salvarUsuariosFirestore(nome, email, password) {
  
  try {
    const docRef = await addDoc(collection(db, "users"), {
      nome: nome,
      email: email,
      senha: password
    });
    Alert.alert('Cadastro', 'Cadastro realizado com sucesso!');
    console.log("Documento escrito com ID: ", docRef.id);
  } catch (e) {
    Alert.alert('Erro', 'Erro ao cadastrar usuário');
    console.error("Erro ao adicionar documento: ", e);
  }
}


    
  
    return (
      <View style={styles.container}>
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
           style={styles.button}
            title="Cadastrar"
            onPress={verificarCampoEmail}
          />
        </View>
      </View>
    );
  }