// --- Eventra AI Data Store & State Management ---

// Seed Vendors (Static Database of Service Providers)
const DEFAULT_VENDORS = [
  {
    id: "v1",
    name: "Grand Plaza Hall & Gardens",
    category: "Venue",
    rating: 4.9,
    price: 15000,
    contact: "events@grandplazahall.com",
    description: "Premium glass-walled indoor hall and scenic outer lawns. Holds up to 500 guests."
  },
  {
    id: "v2",
    name: "Whispering Pines Forest Manor",
    category: "Venue",
    rating: 4.8,
    price: 12000,
    contact: "hello@whisperingpines.com",
    description: "Rustic forest estate with a beautiful wooden pavilion. Perfect for weddings and galas."
  },
  {
    id: "v3",
    name: "Apex Culinary Group",
    category: "Catering",
    rating: 4.7,
    price: 7500,
    contact: "chef@apexculinary.com",
    description: "Gourmet dining experience with tailor-made menus ranging from fine dining to buffet bars."
  },
  {
    id: "v4",
    name: "Sonic Wave DJ & Production",
    category: "Entertainment",
    rating: 4.9,
    price: 3200,
    contact: "bookings@sonicwave.io",
    description: "High-end concert sound setups, customized neon stage lighting, and professional DJs."
  },
  {
    id: "v5",
    name: "Lumina Photography & Video",
    category: "Photography",
    rating: 4.8,
    price: 4500,
    contact: "info@luminaphoto.com",
    description: "Award-winning documentary photographers capturing candid emotions and high-definition video."
  },
  {
    id: "v6",
    name: "Prism & Petal Floral Decor",
    category: "Decor",
    rating: 4.6,
    price: 5200,
    contact: "hello@prismandpetal.com",
    description: "Bespoke floral setups, neon signs, holographic backdrops, and modern centerpieces."
  }
];

// Seed Events (Initial set of demo events)
const DEFAULT_EVENTS = [
  {
    id: "e1",
    name: "VeloTech Innovations Summit 2026",
    type: "Conference",
    date: "2026-06-25",
    location: "Grand Plaza Hall & Gardens",
    guestCount: 350,
    budget: 75000,
    status: "Upcoming",
    vendors: ["v1", "v3", "v4"],
    aiSuggestions: {
      tagline: "Accelerate into the Future of Tech",
      theme: "Cyberpunk Tech & Kinetic Energy",
      colors: ["#a855f7", "#3b82f6", "#06b6d4"],
      activities: "Interactive VR Booths, AI Startup Panel, Neon Networking Hour",
      budgetTip: "Allocate 15% more budget towards AV equipment to boost virtual attendee experience."
    }
  },
  {
    id: "e2",
    name: "Sophia & Daniel's Eternal Gala",
    type: "Wedding",
    date: "2026-07-18",
    location: "Whispering Pines Forest Manor",
    guestCount: 120,
    budget: 45000,
    status: "Upcoming",
    vendors: ["v2", "v3", "v5", "v6"],
    aiSuggestions: {
      tagline: "Love Amidst the Ancient Pines",
      theme: "Whimsical Forest & Glowing Fairy Lights",
      colors: ["#ec4899", "#a855f7", "#f59e0b"],
      activities: "Acoustic Forest Walk, Sparkler Send-Off, Polaroid Guest Wall",
      budgetTip: "Saves 10% on flowers by utilizing the venue's natural foliage and using fairy lights for ambient decor."
    }
  },
  {
    id: "e3",
    name: "Retro-Future Synth Concert",
    type: "Concert",
    date: "2026-08-12",
    location: "Grand Plaza Hall & Gardens",
    guestCount: 600,
    budget: 95000,
    status: "Pending",
    vendors: ["v1", "v4"],
    aiSuggestions: null
  }
];

