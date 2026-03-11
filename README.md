# Express Secure Auth 🔐

Sistema de autenticación robusto y seguro construido con **Node.js** y **Express**, siguiendo las mejores prácticas de seguridad y arquitectura de software.

## 🚀 Tecnologías Aplicadas

El proyecto utiliza un stack moderno enfocado en la seguridad y escalabilidad:

- **Node.js & Express**: Entorno de ejecución y framework web principal.
- **PostgreSQL**: Base de datos relacional para el almacenamiento persistente.
- **EJS (Embedded JavaScript)**: Motor de plantillas para renderizado del lado del servidor.
- **JWT (JSON Web Tokens)**: Implementación de sesiones stateless y seguras.
- **Bcrypt**: Hashing de contraseñas con salt para máxima seguridad.
- **Cookie-parser**: Manejo de cookies, priorizando el uso de `httpOnly` para mitigar ataques XSS.
- **CSRF-csrf**: Protección avanzada contra ataques de falsificación de peticiones en sitios cruzados.
- **Helmet**: Middleware de seguridad para configurar cabeceras HTTP seguras.
- **Express-rate-limit**: Protección contra ataques de fuerza bruta.
- **Express-validator**: Middleware para la validación y sanitización de datos de entrada.

## 🏗️ Metodologías y Patrones

Este proyecto ha sido desarrollado aplicando rigurosos estándares de ingeniería:

### 1. Arquitectura MVC (Modelo-Vista-Controlador)
Organización modular del código para separar la lógica de negocio, el acceso a datos y la representación visual:
- **Models**: Definición y gestión de la estructura de datos.
- **Views**: Plantillas dinámicas renderizadas con EJS.
- **Controllers**: Lógica de procesamiento de peticiones y respuestas.

### 2. RBAC (Role-Based Access Control)
Implementación de un sistema de permisos basado en roles (**Admin** y **User**) para restringir el acceso a rutas y funcionalidades críticas del sistema.

### 3. Seguridad por Diseño (Security by Design)
- **Mitigación de Vulnerabilidades**: Protección nativa contra XSS (cookies httpOnly, sanitización), CSRF y Brute Force.
- **Sesiones Híbridas**: Uso de cookies persistentes combinadas con JWT para un balance óptimo entre experiencia de usuario y seguridad.
- **Variables de Entorno**: Gestión de secretos y configuraciones sensibles mediante `.env`.

### 4. Estándares de Código y Refactorización
- **ES Modules (ESM)**: Uso de módulos nativos de JavaScript para mejorar la organización y evitar polución de scopes globales.
- **Middleware Pattern**: Uso extensivo de middlewares para la validación, autenticación y manejo de errores centralizado.

## 🛠️ Instalación y Uso

1. **Clonar el repositorio**:
   ```bash
   git clone git@github.com:NicolasFleitas/express-secure-auth.git
   cd express-secure-auth
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Configurar el entorno**:
   - Renombra `.env.example` a `.env` y completa tus credenciales.
   - Ejecuta el script de base de datos `setup_db.sql` en tu instancia de PostgreSQL.

4. **Ejecutar en desarrollo**:
   ```bash
   npm run dev
   ```

---
Desarrollado con ❤️ por [Nicolás Fleitas](https://github.com/NicolasFleitas)
