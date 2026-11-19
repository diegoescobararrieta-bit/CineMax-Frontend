# CineMax - Frontend

Repositorio 3 de 3 del proyecto **Sistema de Taquilla de Cine** (Programación Basada en Componentes).
Interfaz web hecha con **Angular** que consume la API REST de CineMax para mostrar la cartelera, vender boletas y
administrar películas y funciones.

Repositorios del proyecto:
1. [CineMax-BD](https://github.com/diegoescobararrieta-bit/CineMax-BD): scripts SQL (PostgreSQL).
2. [CineMax-Backend](https://github.com/diegoescobararrieta-bit/CineMax-Backend): API REST con Spring Boot.
3. **CineMax-Frontend** (este): interfaz en Angular.

## Integrantes
- Diego Escobar Arrieta
- Nestor Andres Torres Mora

## Tecnologías
- Angular 22 (componentes standalone) y TypeScript
- Formularios con `FormsModule` y `ngModel`
- `HttpClient` y Observables para consumir la API
- Enrutamiento con `RouterLink`, `RouterOutlet` y un guard de rutas (`CanActivateFn`)
- Control de flujo `@if` y `@for`
- Signals para el estado de los componentes

## Requisitos previos
1. Node.js y npm instalados.
2. Angular CLI (`npm install -g @angular/cli`).
3. El **backend** en ejecución en `http://localhost:8080` (con la base de datos `cinemax` creada).

## Cómo ejecutarlo
```bash
npm install
ng serve
```
La aplicación queda disponible en `http://localhost:4200`.

## Secciones

### Zona pública (cliente)
| Ruta | Sección | Qué hace |
|---|---|---|
| `/cartelera` | Cartelera | Tarjetas con el afiche de cada película, botón **Ver tráiler** (ventana emergente) y **Ver detalle** |
| `/cartelera/:id` | Detalle de la película | Afiche, datos, tráiler incrustado, sinopsis, reparto y las funciones de esa película, cada una con botón **Comprar boletas** |
| `/compras` | Compra de boletas | Elige función, cliente, tipo de boleta (**Estándar** o **CineMax+**, silla VIP) y cantidad; muestra el total antes de comprar y el comprobante después. Si no hay cupos suficientes muestra el mensaje de error del **409** |
| `/confiteria` | Confitería | Menú de combos (solo informativo) |

### Zona de administrador
Requieren iniciar sesión en `/login`.

| Ruta | Sección | Qué hace |
|---|---|---|
| `/peliculas` | Películas | CRUD completo, con búsqueda por título y por id |
| `/funciones` | Funciones | CRUD completo; la película se elige en un `select`; precio Estándar y precio CineMax+ |
| `/historial` | Historial de compras | Lista las compras, con filtro por un día o por rango de fechas, y totales vendidos |

### Tipos de boleta
| En pantalla | Valor interno (API y base de datos) |
|---|---|
| Estándar | `GENERAL` |
| CineMax+ (silla VIP) | `GENERAL_PLUS` |

El precio de cada tipo se define por función.

## Acceso de administrador
Hay dos usuarios administradores (uno por integrante). Las credenciales **no se publican** en el repositorio:
el código solo guarda la huella (hash SHA-256) de cada contraseña.

**Limitación:** este control de acceso se hace solo en el navegador (guard de rutas y sesión en `sessionStorage`).
No protege la API, que sigue abierta. En un sistema real la autenticación se haría en el backend
(por ejemplo con Spring Security y tokens JWT).

## Estructura del código
```
src/app/
├── models/     Interfaces (Pelicula, Funcion, Compra, CompraRequest)
├── services/   HttpClient (PeliculaService, FuncionService, CompraService) y AuthService (sesión)
├── guards/     adminGuard: protege las rutas de administrador
├── pages/      Un componente por sección (cartelera, detalle, compras, confiteria, login,
│               peliculas, funciones, historial)
├── app.routes.ts   Rutas de la aplicación
└── app.config.ts   Configuración (router y HttpClient)
public/img/     Logo, afiches de las películas, cartel de CineMax+ y menú de confitería
```

## Conexión con el backend
Los servicios llaman a `http://localhost:8080/api/...`. El backend ya tiene CORS habilitado para `http://localhost:4200`.
Los afiches se guardan en `public/img/` y en la base de datos se registra su ruta (`/img/archivo.jpg`);
los tráilers son enlaces de YouTube en formato `embed`.
