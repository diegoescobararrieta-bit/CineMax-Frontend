# CineMax - Frontend

Repositorio 3 de 3 del proyecto **Sistema de Taquilla de Cine** (Programación Basada en Componentes).
Interfaz web hecha con **Angular** que consume la API REST de CineMax para mostrar la cartelera, vender boletas,
generar el recibo de compra en PDF y administrar películas y funciones.

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
- [jsPDF](https://github.com/parallax/jsPDF) para generar el recibo de compra en PDF

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

> Si se agrega un archivo nuevo a `public/img` mientras `ng serve` está corriendo, hay que reiniciar el servidor
> (Ctrl+C y `ng serve`) para que lo sirva.

## Secciones

### Zona pública (cliente)
| Ruta | Sección | Qué hace |
|---|---|---|
| `/cartelera` | Cartelera | Tarjetas con el afiche de cada película y una barra de color según su estado (**En cartelera**, **Preventa** o **Próximamente**). Botones **Ver tráiler** (ventana emergente) y **Ver detalle** |
| `/cartelera/:id` | Detalle de la película | Afiche, datos, tráiler incrustado, sinopsis, reparto y las funciones de esa película, cada una con botón **Comprar boletas** que lleva a la compra con la función ya elegida |
| `/compras` | Compra de boletas | Elige función, cliente, tipo de boleta (**Estándar** o **CineMax+**, silla VIP) y cantidad; muestra el total antes de comprar y el comprobante después, con descarga del **recibo en PDF**. Si no hay cupos suficientes muestra el mensaje de error del **409** |
| `/confiteria` | Confitería | Menú de combos (solo informativo) |

### Zona de administrador
Requieren iniciar sesión en `/login`.

| Ruta | Sección | Qué hace |
|---|---|---|
| `/peliculas` | Películas | CRUD completo, con búsqueda por título y por id; afiche, tráiler, sinopsis y estado |
| `/funciones` | Funciones | CRUD completo; la película se elige en un `select`; precio Estándar y precio CineMax+ |
| `/historial` | Historial de compras | Lista las compras, con filtro por un día o por rango de fechas, totales vendidos y descarga del recibo en PDF de cada compra |

### Tipos de boleta
| En pantalla | Valor interno (API y base de datos) |
|---|---|
| Estándar | `GENERAL` |
| CineMax+ (silla VIP) | `GENERAL_PLUS` |

El precio de cada tipo se define por función.

### Recibo en PDF
Después de una compra (y desde el historial) se puede descargar un recibo con el número de compra, el cliente,
la película, la función, el tipo de boleta, el detalle del valor, el total pagado y el logo de CineMax en el pie.

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
├── services/   HttpClient (PeliculaService, FuncionService, CompraService),
│               AuthService (sesión) y ReciboService (PDF)
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
los tráilers son enlaces de YouTube en formato `embed` (`https://www.youtube.com/embed/ID_DEL_VIDEO`).
