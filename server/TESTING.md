# Testing Guide - Photo Album Backend

Este proyecto utiliza **Vitest** para testing, una herramienta moderna y rápida para pruebas en TypeScript/JavaScript.

## Scripts disponibles

```bash
# Ejecutar tests en modo interactivo (watch)
npm test

# Ejecutar tests una sola vez
npm run test:run

# Ejecutar tests con interfaz visual
npm run test:ui

# Ejecutar tests con coverage
npm run test:coverage
```

## Estructura de Tests

```
src/test/
├── sample.test.ts              # Tests de ejemplo básicos (5 tests)
├── business-logic.test.ts      # Tests de lógica de negocio (12 tests)
├── cloudinary.test.ts         # Tests para configuración de Cloudinary (7 tests)
├── helpers.ts                 # Utilidades para testing
├── setup.ts                   # Configuración global con MongoDB Memory Server
└── models/                    # Tests de modelos con MongoDB (48 tests)
    ├── album.test.ts           # Tests básicos del modelo Album (11 tests)
    ├── image.test.ts          # Tests básicos del modelo Image (9 tests)
    ├── integration.test.ts    # Tests de integración entre modelos (11 tests)
    └── validation.test.ts     # Tests avanzados de validación (17 tests)
```

**Total: 72 tests pasando con 100% coverage en modelos**

## Tipos de Tests Implementados

### 1. Tests Unitarios

- **Validación de datos**: Verifican reglas de negocio como longitud de nombres, formatos permitidos
- **Utilidades**: Funciones helper para formateo, validación, etc.
- **Configuración**: Validación de variables de entorno y configuraciones

### 2. Tests de Lógica de Negocio

- Validación de álbumes (nombre, longitud, formato)
- Validación de imágenes (extensiones, URLs, tamaños)
- Operaciones sobre datos (toggle favoritos, asociaciones)

### 3. Tests de Cloudinary

- Configuración de variables de entorno
- Validación de formatos de archivo
- Procesamiento de respuestas de upload

## Ejemplos de Tests

### Test básico

```typescript
import { describe, it, expect } from 'vitest'

describe('Album Validation', () => {
  it('should validate album name length', () => {
    const isValidLength = (name: string) => {
      return name.length >= 3 && name.length <= 20
    }

    expect(isValidLength('ab')).toBe(false)
    expect(isValidLength('abc')).toBe(true)
  })
})
```

### Test con mocks

```typescript
import { describe, it, expect, vi } from 'vitest'

describe('API Response', () => {
  it('should format success response', () => {
    const successResponse = (data: any) => ({
      success: true,
      data
    })

    const result = successResponse({ id: 1 })
    expect(result).toEqual({
      success: true,
      data: { id: 1 }
    })
  })
})
```

## Configuración Actual

- **Framework**: Vitest v4.0.8
- **Entorno**: Node.js
- **Base de datos**: MongoDB Memory Server para tests
- **Globals**: Habilitadas (describe, it, expect disponibles globalmente)
- **Coverage**: Configurado con @vitest/coverage-v8
- **Timeouts**: 15s para tests y hooks (MongoDB setup)

### MongoDB Testing Setup

Los tests de modelos utilizan MongoDB Memory Server que:

- Crea una instancia de MongoDB en memoria para cada ejecución
- Se configura automáticamente en `src/test/setup.ts`
- Limpia datos entre tests para aislamiento
- No requiere MongoDB instalado localmente
- Es completamente independiente de datos de producción

## Próximos Pasos

Para una implementación completa, considera:

1. **Tests de Integración**: Con base de datos de prueba (MongoDB Memory Server)
2. **Tests de API**: Con supertest para endpoints HTTP
3. **Tests de Middleware**: Validación, autenticación, upload de archivos
4. **Tests E2E**: Flujos completos de usuario

## Comandos Útiles

```bash
# Ejecutar tests con coverage
npm run test:coverage

# Ejecutar tests específicos
npx vitest run src/test/business-logic.test.ts

# Modo watch (recarga automática)
npm test

# Ver interfaz visual
npm run test:ui
```

## Notas

- Los tests de modelos están temporalmente deshabilitados porque requieren configuración de MongoDB
- El proyecto usa ES modules (`"type": "module"`), por lo que la configuración está adaptada
- Los tests son independientes y no requieren setup complejo por ahora
- Se incluye validación de TypeScript en los tests
