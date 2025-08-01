# Arquitectura dApp para Trading de Tokens Ambientales

## Resumen Ejecutivo

Esta aplicación descentralizada (dApp) permite crear, distribuir y comercializar tokens ambientales como incentivos comunitarios. La arquitectura consta de 3 capas principales: Blockchain, API y Cliente (Android).

## 1. Capa Blockchain (Lógica Central)

### 1.1 Contrato Inteligente de Tokens
**Función**: Gestiona el ciclo de vida del token ambiental

**Características críticas**:
- Creación (minting), transferencias y quema de tokens
- Pool inicial de incentivos en wallet especial
- Estándar ASA (Algorand) o HTS (Hedera)

**Sugerencia**: Usar ASA de Algorand por simplicidad y documentación extensa

### 1.2 Contrato de Incentivos y Verificación ("Motor de Políticas")
**Función**: Núcleo de la lógica de negocio

**Funciones principales**:
- `crear_programa_incentivo()`: Define reglas (ej: "1 árbol = 5 tokens")
- `enviar_solicitud_verificacion()`: Usuario sube prueba (foto + GPS)
- `verificar_y_recompensar()`: Solo validadores pueden ejecutar
- `obtener_recompensas_usuario()`: Historial público

**Crítica**: Este es el componente más complejo. Requiere diseño cuidadoso de la lógica de verificación.

### 1.3 Contrato de Validadores ("Oráculo")
**Función**: Gestiona la verificación de pruebas

**Implementación**:
- Lista blanca de direcciones autorizadas
- Puede ser manual (comunidad) o automatizado (IA)

**Sugerencia**: Comenzar con validación manual y evolucionar hacia automatización

## 2. Capa API (Puente de Comunicación)

### 2.1 Servidor Backend
**Opciones**:
- Funciones serverless (AWS Lambda, Google Cloud)
- Servidor tradicional (Node.js + Express)

**Crítica**: Las funciones serverless son más escalables pero menos control sobre estado

### 2.2 Integración Blockchain
**Herramientas**:
- Algorand SDK (JavaScript/Python)
- Hedera SDK (JavaScript/Java)

### 2.3 Endpoints API Esenciales
- `POST /enviar_prueba`: Sube evidencia del usuario
- `GET /usuario/:direccion/balance`: Consulta saldo de tokens
- `GET /usuario/:direccion/historial`: Historial de transacciones
- `GET /datos_intercambio`: Datos de trading en tiempo real
- `POST /comerciar`: Inicia operación de intercambio

**Sugerencia**: Implementar autenticación robusta y rate limiting desde el inicio

## 3. Capa Cliente (Aplicación Android)

### 3.1 Wallet del Usuario
**Crítico**: Gestión segura de claves privadas
- Almacenamiento seguro en dispositivo
- Autenticación biométrica obligatoria
- Backup de semilla de recuperación

### 3.2 Interfaz de Envío de Incentivos
**Funcionalidad**:
- Selección de programa de incentivo
- Captura de evidencia (foto + GPS)
- Envío a API para procesamiento

### 3.3 Historial de Recompensas
**Información mostrada**:
- Recompensas obtenidas
- Estado de verificación (pendiente/aprobada/rechazada)
- Detalles de cada envío

### 3.4 Interfaz de Intercambio
**Funcionalidades**:
- Visualización de balance actual
- Trading básico de tokens
- Historial de transacciones

## Comparación de Plataformas

### Hedera Guardian
**Ventajas**:
- Framework pre-construido para créditos de carbono
- dMRV (digital MRV) integrado
- Mayor adopción en sector ambiental

**Desventajas**:
- Menos flexible para casos de uso generales
- Framework más complejo de personalizar
- Documentación menos accesible

**Recomendación**: Ideal si el foco son específicamente créditos de carbono verificados

### Algorand AlgoKit
**Ventajas**:
- Herramientas de desarrollo superiores
- Documentación extensa y clara
- Mayor flexibilidad para lógica personalizada
- Comunidad de desarrolladores más activa

**Desventajas**:
- Requiere construir lógica dMRV desde cero
- Menos recursos específicos para tokens ambientales

