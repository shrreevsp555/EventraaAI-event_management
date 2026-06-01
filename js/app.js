// --- Eventra AI Application Controller ---

document.addEventListener("DOMContentLoaded", () => {
  // Global View State
  let activeView = "dashboard";
  let activeEventIdForBudget = "";
  let activeEventIdForSchedule = "";
  let activeEventIdForGuests = "";
  let activeEventIdForAI = "";

  // Chart Instances Registry (to destroy before redrawing)
  const chartRegistry = {
    trend: null,
    rsvp: null,
    types: null
  };

  // --- DOM Elements Cache ---
  const pageTitle = document.getElementById("page-title");
  const pageSubtitle = document.getElementById("page-subtitle");
  const viewPanels = document.querySelectorAll(".view-panel");
  const navLinks = document.querySelectorAll(".nav-link");
  
  // Modals & Panels
  const createEventModal = document.getElementById("modal-create-event");
  const aiDrawerPanel = document.getElementById("panel-ai-drawer");

  // --- Initializers ---
  const init = () => {
    bindNavEvents();
    bindModalEvents();
    bindAIEvents();
    populateVendorCheckboxes();
    populateEventDropdowns();
    
    // Set initial dropdown selections
    const allEvents = EventraDB.getEvents();
    if (allEvents.length > 0) {
      activeEventIdForBudget = allEvents[0].id;
      activeEventIdForSchedule = allEvents[0].id;
      activeEventIdForGuests = allEvents[0].id;
      activeEventIdForAI = allEvents[0].id;
    }

    renderActiveView();

    // Listen for data state changes to sync operational statistics
    window.addEventListener('eventra_state_change', () => {
      renderActiveView();
    });
  };

  // --- Router & Nav Bindings ---
  const bindNavEvents = () => {
    navLinks.forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const view = link.getAttribute("data-view");
        
        // Update active nav class
        navLinks.forEach(nl => nl.classList.remove("active"));
        link.classList.add("active");
        
        // Update URL hash or class-based SPA states
        activeView = view;
        renderActiveView();
      });
    });

    // View All button on dashboard
    document.getElementById("btn-dashboard-view-all-events").addEventListener("click", () => {
      document.querySelector('[data-view="events"]').click();
    });
  };

  const renderActiveView = () => {
    // Hide all view panels
    viewPanels.forEach(panel => panel.classList.remove("active"));
    
    // Show target view panel
    const activePanel = document.getElementById(`panel-${activeView}`);
    if (activePanel) {
      activePanel.classList.add("active");
    }

    // Update Header labels dynamically
    const headerTitles = {
      dashboard: { title: "Dashboard Overview", sub: "Plan Smart. Create Unforgettable Moments." },
      events: { title: "Event Management", sub: "Design, oversee, and optimize your event lineup." },
      guests: { title: "Guest Management", sub: "Track RSVP response rates and dietary specifications." },
      bookings: { title: "Booking Management", sub: "Validate vendor partnership bookings and billing status." },
      vendors: { title: "Vendor Network", sub: "Approved providers ready for direct event assignment." },
      budget: { title: "Budget Tracker", sub: "Oversee operational costs vs targets with AI audit features." },
      schedule: { title: "Schedule Planner", sub: "Itinerary day schedules and automated AI generation." },
      reports: { title: "Operational Insights", sub: "Consolidated performance analysis and event breakdowns." }
    };

    const textMeta = headerTitles[activeView] || { title: "Eventra AI", sub: "Event Management Dashboard" };
    pageTitle.textContent = textMeta.title;
    pageSubtitle.textContent = textMeta.sub;

    // Trigger page-specific renders
    switch (activeView) {
      case "dashboard":
        renderDashboard();
        break;
      case "events":
        renderEvents();
        break;
      case "guests":
        renderGuests();
        break;
      case "bookings":
        renderBookings();
        break;
      case "vendors":
        renderVendors();
        break;
      case "budget":
        renderBudget();
        break;
      case "schedule":
        renderSchedule();
        break;
      case "reports":
        renderReports();
        break;
    }
  };

  // --- Populate Setup Elements ---
  const populateVendorCheckboxes = () => {
    const container = document.getElementById("container-modal-vendors");
    if (!container) return;
    
    const vendorsList = EventraDB.getVendors();
    container.innerHTML = vendorsList.map(v => `
      <label class="checkbox-item">
        <input type="checkbox" name="modal-vendors" value="${v.id}" id="chk-vendor-${v.id}">
        <span>${v.name} (${v.category} - $${v.price.toLocaleString()})</span>
      </label>
    `).join('');
  };

  const populateEventDropdowns = () => {
    const eventList = EventraDB.getEvents();
    
    // Helper to populate select elements
    const fillSelect = (selectId, selectVal) => {
      const selectEl = document.getElementById(selectId);
      if (!selectEl) return;
      
      // Preserve selection if possible
      const currentVal = selectEl.value || selectVal;
      
      selectEl.innerHTML = eventList.map(e => `
        <option value="${e.id}">${e.name} (${e.type})</option>
      `).join('');
      
      // Set to current or fallback to first
      if (eventList.some(e => e.id === currentVal)) {
        selectEl.value = currentVal;
      } else if (eventList.length > 0) {
        selectEl.value = eventList[0].id;
      }
    };

    fillSelect("select-guest-event", activeEventIdForGuests);
    fillSelect("select-budget-event", activeEventIdForBudget);
    fillSelect("select-schedule-event", activeEventIdForSchedule);

    // Bookings filter dropdown
    const filterBookings = document.getElementById("filter-bookings-event");
    if (filterBookings) {
      const currentVal = filterBookings.value;
      filterBookings.innerHTML = '<option value="ALL">All Events</option>' + eventList.map(e => `
        <option value="${e.id}">${e.name}</option>
      `).join('');
      filterBookings.value = currentVal || "ALL";
    }
  };

  // --- Modal Logic ---
  const bindModalEvents = () => {
    const openBtn = document.getElementById("btn-create-event-header");
    const closeBtn = document.getElementById("btn-close-create-event-modal");
    const cancelBtn = document.getElementById("btn-modal-cancel-event");
    const form = document.getElementById("form-create-event");

    const toggleModal = (show) => {
      if (show) {
        // Reset and show
        form.reset();
        
        // Set default date to today
        const dateInput = document.getElementById("input-modal-date");
        if (dateInput) {
          const today = new Date().toISOString().split('T')[0];
          dateInput.value = today;
        }

        createEventModal.classList.add("active");
      } else {
        createEventModal.classList.remove("active");
      }
    };

    if (openBtn) openBtn.addEventListener("click", () => toggleModal(true));
    if (closeBtn) closeBtn.addEventListener("click", () => toggleModal(false));
    if (cancelBtn) cancelBtn.addEventListener("click", () => toggleModal(false));

    // Handle backdrop click
    createEventModal.addEventListener("click", (e) => {
      if (e.target === createEventModal) toggleModal(false);
    });

    // Save Event Form
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("input-modal-name").value.trim();
      const type = document.getElementById("select-modal-type").value;
      const date = document.getElementById("input-modal-date").value;
      const location = document.getElementById("input-modal-location").value.trim();
      const guestCount = document.getElementById("input-modal-guests").value;
      const budget = document.getElementById("input-modal-budget").value;

      // Extract checked vendors
      const checkedVendors = [];
      const checkboxes = document.querySelectorAll('input[name="modal-vendors"]:checked');
      checkboxes.forEach(chk => checkedVendors.push(chk.value));

      // Build event object
      const newEvent = EventraDB.addEvent({
        name,
        type,
        date,
        location,
        guestCount,
        budget,
        vendors: checkedVendors
      });

      // Synchronize selections
      activeEventIdForBudget = newEvent.id;
      activeEventIdForSchedule = newEvent.id;
      activeEventIdForGuests = newEvent.id;
      
      populateEventDropdowns();
      toggleModal(false);
      
      // Navigate to Events panel
      document.querySelector('[data-view="events"]').click();
    });
  };

  // --- AI Suggestions Panel ---
  const bindAIEvents = () => {
    const closeBtn = document.getElementById("btn-close-ai-panel");
    const regenBtn = document.getElementById("btn-regenerate-ai-drawer");

    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        aiDrawerPanel.classList.remove("active");
      });
    }

    if (regenBtn) {
      regenBtn.addEventListener("click", () => {
        triggerAIDrawerGeneration(activeEventIdForAI);
      });
    }

    // Dashboard Quick AI tool
    const quickAiBtn = document.getElementById("btn-quick-ai-submit");
    if (quickAiBtn) {
      quickAiBtn.addEventListener("click", async () => {
        const name = document.getElementById("input-quick-ai-name").value.trim();
        const type = document.getElementById("select-quick-ai-type").value;
        
        if (!name) {
          alert("Please type a conceptual name first.");
          return;
        }

        // Open AI drawer
        aiDrawerPanel.classList.add("active");
        
        // Set temporary header label
        document.getElementById("ai-drawer-event-name").textContent = `${name} (${type})`;
        
        // Show loading loaders
        const loadingText = `<i class="fa-solid fa-spinner fa-spin"></i> Formulating...`;
        document.getElementById("ai-drawer-tagline").innerHTML = loadingText;
        document.getElementById("ai-drawer-theme").innerHTML = loadingText;
        document.getElementById("ai-drawer-activities").innerHTML = loadingText;
        document.getElementById("ai-drawer-budget-tip").innerHTML = loadingText;
        document.getElementById("ai-drawer-colors").innerHTML = "";

        // Trigger suggestions
        const res = await EventraAI.generateSuggestions(name, type);
        
        // Typing effects
        typeEffect(document.getElementById("ai-drawer-tagline"), `"${res.tagline}"`);
        typeEffect(document.getElementById("ai-drawer-theme"), res.theme);
        typeEffect(document.getElementById("ai-drawer-activities"), res.activities);
        typeEffect(document.getElementById("ai-drawer-budget-tip"), res.budgetTip);

        // Display color boxes
        const colorBox = document.getElementById("ai-drawer-colors");
        colorBox.innerHTML = res.colors.map(col => `
          <div class="theme-swatch" style="background: ${col};" data-tooltip="${col}"></div>
        `).join('');

        // Clean quick-input fields
        document.getElementById("input-quick-ai-name").value = "";
      });
    }

    // AI Tip Refresher
    const refreshTipBtn = document.getElementById("btn-ai-refresh-tip");
    if (refreshTipBtn) {
      refreshTipBtn.addEventListener("click", () => {
        renderAIDashboardTip();
      });
    }
  };

  const triggerAIDrawerGeneration = async (eventId) => {
    const event = EventraDB.getEventById(eventId);
    if (!event) return;

    activeEventIdForAI = eventId;
    aiDrawerPanel.classList.add("active");

    document.getElementById("ai-drawer-event-name").textContent = event.name;

    // Loading states
    const loadingHtml = `<i class="fa-solid fa-spinner fa-spin"></i> Consulting AI...`;
    document.getElementById("ai-drawer-tagline").innerHTML = loadingHtml;
    document.getElementById("ai-drawer-theme").innerHTML = loadingHtml;
    document.getElementById("ai-drawer-activities").innerHTML = loadingHtml;
    document.getElementById("ai-drawer-budget-tip").innerHTML = loadingHtml;
    document.getElementById("ai-drawer-colors").innerHTML = "";

    const res = await EventraAI.generateSuggestions(event.name, event.type);
    
    // Save generated items into event database to persist
    EventraDB.updateEventSuggestions(event.id, res);

    // Apply typing animation sequentially
    await typeEffect(document.getElementById("ai-drawer-tagline"), `"${res.tagline}"`);
    await typeEffect(document.getElementById("ai-drawer-theme"), res.theme);
    await typeEffect(document.getElementById("ai-drawer-activities"), res.activities);
    await typeEffect(document.getElementById("ai-drawer-budget-tip"), res.budgetTip);

    // Draw colors
    const colorContainer = document.getElementById("ai-drawer-colors");
    colorContainer.innerHTML = res.colors.map(col => `
      <div class="theme-swatch" style="background: ${col};" data-tooltip="${col}"></div>
    `).join('');

    EventraDB.logActivity("info", `AI suggestions formulated for event <strong>${event.name}</strong>.`);
  };

  // --- Text Typing Effect ---
  const typeEffect = (element, text, speed = 10) => {
    element.innerHTML = "";
    return new Promise(resolve => {
      let i = 0;
      const cursor = document.createElement("span");
      cursor.className = "typing-cursor";
      element.appendChild(cursor);

      const interval = setInterval(() => {
        if (i < text.length) {
          cursor.before(text.charAt(i));
          i++;
        } else {
          clearInterval(interval);
          cursor.remove();
          resolve();
        }
      }, speed);
    });
  };

  // --- RENDER 1. DASHBOARD OVERVIEW ---
  const renderDashboard = () => {
    const stats = EventraDB.getDashboardStats();
    
    // Update Stats Numbers
    document.getElementById("stat-total-events").textContent = stats.totalEvents;
    document.getElementById("stat-upcoming-events").textContent = stats.upcomingEvents;
    document.getElementById("stat-pending-bookings").textContent = stats.pendingBookings;
    document.getElementById("stat-total-revenue").textContent = `$${stats.totalRevenue.toLocaleString()}`;
    document.getElementById("stat-total-guests").textContent = stats.totalGuests;

    // Render Mini Timelines
    const dashboardEventsList = document.getElementById("dashboard-events-list");
    const activeEvents = EventraDB.getEvents().slice(0, 3); // top 3

    if (activeEvents.length === 0) {
      dashboardEventsList.innerHTML = `<div class="empty-state"><p>No events active. Create one to begin!</p></div>`;
    } else {
      dashboardEventsList.innerHTML = activeEvents.map(e => {
        // Calculate attending RSVPs count
        const eventGuests = EventraDB.getGuestsByEvent(e.id);
        const attendingGuests = eventGuests.filter(g => g.rsvpStatus === "Attending").length;
        
        let typeIcon = "fa-calendar-day";
        if (e.type === "Wedding") typeIcon = "fa-heart";
        if (e.type === "Conference") typeIcon = "fa-handshake";
        if (e.type === "Concert") typeIcon = "fa-music";

        return `
          <div class="event-mini-item">
            <div class="event-mini-info">
              <div class="event-mini-type-icon"><i class="fa-solid ${typeIcon}"></i></div>
              <div class="event-mini-details">
                <h4>${e.name}</h4>
                <p><i class="fa-solid fa-location-dot"></i> ${e.location}</p>
              </div>
            </div>
            <div class="event-mini-meta">
              <span class="event-mini-guest-pill">${attendingGuests} / ${e.guestCount} RSVPs</span>
              <div class="event-mini-date">${formatDate(e.date)}</div>
            </div>
          </div>
        `;
      }).join('');
    }

    // Render Recent operational activities log
    const activityFeed = document.getElementById("dashboard-activity-feed");
    const logs = EventraDB.getActivities();
    
    if (logs.length === 0) {
      activityFeed.innerHTML = `<p style="text-align: center; color: var(--color-text-muted); font-size: 0.85rem;">No recent activities logged.</p>`;
    } else {
      activityFeed.innerHTML = logs.map(log => `
        <div class="activity-item ${log.type}">
          <div class="activity-icon">
            <i class="fa-solid ${log.type === 'success' ? 'fa-check' : log.type === 'warning' ? 'fa-circle-exclamation' : 'fa-info'}"></i>
          </div>
          <div class="activity-details">
            <div class="activity-desc">${log.text}</div>
            <div class="activity-time">${log.time}</div>
          </div>
        </div>
      `).join('');
    }

    // Load AI tip
    renderAIDashboardTip();
  };

  const renderAIDashboardTip = () => {
    const tipBox = document.getElementById("ai-smart-tip-content");
    const tips = [
      "AI Audit: Allocating 35% of your event budget toward Gourmet Catering is standard, but you can shave 8% by serving styled grazing boards instead of sit-down meals.",
      "Operations Warning: You have 3 bookings marked as Pending. Confirm catering and sound checks at least 3 weeks in advance to avoid late-booking premiums.",
      "Engagement Insight: Guests attending Conferences respond 40% better when interactive VR stations or Q&A panels are placed right after the networking lunch.",
      "Budget Tip: Combining AV and stage decoration under one local supplier can reduce transport and setup logistics by up to $1,500.",
      "RSVP Boost: Sending calendar link invites with your guest invitations will increase your RSVP confirmation rate by up to 25%."
    ];
    
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    typeEffect(tipBox, randomTip);
  };

  // --- RENDER 2. EVENT MANAGEMENT ---
  const renderEvents = () => {
    const container = document.getElementById("events-grid-container");
    const searchVal = document.getElementById("search-events-input").value.toLowerCase();
    const typeVal = document.getElementById("filter-events-type").value;
    
    let eventList = EventraDB.getEvents();

    // Filters
    if (typeVal !== "ALL") {
      eventList = eventList.filter(e => e.type === typeVal);
    }
    if (searchVal) {
      eventList = eventList.filter(e => 
        e.name.toLowerCase().includes(searchVal) || 
        e.location.toLowerCase().includes(searchVal)
      );
    }

    if (eventList.length === 0) {
      container.innerHTML = `
        <div class="charts-grid-full card empty-state" style="grid-column: 1 / -1;">
          <i class="fa-solid fa-folder-open"></i>
          <h3>No events found</h3>
          <p>Modify your search criteria or add a new event to get started.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = eventList.map(e => {
      const eventGuests = EventraDB.getGuestsByEvent(e.id);
      const attending = eventGuests.filter(g => g.rsvpStatus === "Attending").length;
      
      // Calculate RSVPs percentage
      const pct = e.guestCount > 0 ? Math.round((attending / e.guestCount) * 100) : 0;

      // Status class
      let statusColorClass = "badge-info";
      if (e.status === "Pending") statusColorClass = "badge-warning";
      if (e.status === "Completed") statusColorClass = "badge-success";

      return `
        <div class="card event-card ${e.type}">
          <div class="event-card-header">
            <span class="event-type-badge">${e.type}</span>
            <span class="badge ${statusColorClass}">${e.status}</span>
          </div>
          
          <h3 class="event-card-title">${e.name}</h3>
          
          <div class="event-card-info-item">
            <i class="fa-solid fa-calendar"></i>
            <span>${formatDate(e.date)}</span>
          </div>
          <div class="event-card-info-item">
            <i class="fa-solid fa-location-dot"></i>
            <span>${e.location}</span>
          </div>
          <div class="event-card-info-item">
            <i class="fa-solid fa-briefcase"></i>
            <span>${e.vendors.length} Vendor Partnerships</span>
          </div>

          <div class="event-progress-container">
            <div class="event-progress-labels">
              <span>Roster RSVPs</span>
              <span>${attending} / ${e.guestCount} (${pct}%)</span>
            </div>
            <div class="progress-track">
              <div class="progress-fill" style="width: ${pct}%"></div>
            </div>
          </div>

          <div class="event-card-footer">
            <div class="event-budget-badge">
              <span>Target Budget</span>
              $${e.budget.toLocaleString()}
            </div>
            <div class="event-card-actions">
              <button class="btn btn-secondary btn-sm btn-view-event-ai" data-id="${e.id}" title="AI Brand Suggestions">
                <i class="fa-solid fa-wand-magic-sparkles"></i> AI Suggest
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Attach Event listeners
    document.querySelectorAll(".btn-view-event-ai").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        triggerAIDrawerGeneration(id);
      });
    });
  };

  // Attach filters for events view
  const searchInput = document.getElementById("search-events-input");
  const typeFilter = document.getElementById("filter-events-type");
  if (searchInput) searchInput.addEventListener("input", renderEvents);
  if (typeFilter) typeFilter.addEventListener("change", renderEvents);

  // --- RENDER 3. GUEST MANAGEMENT ---
  const renderGuests = () => {
    const select = document.getElementById("select-guest-event");
    if (!select) return;

    const eventId = select.value;
    if (!eventId) {
      document.getElementById("guests-table-body").innerHTML = `<tr><td colspan="6" style="text-align: center;">Create an event to view guests.</td></tr>`;
      return;
    }

    activeEventIdForGuests = eventId;
    const event = EventraDB.getEventById(eventId);
    const guestList = EventraDB.getGuestsByEvent(eventId);

    // Calculate details
    const totalLimit = event ? event.guestCount : 100;
    const attending = guestList.filter(g => g.rsvpStatus === "Attending").length;
    const pending = guestList.filter(g => g.rsvpStatus === "Pending").length;
    const rsvpPct = totalLimit > 0 ? Math.round((attending / totalLimit) * 100) : 0;

    // Update numbers
    document.getElementById("guest-metric-rsvp-pct").textContent = `${rsvpPct}%`;
    document.getElementById("guest-metric-attending").textContent = attending;
    document.getElementById("guest-metric-pending").textContent = pending;

    const tbody = document.getElementById("guests-table-body");
    
    if (guestList.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: 3rem 1rem;" class="color-text-muted">
            <i class="fa-solid fa-users" style="font-size: 2rem; margin-bottom: 0.5rem; display: block; color: var(--color-purple);"></i>
            No guests added yet. Add one above!
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = guestList.map(g => {
      // RSVP state badge
      let rsvpClass = "badge-warning";
      if (g.rsvpStatus === "Attending") rsvpClass = "badge-success";
      if (g.rsvpStatus === "Declined") rsvpClass = "badge-danger";

      // Invitation toggle actions
      const inviteBtnIcon = g.invitation === "Sent" ? "fa-envelope-open" : "fa-paper-plane";
      const inviteBtnLabel = g.invitation === "Sent" ? "Mark Unsent" : "Send Invite";
      const inviteClass = g.invitation === "Sent" ? "badge-success" : "badge-warning";

      return `
        <tr>
          <td style="font-weight: 600; color: var(--color-white);">${g.name}</td>
          <td>${g.email}</td>
          <td>
            <span class="badge badge-info">${g.dietary}</span>
          </td>
          <td>
            <span class="badge ${inviteClass}">${g.invitation}</span>
          </td>
          <td>
            <span class="badge ${rsvpClass}">${g.rsvpStatus}</span>
          </td>
          <td>
            <div style="display: flex; gap: 0.35rem;">
              <select class="form-control form-control-rsvp-select btn-sm" data-id="${g.id}" style="width: 110px; padding: 0.25rem 0.5rem; height: 30px; font-size: 0.8rem;">
                <option value="Pending" ${g.rsvpStatus === "Pending" ? "selected" : ""}>Pending</option>
                <option value="Attending" ${g.rsvpStatus === "Attending" ? "selected" : ""}>Attending</option>
                <option value="Declined" ${g.rsvpStatus === "Declined" ? "selected" : ""}>Declined</option>
              </select>
              <button class="btn btn-secondary btn-sm btn-guest-invite-toggle" data-id="${g.id}" title="${inviteBtnLabel}">
                <i class="fa-solid ${inviteBtnIcon}"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    // Attach listeners
    document.querySelectorAll(".form-control-rsvp-select").forEach(sel => {
      sel.addEventListener("change", (e) => {
        const id = sel.getAttribute("data-id");
        EventraDB.updateGuestRSVP(id, e.target.value);
        renderGuests();
      });
    });

    document.querySelectorAll(".btn-guest-invite-toggle").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        const guest = EventraDB.getGuests().find(g => g.id === id);
        if (guest) {
          const targetStatus = guest.invitation === "Sent" ? "Unsent" : "Sent";
          EventraDB.updateGuestInvitation(id, targetStatus);
          renderGuests();
        }
      });
    });
  };

  // Bind change trigger for active guests filter
  const guestSelect = document.getElementById("select-guest-event");
  if (guestSelect) {
    guestSelect.addEventListener("change", () => {
      activeEventIdForGuests = guestSelect.value;
      renderGuests();
    });
  }

  // Handle Add Guest Form Submission
  const addGuestForm = document.getElementById("form-add-guest");
  if (addGuestForm) {
    addGuestForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const targetEventId = document.getElementById("select-guest-event").value;
      if (!targetEventId) {
        alert("Please select a target event first.");
        return;
      }

      const name = document.getElementById("input-guest-name").value.trim();
      const email = document.getElementById("input-guest-email").value.trim();
      const dietary = document.getElementById("select-guest-dietary").value;

      EventraDB.addGuest({
        eventId: targetEventId,
        name,
        email,
        dietary,
        rsvpStatus: "Pending",
        invitation: "Unsent"
      });

      // Clear input fields
      document.getElementById("input-guest-name").value = "";
      document.getElementById("input-guest-email").value = "";
      document.getElementById("select-guest-dietary").value = "None";

      renderGuests();
    });
  }

  // --- RENDER 4. BOOKING MANAGEMENT ---
  const renderBookings = () => {
    const filter = document.getElementById("filter-bookings-event");
    if (!filter) return;

    const eventFilterVal = filter.value;
    let bookingsList = EventraDB.getBookings();

    if (eventFilterVal !== "ALL") {
      bookingsList = bookingsList.filter(b => b.eventId === eventFilterVal);
    }

    const tbody = document.getElementById("bookings-table-body");
    
    if (bookingsList.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 2rem;">No operational bookings registered.</td></tr>`;
      return;
    }

    tbody.innerHTML = bookingsList.map(b => {
      const event = EventraDB.getEventById(b.eventId);
      const vendor = EventraDB.getVendorById(b.vendorId);
      
      const eventName = event ? event.name : "Unknown Event";
      const vendorName = vendor ? vendor.name : "Unknown Vendor";
      const category = vendor ? vendor.category : "Service";

      // Status details
      let statusClass = "badge-warning";
      if (b.status === "Confirmed") statusClass = "badge-success";
      if (b.status === "Cancelled") statusClass = "badge-danger";

      // Payment details
      let payClass = "badge-warning";
      if (b.paymentStatus === "Paid") payClass = "badge-success";

      return `
        <tr>
          <td style="font-family: monospace; font-size: 0.8rem;">#${b.id}</td>
          <td style="font-weight: 500; color: var(--color-white);">${eventName}</td>
          <td>${vendorName}</td>
          <td><span class="badge badge-info">${category}</span></td>
          <td style="font-weight: 600;">$${b.cost.toLocaleString()}</td>
          <td>
            <span class="badge ${payClass}">${b.paymentStatus}</span>
          </td>
          <td>
            <span class="badge ${statusClass}">${b.status}</span>
          </td>
          <td>
            <div style="display: flex; gap: 0.35rem;">
              <button class="btn btn-secondary btn-sm btn-booking-status-toggle" data-id="${b.id}" data-action="status" title="Confirm/Cancel">
                <i class="fa-solid fa-circle-check"></i>
              </button>
              <button class="btn btn-secondary btn-sm btn-booking-payment-toggle" data-id="${b.id}" data-action="payment" title="Pay/Unpay">
                <i class="fa-solid fa-credit-card"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    // Attach listeners
    document.querySelectorAll(".btn-booking-status-toggle").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        const b = EventraDB.getBookings().find(item => item.id === id);
        if (b) {
          const nextStatus = b.status === "Confirmed" ? "Cancelled" : b.status === "Cancelled" ? "Pending" : "Confirmed";
          EventraDB.updateBookingStatus(id, nextStatus);
          renderBookings();
        }
      });
    });

    document.querySelectorAll(".btn-booking-payment-toggle").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        const b = EventraDB.getBookings().find(item => item.id === id);
        if (b) {
          const nextPay = b.paymentStatus === "Paid" ? "Unpaid" : "Paid";
          EventraDB.updateBookingPayment(id, nextPay);
          renderBookings();
        }
      });
    });
  };

  const bookingFilter = document.getElementById("filter-bookings-event");
  if (bookingFilter) {
    bookingFilter.addEventListener("change", renderBookings);
  }

  // --- RENDER 5. VENDOR MANAGEMENT ---
  const renderVendors = () => {
    const container = document.getElementById("vendors-grid-container");
    if (!container) return;

    const filterVal = document.getElementById("filter-vendors-category").value;
    let list = EventraDB.getVendors();

    if (filterVal !== "ALL") {
      list = list.filter(v => v.category === filterVal);
    }

    container.innerHTML = list.map(v => {
      // Build rating stars
      const fullStars = Math.floor(v.rating);
      const hasHalf = v.rating % 1 !== 0;
      let starsHtml = "";
      for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
          starsHtml += '<i class="fa-solid fa-star"></i>';
        } else if (i === fullStars && hasHalf) {
          starsHtml += '<i class="fa-solid fa-star-half-stroke"></i>';
        } else {
          starsHtml += '<i class="fa-regular fa-star"></i>';
        }
      }

      return `
        <div class="card vendor-card">
          <div class="vendor-card-header">
            <span class="vendor-category">${v.category}</span>
            <div class="vendor-rating">
              ${starsHtml} <span>(${v.rating})</span>
            </div>
          </div>
          <h3 class="vendor-name">${v.name}</h3>
          <p class="vendor-details">${v.description}</p>
          <div style="font-size: 0.8rem; color: var(--color-text-muted); margin-bottom: 1rem;">
            <i class="fa-solid fa-envelope"></i> Contact: ${v.contact}
          </div>
          <div class="vendor-pricing">
            <div>
              <span class="vendor-price-label">Average Booking Fee</span>
              <div class="vendor-price-value">$${v.price.toLocaleString()}</div>
            </div>
            <button class="btn btn-secondary btn-sm btn-vendor-quick-inquire" data-id="${v.id}">
              <i class="fa-solid fa-paper-plane"></i> Contact
            </button>
          </div>
        </div>
      `;
    }).join('');

    document.querySelectorAll(".btn-vendor-quick-inquire").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        const vendor = EventraDB.getVendorById(id);
        if (vendor) {
          alert(`Sending inquiry packet to ${vendor.name} (${vendor.contact}). Expect response within 24 hours.`);
        }
      });
    });
  };

  const vendorFilter = document.getElementById("filter-vendors-category");
  if (vendorFilter) {
    vendorFilter.addEventListener("change", renderVendors);
  }

  // --- RENDER 6. BUDGET TRACKING ---
  const renderBudget = () => {
    const select = document.getElementById("select-budget-event");
    if (!select) return;

    const eventId = select.value;
    if (!eventId) {
      document.getElementById("budget-category-list").innerHTML = `<div class="empty-state"><p>Create an event to audit budgets.</p></div>`;
      return;
    }

    activeEventIdForBudget = eventId;
    const event = EventraDB.getEventById(eventId);
    const eventBookings = EventraDB.getBookingsByEvent(eventId);

    // Calculate actual spend from bookings costs
    const spent = eventBookings
      .filter(b => b.status !== "Cancelled")
      .reduce((sum, b) => sum + b.cost, 0);

    const limit = event ? event.budget : 20000;
    const remaining = limit - spent;
    const useRate = limit > 0 ? Math.round((spent / limit) * 100) : 0;

    // Display numbers
    document.getElementById("budget-val-limit").textContent = `$${limit.toLocaleString()}`;
    document.getElementById("budget-val-committed").textContent = `$${spent.toLocaleString()}`;
    
    const remainingBox = document.getElementById("budget-val-remaining");
    remainingBox.textContent = `$${remaining.toLocaleString()}`;
    if (remaining < 0) {
      remainingBox.style.color = "var(--color-red)";
    } else {
      remainingBox.style.color = "var(--color-green)";
    }

    // Progress bar fill
    document.getElementById("budget-progress-percent").textContent = `${useRate}% Used`;
    const fillBar = document.getElementById("budget-progress-bar-fill");
    
    // Animate widths
    fillBar.style.width = `${Math.min(useRate, 100)}%`;
    fillBar.className = "budget-fill";
    if (useRate >= 100) {
      fillBar.classList.add("danger");
    } else if (useRate >= 80) {
      fillBar.classList.add("warning");
    }

    // Category Splits listing
    const categoryContainer = document.getElementById("budget-category-list");
    
    // Group actual bookings into categories
    const categoriesMap = {};
    eventBookings.forEach(b => {
      const vendor = EventraDB.getVendorById(b.vendorId);
      const cat = vendor ? vendor.category : "Miscellaneous";
      
      if (!categoriesMap[cat]) {
        categoriesMap[cat] = 0;
      }
      categoriesMap[cat] += b.cost;
    });

    const categoryKeys = Object.keys(categoriesMap);

    if (categoryKeys.length === 0) {
      categoryContainer.innerHTML = `
        <div style="text-align: center; color: var(--color-text-muted); font-size: 0.88rem; padding: 2rem 0;">
          No operational bookings confirmed for this event. 
        </div>
      `;
    } else {
      categoryContainer.innerHTML = categoryKeys.map(cat => {
        const val = categoriesMap[cat];
        const pct = limit > 0 ? Math.round((val / limit) * 100) : 0;

        return `
          <div class="expense-row">
            <div class="expense-info">
              <h4>${cat}</h4>
              <p>${pct}% of target limit</p>
            </div>
            <div class="expense-val">$${val.toLocaleString()}</div>
          </div>
        `;
      }).join('');
    }

    // Load AI Budget advisor panel text
    const adviceBox = document.getElementById("ai-budget-analysis-box");
    if (useRate > 100) {
      adviceBox.innerHTML = `<strong>AI Financial Alert:</strong> Budget limit is exceeded by $${Math.abs(remaining).toLocaleString()} (${useRate}% usage)! We advise cancelling optional bookings (e.g. Entertainment/Decor) or negotiating base catering prices.`;
    } else if (useRate > 80) {
      adviceBox.innerHTML = `<strong>AI Financial Warning:</strong> You have consumed ${useRate}% of the budget. Reserves are slim ($${remaining.toLocaleString()}). Avoid adding any new guest lists or extra amenities.`;
    } else if (eventBookings.length > 0) {
      adviceBox.innerHTML = `<strong>AI Financial Audit:</strong> Budget healthy. Spending is stable at ${useRate}% of target limit. We suggest allocating remaining ${remaining.toLocaleString()} reserves into guest marketing or tech giveaways.`;
    } else {
      adviceBox.innerHTML = `Please select "Estimate Budget with AI" to generate a simulated cost projection for categories based on inputs.`;
    }
  };

  // Bind change trigger for active budgets filter
  const budgetSelect = document.getElementById("select-budget-event");
  if (budgetSelect) {
    budgetSelect.addEventListener("change", () => {
      activeEventIdForBudget = budgetSelect.value;
      renderBudget();
    });
  }

  // Handle AI Budget Estimator Button
  const btnEstimateBudget = document.getElementById("btn-budget-ai-estimate");
  if (btnEstimateBudget) {
    btnEstimateBudget.addEventListener("click", async () => {
      const select = document.getElementById("select-budget-event");
      const eventId = select.value;
      if (!eventId) return;

      const event = EventraDB.getEventById(eventId);
      if (!event) return;

      // Loading state on button
      btnEstimateBudget.disabled = true;
      btnEstimateBudget.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Analyzing...`;

      const adviceBox = document.getElementById("ai-budget-analysis-box");
      adviceBox.innerHTML = `<i class="fa-solid fa-hourglass-half"></i> Distributing costs & checking metrics...`;

      // Call AI estimator
      const res = await EventraAI.estimateBudget(event.type, event.guestCount, event.budget);

      // Play typing comments
      await typeEffect(adviceBox, res.analysis);

      // Mutate event categories list into virtual allocations representation
      const categoryContainer = document.getElementById("budget-category-list");
      categoryContainer.innerHTML = res.breakdown.map(item => `
        <div class="expense-row" style="border-color: rgba(168, 85, 247, 0.15); background: rgba(168, 85, 247, 0.02);">
          <div class="expense-info">
            <h4 style="color: var(--color-white);">${item.category} (AI Projection)</h4>
            <p>${item.percentage}% allocated • $${item.costPerGuest}/guest</p>
          </div>
          <div class="expense-val" style="color: var(--color-cyan);">$${item.estimatedCost.toLocaleString()}</div>
        </div>
      `).join('');

      // Add a virtual bookings update feedback logic if necessary. Here we just update local state tip.
      btnEstimateBudget.disabled = false;
      btnEstimateBudget.innerHTML = `<i class="fa-solid fa-chart-line-up"></i> Estimate Budget with AI`;

      EventraDB.logActivity("info", `AI generated budget splits configured for <strong>${event.name}</strong>.`);
    });
  }

  // --- RENDER 7. SCHEDULE PLANNER ---
  const renderSchedule = () => {
    const select = document.getElementById("select-schedule-event");
    if (!select) return;

    const eventId = select.value;
    if (!eventId) {
      document.getElementById("schedule-timeline-container").innerHTML = `<div class="empty-state"><p>Create an event to view itinerary.</p></div>`;
      return;
    }

    activeEventIdForSchedule = eventId;
    const list = EventraDB.getScheduleByEvent(eventId);
    const container = document.getElementById("schedule-timeline-container");

    if (list.length === 0) {
      container.innerHTML = `
        <div class="empty-state" style="padding: 2rem 0;">
          <i class="fa-solid fa-route"></i>
          <h3>No slots planned yet</h3>
          <p>Generate a full schedule with AI below or insert a custom slot.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = list.map(item => `
      <div class="timeline-item">
        <div class="timeline-time">${item.time}</div>
        <h4 class="timeline-title">${item.title}</h4>
        <p class="timeline-desc">${item.description}</p>
      </div>
    `).join('');
  };

  // Bind change trigger for active schedule filter
  const scheduleSelect = document.getElementById("select-schedule-event");
  if (scheduleSelect) {
    scheduleSelect.addEventListener("change", () => {
      activeEventIdForSchedule = scheduleSelect.value;
      renderSchedule();
    });
  }

  // Handle Add Schedule Form Submission
  const addScheduleForm = document.getElementById("form-add-schedule");
  if (addScheduleForm) {
    addScheduleForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const eventId = document.getElementById("select-schedule-event").value;
      if (!eventId) {
        alert("Please select an event context.");
        return;
      }

      const time = document.getElementById("input-schedule-time").value.trim();
      const title = document.getElementById("input-schedule-title").value.trim();
      const description = document.getElementById("input-schedule-desc").value.trim();

      EventraDB.addScheduleItem({
        eventId,
        time,
        title,
        description
      });

      // Clear input fields
      document.getElementById("input-schedule-time").value = "";
      document.getElementById("input-schedule-title").value = "";
      document.getElementById("input-schedule-desc").value = "";

      renderSchedule();
    });
  }

  // Handle AI Schedule Generator Button
  const btnGenerateSchedule = document.getElementById("btn-schedule-ai-generate");
  if (btnGenerateSchedule) {
    btnGenerateSchedule.addEventListener("click", async () => {
      const select = document.getElementById("select-schedule-event");
      const eventId = select.value;
      if (!eventId) return;

      const event = EventraDB.getEventById(eventId);
      if (!event) return;

      btnGenerateSchedule.disabled = true;
      btnGenerateSchedule.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Generating slots...`;

      // Wipe old schedules first
      EventraDB.clearScheduleForEvent(eventId);
      
      const timelineContainer = document.getElementById("schedule-timeline-container");
      timelineContainer.innerHTML = `
        <div class="empty-state" style="padding: 2rem 0;">
          <i class="fa-solid fa-wand-magic-sparkles fa-bounce" style="color: var(--color-pink);"></i>
          <h3>Synthesizing optimal hourly runs...</h3>
          <p>Arranging speakers, catering timing alignments, and network openings.</p>
        </div>
      `;

      // Call AI generator
      const list = await EventraAI.generateSchedule(event.type, event.name);

      // Populate database
      list.forEach(slot => {
        EventraDB.addScheduleItem({
          eventId: event.id,
          time: slot.time,
          title: slot.title,
          description: slot.description
        });
      });

      // Play visual slide load
      btnGenerateSchedule.disabled = false;
      btnGenerateSchedule.innerHTML = `<i class="fa-solid fa-compass"></i> Auto Itinerary Generator (AI)`;

      renderSchedule();
      
      EventraDB.logActivity("success", `AI generated full itinerary schedule for <strong>${event.name}</strong>.`);
    });
  }

  // --- RENDER 8. REPORTS SECTION (Chart.js) ---
  const renderReports = () => {
    // Destroy previous chart instances
    if (chartRegistry.trend) chartRegistry.trend.destroy();
    if (chartRegistry.rsvp) chartRegistry.rsvp.destroy();
    if (chartRegistry.types) chartRegistry.types.destroy();

    const activeEventsList = EventraDB.getEvents().filter(e => e.status !== "Cancelled");

    // 1. Line Chart: Financial Budgets Allocation
    const trendCtx = document.getElementById("chart-revenue-trends");
    if (trendCtx) {
      const labels = activeEventsList.map(e => e.name.substring(0, 15) + "...");
      const budgets = activeEventsList.map(e => e.budget);
      
      // Calculate committed costs
      const committed = activeEventsList.map(e => {
        const eventBookings = EventraDB.getBookingsByEvent(e.id);
        return eventBookings.reduce((sum, b) => sum + b.cost, 0);
      });

      const ctx2d = trendCtx.getContext("2d");
      
      // Gradients
      const gradPurple = ctx2d.createLinearGradient(0, 0, 0, 200);
      gradPurple.addColorStop(0, "rgba(168, 85, 247, 0.4)");
      gradPurple.addColorStop(1, "rgba(168, 85, 247, 0.0)");

      const gradCyan = ctx2d.createLinearGradient(0, 0, 0, 200);
      gradCyan.addColorStop(0, "rgba(6, 182, 212, 0.4)");
      gradCyan.addColorStop(1, "rgba(6, 182, 212, 0.0)");

      chartRegistry.trend = new Chart(trendCtx, {
        type: "line",
        data: {
          labels,
          datasets: [
            {
              label: "Target Budget ($)",
              data: budgets,
              borderColor: "#a855f7",
              backgroundColor: gradPurple,
              fill: true,
              tension: 0.4,
              borderWidth: 3,
              pointBackgroundColor: "#a855f7"
            },
            {
              label: "Committed Vendor Bills ($)",
              data: committed,
              borderColor: "#06b6d4",
              backgroundColor: gradCyan,
              fill: true,
              tension: 0.4,
              borderWidth: 2,
              pointBackgroundColor: "#06b6d4",
              borderDash: [5, 5]
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { labels: { color: "#94a3b8", font: { family: "Inter" } } }
          },
          scales: {
            x: { grid: { color: "rgba(255,255,255,0.05)" }, ticks: { color: "#94a3b8" } },
            y: { grid: { color: "rgba(255,255,255,0.05)" }, ticks: { color: "#94a3b8" } }
          }
        }
      });
    }

    // 2. Doughnut Chart: RSVP Distribution
    const rsvpCtx = document.getElementById("chart-rsvp-distribution");
    if (rsvpCtx) {
      const allGuestsList = EventraDB.getGuests();
      const attending = allGuestsList.filter(g => g.rsvpStatus === "Attending").length;
      const pending = allGuestsList.filter(g => g.rsvpStatus === "Pending").length;
      const declined = allGuestsList.filter(g => g.rsvpStatus === "Declined").length;

      chartRegistry.rsvp = new Chart(rsvpCtx, {
        type: "doughnut",
        data: {
          labels: ["Attending", "Pending", "Declined"],
          datasets: [
            {
              data: [attending, pending, declined],
              backgroundColor: ["#10b981", "#f59e0b", "#ef4444"], // Green, Amber, Red
              borderColor: "rgba(20, 16, 33, 0.9)",
              borderWidth: 2
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: "right", labels: { color: "#94a3b8", font: { family: "Inter" } } }
          }
        }
      });
    }

    // 3. Bar Chart: Event Categories Distribution
    const typesCtx = document.getElementById("chart-types-distribution");
    if (typesCtx) {
      // Tally type counts
      const counts = {};
      activeEventsList.forEach(e => {
        counts[e.type] = (counts[e.type] || 0) + 1;
      });

      const labels = Object.keys(counts);
      const data = Object.values(counts);

      chartRegistry.types = new Chart(typesCtx, {
        type: "bar",
        data: {
          labels,
          datasets: [
            {
              label: "Events Configured Count",
              data,
              backgroundColor: "rgba(236, 72, 153, 0.75)",
              borderColor: "#ec4899",
              borderWidth: 2,
              borderRadius: 6
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            x: { grid: { display: false }, ticks: { color: "#94a3b8" } },
            y: { grid: { color: "rgba(255,255,255,0.05)" }, ticks: { color: "#94a3b8", stepSize: 1 } }
          }
        }
      });
    }
  };

  // --- Utility Date Formatting ---
  const formatDate = (dateStr) => {
    if (!dateStr) return "TBD";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const options = { month: "short", day: "numeric", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  // Launch Dashboard Code
  init();
});
