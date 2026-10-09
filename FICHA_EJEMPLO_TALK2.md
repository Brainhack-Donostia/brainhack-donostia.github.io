# Ficha de conferenciante — Ejemplo rellenado (Talk 2)

<!--
  ============================================================================
  COMENTARIOS EXPLICATIVOS
  ----------------------------------------------------------------------------
  Este documento es un EJEMPLO REAL: muestra la ficha de un conferenciante ya
  existente en el sitio (Ibai Diez Palacio, Talk 2) rellenada siguiendo el
  mismo formato que la plantilla `SPEAKER_TEMPLATE.md`.

  La ficha original vive en:
    _posts/2026-11-04-talk-2-ibai-diez-palacio.markdown

  Sirve de referencia para saber cómo debe quedar un archivo completo. Al
  añadir un nuevo conferenciante, copia la estructura (NO este texto) y
  sustituye cada campo por los datos del nuevo speaker.

  Reglas clave repetidas aquí:
    - modal-id debe ser ÚNICO y coincidir en:
        _includes/portfolio_grid.html  (la tupla clicable)
        _includes/modals.html          (la ventana modal)
    - `description` se escribe en HTML: usa <br /><br /> entre párrafos
      y <strong> para los títulos (About / Profile).
    - `img` y `thumbnail` van vacíos si aún no hay foto confirmada; la grilla
      mostrará entonces el marcador "Photo coming soon".
  ============================================================================
-->

# Talk 2 — Ibai Diez Palacio

## Información del archivo

- **Ruta en el repo:** `_posts/2026-11-04-talk-2-ibai-diez-palacio.markdown`
- **modal-id:** `6`
- **Fecha del talk:** `2026-11-04`
- **Categoría:** `Keynote Talk`

## Contenido del front matter (tal cual, listo para copiar)

```markdown
---
title: "From Brain Maps to Molecular Mechanisms: Unveiling the Neuroimaging-Genetic Intersections in the Human Brain"
subtitle: "Ibai Diez Palacio, Ikerbasque Research Fellow <br /> @ Biobizkaia Health Research Institute"
layout: default
modal-id: 6
date: 2026-11-04
img:
thumbnail:
alt: "Portrait of Ibai Diez Palacio — photograph to be added once image rights are confirmed"
project-date: November 2026
category: Keynote Talk
description: "Neuroimaging has transformed our ability to map brain structure, function, connectivity, and pathology in vivo. However, many neuroimaging findings remain primarily descriptive, identifying where the brain changes without fully explaining the biological mechanisms underlying these spatial patterns. In this talk, I will discuss the importance of moving beyond anatomical localization toward mechanistic interpretation of neuroimaging results. I will present different computational approaches that integrate neuroimaging-derived brain maps with molecular and cellular information, including transcriptomic and cell-type-specific data, to identify underlying cellular and molecular mechanism behind neuroimaging findings. This talk will emphasize how open datasets, and reproducible workflows, can help bridge systems neuroscience and molecular neuroscience. By connecting brain maps with biological context, neuroimaging can become not only a tool for detecting where changes occur, but also a starting point for understanding why they occur and how they may inform future biomarkers, disease models, and therapeutic strategies.<br /><br />
<strong> About </strong><br />
Ibai Diez Palacio is an Ikerbasque Research Fellow at Biobizkaia Health Research Institute. His research combines computational neuroimaging, genetics and precision medicine to investigate neurodegenerative disorders and the neuroprotective mechanisms of the brain. His previous research experience includes Massachusetts General Hospital–Harvard Medical School, BioCruces Research Institute and Tecnalia-Health.<br /><br />
<strong>Profile:</strong> <a href=\"https://www.ikerbasque.net/en/ibai-diez\" target=\"_blank\" rel=\"noopener\">Official Ikerbasque profile</a>"
---
```

---

## Desglose campo a campo (qué contiene cada línea)

| Campo | Valor en este ejemplo | Observación |
|-------|-----------------------|-------------|
| `title` | Título de la charla en inglés | Enfoca el tema de la charla, no el CV. |
| `subtitle` | "Nombre, cargo `<br />` @ Institución" | El `<br />` fuerza salto de línea. |
| `layout` | `default` | Siempre igual. |
| `modal-id` | `6` | Único; enlaza grilla ↔ modal. |
| `date` | `2026-11-04` | Fecha `YYYY-MM-DD`. |
| `img` | *(vacío)* | Imagen expandida (modal), pendiente. |
| `thumbnail` | *(vacío)* | Miniatura de la grilla, pendiente. |
| `alt` | Texto del retrato + nota de derechos | Se muestra si falta la imagen. |
| `project-date` | `November 2026` | Mes y año del evento. |
| `category` | `Keynote Talk` | Mismo valor en los 4 talks. |
| `description` | Párrafos HTML | Estructura: resumen → `<strong>About</strong>` → bio → `<strong>Profile:</strong>` + enlace. |

---

## Cómo usarlo como modelo

1. Copia el bloque de front matter de arriba en un archivo nuevo dentro de `_posts/`.
2. Renombra el archivo: `2026-11-07-talk-5-nombre-apellido.markdown` (fecha + nº + nombre).
3. Sustituye cada campo por los datos del nuevo conferenciante.
4. Asigna un `modal-id` libre (el mayor actual es `8` → usa `9`).
5. Añade el mismo `modal-id` en `_includes/modals.html` y la tupla en `_includes/portfolio_grid.html`.
6. Verifica con `bundle exec jekyll serve --trace` y mirando la página en el navegador.