# Retícula de Consenso Parlamentario

## Descripción General

La **Retícula de Consenso Parlamentario** es una visualización interactiva que combina conceptos ecológicos con representación política democrática. El sistema simula cómo las ondas de consenso se propagan a través de una estructura parlamentaria circular, mientras que una forma central morfológica responde a los parámetros de control.

## Arquitectura Visual

### Estructura Concéntrica
- **7 anillos concéntricos** que representan diferentes niveles de organización ecológica
- **210 escaños parlamentarios** distribuidos proporcionalmente (12-48 por anillo)
- **Forma central dinámica** que se transforma según los parámetros de entrada

### Marco Conceptual Ecológico

#### Ejes Principales
- **GENÉTICO** (Norte): Información heredable y variación
- **ECOSISTEMA** (Sur): Redes de interacción completas  
- **ESPECIES** (Este): Diversidad taxonómica
- **CONECTIVIDAD** (Oeste): Flujos e intercambios

#### Componentes Internos
- **MICROBIOS**: Organismos microscópicos fundamentales
- **ANIMALES**: Fauna y comportamiento
- **PLANTAS**: Flora y producción primaria
- **HÁBITATS**: Espacios y nichos ecológicos
- **FUNCIÓN**: Procesos ecosistémicos
- **ESTRUCTURA**: Organización espacial
- **MOVIMIENTO**: Dinámicas temporales

## Controles Interactivos

### 1. Espinas (0-127)
**Dirección OSC**: `/spike`
- **Función**: Controla la variabilidad de la forma central
- **Rango visual**: 0-100 unidades de desviación
- **Efecto**: Mayor valor = forma más irregular y dinámica

### 2. Opacidad (0-127)
**Dirección OSC**: `/opacity`
- **Función**: Transparencia de la forma central
- **Rango visual**: 0-1 (completamente transparente a opaco)
- **Efecto**: Permite ver los escaños a través de la forma central

### 3. Velocidad de Pulso (1-127)
**Dirección OSC**: `/speed`
- **Función**: Frecuencia de regeneración de la forma central
- **Rango visual**: Intervalos de 1-127 frames
- **Efecto**: Mayor valor = transformaciones más rápidas

### 4. Onda de Consenso (1-127)
**Dirección OSC**: `/consensus`
- **Función**: Velocidad de propagación del consenso
- **Rango visual**: Multiplicador de 0.08-5.0
- **Efecto**: Controla cómo las ondas de consenso viajan por los anillos

### 5. Intensidad de Escaños (1-127)
**Dirección OSC**: `/intensity`
- **Función**: Amplitud del brillo de los escaños
- **Rango visual**: Multiplicador de 0.08-3.0
- **Efecto**: Mayor intensidad = escaños más brillantes durante consenso alto

## Sistema de Consenso

### Algoritmo de Ondas
El consenso se calcula mediante **interferencia de múltiples ondas**:

```javascript
wave1 = sin(ángulo + radio * 0.01 + tiempo * velocidad_consenso * 0.05)
wave2 = sin(anillo * 0.5 + tiempo * velocidad_consenso * 0.03)  
wave3 = sin(tiempo * velocidad_consenso * 0.02 + índice_escaño * 0.1)

consenso = (wave1 * wave2 * wave3) * intensidad
```

### Representación Visual
- **Color**: HSL dinámico basado en anillo y tiempo
- **Opacidad**: 0.3 + consenso * 0.7
- **Tamaño**: 1.5 + consenso * 1.0 unidades de radio

## Protocolo OSC

### Configuración de Red
- **Puerto de entrada**: 8080
- **Puerto de salida**: 9090
- **Host**: localhost
- **Protocolo**: WebSocket-to-OSC bridge requerido

### Mensajes Soportados

#### Entrada (Control remoto)
```
/spike <int 0-127>      # Controla espinas
/opacity <int 0-127>    # Controla opacidad  
/speed <int 1-127>      # Controla velocidad
/consensus <int 1-127>  # Controla ondas de consenso
/intensity <int 1-127>  # Controla intensidad de escaños
```

#### Salida (Feedback de estado)
Los mismos mensajes se envían cuando se modifican los controles manualmente.

### Implementación OSC Real

Para conectividad OSC completa, necesitas un servidor puente:

```javascript
// Ejemplo con node-osc
const osc = require('node-osc');
const WebSocket = require('ws');

const oscServer = new osc.Server(8080, '0.0.0.0');
const oscClient = new osc.Client('127.0.0.1', 9090);
const wss = new WebSocket.Server({ port: 8081 });
```

## Casos de Uso

### 1. Visualización de Datos Políticos
- Mapear datos reales de votaciones parlamentarias
- Visualizar patrones de consenso histórico
- Análisis de polarización política

### 2. Control Artístico en Vivo
- Performance audiovisual con controladores MIDI/OSC
- Sincronización con música y sonido
- Instalaciones interactivas

### 3. Simulación Ecológica
- Modelado de dinámicas de ecosistemas
- Visualización de redes tróficas
- Análisis de conectividad de hábitats

### 4. Investigación Interdisciplinaria
- Estudios de sistemas complejos
- Visualización de datos multidimensionales
- Herramienta educativa para conceptos sistémicos

## Especificaciones Técnicas

### Rendimiento
- **Framerate objetivo**: 60 FPS
- **Escaños renderizados**: 210 elementos SVG
- **Optimización**: RequestAnimationFrame para suavidad visual

### Compatibilidad
- **Navegadores**: Chrome, Firefox, Safari, Edge (últimas versiones)
- **Dispositivos**: Desktop, tablet, móvil (responsivo)
- **Resolución**: Escalable SVG, óptimo en 600x600px

### Dependencias
- **Fuentes**: Google Fonts (Futura)
- **Protocolos**: WebSocket para OSC bridge
- **Estándares**: SVG 1.1, ES6 JavaScript

## Desarrollo y Extensión

### Estructura del Código
- **HTML**: Estructura SVG y controles
- **CSS**: Estilización y gradientes
- **JavaScript**: Lógica de animación y OSC

### Puntos de Extensión
- **Algoritmos de consenso**: Modificar funciones de onda
- **Esquemas de color**: Personalizar paletas
- **Distribución de escaños**: Cambiar geometría parlamentaria
- **Protocolos adicionales**: MIDI, DMX, Artnet

### Contribución
El código está estructurado para facilitar:
- Nuevos algoritmos de visualización
- Protocolos de comunicación adicionales
- Esquemas conceptuales alternativos
- Optimizaciones de rendimiento

---

*Documento generado para la Retícula de Consenso Parlamentario v1.0*