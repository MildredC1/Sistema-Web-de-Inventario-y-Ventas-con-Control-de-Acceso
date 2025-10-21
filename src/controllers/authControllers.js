import bcrypt from "bcrypt"
import pool from "../config/db.js"

// muestra el Login (GET)
export function showLogin(req, res) {
    res.render("login", {title: "Iniciar sesión"})
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
    
    req.session.user = usuario;

    // creamos la info para crear la cookie
    const infoCookie = {id: usuario.id, nombre: usuario.nombre, email: usuario.email}

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
// cerrar sesión(GET)
export async function logout(req, res) {

    res.clearCookie('auth')

    res.render("mensaje", {titulo: "Salida", mensaje: "Sesión cerrada correctamente"})
    
}