// Seed Guests (Linked to Event e1 and e2)
const DEFAULT_GUESTS = [
  // VeloTech Guests
  { id: "g1", eventId: "e1", name: "Dr. Aris Thorne", email: "aris@thornetech.io", rsvpStatus: "Attending", invitation: "Sent", dietary: "Vegan" },
  { id: "g2", eventId: "e1", name: "Sarah Jenkins", email: "sarah.j@codecollective.org", rsvpStatus: "Attending", invitation: "Sent", dietary: "None" },
  { id: "g3", eventId: "e1", name: "Marko Novak", email: "novak@futurelabs.com", rsvpStatus: "Pending", invitation: "Sent", dietary: "Gluten-Free" },
  { id: "g4", eventId: "e1", name: "Yuki Tanaka", email: "y.tanaka@cybernet.co.jp", rsvpStatus: "Attending", invitation: "Sent", dietary: "None" },
  { id: "g5", eventId: "e1", name: "Liam Vance", email: "vance.l@innovate.edu", rsvpStatus: "Declined", invitation: "Sent", dietary: "None" },
  { id: "g6", eventId: "e1", name: "Emma Watson", email: "emma@cloudcorp.com", rsvpStatus: "Pending", invitation: "Unsent", dietary: "None" },

  // Wedding Guests
  { id: "g7", eventId: "e2", name: "Helen Carter", email: "helen@carterfamily.net", rsvpStatus: "Attending", invitation: "Sent", dietary: "Vegetarian" },
  { id: "g8", eventId: "e2", name: "David Miller", email: "david@millerarch.com", rsvpStatus: "Attending", invitation: "Sent", dietary: "None" },
  { id: "g9", eventId: "e2", name: "Olivia Rose", email: "olivia.rose@gmail.com", rsvpStatus: "Pending", invitation: "Sent", dietary: "Nut Allergy" },
  { id: "g10", eventId: "e2", name: "James Thompson", email: "james.t@gmail.com", rsvpStatus: "Declined", invitation: "Sent", dietary: "None" }
];

// Seed Bookings (Links Events to Vendors with pricing)
const DEFAULT_BOOKINGS = [
  { id: "b1", eventId: "e1", vendorId: "v1", cost: 15000, status: "Confirmed", paymentStatus: "Paid" },
  { id: "b2", eventId: "e1", vendorId: "v3", cost: 18000, status: "Confirmed", paymentStatus: "Unpaid" },
  { id: "b3", eventId: "e1", vendorId: "v4", cost: 4200, status: "Pending", paymentStatus: "Unpaid" },
  
  { id: "b4", eventId: "e2", vendorId: "v2", cost: 12000, status: "Confirmed", paymentStatus: "Paid" },
  { id: "b5", eventId: "e2", vendorId: "v3", cost: 6500, status: "Confirmed", paymentStatus: "Unpaid" },
  { id: "b6", eventId: "e2", vendorId: "v5", cost: 4500, status: "Confirmed", paymentStatus: "Paid" },
  { id: "b7", eventId: "e2", vendorId: "v6", cost: 5200, status: "Pending", paymentStatus: "Unpaid" },
  
  { id: "b8", eventId: "e3", vendorId: "v1", cost: 15000, status: "Pending", paymentStatus: "Unpaid" },
  { id: "b9", eventId: "e3", vendorId: "v4", cost: 5000, status: "Pending", paymentStatus: "Unpaid" }
];

// Seed Schedules
const DEFAULT_SCHEDULES = [
  // VeloTech Event
  { id: "s1", eventId: "e1", time: "09:00 AM", title: "Registrations & Welcome Coffee", description: "Collect tags, enter glass dome foyer, and enjoy custom coffee drinks." },
  { id: "s2", eventId: "e1", time: "10:00 AM", title: "Keynote: AI and Quantum Futures", description: "Opening session by keynote speaker focusing on breakthroughs in hardware." },
  { id: "s3", eventId: "e1", time: "12:00 PM", title: "Networking Lunch & VR Demos", description: "Interact at demo booths, visual arts garden, and caterer's buffet." },
  { id: "s4", eventId: "e1", time: "02:30 PM", title: "Panel Discussion: Ethics of Velocity", description: "Interactive session with industry leaders on rapid tech adoption." },
  { id: "s5", eventId: "e1", time: "05:00 PM", title: "Neon Sunset Social", description: "Cocktail event with synthwave music by DJ Sonic Wave." },

  // Wedding Event
  { id: "s6", eventId: "e2", time: "03:30 PM", title: "Arrival of Guests", description: "Fairy light path walks, champagne welcoming at the forest manor." },
  { id: "s7", eventId: "e2", time: "04:00 PM", title: "Ceremony & Exchange of Vows", description: "Beautiful custom vows under the ancient pine canopy." },
  { id: "s8", eventId: "e2", time: "05:30 PM", title: "Cocktail Hour & Portraits", description: "Acoustic strings background, polaroid memories board setup." },
  { id: "s9", eventId: "e2", time: "07:00 PM", title: "Reception Dinner & Toasting", description: "Elegant candlelit catering, heartwarming family toasts." },
  { id: "s10", eventId: "e2", time: "09:30 PM", title: "Sparkler Dance", description: "Opening dance and cake cutting with neon ambient lighting." }
];

