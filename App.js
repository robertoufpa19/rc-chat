
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './src/pages/Login';
import Chat from './src/pages/Chat';
import Conversa from './src/pages/Conversa';
import Contato from './src/pages/Contato';
import CadastroUsuario from './src/pages/CadastroUsuario'
import ConfiguracaoPerfil from './src/pages/ConfiguracaoPerfil'

import {Image, TouchableOpacity} from 'react-native';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} 
         options={{ headerShown: false }}/>
        
         
         <Stack.Screen 
          name="Chat" 
          component={Chat} 
          options={({ route }) => ({
            headerTitle: route.params.userName,
            headerRight: () => (
              <Image 
                source={route.params.userFoto ? { uri: route.params.userFoto } : require("./src/images/perfilpadrao.png")} 
                style={{ width: 40, height: 40, borderRadius: 20 }} 
              />
            ),
          })} 
        />

    <Stack.Screen 
          name="Conversa" 
          component={Conversa} 
          options={({ navigation, route }) => ({
            headerRight: () => (
              <TouchableOpacity    
                onPress={() => navigation.navigate("ConfiguracaoPerfil", { 
                 // userId: route.params.userId, 
                 // userName: route.params.userName, 
                 // userFoto: route.params.userFoto 
                })}
              >
                <Image 
                  source={require("./src/images/ic_configuracao.png")} 
                  style={{ width: 30, height: 30, borderRadius: 20 }} 
                />
              </TouchableOpacity>
            ),
          })} 
        />


        <Stack.Screen name="Contato" component={Contato} />
        <Stack.Screen name="CadastroUsuario" component={CadastroUsuario}
        options={{ headerShown: false }}/>

       <Stack.Screen name="ConfiguracaoPerfil" component={ConfiguracaoPerfil} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}