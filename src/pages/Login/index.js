import React, { useState } from 'react';
import { View, TextInput,  Alert, Text, TouchableOpacity,  Button } from 'react-native';

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import { styles } from '../Styles/styles';


export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const verificarCampoEmail = () => {
    if (email.trim() === '') {
      Alert.alert('Erro', 'Por favor, preencha o campo de e-mail');
    } else if (password.trim() === '') {
      Alert.alert('Erro', 'Por favor, preencha o campo de senha');
    } else {
        /// realizar login
      loginUserWithEmailAndPassword(email, password);
    
    }
  };

  const loginUserWithEmailAndPassword = async (email, password) => {
  
      const auth = getAuth();
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
    
      Alert.alert("Login",'Login realizado com sucesso!', [
        {
          text:"Cancelar", 
        },
        { 
          text:"Ok",
          onPress: () => navigation.navigate('Conversa')
        },
       ])
      
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      Alert.alert('Erro', 'Erro ao realizar login'+errorCode);
    });

  };
  

  return (
    <View style={styles.container}>
      <View style={styles.boxInput}>
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
          title="Entrar"
          onPress={verificarCampoEmail}
        />

      <TouchableOpacity onPress={() => navigation.navigate('CadastroUsuario')}>
        <Text style={styles.textCadastre}>Cadastre-se</Text>
       </TouchableOpacity>

      </View>
    </View>
  );
}
