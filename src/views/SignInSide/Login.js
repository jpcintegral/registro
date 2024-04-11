
import axios from 'axios';
import jwt from 'jsonwebtoken';

const Login = async (usuario, password) => {
const url=process.env.REACT_APP_API_URL;
  try {
    // Paso 1: Crear un token JWT con usuario y contraseña
    let data = {
        signInTime: Date.now(),
        email: usuario,
        password
      }
      const key = process.env.REACT_APP_SECRET_KEY;     
      const token = jwt.sign(data, key, { expiresIn: '1h' });
     
    // Paso 2: Consultar el login con el token JWT
    
     const response = await axios.post(`${url}/api/login`,{token: token});

    // Paso 3: Verificar si la API devuelve un perfil
    if (response.data.perfil) {
      // Crear cookie con tiempo de vida de 1 hora
      //document.cookie = `token=${ jwt.sign({data:response.data}, key, { expiresIn: '1h' }) }; max-age=3600;`;
      document.cookie = `token=${ jwt.sign({data:response.data}, key, { expiresIn: '1h' }) }; max-age=3600;`;
      return true; // Devolver true si las credenciales son correctas
    } else {
      return false; // Devolver false si las credenciales son incorrectas
    }
  } catch (error) {
    console.error('Error en la autenticación:', error);
    return false; // Devolver false si hay un error en la autenticación
  }
};

export default Login;