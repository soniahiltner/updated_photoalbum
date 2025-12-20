# Plan: Optimizar rendimiento de renderizado de imágenes

Transformar las URLs de Cloudinary al solicitarlas para servir imágenes optimizadas según contexto (thumbnails ~400px, galería ~800px, modal full-size). Implementar lazy loading nativo y srcset responsivo. El enfoque híbrido (transformar en backend + cliente) maximiza flexibilidad sin reprocesar uploads.

## Steps

1. [Crear utilidad `getOptimizedImageUrl()`](server/src/libs/cloudinary.ts) para generar URLs transformadas con parámetros Cloudinary (`f_auto,q_auto,w_X,c_fill`)

2. [Modificar services/controllers](server/src/services/image.ts) para devolver múltiples versiones de URL (thumbnail, medium, original) usando la utilidad del paso 1

3. [Actualizar tipo `Image`](client/src/types.ts) agregando campos `thumbnailUrl` y `mediumUrl` además del `url` original

4. [Actualizar componentes Image/Gallery](client/src/components/Image) para usar `thumbnailUrl` en galería, agregar `loading="lazy"` y `srcset` para responsive

5. [Modificar GalleryModal](client/src/components/GalleryModal) para usar `url` original y precargar imágenes adyacentes con `<link rel="preload">`

6. [Actualizar API client y React Query](client/src/api/images.ts) para manejar nueva estructura de datos con múltiples URLs

## Further Considerations

1. **¿Transformar solo al solicitar o también al subir?** Recomiendo híbrido: al solicitar para flexibilidad, pero podrías agregar transformación básica al subir (max 2000px) para reducir storage

2. **¿Implementar LQIP (blur placeholder)?** Opcional pero mejora UX - Cloudinary puede generar versiones blur-up con `e_blur,w_50,q_1`

3. **¿Mantener compatibilidad con URLs antiguas?** Si hay imágenes ya subidas, la utilidad debería detectar si la URL ya tiene transformaciones
