# 📦 OCA Tracking App

Aplicación web en **Angular 18** para realizar el seguimiento de envíos de **OCA** utilizando su API pública.  
Permite buscar el historial de un envío mediante:

- **Número de Documento del Cliente** + **CUIT**
- **Número de Envío (Pieza)** de 19 dígitos

---

## ✨ Características

- Formulario responsive para ingreso de datos
- Validaciones para CUIT y número de pieza
- Integración con API de OCA vía HTTP
- Historial de seguimiento con línea de tiempo
- Mensajes de error claros y estados de carga
- Limpieza rápida del formulario
- Soporte para **proxy Angular** para evitar problemas de CORS

---

## 📂 Estructura del Proyecto
```bash
src/
├── app/
│ ├── components/
│ │ └── oca-tracking/
│ │ ├── oca-tracking.component.ts
│ │ ├── oca-tracking.component.html
│ │ └── oca-tracking.component.css
│ ├── models/
│ │ ├── TrackingItem.ts
│ │ ├── ParsedTrackingItem.ts
│ │ └── TrackingRequest.ts
│ ├── services/
│ │ └── oca-tracking.service.ts
│ ├── app.component.ts
│ ├── app.component.html
│ ├── app.routes.ts
│ └── app.config.ts
├── proxy.conf.json
├── index.html
└── main.ts
```

## ⚙️ Instalación y Ejecución

### 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/UlisesLara13/OcaSeguimiento.git
```

### 2️⃣ Instalar dependencias

```bash
npm install
```

### 3️⃣ Ejecutar la aplicación (Necesario utilizar el proxy si lo pruebas localmente)

```bash
ng serve --proxy-config proxy.conf.json
```

### 📡 Ejemplo de uso de la API de OCA

Endpoint para obtener historial completo de un envío:

GET http://webservice.oca.com.ar/ePak_tracking/Oep_TrackEPak.asmx/Tracking_Pieza


Parámetros:

NroDocumentoCliente (DNI)

CUIT (con guiones)

Pieza (número de envío de 19 dígitos)

Ejemplo:

http://webservice.oca.com.ar/ePak_tracking/Oep_TrackEPak.asmx/Tracking_Pieza?NroDocumentoCliente=415111232&CUIT=20-415111232-6&Pieza=3623000000001546446

