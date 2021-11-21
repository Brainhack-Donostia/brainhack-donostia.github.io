---
layout: page
title: Projects
permalink: /projects/
---

**Got a project idea? Submit! Project submissions for Brainhack Donostia 2021 are now OPEN!** 

**[Contact us](https://brainhack-donostia.github.io/contact/) if you are not sure about your project being eligible, or don't know how to fill in the submission form.**

<center style="padding-bottom: 1em;"><a class="submission-button" href="https://forms.gle/cUcY4BB5sNjg1TuEA" target="_blank">Submit</a></center>

## Key points

We want to encourage participants to join the event with their mindset ready to collaborate on projects and hope it will also lead to a better chance of collaborating and networking. At the same time, we hope it will help project leaders get collaborators too.

Activities carried out during Brainhack Donostia 2021 can result in useful outputs for the neuroscience community. **We highly encourage you to submit a project for this year's edition.** If you are in need of inspiration, have a look at the project ideas we have received so far, or check out the projects submitted to <a href="https://brainhack.org/global2020/projects" target="_blank">Brainhack Global</a> last year.

### For attendees:

- **Attendees are required to commit to a project for the duration of Brainhack Donostia 2021.**
- Attendees can work on any of the projects on the <a href="https://brainhack.org/global2021/projects" target="_blank">Brainhack Global website</a>.
- Attendees will receive an email days before the event to select the project they will work on.
- Projects are the perfect chance for active collaboration, networking and hands-on learning, both during and after the event.

### For project leaders:

- Projects can focus on _any technique or method_, use behavioral or neuroimaging data, or explore any topic related to Open Science.
- Projects can involve _any stage of the scientific process_, from data acquisition to analysis and documentation, as well as data visualization and scientific publication.
- Projects can also be focused on _creating tutorials or improving the documentation_ of a library/program, or even replicating a paper (and dockerize it!).

## Projects submitted so far

<div class="post-list" itemscope="" itemtype="http://schema.org/Blog" style="padding-top: 1em !important;">

<div class="projects post-card" style="padding: 1.4em">
  <h4 style="font-size: 1.8em">Aroma</h4>
  <p style="padding-top: 1em; padding-bottom: 1em">ICA-AROMA (i.e. ‘ICA-based Automatic Removal Of Motion Artifacts’) concerns a data-driven method to identify and remove motion-related independent components from fMRI data. To that end it exploits a small, but robust set of theoretically motivated features, preventing the need for classifier re-training and therefore providing direct and easy applicability. The aim of this project is to modify the original ICA-AROMA code in order to restructure it into a pure Python package; e.g., dropping FSL calls in favor of pure Python functions.</p>
  <p
    style="
      text-align: right;
      bottom: 0;
      right: 0;
      position: absolute;
      padding-right: 1.4em;
      font-style: italic;
    "
  >
    Eneko Uruñuela
  </p>
</div>
<div class="projects post-card" style="padding: 1.4em">
  <h4 style="font-size: 1.8em">abstract2poster</h4>
  <p style="padding-top: 1em; padding-bottom: 1em">Do you need your poster ready to print/upload in two hours? Abstract is ready but you cannot bother to read it anymore? 
Imagine you could automatize the abstract->poster transformation, and then just tweak a few minor things to make it shine and impress everyone in that conference! 
In the abstract2poster project we will work towards developping a pipeline to translate your abstract to a ready-to-present poster. How? We are planning to use `Jekyll` but other ideas are welcome!</p>
  <p
    style="
      text-align: right;
      bottom: 0;
      right: 0;
      position: absolute;
      padding-right: 1.4em;
      font-style: italic;
    "
  >
    Amaia Carrion Castillo (@amaiacc)
  </p>
</div>
<div class="projects post-card" style="padding: 1.4em">
  <h4 style="font-size: 1.8em">Automatic plosive detection and VOT extraction using the Plosion index</h4>
  <p style="padding-top: 1em; padding-bottom: 1em">Do you wish you didn't have to spend hours manually combing through your audio data to identify plosives and extract their voice onset times (VOT)? Introducing the Plosion Index! The Plosion index is a measurement from the speech recognition literature (Ananthapadmanabha, Prathosh, & Ramakrishnan; 2014) to facilitate the detection of plosives in natural language data. It is based on an algorithm that calculate at each time point the ratio between the instantaneous amplitude of an acoustic signal and the mean amplitude of the signal during the preceding few milliseconds. It is designed to detect brutal changes in amplitude typically linked to the puff of air expulsed out of the mouth during the release phase of a plosive. This mean that the Plosive index is not only able to detect plosives in speech data, but also to determine the exact moment of the plosive release, making it possible to automatize the calculation of VOT, that is the interval of time between the release of the plosive and the moment when the vocal chords start to vibrate to produce the following vowel.</p>
  <p
    style="
      text-align: right;
      bottom: 0;
      right: 0;
      position: absolute;
      padding-right: 1.4em;
      font-style: italic;
    "
  >
    Florent Dueme
  </p>
</div>
<div class="projects post-card" style="padding: 1.4em">
  <h4 style="font-size: 1.8em">Universal data load for neural networks</h4>
  <p style="padding-top: 1em; padding-bottom: 1em">There exit data loader pipeline for deep neural network project using Tensorflow or Pytorch, but they mainly focus on computer visions and natural language processing. When neuroscientists implement deep neural network models on neuroimaging or neurosignal data, a customized pipeline must be written from scratch every time. This project aims to provide a universal data loader, based on either Tensorflow or Pytorch data loader pipelines, so that it is easier for neurosientists to implement neural network modeling in the next steps. </p>
  <p
    style="
      text-align: right;
      bottom: 0;
      right: 0;
      position: absolute;
      padding-right: 1.4em;
      font-style: italic;
    "
  >
    Ning Mei
  </p>
</div>
<div class="projects post-card" style="padding: 1.4em">
  <h4 style="font-size: 1.8em">Non-invasive brain stimulation BIDS proposal</h4>
  <p style="padding-top: 1em; padding-bottom: 1em">Brain Imaging Data Structure (BIDS) is a common way to structure potentially any kind of neuroimaging data. Due to its intuitive and clear structure, it has been adopted in most neuroscientific fields as a common way to organize and share data that is compliant to the F.A.I.R. principles of open science. You don’t know about BIDS? Shame on you..  More on: https://bids.neuroimaging.io/  

BIDS is continuously evolving, incorporating new fields and modality through community proposals. That is where we come in! We work in the field of non-invasive brain stimulation (NIBS), which is a modality not yet supported by BIDS. Current NIBS includes transcranial magnetic stimulation (TMS), transcranial electrical stimulation (tES, like tDCS, tACS, tRNS) and focused-ultrasound stimulation (FUS). Our project aims to build an official BIDS proposal on NIBS, that will help the whole field to structure and share data with a common framework (NIBS field desperately needs to be more open!).

Me and my collaborators already wrote a BIDS proposal draft and structured a prototype of a NIBS-BIDS dataset, that you can find here: https://gin.g-node.org/CIMeC/TMS-EEG_brain_connectivity_BIDS/src/master

Our goal is to gather people who already have some hands-on experience in some NIBS technique and are interested in BIDS.

BIDS is helping science a lot, let’s help BIDS back! </p>
  <p
    style="
      text-align: right;
      bottom: 0;
      right: 0;
      position: absolute;
      padding-right: 1.4em;
      font-style: italic;
    "
  >
    Giacomo Bertazzoli
  </p>
</div>
<div class="projects post-card" style="padding: 1.4em">
  <h4 style="font-size: 1.8em">Physiological Signal Classification</h4>
  <p style="padding-top: 1em; padding-bottom: 1em">Physiopy is is a python3 suite to format and analyse physiological recordings. One of the current development goals is to implementing an automatic signal classificator that, given a signal as input, is be able to determine the type of the signal.

In this project we provide time-series data of 4 kinds of physiological signals (cardiac, respiratory chest, O2 and CO2) and the goal will be to collaborate to find robust features that allow discerning between them.</p>
  <p
    style="
      text-align: right;
      bottom: 0;
      right: 0;
      position: absolute;
      padding-right: 1.4em;
      font-style: italic;
    "
  >
    David Romero-Bascones
  </p>
</div>
<div class="projects post-card" style="padding: 1.4em">
  <h4 style="font-size: 1.8em">Implement Cross Frequency Coupling Analysis in EEG as Consciousness Alteration Biomarker</h4>
  <p style="padding-top: 1em; padding-bottom: 1em">Implement code (re-created from directions from a specied research article) for evaluating cross frequency coupling of EEG data. Cross frequency coupling has been linked to meditative states, anesthesia, psychedelics, and more. This work will use already-recorded and labeled 19-channel EEG datasets and implement cross frequency coupling analysis to evaluate its sensitivity as a marker for gradations in changes in conciousness.  This will be done in MNE python and/or Matlab. This implementation will lay the groundwork to develop this project to evaluate and perhaps later on in the year implement neurofeedback for neuro-meditation. 
</p>
  <p
    style="
      text-align: right;
      bottom: 0;
      right: 0;
      position: absolute;
      padding-right: 1.4em;
      font-style: italic;
    "
  >
    Bar Lehmann
  </p>
</div>
<div class="projects post-card" style="padding: 1.4em">
  <h4 style="font-size: 1.8em">Build your personal website with GitHub</h4>
  <p style="padding-top: 1em; padding-bottom: 1em">As a researcher, it is always useful to have your own website to showcase your CV, publications, talks, etc. This project will teach you how to build your personal website using GitHub. The project is aimed at anyone, regardless of your experience with programming and GitHub. Do not worry, you will not have to code the website as you will be using a template that has already been designed for academic websites (https://academicpages.github.io/) and GitHub already makes it super easy to deploy a site on its platform. </p>
  <p
    style="
      text-align: right;
      bottom: 0;
      right: 0;
      position: absolute;
      padding-right: 1.4em;
      font-style: italic;
    "
  >
    Chiara Luna Rivolta
  </p>
</div>
<div class="projects post-card" style="padding: 1.4em">
  <h4 style="font-size: 1.8em">Physiopy: open development solutions for physiology in MRI</h4>
  <p style="padding-top: 1em; padding-bottom: 1em">Physiopy is a community developing open science software for physiological files (e.g. vital signs, respiration, eye tracking, skin conductance, ...) handling and processing.
Currently maintaining three libraries to format physiological files into BIDS (phys2bids), clean physiological traces and find their peaks (peakdet), and use physiological traces to compute nuisance regressors for fMRI denoising (phys2denoise), this (meta-)project aims to provide challenges for all levels of contributors within physiopy's environment, its three libraries, and its documentation.
Collaborators of all levels of experience with git, GitHub, python, and physiology are welcome. Depending on the level of experience, we'll match collaborators and tasks, and help filling gaps and acquire the necessary skills to finish them.</p>
  <p
    style="
      text-align: right;
      bottom: 0;
      right: 0;
      position: absolute;
      padding-right: 1.4em;
      font-style: italic;
    "
  >
    Stefano Moia
  </p>
</div>


</div>
