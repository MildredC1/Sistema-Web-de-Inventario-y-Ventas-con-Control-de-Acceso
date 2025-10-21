import bcrypt from "bcrypt"
import pool from "../config/db.js"

exports.login = async (req, res) => {
  const { correo, contrasena } = req.body;
  const [rows] = await pool.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
  const usuario = rows[0];

  if (usuario && await bcrypt.compare(contrasena, usuario.contrasena)) {
    req.session.user = usuario;

    if (usuario.admin) {
      res.redirect('/'); // Acceso completo
    } else {
      res.redirect('/'); // Solo visualización
    }
  } else {
    res.render('mensaje', { 
      titulo: 'Error',
      mensaje: 'Datos invalidos'});
  }
};