**Recomendación**: Mejor opción para desarrollo ágil y personalizado

## Sugerencias de Implementación

### Fase 1: MVP (3-4 meses)
1. Desarrollar contrato básico de tokens en Algorand
2. API simple con validación manual
3. App Android básica (wallet + envío de pruebas)

### Fase 2: Expansión (2-3 meses)
1. Implementar sistema de intercambio
2. Mejorar UI/UX de la aplicación
3. Agregar más tipos de incentivos ambientales

### Fase 3: Optimización (ongoing)
1. Automatizar verificación con IA
2. Integrar con exchanges externos
3. Expandir a otras blockchain si es necesario

## Consideraciones Críticas

1. **Seguridad**: La gestión de claves privadas es fundamental
2. **Escalabilidad**: Considerar costos de transacción a gran escala
3. **Experiencia de Usuario**: La complejidad blockchain debe ser invisible
4. **Regulación**: Verificar marco legal para tokens ambientales en tu jurisdicción
5. **Validación**: Diseñar sistema robusto contra fraude desde el inicio

## Conclusión

**Recomendación final**: Comenzar con Algorand AlgoKit para mayor flexibilidad y mejores herramientas de desarrollo. Una vez establecido el MVP, evaluar migración parcial a Hedera Guardian si se requieren funcionalidades específicas de créditos de carbono verificados.

## Implementación Paso a Paso con TypeScript

### Prerrequisitos del Entorno de Desarrollo
```bash
# Instalar Node.js 18+ y npm
node --version  # Verificar >= 18.0.0
npm --version

# Instalar AlgoKit CLI
pip install algokit

# Verificar instalación
algokit --version
```

### Paso 1: Configuración del Proyecto Backend (Semana 1)

#### 1.1 Inicializar Proyecto AlgoKit
```bash
# Crear nuevo proyecto
algokit init

# Seleccionar:
# - Template: "beaker" (para contratos inteligentes)
# - Language: TypeScript
# - Framework: React (para frontend futuro)

cd mi-proyecto-tokens-ambientales
```

#### 1.2 Estructura de Proyecto TypeScript
```
proyecto/
├── backend/
│   ├── contracts/          # Contratos inteligentes
│   ├── api/               # API REST en TypeScript
│   └── tests/             # Pruebas unitarias
├── frontend/
│   └── android/           # App Android (React Native)
└── shared/
    └── types/             # Tipos TypeScript compartidos
```

#### 1.3 Configurar API Backend
```bash
cd backend/api
npm init -y
npm install --save express cors helmet morgan compression
npm install --save-dev @types/node @types/express typescript ts-node nodemon
npm install --save algosdk @algorandfoundation/algokit-utils
```

### Paso 2: Desarrollo de Contratos Inteligentes (Semana 2-3)

#### 2.1 Contrato de Token Ambiental
```typescript
// contracts/environmental-token.ts
import { Contract } from '@algorandfoundation/tealscript';

class EnvironmentalToken extends Contract {
  // Estado del contrato
  totalSupply = GlobalStateValue<uint64>();
  incentivePool = GlobalStateValue<Address>();
  
  // Crear token inicial
  createToken(supply: uint64): AssetID {
    // Lógica de creación del ASA
    return this.itxn.submit({
      type: 'acfg',
      total: supply,
      creator: this.txn.sender,
      unitName: 'ENVTK',
      assetName: 'Environmental Token'
    });
  }
  
  // Transferir tokens como recompensa
  rewardUser(user: Address, amount: uint64): void {
    // Solo el contrato de incentivos puede llamar esto
    assert(this.txn.sender === this.incentiveContract.value);
    
    this.itxn.submit({
      type: 'axfer',
      receiver: user,
      amount: amount,
      asset: this.tokenAssetId.value
    });
  }
}
```

