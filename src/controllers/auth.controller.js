import bcrypt from "bcrypt"
import pool from "../config/db.js"
import multer from 'multer';
import path from 'path';


// muestra el Login (GET)
export function mostrarLogin(req, res) {
    res.render("login")
}

// procesar el inicio de sesión (POST)
export async function login(req, res) {
  const { correo, contrasena } = req.body;

  if (!correo || !contrasena) {
        return  res.status(400).render("mensaje", {
          titulo: "Iniciar sesión", 
          mensaje: "Todos los campos son obligatorios"})
  }
  
  try {
    // buscar el usuario en la BD
    const [rows] = await pool.query(
      'SELECT * FROM usuarios WHERE correo = ?', [correo]);
    
    // no existe el usuario
    if (rows.length === 0) {
      return res.status(401).render("mensaje", {
        titulo: "Iniciar sesión", 
        mensaje: "Credenciales inválidas"})
    }

    const usuario = rows[0];

    const iguales = await bcrypt.compare(contrasena, usuario.contrasena)
    
    if (!iguales) {
      return res.status(401).render("mensaje", {
        titulo: "Iniciar sesión",
        mensaje: "Credenciales inválidas"})

    }
    
    // req.session.user = usuario;

    // creamos la info para crear la cookie
    const infoCookie = {
      id: usuario.id, 
      nombre: usuario.nombre, 
      email: usuario.email,
      admin: usuario.admin,
      foto:usuario.foto
    }

    res.cookie('auth', JSON.stringify(infoCookie), {
      httpOnly: true,
      signed: true,
      maxAge: 1000 * 60 * 5
    })
    
    // si el usuario intentaba ingresar a otra ruta antes de logearse
      // lo redireccionamos

    const nextUrl = req.query.next || '/'
    res.redirect(nextUrl)

  } catch (error) {
    console.log(error)
    res.status(500).render("mensaje", {
      titulo: "Error", 
      mensaje: "No se pudo iniciar sesión"})
  }
  
}

// Controlador para procesar el registro (GET)
export function mostrarRegistro(req, res) {
    res.render("registro")
}

// procesar el inicio de sesión (POST)
const storage = multer.diskStorage({
  destination: 'public/img/',
  filename: (req, file, cb) => {
    const nombreUnico = Date.now() + path.extname(file.originalname);
    cb(null, nombreUnico);
  }
});

export const upload = multer({ storage });

export function registroUsuario(req, res) {
  const { nombre, correo, contrasena, admin } = req.body;
  const foto = req.file ? req.file.filename : 'default.jpg';

  // Verificar si ya existe un usuario con el mismo nombre o correo
  pool.query(
    'SELECT * FROM usuarios WHERE nombre = ? OR correo = ?',
    [nombre, correo],
    (error, resultados) => {
      if (error) {
        console.error('Error al verificar datos repetidos:', error);
        return res.status(500).render('mensaje', {
          titulo: 'Error',
          mensaje: 'No se pudo verificar los datos del usuario'
        });
      }

      if (resultados.length > 0) {
        return res.status(400).render('mensaje', {
          titulo: 'Registro',
          mensaje: 'Ya existe un usuario con ese nombre o correo electrónico'
        });
      }

      // Encriptar la contraseña antes de guardar
      bcrypt.hash(contrasena, 10, (err, hash) => {
        if (err) {
          console.error('Error al encriptar contraseña:', err);
          return res.status(500).render('mensaje', {
            titulo: 'Error',
            mensaje: 'No se pudo procesar la contraseña'
          });
        }

        const nuevoUsuario = [nombre, correo, hash, admin || 0, foto];

        pool.query(
          'INSERT INTO usuarios (nombre, correo, contrasena, admin, foto) VALUES (?, ?, ?, ?, ?)',
          nuevoUsuario,
          (error, results) => {
            if (error) {
              console.error('Error al registrar usuario:', error);
              return res.status(500).render('mensaje', {
                titulo: 'Error',
                mensaje: 'No se pudo registrar el usuario'
              });
            }

            res.redirect('/login');
          }
        );
      });
    }
  );
}


// cerrar sesión(GET)
export async function logout(req, res) {

    res.clearCookie('auth')

    res.render("mensaje", {
      titulo: "Salida", 
      mensaje: "Sesión cerrada correctamente"})
    
}