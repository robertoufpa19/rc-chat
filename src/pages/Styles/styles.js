import { StyleSheet } from "react-native";


export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F8FF',
        alignItems: 'center',
        justifyContent: 'center',
      },
      input:{
        backgroundColor: '#F8F8FF',
        width: '95%',
        height: 55,
        borderRadius: 10,
        marginTop: 10,
        marginBottom: 10,
        padding: 10,
        color: '#000000',
        fontSize: 16,
        shadowColor: 'grey',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.4,
        elevation: 8,
        alignSelf: 'center',

      },
      boxInput:{
        width: '90%',
        height: 100,
      },

      textCadastre:{
        textAlign: 'center',
        fontSize: 18,
        marginTop: 0,
        marginBottom: 40,
        color: "#00BFFF"
      },

      textSair:{
        textAlign: 'center',
        fontSize: 18,
        marginTop: 30,
        marginBottom: 10,
        color: "#FF6347"
      },

      textEsqueceSenha:{
        textAlign: 'center',
        fontSize: 18,
        marginTop: 0,
        marginBottom: 40,
        color: "#A9A9A9"
      },

      floatingButton: {
        position: 'absolute',
        width: 50,
        height: 50,
        borderRadius: 30,
        backgroundColor: '#00BFFF',
        alignItems: 'center',
        justifyContent: 'center',
        right: 20,
        bottom: 20,
        elevation: 5,
      },

});