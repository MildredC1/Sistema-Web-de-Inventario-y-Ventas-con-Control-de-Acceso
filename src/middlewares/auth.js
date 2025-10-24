// protege rutas que solo deben de ser accesibles si el usuario está autenticado

export function requiereAuth(req, res, next) {
    try{ 
        const hayCookies = req.signedCookies?.auth

        // si no hay una cookie, significa que el usuario NO ha iniciado sesión 
        // se redirige a /login y se le pasa el parametro ?next=
            // para recordar la ruta original a la quie intentaba acceder
        if(!hayCookies)
        { 
            return res.redirect('/login?next=' + encodeURIComponent(req.originalUrl))
        }

        let usuario;
        // ejemplo: { id: 1, nombre: "Diego", email: "diego@mail.com"}
        try {
            usuario = JSON.parse(hayCookies)
        }
        catch (_) {

            return res.clearCookie('auth').redirect("/login")
        }

        req.user = usuario

        next()
    }
    catch (error)
    {
        console.log("Error en requiereAuth: ", error)
        return res.status(401).render('mensaje', { 
            titulo: "No autorizado",
            mensaje: "Debes iniciar sesión",
            redireccionar: true,
            linkMensaje: "Volver al inicio",
            link: "/"
            })
    }
}

// si el usuario ya tiene una cookie 'auth' se redirige al inicio
export function redireccionAuth(req, res, next) {

    const hayCookies = req.signedCookies?.auth
    
    if(hayCookies)
        return res.redirect("/login")

    next()
}