import React, { useState, useEffect } from 'react';
import { View, Text, } from 'react-native';
import {  Image } from '@rneui/themed';
import { onAuthStateChanged } from "firebase/auth";
import { styles } from '../Styles/styles';
import logoChat from '../../images/icone_lero_lero.png'; 
import { auth } from '../config/firebase';

export default function Login({ navigation }) {
  const [loading, setLoading] = useState(false);


    // Verificar se o usuário está logado
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          navigation.navigate('Conversa');
        }else{
            navigation.navigate('Login');
        }
      });
      return unsubscribe; // Cleanup listener on unmount
    }, [navigation]);

  return (
    <View style={styles.container}>
     <Text style={styles.textEsqueceSenha}>Carregando...</Text>
      </View>
  
  );
}