#### 2.2 Contrato de Incentivos
```typescript
// contracts/incentive-manager.ts
import { Contract } from '@algorandfoundation/tealscript';

class IncentiveManager extends Contract {
  // Estados
  validators = GlobalStateMap<Address, uint64>(); // Lista de validadores
  programs = GlobalStateMap<uint64, IncentiveProgram>(); // Programas activos
  submissions = LocalStateMap<uint64, Submission>(); // Envíos de usuarios
  
  // Crear programa de incentivos
  createIncentiveProgram(
    name: string,
    tokensPerAction: uint64,
    validatorRequired: boolean
  ): uint64 {
    const programId = this.nextProgramId.value;
    
    this.programs[programId] = {
      name: name,
      tokensPerAction: tokensPerAction,
      validatorRequired: validatorRequired,
      active: true
    };
    
    return programId;
  }
  
  // Usuario envía prueba
  submitProof(
    programId: uint64,
    proofHash: bytes,
    location: string
  ): uint64 {
    const submissionId = this.nextSubmissionId.value;
    
    this.submissions[submissionId] = {
      user: this.txn.sender,
      programId: programId,
      proofHash: proofHash,
      location: location,
      status: 'pending',
      timestamp: Global.latestTimestamp
    };
    
    return submissionId;
  }
  
  // Validador aprueba y recompensa
  verifyAndReward(submissionId: uint64, approved: boolean): void {
    // Verificar que el llamador es un validador
    assert(this.validators[this.txn.sender].exists);
    
    const submission = this.submissions[submissionId];
    const program = this.programs[submission.programId];
    
    if (approved) {
      // Llamar al contrato de tokens para recompensar
      this.itxn.submit({
        applicationId: this.tokenContract.value,
        method: 'rewardUser',
        args: [submission.user, program.tokensPerAction]
      });
      
      submission.status = 'approved';
    } else {
      submission.status = 'rejected';
    }
  }
}
```

### Paso 3: API REST en TypeScript (Semana 4)

#### 3.1 Servidor Express
```typescript
// api/src/server.ts
import express from 'express';
import cors from 'cors';
import { AlgorandService } from './services/algorand.service';
import { IncentiveController } from './controllers/incentive.controller';

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servicios
const algorandService = new AlgorandService();
const incentiveController = new IncentiveController(algorandService);

// Rutas
app.post('/api/enviar-prueba', incentiveController.submitProof);
app.get('/api/usuario/:address/balance', incentiveController.getUserBalance);
app.get('/api/usuario/:address/historial', incentiveController.getUserHistory);
app.post('/api/comerciar', incentiveController.initiateTrade);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
```

#### 3.2 Servicio Algorand
```typescript
// api/src/services/algorand.service.ts
import algosdk from 'algosdk';
import { AlgoKitClient } from '@algorandfoundation/algokit-utils';

export class AlgorandService {
  private algodClient: algosdk.Algodv2;
  private appClient: AlgoKitClient;
  
  constructor() {
    this.algodClient = new algosdk.Algodv2(
      process.env.ALGOD_TOKEN || '',
      process.env.ALGOD_SERVER || 'https://testnet-api.algonode.cloud',
      process.env.ALGOD_PORT || 443
    );
  }
  
  async getUserBalance(address: string): Promise<number> {
    const accountInfo = await this.algodClient.accountInformation(address).do();
    const tokenAsset = accountInfo.assets?.find(
      asset => asset['asset-id'] === this.tokenAssetId
    );
    return tokenAsset?.amount || 0;
  }
  
  async submitProofToBlockchain(
    userAddress: string,
    programId: number,
    proofHash: string,
    location: string
  ): Promise<string> {
    // Interactuar con el contrato de incentivos
    const result = await this.appClient.call({
      method: 'submitProof',
      args: [programId, proofHash, location]
    });
    
    return result.txId;
  }
}
```

### Paso 4: Aplicación Android con React Native (Semana 5-6)

#### 4.1 Configuración React Native
```bash
cd frontend
npx react-native init EnvironmentalTokenApp --template react-native-template-typescript
cd EnvironmentalTokenApp

# Instalar dependencias específicas
npm install @react-native-async-storage/async-storage
npm install react-native-camera react-native-permissions
npm install @react-navigation/native @react-navigation/stack
npm install react-native-keychain  # Para almacenamiento seguro de claves
```

