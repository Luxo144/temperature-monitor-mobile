# Monitor de Temperatura

Esta es una aplicación móvil desarrollada en **React Native** utilizando **Expo**. La aplicación permite monitorear temperaturas en tiempo real, establecer umbrales mínimos y máximos, y recibir alertas cuando la temperatura está fuera de estos límites. Además, cuenta con un historial de temperaturas reciente.

## Características

- Monitoreo de temperatura en tiempo real.
- Configuración de umbrales mínimos y máximos.
- Alertas en caso de que la temperatura exceda los umbrales configurados.
- Visualización de un historial de temperaturas recientes.
- Interfaz gráfica amigable y fácil de usar.

## Requisitos

- Node.js (v16 o superior)
- Expo CLI (v5 o superior)
- Un dispositivo móvil o emulador con soporte para Expo Go.

## Instalación

0. Instala y ejecuta la api (seguir pasos del repositorio)
    https://github.com/Luxo144/flask-temperature-monitor

1. Clona este repositorio:

   ```bash
   git clone https://github.com/Luxo144/temperature-monitor-mobile
   cd temperature-monitor-mobile
2. Instala las dependencias:

    ```bash
    npm install
3. Modifica la ip del .env con una local para acceder a la api (no vale localhost)

    API_URL=IPLOCAL:5000

4. Inicia el servidor de desarrollo:

    ```bash
    npx expo start
5. Escanea el código QR con la aplicación Expo Go en tu dispositivo móvil o ejecuta la aplicación en un emulador.
