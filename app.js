// SFRA territorial map application for project governance in Fes.
(() => {
  const CITY_CENTER = [34.0331, -5.0003];
  const MOBILE_BREAKPOINT = 980;

  const TYPE_META = {
    voirie: { label: "Voirie", colorClass: "type-voirie", markerIcon: "V", categoryIcon: "🛣" },
    batiment: { label: "Bâtiment", colorClass: "type-batiment", markerIcon: "B", categoryIcon: "🏢" },
    equipement: { label: "Équipement", colorClass: "type-equipement", markerIcon: "E", categoryIcon: "🏟" },
    reseaux: { label: "Réseaux", colorClass: "type-reseaux", markerIcon: "R", categoryIcon: "🔌" },
    renovation: { label: "Rénovation", colorClass: "type-renovation", markerIcon: "N", categoryIcon: "🧱" },
    autres: { label: "Autres", colorClass: "type-autres", markerIcon: "A", categoryIcon: "📌" }
  };

  const STATUS_META = {
    attribue: { label: "Attribué" },
    en_cours: { label: "En cours" },
    litige: { label: "En arrêt / litige" },
    acheve: { label: "Achevé" },
    reception_provisoire: { label: "Réception provisoire" },
    reception_definitive: { label: "Réception définitive" }
  };

  const rawProjects = [
    {
      title: "Aménagement Voirie Route Sefrou",
      type: "voirie",
      status: "en_cours",
      coords: [34.05, -4.98],
      budget: 12000000,
      institution: "Commune de Fès",
      enterprise: "TGCC",
      progress: 60,
      description:
        "Réhabilitation de l'axe principal reliant les quartiers Est avec renforcement de la mobilité urbaine.",
      geoElements: ["Axe Route de Sefrou", "Carrefour Atlas", "Zone de drainage A3"]
    },
    {
      title: "Centre Administratif Quartier Saiss",
      type: "batiment",
      status: "attribue",
      coords: [34.027, -5.017],
      budget: 18500000,
      institution: "Préfecture Fès",
      enterprise: "SGTM",
      progress: 18,
      description:
        "Construction d'un pôle administratif de proximité regroupant services sociaux et guichets numériques.",
      geoElements: ["Parcelle SA-18", "Stationnement public", "Parvis institutionnel"]
    },
    {
      title: "Complexe Sportif Hay Tarik",
      type: "equipement",
      status: "en_cours",
      coords: [34.016, -4.995],
      budget: 9600000,
      institution: "Conseil Régional Fès-Meknès",
      enterprise: "Jet Contractors",
      progress: 42,
      description:
        "Mise à niveau d'un complexe multisport incluant espaces jeunes et équipements de sécurité.",
      geoElements: ["Zone sportive sud", "Accès PMR", "Réseau sécurité incendie"]
    },
    {
      title: "Renforcement Réseaux Eau - Ain Nokbi",
      type: "reseaux",
      status: "reception_provisoire",
      coords: [34.073, -5.021],
      budget: 7300000,
      institution: "RADEEF",
      enterprise: "SOMAGEC",
      progress: 91,
      description:
        "Modernisation des conduites de distribution et amélioration de la pression sur les secteurs périphériques.",
      geoElements: ["Conduite primaire D450", "Chambre de régulation C2", "Sous-secteur Nord"]
    },
    {
      title: "Rénovation Médina - Circuit patrimonial",
      type: "renovation",
      status: "litige",
      coords: [34.062, -4.976],
      budget: 14400000,
      institution: "ADER Fès",
      enterprise: "BTP Atlas",
      progress: 37,
      description:
        "Réhabilitation des cheminements patrimoniaux et restauration des façades historiques.",
      geoElements: ["Porte Boujloud", "Placette artisanale", "Tracé piéton culturel"]
    },
    {
      title: "Éclairage Public Périmètre Ouest",
      type: "autres",
      status: "acheve",
      coords: [34.022, -5.048],
      budget: 5200000,
      institution: "Commune de Fès",
      enterprise: "ELEC Maghreb",
      progress: 100,
      description:
        "Installation de luminaires LED à haut rendement pour sécurisation des voies et réduction énergétique.",
      geoElements: ["Avenue Hassan II", "Boulevard des FAR", "Secteur résidentiel Ouest"]
    },
    {
      title: "Connexion Réseaux Assainissement ZI Bensouda",
      type: "reseaux",
      status: "en_cours",
      coords: [34.092, -5.034],
      budget: 10900000,
      institution: "RADEEF",
      enterprise: "SEEG",
      progress: 55,
      description:
        "Extension des collecteurs et raccordement des zones industrielles à fort impact hydraulique.",
      geoElements: ["Collecteur principal B5", "Bassin de délestage", "Point de contrôle ZI-3"]
    },
    {
      title: "Mise à niveau Écoles primaires - Lot 2",
      type: "batiment",
      status: "reception_definitive",
      coords: [34.041, -5.056],
      budget: 8100000,
      institution: "Académie Régionale de l'Éducation",
      enterprise: "Marsa Bât",
      progress: 100,
      description:
        "Travaux de réhabilitation des classes, sanitaires et systèmes d'accessibilité des établissements scolaires.",
      geoElements: ["École Ibn Rochd", "École Al Qods", "École Saada"]
    },
    {
      title: "Réaménagement Parc de la Ville Nouvelle",
      type: "equipement",
      status: "attribue",
      coords: [34.032, -4.989],
      budget: 6800000,
      institution: "Commune de Fès",
      enterprise: "GreenScape Maroc",
      progress: 10,
      description:
        "Valorisation des espaces verts urbains avec nouvelles aires de détente et parcours santé.",
      geoElements: ["Zone centrale", "Mail piéton", "Pôle jeux enfants"]
    },
    {
      title: "Réfection Voirie Ceinture Nord",
      type: "voirie",
      status: "en_cours",
      coords: [34.082, -4.972],
      budget: 15400000,
      institution: "Direction Provinciale de l'Équipement",
      enterprise: "Mojazine Travaux",
      progress: 48,
      description:
        "Renforcement de la couche de roulement et correction des points noirs de circulation au nord de la ville.",
      geoElements: ["Tronçon N1", "Giratoire Sidi Hrazem", "Bretelle industrielle"]
    }
  ];

  function buildProjectTimeline(project, index) {
    const baseYear = 2024 + (index % 2);

    return [
      {
        date: `12/01/${baseYear}`,
        title: "Programmation territoriale validée",
        note: "Validation des besoins et cadrage institutionnel."
      },
      {
        date: `28/03/${baseYear}`,
        title: "Attribution du marché",
        note: `Entreprise attributaire: ${project.enterprise}.`
      },
      {
        date: `16/06/${baseYear}`,
        title: "Lancement opérationnel",
        note: "Installation de chantier et mobilisation des équipes."
      },
      {
        date: `04/11/${baseYear}`,
        title: "Phase d'exécution structurante",
        note: "Suivi technique, financier et contrôle qualité SFRA."
      },
      {
        date: `18/02/${baseYear + 1}`,
        title: "Réception et transfert",
        note: "Préparation réception provisoire/définitive selon avancement."
      }
    ];
  }

  function buildProjectMedia(index) {
    const seed = `sfra-fes-${index + 1}`;

    return [
      {
        kind: "photo",
        title: "Vue générale du chantier",
        thumb: `https://picsum.photos/seed/${seed}-p1/720/420`,
        url: `https://picsum.photos/seed/${seed}-p1/1400/900`
      },
      {
        kind: "photo",
        title: "Détail technique sur site",
        thumb: `https://picsum.photos/seed/${seed}-p2/720/420`,
        url: `https://picsum.photos/seed/${seed}-p2/1400/900`
      },
      {
        kind: "video",
        title: "Capsule vidéo d'avancement",
        thumb: `https://picsum.photos/seed/${seed}-v1/720/420`,
        url: "https://www.youtube.com/"
      }
    ];
  }

  const projects = rawProjects.map((project, index) => ({
    ...project,
    id: `project-${index + 1}`,
    timeline: buildProjectTimeline(project, index),
    media: buildProjectMedia(index)
  }));

  const map = L.map("map", {
    center: CITY_CENTER,
    zoom: 12,
    zoomControl: false,
    minZoom: 10,
    maxZoom: 18,
    preferCanvas: true
  });

  L.control.zoom({ position: "bottomright" }).addTo(map);

  const planLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  });

  const satelliteLayer = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    {
      maxZoom: 19,
      attribution: "Tiles &copy; Esri"
    }
  );

  planLayer.addTo(map);

  const markerCluster = L.markerClusterGroup({
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false,
    maxClusterRadius: 45,
    iconCreateFunction(cluster) {
      const count = cluster.getChildCount();
      const sizeClass = count >= 18 ? "large" : count >= 8 ? "medium" : "small";

      return L.divIcon({
        html: `<span>${count}</span>`,
        className: `sfra-cluster sfra-cluster-${sizeClass}`,
        iconSize: L.point(42, 42)
      });
    }
  });

  map.addLayer(markerCluster);

  // Static territorial layers to reinforce geographic context.
  const strategicRoad = L.polyline(
    [
      [34.018, -5.063],
      [34.031, -5.032],
      [34.046, -5.005],
      [34.06, -4.982]
    ],
    {
      color: "#0066CC",
      weight: 5,
      opacity: 0.72,
      dashArray: "8 8"
    }
  ).bindPopup("Corridor stratégique: modernisation voirie nord-est.");

  const interventionZone = L.polygon(
    [
      [34.012, -5.015],
      [34.018, -4.992],
      [34.005, -4.977],
      [33.996, -4.998]
    ],
    {
      color: "#50C878",
      weight: 2,
      fillColor: "#50C878",
      fillOpacity: 0.2
    }
  ).bindPopup("Zone d'intervention prioritaire: équipements de proximité.");

  strategicRoad.addTo(map);
  interventionZone.addTo(map);
  const elements = {
    body: document.body,
    appShell: document.getElementById("appShell"),
    projectsPage: document.getElementById("projectsPage"),
    navLinks: Array.from(document.querySelectorAll(".nav-link[data-view]")),
    sidebar: document.getElementById("sidebar"),
    closeSidebarBtn: document.getElementById("closeSidebarBtn"),
    openSidebarBtn: document.getElementById("openSidebarBtn"),
    mapBackdrop: document.getElementById("mapBackdrop"),
    searchInput: document.getElementById("projectSearch"),
    statusCheckboxes: Array.from(document.querySelectorAll("[data-status]")),
    typeCards: Array.from(document.querySelectorAll(".type-card")),
    institutionChips: document.getElementById("institutionChips"),
    enterpriseSearch: document.getElementById("enterpriseSearch"),
    enterpriseList: document.getElementById("enterpriseList"),
    resetFiltersBtn: document.getElementById("resetFiltersBtn"),
    layerButtons: Array.from(document.querySelectorAll(".layer-btn")),
    exploreBtn: document.getElementById("exploreBtn"),
    projectPanel: document.getElementById("projectPanel"),
    closePanelBtn: document.getElementById("closePanelBtn"),
    expandProjectBtn: document.getElementById("expandProjectBtn"),
    panelTitle: document.getElementById("panelTitle"),
    panelTypeBadge: document.getElementById("panelTypeBadge"),
    panelStatusBadge: document.getElementById("panelStatusBadge"),
    panelDescription: document.getElementById("panelDescription"),
    panelInstitution: document.getElementById("panelInstitution"),
    panelEnterprise: document.getElementById("panelEnterprise"),
    panelBudget: document.getElementById("panelBudget"),
    panelProgressValue: document.getElementById("panelProgressValue"),
    panelProgressBar: document.getElementById("panelProgressBar"),
    panelGeoList: document.getElementById("panelGeoList"),
    projectModal: document.getElementById("projectModal"),
    closeProjectModalBtn: document.getElementById("closeProjectModalBtn"),
    modalProjectTitle: document.getElementById("modalProjectTitle"),
    modalTypeBadge: document.getElementById("modalTypeBadge"),
    modalStatusBadge: document.getElementById("modalStatusBadge"),
    modalDescription: document.getElementById("modalDescription"),
    modalInstitution: document.getElementById("modalInstitution"),
    modalEnterprise: document.getElementById("modalEnterprise"),
    modalBudget: document.getElementById("modalBudget"),
    modalProgressValue: document.getElementById("modalProgressValue"),
    modalProgressBar: document.getElementById("modalProgressBar"),
    modalTimelineList: document.getElementById("modalTimelineList"),
    modalMediaGrid: document.getElementById("modalMediaGrid"),
    projectsSearchInput: document.getElementById("projectsSearchInput"),
    projectsStatusSelect: document.getElementById("projectsStatusSelect"),
    projectsTypeSelect: document.getElementById("projectsTypeSelect"),
    projectsInstitutionSelect: document.getElementById("projectsInstitutionSelect"),
    resetProjectPageFiltersBtn: document.getElementById("resetProjectPageFiltersBtn"),
    projectsResultCount: document.getElementById("projectsResultCount"),
    projectsGrid: document.getElementById("projectsGrid")
  };

  const allStatuses = Object.keys(STATUS_META);
  const allTypes = Object.keys(TYPE_META);
  const institutions = [...new Set(projects.map((project) => project.institution))].sort((a, b) =>
    a.localeCompare(b, "fr")
  );
  const enterprises = [...new Set(projects.map((project) => project.enterprise))].sort((a, b) =>
    a.localeCompare(b, "fr")
  );

  const state = {
    query: "",
    enterpriseQuery: "",
    statuses: new Set(allStatuses),
    types: new Set(allTypes),
    institutions: new Set(institutions),
    enterprises: new Set(enterprises),
    activeLayer: "plan",
    selectedProjectId: null,
    currentView: "map",
    projectsPageFilters: {
      query: "",
      status: "all",
      type: "all",
      institution: "all"
    }
  };

  function formatBudget(value) {
    return new Intl.NumberFormat("fr-MA", {
      style: "currency",
      currency: "MAD",
      maximumFractionDigits: 0
    }).format(value);
  }

  function getProjectById(projectId) {
    return projects.find((project) => project.id === projectId) || null;
  }

  function renderInstitutionChips() {
    elements.institutionChips.innerHTML = "";

    institutions.forEach((institution) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "chip is-active";
      chip.dataset.institution = institution;
      chip.textContent = institution;

      chip.addEventListener("click", () => {
        if (state.institutions.has(institution)) {
          state.institutions.delete(institution);
          chip.classList.remove("is-active");
        } else {
          state.institutions.add(institution);
          chip.classList.add("is-active");
        }

        applyMapFilters();
      });

      elements.institutionChips.appendChild(chip);
    });
  }

  function renderEnterpriseList() {
    elements.enterpriseList.innerHTML = "";

    enterprises.forEach((enterprise) => {
      const item = document.createElement("li");
      item.dataset.enterprise = enterprise.toLowerCase();
      const inputId = `enterprise-${enterprise.replace(/\s+/g, "-").toLowerCase()}`;

      item.innerHTML = `
        <label for="${inputId}">
          <input id="${inputId}" type="checkbox" checked>
          ${enterprise}
        </label>
      `;

      const checkbox = item.querySelector("input");
      checkbox.addEventListener("change", () => {
        if (checkbox.checked) {
          state.enterprises.add(enterprise);
        } else {
          state.enterprises.delete(enterprise);
        }

        applyMapFilters();
      });

      elements.enterpriseList.appendChild(item);
    });
  }

  function populateProjectPageFilterOptions() {
    const statusOptions = Object.entries(STATUS_META)
      .map(([value, meta]) => `<option value="${value}">${meta.label}</option>`)
      .join("");

    const typeOptions = Object.entries(TYPE_META)
      .map(([value, meta]) => `<option value="${value}">${meta.label}</option>`)
      .join("");

    const institutionOptions = institutions.map((institution) => `<option value="${institution}">${institution}</option>`).join("");

    elements.projectsStatusSelect.insertAdjacentHTML("beforeend", statusOptions);
    elements.projectsTypeSelect.insertAdjacentHTML("beforeend", typeOptions);
    elements.projectsInstitutionSelect.insertAdjacentHTML("beforeend", institutionOptions);
  }

  function createProjectIcon(type) {
    const typeInfo = TYPE_META[type] || TYPE_META.autres;

    return L.divIcon({
      className: "project-icon",
      html: `<div class="marker-pin ${typeInfo.colorClass}"><span>${typeInfo.markerIcon}</span></div>`,
      iconSize: [36, 36],
      iconAnchor: [18, 32],
      popupAnchor: [0, -24]
    });
  }

  function getMapFilteredProjects() {
    return projects.filter((project) => {
      const queryTarget = `${project.title} ${project.description} ${project.enterprise}`.toLowerCase();

      return (
        (!state.query || queryTarget.includes(state.query)) &&
        state.statuses.has(project.status) &&
        state.types.has(project.type) &&
        state.institutions.has(project.institution) &&
        state.enterprises.has(project.enterprise)
      );
    });
  }

  function getProjectsPageFilteredProjects() {
    const { query, status, type, institution } = state.projectsPageFilters;

    return projects.filter((project) => {
      const queryTarget = `${project.title} ${project.description} ${project.enterprise} ${project.institution}`.toLowerCase();

      return (
        (!query || queryTarget.includes(query)) &&
        (status === "all" || project.status === status) &&
        (type === "all" || project.type === type) &&
        (institution === "all" || project.institution === institution)
      );
    });
  }

  function setTypeBadgeContent(badgeElement, type) {
    const typeInfo = TYPE_META[type] || TYPE_META.autres;
    badgeElement.className = `badge ${typeInfo.colorClass}`;
    badgeElement.innerHTML = `<span class="badge-icon" aria-hidden="true">${typeInfo.categoryIcon}</span><span>${typeInfo.label}</span>`;
  }

  function setStatusBadgeContent(badgeElement, status) {
    badgeElement.className = `badge status-${status}`;
    badgeElement.textContent = STATUS_META[status].label;
  }

  function fillSummaryDetails(project, target) {
    target.title.textContent = project.title;
    setTypeBadgeContent(target.typeBadge, project.type);
    setStatusBadgeContent(target.statusBadge, project.status);
    target.description.textContent = project.description;
    target.institution.textContent = project.institution;
    target.enterprise.textContent = project.enterprise;
    target.budget.textContent = formatBudget(project.budget);
    target.progressValue.textContent = `${project.progress}%`;
    target.progressBar.style.width = `${project.progress}%`;
    target.progressBar.parentElement.setAttribute("aria-valuenow", String(project.progress));
  }

  function openProjectPanel(project) {
    state.selectedProjectId = project.id;

    fillSummaryDetails(project, {
      title: elements.panelTitle,
      typeBadge: elements.panelTypeBadge,
      statusBadge: elements.panelStatusBadge,
      description: elements.panelDescription,
      institution: elements.panelInstitution,
      enterprise: elements.panelEnterprise,
      budget: elements.panelBudget,
      progressValue: elements.panelProgressValue,
      progressBar: elements.panelProgressBar
    });

    elements.panelGeoList.innerHTML = "";
    project.geoElements.forEach((geoItem) => {
      const listItem = document.createElement("li");
      listItem.textContent = geoItem;
      elements.panelGeoList.appendChild(listItem);
    });

    elements.expandProjectBtn.disabled = false;
    elements.projectPanel.classList.add("is-open");
    syncBackdropVisibility();
  }

  function closeProjectPanel() {
    elements.projectPanel.classList.remove("is-open");
    syncBackdropVisibility();
  }

  function renderProjectTimeline(project) {
    const stepThresholds = [8, 22, 45, 72, 100];
    let currentPlaced = false;

    elements.modalTimelineList.innerHTML = "";

    project.timeline.forEach((step, index) => {
      const item = document.createElement("li");
      const threshold = stepThresholds[index] || 100;

      if (project.progress >= threshold) {
        item.className = "timeline-item is-done";
      } else if (!currentPlaced) {
        item.className = "timeline-item is-current";
        currentPlaced = true;
      } else {
        item.className = "timeline-item";
      }

      item.innerHTML = `
        <span class="timeline-date">${step.date}</span>
        <span class="timeline-title">${step.title}</span>
        <span class="timeline-note">${step.note}</span>
      `;

      elements.modalTimelineList.appendChild(item);
    });
  }

  function renderProjectMedia(project) {
    elements.modalMediaGrid.innerHTML = "";

    project.media.forEach((mediaItem) => {
      const card = document.createElement("article");
      card.className = "media-card";

      const kindLabel = mediaItem.kind === "video" ? "Vidéo" : "Photo";
      const kindClass = mediaItem.kind === "video" ? "is-video" : "";
      const linkLabel = mediaItem.kind === "video" ? "Ouvrir la vidéo" : "Ouvrir la photo";

      card.innerHTML = `
        <div class="media-thumb">
          <img src="${mediaItem.thumb}" alt="${mediaItem.title}" loading="lazy" />
          <span class="media-kind ${kindClass}">${kindLabel}</span>
        </div>
        <div class="media-body">
          <h4>${mediaItem.title}</h4>
          <a class="media-link" href="${mediaItem.url}" target="_blank" rel="noopener noreferrer">${linkLabel}</a>
        </div>
      `;

      elements.modalMediaGrid.appendChild(card);
    });
  }

  function openProjectModal(project) {
    state.selectedProjectId = project.id;

    fillSummaryDetails(project, {
      title: elements.modalProjectTitle,
      typeBadge: elements.modalTypeBadge,
      statusBadge: elements.modalStatusBadge,
      description: elements.modalDescription,
      institution: elements.modalInstitution,
      enterprise: elements.modalEnterprise,
      budget: elements.modalBudget,
      progressValue: elements.modalProgressValue,
      progressBar: elements.modalProgressBar
    });

    renderProjectTimeline(project);
    renderProjectMedia(project);

    elements.projectModal.hidden = false;
    window.requestAnimationFrame(() => {
      elements.projectModal.classList.add("is-open");
    });
  }

  function closeProjectModal() {
    if (elements.projectModal.hidden) {
      return;
    }

    elements.projectModal.classList.remove("is-open");
    window.setTimeout(() => {
      elements.projectModal.hidden = true;
    }, 240);
  }
  function renderMarkers(data) {
    markerCluster.clearLayers();

    data.forEach((project) => {
      const marker = L.marker(project.coords, {
        icon: createProjectIcon(project.type),
        title: project.title,
        riseOnHover: true
      });

      const typeInfo = TYPE_META[project.type] || TYPE_META.autres;

      marker.bindTooltip(
        `<span class="tooltip-content"><span class="tooltip-icon" aria-hidden="true">${typeInfo.categoryIcon}</span><span>${project.title}</span></span>`,
        {
          direction: "top",
          offset: [0, -20],
          className: "project-tooltip"
        }
      );

      marker.on("click", () => {
        openProjectPanel(project);
      });

      marker.on("mouseover", () => {
        const markerElement = marker.getElement();
        if (markerElement) {
          markerElement.classList.add("is-hovered");
        }
      });

      marker.on("mouseout", () => {
        const markerElement = marker.getElement();
        if (markerElement) {
          markerElement.classList.remove("is-hovered");
        }
      });

      markerCluster.addLayer(marker);
    });
  }

  function applyMapFilters() {
    const filteredProjects = getMapFilteredProjects();
    renderMarkers(filteredProjects);

    if (filteredProjects.length === 0) {
      closeProjectPanel();
    }
  }

  function renderProjectsGrid(projectList) {
    elements.projectsGrid.innerHTML = "";

    const countLabel = `${projectList.length} projet${projectList.length > 1 ? "s" : ""} affiché${projectList.length > 1 ? "s" : ""}`;
    elements.projectsResultCount.textContent = countLabel;

    if (projectList.length === 0) {
      elements.projectsGrid.innerHTML = '<div class="project-empty-state">Aucun projet ne correspond aux filtres sélectionnés.</div>';
      return;
    }

    projectList.forEach((project) => {
      const card = document.createElement("article");
      card.className = "project-card";

      const typeInfo = TYPE_META[project.type] || TYPE_META.autres;
      const statusLabel = STATUS_META[project.status].label;

      card.innerHTML = `
        <header class="project-card-head">
          <h3 class="project-card-title">${project.title}</h3>
          <div class="project-card-meta">
            <span class="badge ${typeInfo.colorClass}"><span class="badge-icon" aria-hidden="true">${typeInfo.categoryIcon}</span><span>${typeInfo.label}</span></span>
            <span class="badge status-${project.status}">${statusLabel}</span>
          </div>
        </header>

        <p class="project-card-body">${project.description}</p>

        <div class="project-card-kpis">
          <div class="project-card-kpi"><span>Institution</span><strong>${project.institution}</strong></div>
          <div class="project-card-kpi"><span>Entreprise</span><strong>${project.enterprise}</strong></div>
          <div class="project-card-kpi"><span>Budget</span><strong>${formatBudget(project.budget)}</strong></div>
          <div class="progress-block" aria-label="Avancement du projet">
            <div class="progress-head"><span>Avancement</span><strong>${project.progress}%</strong></div>
            <div class="progress-track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${project.progress}">
              <div class="progress-fill" data-progress-fill></div>
            </div>
          </div>
        </div>

        <div class="project-card-actions">
          <button class="btn btn-primary" type="button" data-action="details" data-project-id="${project.id}">Voir les détails</button>
          <button class="btn btn-soft" type="button" data-action="map" data-project-id="${project.id}">Voir sur la carte</button>
        </div>
      `;

      const cardProgressFill = card.querySelector("[data-progress-fill]");
      if (cardProgressFill) {
        cardProgressFill.style.width = `${project.progress}%`;
      }

      elements.projectsGrid.appendChild(card);
    });
  }

  function applyProjectsPageFilters() {
    const filteredProjects = getProjectsPageFilteredProjects();
    renderProjectsGrid(filteredProjects);
  }

  function resetMapFilters() {
    state.query = "";
    state.enterpriseQuery = "";
    state.statuses = new Set(allStatuses);
    state.types = new Set(allTypes);
    state.institutions = new Set(institutions);
    state.enterprises = new Set(enterprises);

    elements.searchInput.value = "";
    elements.enterpriseSearch.value = "";

    elements.statusCheckboxes.forEach((checkbox) => {
      checkbox.checked = true;
    });

    elements.typeCards.forEach((card) => {
      card.classList.add("is-active");
      card.setAttribute("aria-pressed", "true");
    });

    elements.institutionChips.querySelectorAll(".chip").forEach((chip) => {
      chip.classList.add("is-active");
    });

    elements.enterpriseList.querySelectorAll("li").forEach((item) => {
      const checkbox = item.querySelector("input[type='checkbox']");
      checkbox.checked = true;
      item.hidden = false;
    });

    applyMapFilters();
  }

  function resetProjectsPageFilters() {
    state.projectsPageFilters = {
      query: "",
      status: "all",
      type: "all",
      institution: "all"
    };

    elements.projectsSearchInput.value = "";
    elements.projectsStatusSelect.value = "all";
    elements.projectsTypeSelect.value = "all";
    elements.projectsInstitutionSelect.value = "all";

    applyProjectsPageFilters();
  }

  function isMobileViewport() {
    return window.innerWidth <= MOBILE_BREAKPOINT;
  }

  function isSidebarOpen() {
    if (isMobileViewport()) {
      return elements.sidebar.classList.contains("is-open");
    }

    return !elements.body.classList.contains("sidebar-collapsed");
  }

  function syncSidebarButtonState() {
    elements.openSidebarBtn.hidden = isSidebarOpen() || state.currentView === "projects";
  }

  function syncMapSize() {
    window.setTimeout(() => {
      map.invalidateSize();
    }, 280);
  }

  function syncBackdropVisibility() {
    const isMobile = isMobileViewport();
    const shouldShow =
      isMobile &&
      state.currentView === "map" &&
      (isSidebarOpen() || elements.projectPanel.classList.contains("is-open"));

    elements.mapBackdrop.hidden = !shouldShow;
  }

  function openSidebar() {
    if (state.currentView !== "map") {
      return;
    }

    if (isMobileViewport()) {
      elements.sidebar.classList.add("is-open");
    } else {
      elements.body.classList.remove("sidebar-collapsed");
    }

    syncSidebarButtonState();
    syncBackdropVisibility();
    syncMapSize();
  }

  function closeSidebar() {
    if (state.currentView !== "map") {
      return;
    }

    if (isMobileViewport()) {
      elements.sidebar.classList.remove("is-open");
    } else {
      elements.body.classList.add("sidebar-collapsed");
    }

    syncSidebarButtonState();
    syncBackdropVisibility();
    syncMapSize();
  }

  function handleResize() {
    if (!isMobileViewport()) {
      elements.sidebar.classList.remove("is-open");
    }

    syncSidebarButtonState();
    syncBackdropVisibility();
  }

  function switchLayer(layerName) {
    if (state.activeLayer === layerName) {
      return;
    }

    if (layerName === "satellite") {
      map.removeLayer(planLayer);
      satelliteLayer.addTo(map);
    } else {
      map.removeLayer(satelliteLayer);
      planLayer.addTo(map);
    }

    state.activeLayer = layerName;

    elements.layerButtons.forEach((button) => {
      const isActive = button.dataset.layer === layerName;
      button.classList.toggle("is-active", isActive);
    });
  }

  function setActiveNav(view) {
    elements.navLinks.forEach((link) => {
      const navItem = link.dataset.navItem;
      const isActive = view === "projects" ? navItem === "projects" : navItem === "map";

      link.classList.toggle("is-active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  function switchView(view) {
    if (view === state.currentView) {
      return;
    }

    state.currentView = view;
    const showProjects = view === "projects";

    elements.appShell.hidden = showProjects;
    elements.projectsPage.hidden = !showProjects;

    if (showProjects) {
      elements.sidebar.classList.remove("is-open");
      closeProjectPanel();
      closeProjectModal();
    } else {
      switchLayer("plan");
      map.setView(CITY_CENTER, 12, { animate: false });

      window.requestAnimationFrame(() => {
        map.invalidateSize();
      });

      window.setTimeout(() => {
        map.invalidateSize();
      }, 120);
    }

    setActiveNav(view);
    syncSidebarButtonState();
    syncBackdropVisibility();
  }

  function focusProjectOnMap(project, { openModal = false } = {}) {
    switchView("map");

    window.setTimeout(() => {
      map.flyTo(project.coords, 14, { duration: 0.8 });
      openProjectPanel(project);

      if (openModal) {
        openProjectModal(project);
      }
    }, 130);
  }
  function bindEvents() {
    elements.navLinks.forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();

        const targetView = link.dataset.view === "projects" ? "projects" : "map";
        switchView(targetView);
      });
    });

    elements.searchInput.addEventListener("input", (event) => {
      state.query = event.target.value.trim().toLowerCase();
      applyMapFilters();
    });

    elements.statusCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        const { status } = checkbox.dataset;

        if (checkbox.checked) {
          state.statuses.add(status);
        } else {
          state.statuses.delete(status);
        }

        applyMapFilters();
      });
    });

    elements.typeCards.forEach((card) => {
      card.addEventListener("click", () => {
        const { type } = card.dataset;
        const isActive = state.types.has(type);

        if (isActive) {
          state.types.delete(type);
        } else {
          state.types.add(type);
        }

        card.classList.toggle("is-active", !isActive);
        card.setAttribute("aria-pressed", String(!isActive));

        applyMapFilters();
      });
    });

    elements.enterpriseSearch.addEventListener("input", (event) => {
      state.enterpriseQuery = event.target.value.trim().toLowerCase();

      elements.enterpriseList.querySelectorAll("li").forEach((item) => {
        const searchTarget = item.dataset.enterprise || "";
        item.hidden = Boolean(state.enterpriseQuery) && !searchTarget.includes(state.enterpriseQuery);
      });
    });

    elements.projectsSearchInput.addEventListener("input", (event) => {
      state.projectsPageFilters.query = event.target.value.trim().toLowerCase();
      applyProjectsPageFilters();
    });

    elements.projectsStatusSelect.addEventListener("change", (event) => {
      state.projectsPageFilters.status = event.target.value;
      applyProjectsPageFilters();
    });

    elements.projectsTypeSelect.addEventListener("change", (event) => {
      state.projectsPageFilters.type = event.target.value;
      applyProjectsPageFilters();
    });

    elements.projectsInstitutionSelect.addEventListener("change", (event) => {
      state.projectsPageFilters.institution = event.target.value;
      applyProjectsPageFilters();
    });

    elements.projectsGrid.addEventListener("click", (event) => {
      const actionButton = event.target.closest("button[data-action]");
      if (!actionButton) {
        return;
      }

      const project = getProjectById(actionButton.dataset.projectId);
      if (!project) {
        return;
      }

      if (actionButton.dataset.action === "details") {
        focusProjectOnMap(project, { openModal: true });
      }

      if (actionButton.dataset.action === "map") {
        focusProjectOnMap(project, { openModal: false });
      }
    });

    elements.layerButtons.forEach((button) => {
      button.addEventListener("click", () => {
        switchLayer(button.dataset.layer);
      });
    });

    elements.resetFiltersBtn.addEventListener("click", resetMapFilters);
    elements.resetProjectPageFiltersBtn.addEventListener("click", resetProjectsPageFilters);

    elements.exploreBtn.addEventListener("click", () => {
      switchView("map");
      map.flyTo(CITY_CENTER, 12, { duration: 0.8 });
    });

    elements.openSidebarBtn.addEventListener("click", openSidebar);
    elements.closeSidebarBtn.addEventListener("click", closeSidebar);

    elements.closePanelBtn.addEventListener("click", closeProjectPanel);
    elements.expandProjectBtn.addEventListener("click", () => {
      const project = getProjectById(state.selectedProjectId);
      if (project) {
        openProjectModal(project);
      }
    });

    elements.closeProjectModalBtn.addEventListener("click", closeProjectModal);
    elements.projectModal.addEventListener("click", (event) => {
      if (event.target === elements.projectModal) {
        closeProjectModal();
      }
    });

    elements.mapBackdrop.addEventListener("click", () => {
      closeSidebar();
      closeProjectPanel();
      closeProjectModal();
    });

    window.addEventListener("resize", handleResize);
    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeProjectModal();
      }
    });
  }

  function init() {
    elements.expandProjectBtn.disabled = true;

    renderInstitutionChips();
    renderEnterpriseList();
    populateProjectPageFilterOptions();
    bindEvents();

    applyMapFilters();
    applyProjectsPageFilters();
    setActiveNav("map");
    handleResize();
  }

  init();
})();
