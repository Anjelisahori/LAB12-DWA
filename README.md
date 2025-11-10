
# 📚 Sistema de Biblioteca - API Routes (Lab 12)

Este proyecto implementa un sistema de gestión de libros utilizando **Next.js 15**, **Prisma ORM** y **TypeScript**, combinando el uso de **API Routes**, **Server Components** y **Client Components** para ofrecer un flujo de búsqueda, filtrado y administración de datos eficiente.

---

## 🚀 Características Principales

- ✅ Búsqueda avanzada de libros con filtros dinámicos (autor, género, año).
- ✅ Paginación y ordenamiento implementados en el backend.
- ✅ CRUD completo de libros y autores mediante API Routes.
- ✅ Integración con **Prisma** para consultas optimizadas en la base de datos.
- ✅ Interfaz moderna con componentes React e íconos de **react-icons**.
- ✅ Separación entre lógica del servidor y componentes del cliente (Server vs Client Components).

---

## 🧠 Conclusiones

### 1. Aprendizajes Clave
- Comprensión del flujo entre **Server Components** y **Client Components** en Next.js.
- Implementación de **API Routes avanzadas** con soporte para filtros y paginación.
- Uso de **Prisma ORM** para consultas complejas, relaciones y agregaciones.
- Optimización de la búsqueda de datos mediante parámetros dinámicos (`searchParams`).
- Manejo de estado y renderizado condicional con React Hooks (`useState`, `useEffect`, `useCallback`).

---

### 2. Desafíos y Soluciones
- **Desafío:** Manejo de `params` como Promise en Next.js 15.  
  **Solución:** Uso de `await params` antes de desestructurar en los Server Components.

- **Desafío:** Sincronización de filtros con la URL sin recargar la página.  
  **Solución:** Utilización de `useSearchParams` y `router.push` con `{ scroll: false }`.

- **Desafío:** Re-renderizados innecesarios por dependencias erróneas.  
  **Solución:** Encapsular `fetchBooks` dentro de `useCallback` con dependencias vacías.

- **Desafío:** Estilizar y estructurar correctamente los componentes de búsqueda y tabla.  
  **Solución:** Uso de **Tailwind CSS** con una interfaz limpia, responsiva y moderna.

---

## ⚙️ Instalación y Ejecución

Asegúrate de tener **Node.js** y **npm** instalados.  
Luego, ejecuta los siguientes comandos:

```bash
# Instalar dependencias
npm install

# Generar el cliente de Prisma
npx prisma generate

# Crear la base de datos y aplicar el esquema
npx prisma db push

# Iniciar el servidor de desarrollo
npm run dev
````

El proyecto estará disponible en:
👉 [http://localhost:3000](http://localhost:3000)

---

## 🧩 Tecnologías Utilizadas

| Tecnología              | Descripción                                                       |
| ----------------------- | ----------------------------------------------------------------- |
| **Next.js 15**          | Framework React con renderizado híbrido y soporte para App Router |
| **TypeScript**          | Tipado estático para un código más seguro y mantenible            |
| **Prisma ORM**          | Mapeo de base de datos relacional eficiente                       |
| **React Icons**         | Íconos modernos y personalizables                                 |
| **Tailwind CSS**        | Framework de estilos para UI rápida y responsiva                  |
| **SQLite / PostgreSQL** | Base de datos relacional (dependiendo del entorno)                |

---

## 👨‍💻 Autor

**Anjeli Sahori Verástigue Tejeda**
📅 *Laboratorio 12 - Next.js & Prisma*
🎓 *Tecsup - Desarrollo de Software*

```
