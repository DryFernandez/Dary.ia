# Dary.ia

Dary.ia es una aplicación desarrollada con React Native, diseñada para gestionar y visualizar información personal como fechas importantes, fotos y preferencias. El proyecto utiliza Tailwind CSS para estilos y NativeWind para integración con React Native.

## Estructura del Proyecto

```
DaryAI/
├── App.js
├── app.json
├── babel.config.js
├── global.css
├── index.js
├── metro.config.js
├── nativewind.config.js
├── NavigationMenu.js
├── package.json
├── tailwind.config.js
├── api/
│   └── n8nChat.js
├── assets/
│   ├── adaptive-icon.png
│   ├── favicon.png
│   ├── icon.png
│   └── splash-icon.png
├── components/
│   └── ChatModal.js
├── screens/
│   ├── CosasFavoritasScreen.js
│   ├── DefinirFechasScreen.js
│   ├── FechasImportantesScreen.js
│   ├── FotosScreen.js
│   └── index.js
```

## Instalación

1. Clona el repositorio:
	```bash
	git clone https://github.com/DryFernandez/Dary.ia.git
	```
2. Instala las dependencias:
	```bash
	cd DaryAI
	npm install
	```

## Uso

Para iniciar la aplicación en modo desarrollo:
```bash
npm start
```
O con Expo:
```bash
npx expo start
```

## Tecnologías

- React Native
- Tailwind CSS (NativeWind)
- Metro Bundler
- n8n API

## Funcionalidades principales

- Visualización y gestión de fechas importantes
- Galería de fotos
- Chat modal integrado
- Menú de navegación personalizado

## Créditos

Desarrollado por DryFernandez.