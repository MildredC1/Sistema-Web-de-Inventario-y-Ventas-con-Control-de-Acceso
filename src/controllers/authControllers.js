import bcrypt from "bcrypt"
import pool from "../config/db.js"

// muestra el Login (GET)
export function showLogin(req, res) {
    res.render("login", {title: "Iniciar sesión"})
}

// procesar el inicio de sesión (POST)
export async function login(req, res) {
  const { correo, contrasena } = req.body;

  if (!email || !password) {
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

    } else {
      req.session.user = usuario;

      if (usuario.admin) {
        res.redirect('/'); // Acceso completo
      } else {
        res.redirect('/'); // Solo visualización
      }
    }

  } catch (error) {
    
  }
  
};