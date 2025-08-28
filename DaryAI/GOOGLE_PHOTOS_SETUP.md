# Configuración de Google Photos API

## Paso 1: Crear un proyecto en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la API de Google Photos Library:
   - Ve a "APIs y servicios" > "Biblioteca"
   - Busca "Photos Library API"
   - Haz clic en "Habilitar"

## Paso 2: Crear credenciales OAuth 2.0

1. Ve a "APIs y servicios" > "Credenciales"
2. Haz clic en "Crear credenciales" > "ID de cliente OAuth"
3. Selecciona "Aplicación web" (o el tipo apropiado para tu app)
4. Configura los orígenes autorizados:
   - Para desarrollo: `http://localhost:3000`
   - Para producción: tu dominio
5. Configura los URI de redireccionamiento:
   - Para desarrollo: `http://localhost:3000/auth/callback`
   - Para React Native: `com.tuapp.bundle:/oauth2redirect`

## Paso 3: Configurar credenciales en la app

1. Abre el archivo `config/googleConfig.js`
2. Reemplaza `TU_CLIENT_ID_DE_GOOGLE` con tu Client ID real
3. Asegúrate de que los scopes sean correctos:
   ```javascript
   scopes: [
     'https://www.googleapis.com/auth/photoslibrary.readonly',
     'profile',
     'email'
   ]
   ```

## Paso 4: Configuración específica para React Native

### Android (android/app/src/main/AndroidManifest.xml):
```xml
<manifest>
  <application>
    <!-- Agregar este intent filter -->
    <activity
      android:name=".MainActivity"
      android:launchMode="singleTask">
      <intent-filter>
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <data android:scheme="com.tuapp.bundle" />
      </intent-filter>
    </activity>
  </application>
</manifest>
```

### iOS (ios/YourApp/Info.plist):
```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>com.tuapp.bundle</string>
    </array>
  </dict>
</array>
```

## Paso 5: Probar la integración

1. Ejecuta la app
2. Ve a la pantalla de Fotos
3. Haz clic en "Conectar con Google"
4. Autoriza los permisos solicitados
5. Deberías ver tus fotos y álbumes de Google Photos

## Scopes requeridos

- `https://www.googleapis.com/auth/photoslibrary.readonly`: Leer fotos y álbumes
- `profile`: Información básica del perfil
- `email`: Dirección de email del usuario

## Notas importantes

- La API de Google Photos requiere OAuth 2.0 para acceder a datos privados
- Las fotos se muestran con URLs firmadas que expiran
- Respeta los límites de cuota de la API (10,000 requests por día para la mayoría de usuarios)
- Para producción, considera implementar refresh tokens

## Solución de problemas

### Error: "invalid_client"
- Verifica que el Client ID sea correcto
- Asegúrate de que la app esté registrada en Google Cloud Console

### Error: "access_denied"
- El usuario no autorizó los permisos
- Verifica que los scopes sean correctos

### Error: "quota_exceeded"
- Has excedido el límite de requests
- Espera o solicita un aumento de cuota

### Fotos no se cargan
- Verifica la conexión a internet
- Revisa que el token de acceso no haya expirado
- Verifica los permisos de la API