// Seed Activity Log
const DEFAULT_ACTIVITIES = [
  { id: "a1", type: "success", text: "New event <strong>Sophia & Daniel's Eternal Gala</strong> created.", time: "1 hour ago" },
  { id: "a2", type: "info", text: "AI budget estimation generated for <strong>VeloTech Summit</strong>.", time: "3 hours ago" },
  { id: "a3", type: "warning", text: "Catering booking status changed to <strong>Confirmed</strong> for Event #e1.", time: "5 hours ago" },
  { id: "a4", type: "info", text: "Guest <strong>Yuki Tanaka</strong> RSVP'd Attending to VeloTech Summit.", time: "1 day ago" }
];

// --- Local Storage Initialization ---
const loadData = (key, fallback) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : fallback;
};

const saveData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Global Store State Variables
let events = loadData("eventra_events", DEFAULT_EVENTS);
let guests = loadData("eventra_guests", DEFAULT_GUESTS);
let bookings = loadData("eventra_bookings", DEFAULT_BOOKINGS);
let schedules = loadData("eventra_schedules", DEFAULT_SCHEDULES);
let activities = loadData("eventra_activities", DEFAULT_ACTIVITIES);
const vendors = DEFAULT_VENDORS; // Read-only catalog

// --- Eventra AI State Modifiers & Getters ---
const EventraDB = {
  // --- Getters ---
  getEvents: () => events,
  getEventById: (id) => events.find(e => e.id === id),
  getGuests: () => guests,
  getGuestsByEvent: (eventId) => guests.filter(g => g.eventId === eventId),
  getVendors: () => vendors,
  getVendorById: (id) => vendors.find(v => v.id === id),
  getBookings: () => bookings,
  getBookingsByEvent: (eventId) => bookings.filter(b => b.eventId === eventId),
  getScheduleByEvent: (eventId) => schedules.filter(s => s.eventId === eventId).sort((a, b) => {
    // Basic sorting by time (simple conversion for demo ordering)
    const getMinutes = (tStr) => {
      const parts = tStr.split(' ');
      const timeParts = parts[0].split(':');
      let hr = parseInt(timeParts[0]);
      const min = parseInt(timeParts[1]);
      const isPm = parts[1] === 'PM';
      if (hr === 12 && !isPm) hr = 0;
      if (hr !== 12 && isPm) hr += 12;
      return hr * 60 + min;
    };
    try { return getMinutes(a.time) - getMinutes(b.time); } catch(e) { return 0; }
  }),
  getActivities: () => activities,

  // --- Dashboard Aggregations ---
  getDashboardStats: () => {
    const totalEvents = events.length;
    const upcomingEvents = events.filter(e => e.status === "Upcoming").length;
    const pendingBookings = bookings.filter(b => b.status === "Pending").length;
    
    // Revenue calculations
    // We treat event.budget as standard target budget, but revenue here represents total income or booking payments.
    // For dashboard stats, we'll calculate Total Revenue as the sum of budgets of all "Upcoming" or "Completed" events.
    const totalRevenue = events
      .filter(e => e.status !== "Cancelled")
      .reduce((sum, e) => sum + e.budget, 0);

    const totalGuests = guests.filter(g => g.rsvpStatus === "Attending").length;

    return {
      totalEvents,
      upcomingEvents,
      pendingBookings,
      totalRevenue,
      totalGuests
    };
  },

  // --- Mutations ---
  addEvent: (eventData) => {
    const newEvent = {
      id: "e" + (Date.now()),
      name: eventData.name,
      type: eventData.type,
      date: eventData.date,
      location: eventData.location,
      guestCount: parseInt(eventData.guestCount) || 0,
      budget: parseInt(eventData.budget) || 0,
      status: "Upcoming",
      vendors: eventData.vendors || [],
      aiSuggestions: eventData.aiSuggestions || null
    };

    events.unshift(newEvent);
    saveData("eventra_events", events);
    
    // Auto-create bookings for selected vendors
    if (eventData.vendors && eventData.vendors.length > 0) {
      eventData.vendors.forEach(vId => {
        const vendor = vendors.find(v => v.id === vId);
        if (vendor) {
          EventraDB.addBooking({
            eventId: newEvent.id,
            vendorId: vId,
            cost: vendor.price,
            status: "Pending",
            paymentStatus: "Unpaid"
          }, false); // don't sync individually
        }
      });
      saveData("eventra_bookings", bookings);
    }

    EventraDB.logActivity("success", `New event <strong>${newEvent.name}</strong> has been created.`);
    return newEvent;
  },

  updateEventSuggestions: (eventId, suggestions) => {
    const event = events.find(e => e.id === eventId);
    if (event) {
      event.aiSuggestions = suggestions;
      saveData("eventra_events", events);
    }
  },

  updateEventBudgetAmount: (eventId, amount) => {
    const event = events.find(e => e.id === eventId);
    if (event) {
      event.budget = amount;
      saveData("eventra_events", events);
      EventraDB.logActivity("info", `Budget updated to <strong>$${amount.toLocaleString()}</strong> for event <strong>${event.name}</strong>.`);
    }
  },

  addGuest: (guestData) => {
    const newGuest = {
      id: "g" + (Date.now()),
      eventId: guestData.eventId,
      name: guestData.name,
      email: guestData.email,
      rsvpStatus: guestData.rsvpStatus || "Pending",
      invitation: guestData.invitation || "Unsent",
      dietary: guestData.dietary || "None"
    };
    guests.push(newGuest);
    saveData("eventra_guests", guests);
    
    const event = EventraDB.getEventById(guestData.eventId);
    const eventName = event ? event.name : "Event";
    EventraDB.logActivity("info", `Guest <strong>${newGuest.name}</strong> added to <strong>${eventName}</strong>.`);
    return newGuest;
  },

  updateGuestRSVP: (guestId, rsvpStatus) => {
    const guest = guests.find(g => g.id === guestId);
    if (guest) {
      guest.rsvpStatus = rsvpStatus;
      saveData("eventra_guests", guests);
    }
  },

  updateGuestInvitation: (guestId, inviteStatus) => {
    const guest = guests.find(g => g.id === guestId);
    if (guest) {
      guest.invitation = inviteStatus;
      saveData("eventra_guests", guests);
    }
  },

  addBooking: (bookingData, shouldSync = true) => {
    const newBooking = {
      id: "b" + (Date.now() + Math.floor(Math.random() * 100)),
      eventId: bookingData.eventId,
      vendorId: bookingData.vendorId,
      cost: parseInt(bookingData.cost) || 0,
      status: bookingData.status || "Pending",
      paymentStatus: bookingData.paymentStatus || "Unpaid"
    };
    bookings.push(newBooking);
    if (shouldSync) {
      saveData("eventra_bookings", bookings);
    }
    return newBooking;
  },

  updateBookingStatus: (bookingId, status) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
      booking.status = status;
      saveData("eventra_bookings", bookings);
      
      const event = EventraDB.getEventById(booking.eventId);
      const vendor = EventraDB.getVendorById(booking.vendorId);
      const eventName = event ? event.name : "Event";
      const vendorName = vendor ? vendor.name : "Vendor";
      
      const type = status === "Confirmed" ? "success" : "warning";
      EventraDB.logActivity(type, `Booking for <strong>${vendorName}</strong> changed to <strong>${status}</strong> for <strong>${eventName}</strong>.`);
    }
  },

  updateBookingPayment: (bookingId, paymentStatus) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
      booking.paymentStatus = paymentStatus;
      saveData("eventra_bookings", bookings);
    }
  },

  addScheduleItem: (scheduleData) => {
    const newItem = {
      id: "s" + (Date.now()),
      eventId: scheduleData.eventId,
      time: scheduleData.time,
      title: scheduleData.title,
      description: scheduleData.description || ""
    };
    schedules.push(newItem);
    saveData("eventra_schedules", schedules);
    return newItem;
  },

  clearScheduleForEvent: (eventId) => {
    schedules = schedules.filter(s => s.eventId !== eventId);
    saveData("eventra_schedules", schedules);
  },

  logActivity: (type, text) => {
    const newActivity = {
      id: "a" + Date.now(),
      type,
      text,
      time: "Just now"
    };
    activities.unshift(newActivity);
    if (activities.length > 15) {
      activities.pop(); // Keep log tidy
    }
    saveData("eventra_activities", activities);
    
    // Dispatch custom event to alert UI of global updates
    window.dispatchEvent(new Event('eventra_state_change'));
  }
};

// Export to global scope
window.EventraDB = EventraDB;
console.log("EventraDB initialized with LocalStorage synchronization.");
