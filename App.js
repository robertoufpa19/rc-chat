
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './src/pages/Login';
import Chat from './src/pages/Chat';
import Conversa from './src/pages/Conversa';
import Contato from './src/pages/Contato';
import CadastroUsuario from './src/pages/CadastroUsuario'
import {Image} from 'react-native';

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

        <Stack.Screen name="Conversa" component={Conversa} />
        <Stack.Screen name="Contato" component={Contato} />
        <Stack.Screen name="CadastroUsuario" component={CadastroUsuario}
        options={{ headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}