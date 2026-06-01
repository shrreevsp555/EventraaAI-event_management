// --- Eventra AI Simulation Engine ---

const EventraAI = {
  // 1. AI Theme & Brand Suggestions
  generateSuggestions: async (eventName, eventType) => {
    // Artificial delay to simulate processing
    await new Promise(resolve => setTimeout(resolve, 800));

    const cleanName = eventName || "Untitled Event";
    const type = eventType || "Other";

    const suggestionsDatabase = {
      "Conference": {
        taglines: [
          `Unlocking Tomorrow: Inside ${cleanName}`,
          "Connect. Innovate. Accelerate.",
          "Where Knowledge Meets Scale."
        ],
        themes: "Neon Digital Foyer & Cyberpunk Industrial",
        colors: ["#a855f7", "#3b82f6", "#06b6d4"], // Purple, Blue, Cyan
        activities: "AI Matchmaking Networking, Holographic Product Demos, Speed Mentorship Circles",
        budgetTip: "Save up to 18% on printed brochures by shifting to a customized mobile web app."
      },
      "Wedding": {
        taglines: [
          `A Love Written in the Stars: ${cleanName}`,
          "Together Under the Sky.",
          "Laughter, Love, and Happily Ever After."
        ],
        themes: "Holographic Enchanted Forest & Ethereal Glasshouse",
        colors: ["#ec4899", "#a855f7", "#f59e0b"], // Pink, Purple, Amber
        activities: "Custom Scent Mixology Bar, Sunset Champagne Toast, Polaroid Memory Tree",
        budgetTip: "Opt for local seasonal floral arrangements and reuse ceremony backdrop panels for the head table."
      },
      "Concert": {
        taglines: [
          `Feel the Frequency: ${cleanName}`,
          "Sound. Spectacle. Sync.",
          "One Stage. Infinite Beats."
        ],
        themes: "Retro-Future Electro Dome & Infrared Visuals",
        colors: ["#ec4899", "#3b82f6", "#06b6d4"], // Pink, Blue, Cyan
        activities: "Laser Visual Tunnel, Wearable LED Wristbands, Multi-angle Live Stream Pods",
        budgetTip: "Set up vendor sponsor spaces in high foot-traffic spots to offset stage production costs."
      },
      "Birthday": {
        taglines: [
          `Cheers to Another Orbit: ${cleanName}`,
          "Unapologetically Celebrating You.",
          "Another Year Bold."
        ],
        themes: "Electric Candy & Glitter Metallic Shimmer",
        colors: ["#ec4899", "#a855f7", "#10b981"], // Pink, Purple, Green
        activities: "Interactive Neon Photo Box, Custom Birthday Brew Tasting, Retro Arcade Corner",
        budgetTip: "Create a signature punch cocktail rather than opening a full bar to cut alcohol expenses by 30%."
      },
      "Gala": {
        taglines: [
          `A Night of Infinite Impact: ${cleanName}`,
          "Elegance in Motion.",
          "Purpose, Prestige, Passion."
        ],
        themes: "Midnight Celestial & Illuminated Glasshouse",
        colors: ["#a855f7", "#3b82f6", "#f59e0b"], // Purple, Blue, Amber
        activities: "Live Neon Charity Painting Auction, Silk String Quartet, VIP Red Carpet Mirror",
        budgetTip: "Hire vendor equipment as a package (sound, stage, and lights) to negotiate a lower bulk rate."
      },
      "Seminar": {
        taglines: [
          `Mastering the Blueprint: ${cleanName}`,
          "Focused Insights. Practical Wisdom.",
          "Learn Today. Build Tomorrow."
        ],
        themes: "Minimalist Grid & Soft Ambient Lumens",
        colors: ["#3b82f6", "#06b6d4", "#10b981"], // Blue, Cyan, Green
        activities: "Live Interactive Audience Polling, Mind-Mapping Workshops, Masterclass Roundtables",
        budgetTip: "Partner with a coffee brand to sponsor drinks in exchange for prominent logo placement."
      },
      "Exhibition": {
        taglines: [
          `Unveiling Creative Layers: ${cleanName}`,
          "Immerse Your Senses.",
          "The Intersection of Art & Enterprise."
        ],
        themes: "Industrial Warehouse & Neon Projection Walls",
        colors: ["#a855f7", "#ec4899", "#e2e8f0"], // Purple, Pink, Silver
        activities: "Live Augmented Reality Gallery, Vendor Spotlights, Kinetic Sculpture Walkways",
        budgetTip: "Optimize layout grids early to reduce double-handling labor and structural assembly fees."
      }
    };

    const template = suggestionsDatabase[type] || {
      taglines: [
        `Plan Smart. Create Unforgettable Moments at ${cleanName}`,
        "Where Magic is Planned.",
        "Your Vibe. Our Coordination."
      ],
      themes: "Contemporary Neon Glassmorphism",
      colors: ["#a855f7", "#ec4899", "#3b82f6"],
      activities: "Custom Interactive Games, Neon Social lounges, Dynamic Q&A Panel",
      budgetTip: "Track vendor delivery milestones closely to avoid setup delay fines."
    };

    // Return a random tagline
    const tagline = template.taglines[Math.floor(Math.random() * template.taglines.length)];

    return {
      tagline,
      theme: template.theme,
      colors: template.colors,
      activities: template.activities,
      budgetTip: template.budgetTip
    };
  },

  // 2. AI Smart Budget Estimation
  estimateBudget: async (eventType, guestCount, rawTotalBudget) => {
    await new Promise(resolve => setTimeout(resolve, 600));

    const guests = parseInt(guestCount) || 100;
    const total = parseInt(rawTotalBudget) || 20000;

    // Budget ratios per event type
    const ratioTemplates = {
      "Conference": { venue: 0.25, catering: 0.35, AV: 0.20, marketing: 0.10, staff: 0.05, misc: 0.05 },
      "Wedding": { venue: 0.35, catering: 0.30, photography: 0.12, decor: 0.13, entertainment: 0.06, misc: 0.04 },
      "Concert": { venue: 0.20, stagingSound: 0.40, marketing: 0.15, security: 0.10, staff: 0.10, misc: 0.05 },
      "Birthday": { venue: 0.20, catering: 0.40, decor: 0.20, entertainment: 0.10, gifts: 0.05, misc: 0.05 },
      "Gala": { venue: 0.30, catering: 0.40, decor: 0.15, entertainment: 0.08, invites: 0.04, misc: 0.03 },
      "Seminar": { venue: 0.25, catering: 0.30, AV: 0.20, materials: 0.15, staff: 0.05, misc: 0.05 },
      "Exhibition": { venue: 0.35, structures: 0.25, AV: 0.15, marketing: 0.15, staff: 0.05, misc: 0.05 }
    };

    const ratios = ratioTemplates[eventType] || { venue: 0.30, catering: 0.30, decor: 0.15, entertainment: 0.15, misc: 0.10 };
    const breakdown = [];

    // Calculate dollar amount per category
    Object.entries(ratios).forEach(([category, ratio]) => {
      // Capitalize first letter and format name
      let label = category.replace(/([A-Z])/g, ' $1').trim();
      label = label.charAt(0).toUpperCase() + label.slice(1);
      
      const categoryTotal = Math.round(total * ratio);
      const perGuest = Math.round(categoryTotal / guests);

      breakdown.push({
        category: label,
        percentage: Math.round(ratio * 100),
        estimatedCost: categoryTotal,
        costPerGuest: perGuest
      });
    });

    // Provide a customized budget analysis comment
    let analysisText = "";
    if (eventType === "Wedding") {
      analysisText = `AI Analysis: For a wedding with ${guests} guests, catering ($${breakdown.find(b=>b.category === "Catering").estimatedCost.toLocaleString()}) and venue rental dominate expenses. We advise monitoring bar setup costs as they can spike easily. Consider booking in off-peak months to drop venue rental fees by up to 20%.`;
    } else if (eventType === "Conference") {
      analysisText = `AI Analysis: Tech summits rely heavily on AV infrastructure ($${breakdown.find(b=>b.category === "A V").estimatedCost.toLocaleString()}) and catering. To maximize profit, partner with early stage startup sponsors to fund individual workshop tracks.`;
    } else {
      analysisText = `AI Analysis: This custom budget breakdown allocates the largest portions to Catering and Venue hire, optimizing the remaining funds for decor and entertainment based on historical data patterns.`;
    }

    return {
      breakdown,
      analysis: analysisText,
      totalEstimated: total
    };
  },

  // 3. AI Auto Schedule Generator
  generateSchedule: async (eventType, eventName) => {
    await new Promise(resolve => setTimeout(resolve, 750));

    const name = eventName || "The Main Event";
    
    const itineraryTemplates = {
      "Conference": [
        { time: "08:30 AM", title: "Attendee Registration & Badge Pickup", description: "Foyer entrance. Digital QR check-in and pick up tech badges and bags." },
        { time: "09:30 AM", title: "Welcome Address & Main Stage Keynote", description: "Opening session introducing key themes, speaker profiles, and conference objectives." },
        { time: "11:00 AM", title: "Morning Technical Panels & QA", description: "Split breakout tracks on AI, scalability, and infrastructure engineering." },
        { time: "12:30 PM", title: "Networking Lunch & Interactive Expo", description: "Gourmet buffet, sponsor booths walkthroughs, and VR simulator stations open." },
        { time: "02:00 PM", title: "Interactive Workshop Sessions", description: "Hands-on collaborative sessions with instructors in the side lounges." },
        { time: "04:00 PM", title: "Fireside Chat: Future of Digital Media", description: "High-level interview with guest speakers followed by public Q&A." },
        { time: "05:00 PM", title: "Closing Remarks & Networking Reception", description: "Sunset drinks, local musician stage show, and exchange of contacts." }
      ],
      "Wedding": [
        { time: "02:00 PM", title: "Bridal Party & Groom Preparations", description: "Hair, makeup, and pre-ceremony portraits around the scenic venue spots." },
        { time: "03:30 PM", title: "Guest Seating & Prelude Music", description: "Soft acoustic music starts. Guests are ushered into the main garden seating." },
        { time: "04:00 PM", title: "Wedding Ceremony & Vows Exchange", description: "Processional walk, rings exchange, ceremony sealing, and recessional walk." },
        { time: "04:45 PM", title: "Cocktail Hour & Couple Photoshoot", description: "Open bar and butlered canapes served. Cinematic bridal photoshoot in progress." },
        { time: "06:15 PM", title: "Grand Reception Entrance & Toasting", description: "Emcee welcomes the bridal couple. Opening speeches by best man and maid of honor." },
        { time: "07:00 PM", title: "Four-Course Dinner & Slideshow", description: "Fine dining banquet served with background piano melodies." },
        { time: "08:30 PM", title: "First Dance & Cake Cutting", description: "Bridal couple's spotlight dance, cake cutting, and parent dances." },
        { time: "09:30 PM", title: "Dance Floor Open & Sparkler Exit", description: "High energy music, dessert buffet, and sparkler pathway send-off." }
      ],
      "Concert": [
        { time: "04:00 PM", title: "Sound Check & Technical Runthrough", description: "Equalization check, laser projection alignment, and safety walkthrough." },
        { time: "06:00 PM", title: "Gates Open & Sponsor Activities", description: "Security checks, merch stands, food truck lanes, and brand zones activation." },
        { time: "07:30 PM", title: "Opening DJ Act", description: "Pumping basslines and synth mixes to warm up the crowd and establish the vibe." },
        { time: "08:45 PM", title: "Main Stage Performance - Set 1", description: "Lumina visuals launch, neon visual effects, and full band entrance." },
        { time: "09:45 PM", title: "Intermission & Digital Visual Art", description: "Holographic graphic projections display during band breather." },
        { time: "10:00 PM", title: "Main Stage Performance - Set 2 & Encore", description: "High tempo set, confetti launch, final hits, and group photo." },
        { time: "11:15 PM", title: "VIP Meet & Greet Session", description: "Access-controlled backstage meeting, posters signing, and photography." }
      ],
      "Birthday": [
        { time: "05:00 PM", title: "Guests Welcoming & Photo Wall", description: "Welcome drinks, signature mocktails, and portraits at the neon sequin wall." },
        { time: "06:00 PM", title: "Icebreaker Challenges & Arcade Games", description: "Fun team games, retro arcade tournaments, and music mixing table." },
        { time: "07:30 PM", title: "Special Birthday Dinner & Toasts", description: "Informal catering sharing boards, birthday slideshow, and family cheers." },
        { time: "09:00 PM", title: "Cake Sparklers & Dessert Station", description: "Gathering for candle blowout, cake distribution, and hot cocoa bar." },
        { time: "10:00 PM", title: "Dance Party & Glow Night", description: "Glow sticks distribution, UV blacklight activation, and high energy dance sets." }
      ]
    };

    const defaultItinerary = [
      { time: "09:00 AM", title: "Event Setup & Initial Walkthrough", description: "Vendor setup, equipment double-checking, sound levels check." },
      { time: "10:30 AM", title: "Welcome Drinks & Opening Session", description: "Guest welcoming, opening host intro, and detailing the agenda." },
      { time: "12:30 PM", title: "Catered Lunch & Interactive Hour", description: "Buffet dining and guest networking, photo booths operating." },
      { time: "02:30 PM", title: "Main Feature Presentation / Activity", description: "The central focus of the event - workshop, ceremony, or show." },
      { time: "05:00 PM", title: "Closing Remarks & Exit Gifts", description: "Feedback collections, wrap-up statements, and guest send-off." }
    ];

    const itinerary = itineraryTemplates[eventType] || defaultItinerary;

    // Customize the timeline titles slightly to contain event name context
    const customizedTimeline = itinerary.map((item, index) => {
      let title = item.title;
      // Add context to key moments
      if (index === 1 && eventType === "Conference") {
        title = `${name} Keynote Address`;
      } else if (index === 6 && eventType === "Wedding") {
        title = `Cutting the ${name} Wedding Cake`;
      } else if (index === 3 && eventType === "Concert") {
        title = `${name} Headline Live Set`;
      }
      return {
        ...item,
        title
      };
    });

    return customizedTimeline;
  }
};

// Export to global scope
window.EventraAI = EventraAI;
console.log("EventraAI engine initialized.");
