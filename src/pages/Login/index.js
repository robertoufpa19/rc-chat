import React, { useState } from 'react';
import { View, TextInput,  Alert, Text, TouchableOpacity} from 'react-native';
import { Button, Image } from '@rneui/themed';

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import { styles } from '../Styles/styles';

import logoChat from '../../images/icone_lero_lero.png'; 


export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const verificarCampoEmail = () => {
    if (email.trim() === '') {
      Alert.alert('Erro', 'Por favor, preencha o campo de e-mail');
    } else if (password.trim() === '') {
      Alert.alert('Erro', 'Por favor, preencha o campo de senha');
    } else {
        /// realizar login
      setLoading(true);
      loginUserWithEmailAndPassword(email, password);
    
    }
  };

  const loginUserWithEmailAndPassword = async (email, password) => {
  
      const auth = getAuth();
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;

      if(user != null){
        setLoading(false);
        navigation.navigate('Conversa');
      }else{
        Alert.alert('Erro', 'usuario não cadastrado');
      }
      
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      setLoading(false);
      Alert.alert('Erro', 'Erro ao realizar login'+errorCode);
    });

  };
  

  return (
    <View style={styles.container}>
        <Image
          source={logoChat}
          style={{ width: 100, height: 100, marginBottom:20 }}
         /> 
      <View style={styles.boxInput}>
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          value={email}
          onChangeText={text => setEmail(text)} 
        />
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Senha"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={text => setPassword(text)}
            
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}style={ {position: 'absolute',
           right: 10,}}>
          <Image 
            source={showPassword ? require('../../images/mostrar_senha.png') : require('../../images/ocultar_senha.png')} 
            style={{ width: 20, height: 20, marginRight: 10 }} 
          />
          </TouchableOpacity>
        </View>

         <Button
               title="Entrar"
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
              onPress={verificarCampoEmail}
            /> 

      <TouchableOpacity>
        <Text style={styles.textEsqueceSenha}>Esqueceu sua Senha?</Text>
       </TouchableOpacity>  


       <TouchableOpacity
        onPress={() => navigation.navigate('CadastroUsuario')}  
       >
        <Text style={styles.textCadastre}>Criar Nova Conta</Text>
       </TouchableOpacity> 

      </View>
    </View>
  );
}
