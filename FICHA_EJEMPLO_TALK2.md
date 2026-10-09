# Ficha de conferenciante — Ejemplo rellenado (Talk 2)

<!--
  ============================================================================
  COMENTARIOS EXPLICATIVOS
  ----------------------------------------------------------------------------
  Este documento es un EJEMPLO REAL: muestra la ficha de un conferenciante ya
  existente en el sitio (Pandelis Perakakis, Talk 2) rellenada siguiendo el
  mismo formato que la plantilla `SPEAKER_TEMPLATE.md`.

  La ficha original vive en:
    _posts/2026-11-04-talk-2-pandelis-perakakis.markdown

  Sirve de referencia para saber cómo debe quedar un archivo completo. Al
  añadir un nuevo conferenciante, copia la estructura (NO este texto) y
  sustituye cada campo por los datos del nuevo speaker.

  Reglas clave repetidas aquí:
    - modal-id debe ser ÚNICO y coincidir en:
        _includes/portfolio_grid.html  (la tupla clicable)
        _includes/modals.html          (la ventana modal)
    - `description` se escribe en HTML: usa <br /><br /> entre párrafos
      y <strong> para los títulos (About / Profile).
    - `img` (600×450) y `thumbnail` (400×289) viven en `img/portfolio/`.
      Si van vacíos, la grilla y la modal muestran "Photo coming soon".
  ============================================================================
-->

# Talk 2 — Pandelis Perakakis

## Información del archivo

- **Ruta en el repo:** `_posts/2026-11-04-talk-2-pandelis-perakakis.markdown`
- **modal-id:** `6`
- **Fecha del talk:** `2026-11-04`
- **Categoría:** `Keynote Talk`
- **Foto:** sí (`pandelis-perakakis.jpg` / `pandelis-perakakis-thumbnail.jpg`)

## Contenido del front matter (tal cual, listo para copiar)

```markdown
---
title: "Replacing academic journals by repositories and peer communities"
subtitle: "Pandelis Perakakis, Associate Professor of Psychology <br /> @ Complutense University of Madrid (UCM)"
layout: default
modal-id: 6
date: 2026-11-04
img: pandelis-perakakis.jpg
thumbnail: pandelis-perakakis-thumbnail.jpg
alt: "Portrait of Pandelis Perakakis"
project-date: November 2026
category: Keynote Talk
description: "Journals once solved a genuine problem: how to distribute and certify research in a world of paper and scarcity. That world is gone, and the institution has outlived the problem it was built to solve. Publication already happens in repositories, and evaluation can be carried out by communities of peers whose judgments are themselves deposited back into those repositories as open, citable research objects. This talk makes the case for replacing journal-based publishing, inspired by existing successful projects and initiatives. The time for change is ripe: open infrastructures and an international movement for research assessment reform now promise to end the reliance on journal metrics when evaluating research and careers. I will present examples of do-it-yourself, journal-independent scientific communication and explore how to bridge the remaining technical gaps and improve interoperability between today's publication and review-management workflows.<br /><br />
<strong> About </strong><br />
Pandelis Perakakis is an Associate Professor of Psychology at the Complutense University of Madrid. He holds a PhD in clinical psychophysiology from the University of Granada. His research focuses on affect dynamics and psychological well-being. In 2012, he founded Open Scholar to promote a scholar-governed publication and evaluation model based on institutional repositories and open peer review. Since 2025, he has served as an advisor to the UCM Vice-Rectorate for Research and Transfer and as coordinator of the UCM CoARA Working Group.<br /><br />
<strong>Profile:</strong> <a href=\"https://produccioncientifica.ucm.es/investigadores/146564/detalle?lang=en\" target=\"_blank\" rel=\"noopener\">Official UCM profile</a>"
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
| `img` | `pandelis-perakakis.jpg` | Imagen de la modal (600×450) en `img/portfolio/`. |
| `thumbnail` | `pandelis-perakakis-thumbnail.jpg` | Miniatura de la grilla (400×289) en `img/portfolio/`. |
| `alt` | Texto del retrato | Se muestra si falta la imagen. |
| `project-date` | `November 2026` | Mes y año del evento. |
| `category` | `Keynote Talk` | Mismo valor en los 5 talks. |
| `description` | Párrafos HTML | Estructura: resumen → `<strong>About</strong>` → bio → `<strong>Profile:</strong>` + enlace. |

---

## Cómo usarlo como modelo

1. Copia el bloque de front matter de arriba en un archivo nuevo dentro de `_posts/`.
2. Renombra el archivo: `AAAA-MM-DD-talk-N-nombre-apellido.markdown` (fecha + nº + nombre).
3. Sustituye cada campo por los datos del nuevo conferenciante.
4. Asigna un `modal-id` libre (el mayor actual es `9` → usa `10`).
5. Añade el mismo `modal-id` en `_includes/modals.html` y la tupla en `_includes/portfolio_grid.html`.
6. Coloca las fotos en `img/portfolio/` (miniatura 400×289, expandida 600×450) y referencia ambas.
7. Verifica con `bundle exec jekyll serve --trace` y mirando la página en el navegador.