
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './src/pages/Login';
import Chat from './src/pages/Chat';
import Conversa from './src/pages/Conversa';
import CadastroUsuario from './src/pages/CadastroUsuario'

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} 
         options={{ headerShown: false }}/>
         
        <Stack.Screen name="Chat" component={Chat} />
        <Stack.Screen name="Conversa" component={Conversa} />
        <Stack.Screen name="CadastroUsuario" component={CadastroUsuario}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}