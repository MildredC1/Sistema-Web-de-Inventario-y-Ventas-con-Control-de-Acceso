# Proyecto: Sistema Web de Inventario y Ventas con Control de Acceso

## 1. Descripción general
El objetivo del proyecto es desarrollar un **sitio web funcional de inventario y ventas** utilizando **Node.js, Express y MySQL**, aplicando la arquitectura **MVC** y buenas prácticas de desarrollo.  
Debe incluir un **sistema de autenticación con cookies**, **manejo de sesiones** y **control de permisos** según el tipo de usuario.  

El proyecto será desarrollado **en pareja**, deberá ser **subido a un repositorio de GitHub** y gestionado bajo **metodologías ágiles**, incluyendo una **sesión inicial de historias de usuario**.


El sistema debe implementar un control de acceso claro basado en roles. Cada usuario del sistema tendrá un nivel de permisos que define qué acciones puede realizar dentro de la aplicación. Esto permitirá simular un entorno laboral real, donde no todos los empleados tienen los mismos privilegios sobre el inventario y las operaciones del negocio.


Solo los **administradores** podrán agregar, editar y eliminar productos del inventario. Los **trabajadores normales** podrán visualizar la información, pero no modificarla.




---

## 2. Requerimientos funcionales

### A. Módulo de usuarios
- **Tabla:** `usuarios`
- **Campos mínimos:**  
  - `id` (INT, PK, AI)  
  - `nombre` (VARCHAR)  
  - `correo` (VARCHAR)  
  - `contrasena` (VARCHAR, encriptada con bcrypt)  
  - `admin` (BOOLEAN: True si es administrador, False si es trabajador)

- **Características:**
  - Página de **login** (correo y contraseña).  
  - Uso de **cookies** o sesiones para mantener el acceso.  
  - Redirección según tipo de usuario:
    - Administrador → acceso total.  
    - Trabajador → acceso de solo lectura.  
  - Cifrado de contraseñas con **bcrypt**.  
  - Validación y mensajes de error claros.

---

### B. Módulo de productos
- **Tabla:** `productos` (usar la siguiente estructura obligatoria):
```sql
CREATE TABLE `productos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(60) NOT NULL,
  `categoria` varchar(30) NOT NULL,
  `marca` varchar(40) NOT NULL,
  `precio` decimal(7,2) NOT NULL,
  `stock` int NOT NULL,
  `proveedor_email` varchar(120) DEFAULT NULL,
  `rating` decimal(2,1) NOT NULL,
  `creado_es` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `descuento` decimal(4,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`id`),
  UNIQUE KEY `proveedor_email` (`proveedor_email`),
  CONSTRAINT `productos_chk_1` CHECK ((`precio` > -(0))),
  CONSTRAINT `productos_chk_2` CHECK ((`precio` >= 0)),
  CONSTRAINT `productos_chk_3` CHECK ((`stock` >= 0)),
  CONSTRAINT `productos_chk_4` CHECK ((`descuento` between 0 and 0.80))
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```

- **Características:**
  - Mostrar el listado de productos (vista general).  
  - Administrador puede: **crear, editar, eliminar**.  
  - Trabajador puede: **visualizar solamente**.  
  - Las operaciones deben hacerse mediante **routers** separados en `/routes` y controladores en `/controllers`.  
  - Las vistas deben implementarse en **EJS** (`/views`).

---

### C. Módulo de ventas
- **Tabla:** `ventas`
- **Campos mínimos:**  
  - `id` (INT, PK, AI)  
  - `producto_id` (FK → productos.id)  
  - `cantidad` (INT)  
  - `fecha` (DATE)  
  - `vendedor_id` (FK → usuarios.id)

- **Características:**
  - Registrar una venta solo si hay stock suficiente.  
  - Actualizar automáticamente el inventario.  
  - Mostrar historial de ventas.

---

## 3. Requerimientos técnicos

1. **Arquitectura:**
   - Estructura **MVC** obligatoria:  
     - `/src/config/db.js` → conexión con **pool de conexiones** a MySQL.  
     - `/src/models` → consultas SQL.  
     - `/src/controllers` → lógica de negocio.  
     - `/src/routes` → definición de rutas (usuarios, productos, ventas).  
     - `/src/views` → vistas EJS.  
     - `/public/css` → estilos.  
     - `app.js` → punto de entrada principal.

2. **Configuración de entorno:**
   - Crear un archivo `.env` con las credenciales y parámetros del proyecto:  
     ```env
     DB_HOST=localhost
     DB_USER=root
     DB_PASS=1234
     DB_NAME=inventario
     PORT=4000
     ```
   - Usar la librería **dotenv** para cargar las variables.

3. **Autenticación y permisos:**
   - Middleware que valide si el usuario está autenticado.  
   - Middleware adicional que verifique el rol de administrador antes de permitir CRUD.  
   - Cifrado de contraseñas con **bcrypt**.

4. **Metodología ágil:**
   - Documentar **historias de usuario**.  
   - Crear una breve sesión de planificación (capturar evidencia).  
   - Subir los avances al **repositorio GitHub** con commits frecuentes.

---

## 4. Requerimientos visuales

- **Página de login:** formulario con correo y contraseña.  
- **Página principal:** lista de productos.  
  - Si es **admin**, mostrar botones “Editar” y “Eliminar”.  
  - Si es **trabajador**, solo visualización.  
- **Página de ventas:** formulario para registrar ventas.  
- **Navbar:** mostrar el nombre del usuario logueado y botón “Cerrar sesión”.

---

## 5. Criterios de evaluación

| Criterio | Descripción | Ponderación |
|-----------|-------------|-------------|
| **Arquitectura MVC** | Separación clara entre modelo, vista y controlador. | 15% |
| **Login y autenticación** | Cookies, sesiones y cifrado funcionando. | 15% |
| **Control de permisos** | Restricción de acciones según flag de administrador. | 20% |
| **Gestión de inventario** | CRUD funcional y validado. | 20% |
| **Gestión de ventas** | Registro y actualización automática del stock. | 15% |
| **Uso de .env y pool** | Configuración correcta y segura. | 10% |
| **Trabajo colaborativo y metodología ágil** | Historias de usuario, commits y orden. | 5% |

---

## 6. Entregables

- Carpeta del proyecto completa (Node.js + EJS + MySQL).  
- Script SQL con las tablas (`usuarios`, `productos`, `ventas`).  
- Archivo `.env` (sin credenciales sensibles).  
- Capturas de la sesión de historias de usuario.  
- Usuario de prueba:
  - **Administrador:** admin@demo.com / 1234  
  - **Trabajador:** empleado@demo.com / 1234  
- Repositorio en GitHub con el historial de commits.
