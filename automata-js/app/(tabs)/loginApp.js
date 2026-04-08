import { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { loginUser, pedirDatos, updateUser } from '../../services/functions/modulo1.js';
import { actualizarusuariosLite } from '../../services/synchronize/getDatos.js';
import { syncLiteToSupabase } from '../../services/synchronize/postDatos.js';

const LoginScreen = ({ onLoginSuccess }) => {  
  
useEffect(() => {
  const cargarDatos = async () => {
    const datosu = await pedirDatos();
  };
  cargarDatos();

  const init = async () => {
    await syncLiteToSupabase();       // 2. (opcional) sincroniza hacia Supabase
    await actualizarusuariosLite();   // 1. Trae datos actualizados desde Supabase
  };
  init();

}, []);



  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    let datalogin= await loginUser(usuario,password)
    // Aquí puedes agregar tu lógica de autenticación real
    if (usuario.trim() === '' || password.trim() === '') {
      Alert.alert('Error', 'Por favor, completa todos los campos');
      return;
    }
    else if(datalogin == false || datalogin == undefined){
      Alert.alert('Error', 'Datos No Existen');
      return;
    }
    else if(datalogin[5] == true && datalogin[7] == "automata yt-1"){
      if(datalogin[6] == "desactivada"){
        let respD=[datalogin[1],datalogin[2],datalogin[3],datalogin[5]]
        onLoginSuccess(respD); // envías datos al padre
        updateUser(datalogin[2],datalogin[3],"activada","1",datalogin[1])
      }
      else if(datalogin[6] == "activada"){
        Alert.alert('Error', 'Cuenta Activada');        
      }
    }  
    else{
      Alert.alert('Error', 'Datos No Existen');
    }  
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.innerContainer}>
        <View style={styles.logoContainer}>
          {/* Puedes reemplazar esto con tu logo real */}
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>AUTOMATA JS</Text>
          </View>
          <Text style={styles.title}>Bienvenido de nuevo</Text>
          <Text style={styles.subtitle}>Inicia sesión para continuar</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Usuario</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre Usuario"
              placeholderTextColor="#999"
              keyboardType="default"
              autoCapitalize="none"
              value={usuario}
              onChangeText={setUsuario}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Contraseña</Text>
            <TextInput
              style={styles.input}
              placeholder="********"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
          </TouchableOpacity>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>¿No tienes una cuenta? </Text>
            <TouchableOpacity>
              <Text style={styles.registerLink}>Regístrate</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  logoPlaceholder: {
    width: "70%",
    height: 70,
    backgroundColor: '#FF0000',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  logoText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: '#f5f5f5',
    height: 55,
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 30,
  },
  forgotPasswordText: {
    color: '#FF0000',
    fontSize: 14,
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: '#FF0000',
    height: 55,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
  },
  registerText: {
    color: '#666',
    fontSize: 14,
  },
  registerLink: {
    color: '#FF0000',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default LoginScreen;