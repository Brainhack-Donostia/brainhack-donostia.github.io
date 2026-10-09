# Empleo del tiempo — BrainHack Donostia 2026

<!--
  ============================================================================
  COMENTARIOS EXPLICATIVOS (no se muestran en la web, son para el equipo)
  ----------------------------------------------------------------------------
  Este documento resume la semana del evento tal y como está definida
  actualmente en el código del sitio (Jekyll).

  FUENTE PRINCIPAL DEL HORARIO:
    _includes/program.html   -> la tabla de cada día (se edita a mano).
  FICHAS DE LOS CONFERENCIANTES (Keynote Talks):
    _posts/2026-11-0X-talk-N-nombre.markdown -> front matter de cada charla.

  El horario NO es dinámico: está hardcodeado en program.html y se reescribe
  cada edición. Para cambiar una hora/actividad hay que editar esa tabla
  celda por celda.

  Resaltados visuales de la tabla (clases CSS en program.html):
    - tr.program-break   -> pausas (café, comida) en gris itálico.
    - tr.program-keynote -> charlas plenarias con borde amarillo (#ffe95e).
  ============================================================================
-->

# BrainHack Donostia 2026 — Programa semanal

- **Fechas:** 3 al 6 de noviembre de 2026
- **Formato:** 1 día de formación (training) + 3 días de Brainhack
- **Ubicación:** Donostia / San Sebastián (España)

> Formato del documento: cada bloque corresponde a un día real definido en
> `_includes/program.html`. Las horas y actividades son las actuales del código.

---

## Martes, 3 de noviembre — Día de formación (Brainhack Training Day)

| Hora | Actividad |
|------|-----------|
| 09:00–09:30 | Café social y bollería + Registro |
| 09:30–10:00 | Bienvenida a BrainHack Donostia 2026 |
| 10:00–11:30 | Módulo de formación 1: Introducción a Brainhack, Ciencia Abierta y flujos de trabajo colaborativos |
| 11:30–12:00 | **Pausa café** |
| 12:00–13:00 | Módulo de formación 2: Git/GitHub y colaboración reproducible |
| 13:00–14:00 | **Pausa comida** |
| 14:00–15:00 | **Conferencia 1 — Mireia Torralba Cuello:** "Electrophysiological correlates of Stimulus and Response Conflict: From Midfrontal Theta activity to aperiodic and oscillatory Dynamics" |
| 15:00–16:30 | Sesión práctica (hands-on) |
| 16:30–17:00 | **Pausa café** |
| 17:00–18:00 | Práctica guiada, preguntas y preparación de los "pitches" de proyectos |

---

## Miércoles, 4 de noviembre — Día de Brainhack 1

| Hora | Actividad |
|------|-----------|
| 09:00–09:30 | Café social y bollería |
| 09:30–10:00 | Kick-off del Brainhack e información práctica |
| 10:00–11:00 | Presentación de proyectos (Project Pitches) |
| 11:00–11:30 | **Pausa café** + formación de equipos |
| 11:30–13:00 | Inicio de proyectos / Tiempo de proyecto |
| 13:00–14:00 | **Pausa comida** |
| 14:00–15:00 | **Conferencia 2 — Ibai Diez Palacio:** "From Brain Maps to Molecular Mechanisms: Unveiling the Neuroimaging-Genetic Intersections in the Human Brain" |
| 15:00–16:30 | Tiempo de proyecto |
| 16:30–17:00 | **Pausa café** y preparación para la salida |
| 17:00 en adelante | Paseo social científico: [Milla Cuántica](https://sansebastianturismoa.eus/hacer/planes-san-sebastian/rutas-a-pie/ruta-milla-cuantica/) en Donostia |

---

## Jueves, 5 de noviembre — Día de Brainhack 2

| Hora | Actividad |
|------|-----------|
| 09:00–09:30 | Café social y bollería |
| 09:30–11:30 | Tiempo de proyecto |
| 11:30–12:00 | **Pausa café** |
| 12:00–13:00 | **Conferencia 3 — Pandelis Perakakis:** "Replacing academic journals by repositories and peer communities" |
| 13:00–14:00 | **Pausa comida** |
| 14:00–16:30 | Tiempo de proyecto / Desconferencia (Unconference) |
| 16:30–17:00 | **Pausa café** |
| 17:00–18:00 | Tiempo de proyecto / Sesión comunitaria |

---

## Viernes, 6 de noviembre — Día de Brainhack 3

| Hora | Actividad |
|------|-----------|
| 09:00–09:30 | Café social y bollería |
| 09:30–11:30 | Tiempo final de proyecto |
| 11:30–12:00 | **Pausa café** |
| 12:00–13:00 | **Conferencia 4 — Asier Erramuzpe Aliaga:** "Brain Age the Brainhack Way" |
| 13:00–14:00 | **Pausa comida** |
| 14:00–15:30 | Tiempo final de proyecto y preparación de presentaciones |
| 15:30–16:00 | **Pausa café** |
| 16:00–16:30 | Resumen de charlas (Talks Recap) |
| 16:30–17:30 | Resultados de proyectos (Project Results) |
| 17:30–18:00 | Palabras de clausura (Closing Remarks) |
| Noche | Evento social de BrainHack Donostia |

---

<!--
  ============================================================================
  ANEXO — LAS 4 CONFERENCIAS (dato cruzado con _posts/)
  ----------------------------------------------------------------------------
  Cada conferencia tiene su ficha en _posts/ con front matter. El modal-id
  es el enlace entre la grilla (portfolio_grid.html) y las ventanas modales
  (modals.html). Debe ser único.

  | Talk | Archivo en _posts/ | modal-id |
  |------|--------------------|:--------:|
  | 1 – Mireia Torralba Cuello  | 2026-11-03-talk-1-mireia-torralba-cuello.markdown | 5 |
  | 2 – Ibai Diez Palacio       | 2026-11-04-talk-2-ibai-diez-palacio.markdown      | 6 |
  | 3 – Pandelis Perakakis      | 2026-11-05-talk-3-pandelis-perakakis.markdown     | 7 |
  | 4 – Asier Erramuzpe Aliaga  | 2026-11-06-talk-4-asier-erramuzpe-aliaga.markdown | 8 |

  Próximo modal-id libre para un nuevo conferenciante: 9.
  ============================================================================
-->