#### 4.2 Componente Principal de Wallet
```typescript
// src/components/WalletManager.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';
import algosdk from 'algosdk';

interface WalletState {
  address: string | null;
  balance: number;
  privateKey: string | null;
}

export const WalletManager: React.FC = () => {
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    balance: 0,
    privateKey: null
  });
  
  // Crear nueva wallet
  const createWallet = async () => {
    const account = algosdk.generateAccount();
    
    // Guardar clave privada de forma segura
    await Keychain.setInternetCredentials(
      'environmental_token_wallet',
      account.addr,
      algosdk.secretKeyToMnemonic(account.sk)
    );
    
    setWallet({
      address: account.addr,
      balance: 0,
      privateKey: algosdk.secretKeyToMnemonic(account.sk)
    });
  };
  
  // Cargar wallet existente
  const loadWallet = async () => {
    try {
      const credentials = await Keychain.getInternetCredentials('environmental_token_wallet');
      if (credentials) {
        setWallet({
          address: credentials.username,
          balance: await fetchBalance(credentials.username),
          privateKey: credentials.password
        });
      }
    } catch (error) {
      console.log('No hay wallet guardada');
    }
  };
  
  const fetchBalance = async (address: string): Promise<number> => {
    const response = await fetch(`${API_BASE_URL}/usuario/${address}/balance`);
    const data = await response.json();
    return data.balance;
  };
  
  useEffect(() => {
    loadWallet();
  }, []);
  
  return (
    <View>
      <Text>Dirección: {wallet.address || 'No configurada'}</Text>
      <Text>Balance: {wallet.balance} ENVTK</Text>
      {!wallet.address && (
        <Button title="Crear Wallet" onPress={createWallet} />
      )}
    </View>
  );
};
```

### Paso 5: Integración y Testing (Semana 7-8)

#### 5.1 Tests Unitarios
```typescript
// backend/tests/incentive.test.ts
import { describe, it, expect } from '@jest/globals';
import { AlgorandService } from '../src/services/algorand.service';

describe('IncentiveManager', () => {
  let service: AlgorandService;
  
  beforeEach(() => {
    service = new AlgorandService();
  });
  
  it('debería crear un programa de incentivos', async () => {
    const programId = await service.createIncentiveProgram(
      'Plantar Árboles',
      5, // 5 tokens por árbol
      true // Requiere validación
    );
    
    expect(programId).toBeGreaterThan(0);
  });
  
  it('debería permitir envío de prueba', async () => {
    const txId = await service.submitProof(
      'USER_ADDRESS',
      1, // programId
      'PROOF_HASH',
      'Medellín, Colombia'
    );
    
    expect(txId).toBeDefined();
  });
});
```

### Cronograma de Desarrollo (8 Semanas)

| Semana | Actividad | Entregable |
|--------|-----------|------------|
| 1 | Configuración entorno + Contratos base | Contratos desplegados en testnet |
| 2-3 | Lógica de contratos + Testing | Contratos funcionales |
| 4 | API REST + Integración blockchain | API funcional |
| 5-6 | App Android + UI básica | App con funciones core |
| 7 | Integración completa + Testing | Sistema integrado |
| 8 | Pulimiento + Documentación | MVP listo para demo |

## Viabilidad con Plan Claude.ai

Basado en la información de precios disponible, Claude Pro Plan ($18/month billed annually or $20/month billed monthly) sería suficiente para este proyecto. 

**Estimación de uso mensual**:
- Consultas de desarrollo: ~200-300 por mes
- Revisión de código: ~100-150 por mes  
- Debugging y optimización: ~100-200 por mes
- Documentación: ~50-100 por mes

**Total estimado**: 450-750 consultas/mes

El plan Pro de Claude ofrece límites de uso significativamente superiores al plan gratuito, siendo adecuado para un proyecto de desarrollo de esta escala durante el período de 2 meses de desarrollo intensivo.

**Recomendación**: El plan Pro de Claude ($20/mes) es suficiente y rentable para completar este proyecto en TypeScript en 8 semanas.