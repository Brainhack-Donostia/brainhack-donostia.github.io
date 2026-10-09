# Plantilla — Ficha de conferenciante (speaker)

Para añadir un nuevo conferenciante, crea un archivo en `_posts/` con el nombre:

```
_posts/AAAA-MM-DD-talk-N-nombre-apellido.markdown
```

> Reglas de nomenclatura:
> - `AAAA-MM-DD` → fecha del talk (formato `YYYY-MM-DD`).
> - `N` → número del talk (1, 2, 3, 4...).
> - `nombre-apellido` → nombre del conferenciante en minúsculas, separado por guiones.

---

## Plantilla (front matter)

```markdown
---
title: "Título de la charla en inglés"
subtitle: "Nombre Apellido, cargo <br /> @ Institución"
layout: default
modal-id: 9
date: 2026-11-07
img:
thumbnail:
alt: "Retrato de Nombre Apellido — fotografía por añadir una vez confirmados los derechos de imagen"
project-date: November 2026
category: Keynote Talk
description: "Descripción breve de la charla en inglés. Explica qué se tratará y por qué es relevante.<br /><br />
<strong> Acerca de </strong><br />
Nombre Apellido es [cargo] en [institución]. Sus intereses de investigación incluyen [temas]. Antes de [año], fue [puesto] en [institución anterior].<br /><br />
<strong>Perfil:</strong> <a href=\"https://ejemplo.com/perfil\" target=\"_blank\" rel=\"noopener\">Perfil oficial</a>"
---
```

---

## Ejemplo completo

```markdown
---
title: "Neural Correlates of Decision-Making in Dynamic Environments"
subtitle: "Juan Pérez García, Assistant Professor <br /> @ Universidad del País Vasco"
layout: default
modal-id: 9
date: 2026-11-07
img:
thumbnail:
alt: "Retrato de Juan Pérez García — fotografía por añadir una vez confirmados los derechos de imagen"
project-date: November 2026
category: Keynote Talk
description: "Esta charla explora cómo el cerebro toma decisiones en entornos dinámicos...<br /><br />
<strong> Acerca de </strong><br />
Juan Pérez García es Profesor Ayudante en la Universidad del País Vasco. Sus intereses de investigación incluyen la toma de decisiones y la neuroimagen. Antes de 2025, fue investigador postdoctoral en el Basque Center on Cognition, Brain and Language.<br /><br />
<strong>Perfil:</strong> <a href=\"https://ejemplo.com/perfil\" target=\"_blank\" rel=\"noopener\">Perfil oficial</a>"
---
```

---

## Campos y notas importantes

| Campo | Obligatorio | Notas |
|-------|:-----------:|-------|
| `title` | Sí | Título de la charla, en inglés. |
| `subtitle` | Sí | Nombre del conferenciante + cargo, `<br />` para separar líneas, `@ Institución`. |
| `layout` | Sí | Siempre `default`. |
| `modal-id` | **Sí** | Entero **único** (actualmente el mayor es `8`; usa el siguiente). Debe coincidir entre `_includes/portfolio_grid.html` y `_includes/modals.html`. |
| `date` | Sí | Fecha de la charla, formato `YYYY-MM-DD`. |
| `img` | No | Ruta a la imagen expandida (modal), si hay. |
| `thumbnail` | No | Ruta a la miniatura de la grilla, si hay. |
| `alt` | No | Texto alternativo de la imagen. |
| `project-date` | Sí | Mes y año, p. ej. `November 2026`. |
| `category` | Sí | `Keynote Talk` (u otra categoría según la edición). |
| `description` | Sí | Texto largo en HTML (se renderiza en la modala). Usa `<br /><br />` entre párrafos. |

### Puntos de control (checklist)
- [ ] Nombre de archivo correcto en `_posts/` (`AAAA-MM-DD-talk-N-nombre.markdown`).
- [ ] `modal-id` único y **idéntico** en `portfolio_grid.html` y `modals.html`.
- [ ] Imágenes en `img/portfolio/` (miniatura 400×289, expandida 600×450), si las hay.
- [ ] Verificación: `bundle exec jekyll serve --trace` y comprobar la página en el navegador.