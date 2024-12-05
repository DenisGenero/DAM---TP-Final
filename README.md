Web App Full Stack Base - Ionic frontend
========================================

Proyecto basado en [Web App Full Stack Base](https://github.com/gotoiot/app-fullstack-base).

En esta extensión del proyecto se utiliza el framework ionic para realizar el frontend.

## Comenzando 🚀

Esta sección es una guía con los pasos esenciales para que puedas poner en marcha la aplicación.

### Instalar las dependencias

Para correr este proyecto es necesario que instales `Docker` y `Docker Compose`. 

En [este artículo](https://www.gotoiot.com/pages/articles/docker_installation_linux/) publicado en nuestra web están los detalles para instalar Docker y Docker Compose en una máquina Linux. Si querés instalar ambas herramientas en una Raspberry Pi podés seguir [este artículo](https://www.gotoiot.com/pages/articles/rpi_docker_installation) de nuestra web que te muestra todos los pasos necesarios.

En caso que quieras instalar las herramientas en otra plataforma o tengas algún incoveniente, podes leer la documentación oficial de [Docker](https://docs.docker.com/get-docker/) y también la de [Docker Compose](https://docs.docker.com/compose/install/).

Continua con la descarga del código cuando tengas las dependencias instaladas y funcionando.

### Ejecutar la aplicación

Para ejecutar la aplicación tenes que correr el comando `docker compose up` desde la raíz del proyecto. Este comando va a descargar las imágenes de Docker de node, de typescript, de la base datos y del admin de la DB, y luego ponerlas en funcionamiento. 

Para acceder al cliente web ingresa a a la URL [http://localhost:8100/](http://localhost:8100/) y para acceder al admin de la DB accedé a [localhost:8001/](http://localhost:8001/). 

Si pudiste acceder al cliente web y al administrador significa que la aplicación se encuentra corriendo bien. 

> Si te aparece un error la primera vez que corres la app, deteńe el proceso y volvé a iniciarla. Esto es debido a que el backend espera que la DB esté creada al iniciar, y en la primera ejecución puede no alcanzar a crearse. A partir de la segunda vez el problema queda solucionado.

## Licencia 📄

Este proyecto está bajo Licencia ([MIT](https://choosealicense.com/licenses/mit/)). Podés ver el archivo [LICENSE.md](LICENSE.md) para más detalles sobre el uso de este material.


## Implementación 🚧
A continuación se encuentra una breve descripción del funcionamiento del sistema.  

### Página principal 🌐
En la página principal se muestra un listado de los sensores disponibles, cuyos datos se obtienen a partir de una base de datos. Para mejorar la experiencia de usuario, cada elemento del listado cambia de color a rojo cuando el puntero del mouse pasa sobre él. Esto se logra mediante el uso de una directiva custom diseñada específicamente para este propósito.

Además, cada sensor en el listado incluye información básica como su nombre y estado. (Ver Figura 1)  

![Figura 1](/imagenes/Figura1.png)

### Dispositivo 📟
Al hacer clic sobre un sensor en el listado, se despliega la página específica de ese dispositivo. En esta página, el usuario puede consultar la última lectura de humedad, acompañada de la fecha y hora en que fue registrada.

Además, la interfaz presenta tres botones principales:

Controlar electroválvula: Este botón cambia de color en función del estado actual de la electroválvula.
Si está abierta, el botón será de color rojo y mostrará el texto "Cerrar EV".  
Si está cerrada, el botón será de color verde y mostrará el texto "Abrir EV".  
Mediciones: Permite acceder al listado completo de las mediciones registradas por el sensor.  
Volver: Redirige al usuario de vuelta a la página principal con el listado de sensores.  
(Ver Figura 2)  

![Figura 2](/imagenes/Figura2.png)

### Listado de mediciones 📊
Cuando se hace clic en el botón de mediciones, se abre una nueva página que muestra un listado detallado de todos los registros históricos de lecturas del sensor seleccionado. Cada registro incluye la fecha, hora y valor de humedad, ordenados desde la lectura más reciente hasta la más antigua.  

Debajo del listado se encuentra un botón para volver a la página del sensor correspondiente, facilitando la navegación entre las vistas (Ver Figura 3).  

![Figura 3](/imagenes/Figura3.png)

### Servicios y endpoints (🔗)
Se creó un servicio (dispositivo.service.ts) que centraliza todas las peticiones hacia la base de datos. A continuación, se describen los endpoints disponibles para la interacción con el backend:

| **Método** | **Endpoint**                          | **Descripción**                                                                                  |
|------------|---------------------------------------|--------------------------------------------------------------------------------------------------|
| `GET`      | `/dispositivo`                       | Obtiene un listado de todos los dispositivos disponibles en la base de datos.                   |
| `GET`      | `/dispositivo/:id`                   | Recupera los datos de un dispositivo específico junto con su última medición registrada.        |
| `GET`      | `/dispositivo/:id/mediciones`        | Obtiene el historial completo de mediciones asociadas a un dispositivo, ordenadas por fecha.    |
| `POST`     | `/dispositivo/:id/valvula`           | Registra un nuevo estado para la electroválvula y una medición de humedad asociada al dispositivo. |
| `GET`      | `/dispositivo/:id/valvula/:id`       | Consulta el estado más reciente de apertura/cierre de la electroválvula asociada al dispositivo. |