
import axios from 'axios';
import jwt from 'jsonwebtoken';

const Login = async (usuario, password) => {
  try {
    // Paso 1: Crear un token JWT con usuario y contraseña
    let data = {
        signInTime: Date.now(),
        email: usuario,
        password
      }
       const key = 'jp152024'; //process.env.SECRET_KEY;
      console.log("Data: "+ JSON.stringify(data));
        
        const token = jwt.sign(data, key, { expiresIn: '1h' });
        console.log('Token generado con éxito:', token);
     
     // var token = jwt.sign({ usuario: 'jpastorcardenas', password: 'paj9012' }, 'jp152024', { algorithm: 'RS256' });

    // Paso 2: Consultar el login con el token JWT
    
     const response = await axios.post('http://localhost:3800/api/login',{token: token});

    // Paso 3: Verificar si la API devuelve un perfil
    if (response.data.perfil) {
      // Crear cookie con tiempo de vida de 1 hora
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