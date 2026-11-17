# CineMax - Frontend

Repositorio 3 de 3 del proyecto **Sistema de Taquilla de Cine** (Programación Basada en Componentes).
Interfaz web hecha con **Angular** que consume la API REST de CineMax para administrar la cartelera y vender boletas.

Repositorios del proyecto:
1. [CineMax-BD](https://github.com/diegoescobararrieta-bit/CineMax-BD): scripts SQL (PostgreSQL).
2. [CineMax-Backend](https://github.com/diegoescobararrieta-bit/CineMax-Backend): API REST con Spring Boot.
3. **CineMax-Frontend** (este): interfaz en Angular.

## Integrantes
- Diego Escobar Arrieta
- Nestor Andres Torres Mora

## Tecnologías
- Angular 22 (componentes standalone)
- TypeScript
- Formularios con `FormsModule` y `ngModel`
- `HttpClient` y Observables para consumir la API
- Enrutamiento con `RouterLink` y `RouterOutlet`
- Control de flujo `@if` y `@for`

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
| Ruta | Sección | Qué hace |
|---|---|---|
| `/peliculas` | Películas | CRUD completo de películas, con búsqueda por título |
| `/funciones` | Funciones | CRUD completo de funciones; la película se elige en un `select` |
| `/compras` | Compra de boletas | Elige función, cliente, ubicación y cantidad; muestra el total antes de comprar y el comprobante después. Si no hay cupos suficientes muestra el mensaje de error del **409** |
| `/historial` | Historial de compras | Lista las compras, con filtro por un día o por rango de fechas y totales vendidos |

## Estructura del código
```
src/app/
├── models/     Interfaces (Pelicula, Funcion, Compra, CompraRequest)
├── services/   Servicios con HttpClient (PeliculaService, FuncionService, CompraService)
├── pages/      Un componente por sección (peliculas, funciones, compras, historial)
├── app.routes.ts   Rutas de la aplicación
└── app.config.ts   Configuración (router y HttpClient)
```

## Conexión con el backend
Los servicios llaman a `http://localhost:8080/api/...`. El backend ya tiene CORS habilitado para `http://localhost:4200`.
