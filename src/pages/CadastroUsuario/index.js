import React, { useState } from 'react';
import { View, TextInput, Alert } from 'react-native';
import { Button,  Image } from '@rneui/themed';

import { styles } from '../Styles/styles';

import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc } from 'firebase/firestore';

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
      createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        if(user != null){
          setLoading(false);
          salvarUsuariosFirestore(nome, email, password);
          navigation.navigate('Conversa');
        }else{
          Alert.alert('Erro', 'erro ao cadastrar usuario');
        }
       

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
    console.log("Documento escrito com ID: ", docRef.id);
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