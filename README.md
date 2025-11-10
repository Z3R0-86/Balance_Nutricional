#  Balance Nutricional - Contador de Calorías

Aplicación web educativa desarrollada con React y Next.js para calcular, registrar y monitorear el consumo diario de calorías.

## Características Principales

✅ **Cálculo Automático de Calorías**
- Fórmula Harris-Benedict para TMB (Tasa Metabólica Basal)
- Cálculo de TDEE (Gasto Energético Total Diario)
- Niveles de actividad física personalizables

✅ **Registro de Alimentos**
- Base de datos de 35+ alimentos en 7 categorías
- Búsqueda y filtrado por categoría
- Cantidad flexible en gramos

✅ **Visualización de Progreso**
- Gráfico circular del progreso diario
- Mensajes motivacionales dinámicos
- Gráfico de historial de 7 días

✅ **Gestión de Usuarios**
- Registro e inicio de sesión local
- Nombres únicos de usuario
- Persistencia de datos en navegador

✅ **Experiencia de Usuario**
- Tema claro/oscuro
- Diseño responsive (móvil, tablet, escritorio)
- Descarga de resumen en PDF
- Compartir resumen por portapapeles

## Almacenamiento de Datos

Todos los datos se guardan **localmente en el navegador** usando `localStorage`:

- **Perfil de usuario** - Datos personales y TMB/TDEE
- **Registros diarios** - Alimentos consumidos por día
- **Historial** - Últimos 7 días de registros
- **Preferencias** - Configuración de tema

**No se requiere servidor backend ni base de datos externa.**

## Despliegue

Esta aplicación está pensada para ser desplegada en Vercel (plataforma recomendada). Para el desarrollo local puedes usar los scripts definidos en `package.json`.

Si necesitas ejecutar la app localmente, ejecuta los scripts desde tu gestor de paquetes preferido (los comandos están en `package.json`).

# Balance Nutricional

Aplicación educativa para calcular y monitorear el consumo diario de calorías.

Este repositorio contiene una aplicación web construida con Next.js y TypeScript. Está pensada para uso local como herramienta educativa y de aprendizaje sobre nutrición y desarrollo web.

## Qué hace
- Calcula requerimientos energéticos (TMB/TDEE) a partir de datos del usuario
- Permite registrar alimentos consumidos y llevar un historial local
- Muestra visualizaciones simples del progreso diario y del historial
- Gestiona preferencias de usuario (tema, configuraciones) y guarda todo en el navegador

## Tecnologías principales
- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS

## Nota sobre desarrollo local
Los scripts útiles están definidos en `package.json` (dev, build, start, lint). Úsalos según tu flujo de trabajo local si necesitas probar cambios antes de desplegar en Vercel.

## Scripts útiles (package.json)
- dev — servidor de desarrollo
- build — compilación para producción
- start — iniciar la app en producción
- lint — ejecutar linter (si está configurado)

## Estructura (general)
- `app/` — rutas y layouts
- `components/` — componentes UI y pantallas
- `lib/` — lógica de negocio (cálculos, almacenamiento)

## Nota sobre el entorno de desarrollo
- La carpeta de compilación (`.next`) se genera automáticamente y no debe versionarse.
- Si el editor marca imports de `.css` en rojo, crea/usa una declaración global de tipos (por ejemplo `global.d.ts` con `declare module '*.css'`) y reinicia el servidor TypeScript.

## Contribuciones
Este proyecto está orientado a uso educativo. Si deseas contribuir, crea un fork y abre un PR con cambios pequeños y documentados.

## Licencia
Uso educativo y libre modificación.

---

**Versión:** 1.0.0
**Última actualización:** 2025