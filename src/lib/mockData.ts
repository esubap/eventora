import type { 
  UserProfile, 
  EventCategory, 
  Event, 
  TicketType, 
  Booking, 
  Ticket, 
  Payment, 
  CheckIn, 
  Review, 
  Notification,
  PlatformSetting 
} from '../types';

export const INITIAL_CATEGORIES: EventCategory[] = [
  {
    id: 'cat-music',
    name: 'Music & Concerts',
    slug: 'music-concerts',
    description: 'Live concerts, music festivals, acoustics, and DJ shows',
    icon: 'Music',
    image_url: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80',
    display_order: 1
  },
  {
    id: 'cat-tech',
    name: 'Technology & Startups',
    slug: 'technology',
    description: 'Hackathons, tech conferences, developer summits, and AI expos',
    icon: 'Laptop',
    image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
    display_order: 2
  },
  {
    id: 'cat-business',
    name: 'Business & Conferences',
    slug: 'business',
    description: 'Corporate summits, trade expos, networking, and business forums',
    icon: 'Briefcase',
    image_url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80',
    display_order: 3
  },
  {
    id: 'cat-education',
    name: 'Education & Workshops',
    slug: 'education',
    description: 'Hands-on bootcamps, masterclasses, and certified seminars',
    icon: 'GraduationCap',
    image_url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80',
    display_order: 4
  },
  {
    id: 'cat-sports',
    name: 'Sports & Fitness',
    slug: 'sports',
    description: 'Marathons, football championships, yoga retreats, and fitness cups',
    icon: 'Trophy',
    image_url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80',
    display_order: 5
  },
  {
    id: 'cat-festivals',
    name: 'Festivals & Culture',
    slug: 'festivals',
    description: 'Cultural festivals, heritage carnivals, and holiday galas',
    icon: 'Sparkles',
    image_url: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1200&q=80',
    display_order: 6
  },
  {
    id: 'cat-entertainment',
    name: 'Entertainment & Comedy',
    slug: 'entertainment',
    description: 'Standup comedy, theatre acts, movie premieres, and magic shows',
    icon: 'Theater',
    image_url: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?auto=format&fit=crop&w=1200&q=80',
    display_order: 7
  },
  {
    id: 'cat-workshops',
    name: 'Workshops & Masterclasses',
    slug: 'workshops',
    description: 'Skill-building, photography workshops, design and culinary art',
    icon: 'Layers',
    image_url: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1200&q=80',
    display_order: 8
  }
];

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'usr-customer-1',
    email: 'customer@eventora.com',
    full_name: 'Abebe Kebede',
    phone: '+251911234567',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    role: 'customer',
    status: 'active',
    bio: 'Avid music enthusiast and tech explorer based in Addis Ababa.',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'usr-organizer-1',
    email: 'organizer@eventora.com',
    full_name: 'Selamawit Tadesse',
    phone: '+251929876543',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    role: 'organizer',
    status: 'active',
    organization_name: 'Selam Productions & Global Entertainment',
    bio: 'Premier Ethiopian concert and conference production house organizing high-impact international gatherings.',
    created_at: '2026-01-10T10:00:00Z'
  },
  {
    id: 'usr-admin-1',
    email: 'admin@eventora.com',
    full_name: 'Eventora Admin',
    phone: '+251900000000',
    avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
    role: 'admin',
    status: 'active',
    bio: 'System Administrator with complete oversight of security, moderation, and payouts.',
    created_at: '2026-01-01T00:00:00Z'
  }
];

export const INITIAL_TICKETS_TYPES: TicketType[] = [
  // Event 1: Addis Tech Summit
  {
    id: 'tt-tech-1',
    event_id: 'evt-tech-summit-2026',
    name: 'Early Bird Student Pass',
    price: 350,
    currency: 'ETB',
    quantity: 150,
    remaining_quantity: 42,
    description: 'Discounted access for students with valid academic ID. Includes all mainstage keynotes.',
    perks: ['Access to Keynotes', 'Digital Certificate', 'Networking Coffee'],
    max_per_order: 2,
    is_active: true
  },
  {
    id: 'tt-tech-2',
    event_id: 'evt-tech-summit-2026',
    name: 'Regular General Pass',
    price: 1200,
    currency: 'ETB',
    quantity: 500,
    remaining_quantity: 185,
    description: 'Full conference access across 3 stages, exhibition floor, and developer workshops.',
    perks: ['Full 2-Day Access', 'Exhibition Floor Entry', 'Developer Workshops', 'Lunch & Coffee Breaks'],
    max_per_order: 5,
    is_active: true
  },
  {
    id: 'tt-tech-3',
    event_id: 'evt-tech-summit-2026',
    name: 'VIP Executive & Investor Pass',
    price: 4500,
    currency: 'ETB',
    quantity: 80,
    remaining_quantity: 14,
    description: 'Exclusive access to the VIP Lounge, 1-on-1 VC speed dating, and the VIP Gala Dinner.',
    perks: ['VIP Lounge Access', 'Front-row Reserved Seating', 'Gala Dinner with Speakers', 'Fast-track Check-in'],
    max_per_order: 4,
    is_active: true
  },

  // Event 2: Entoto Mountain Music Festival
  {
    id: 'tt-music-1',
    event_id: 'evt-entoto-music-fest',
    name: 'General Admission',
    price: 600,
    currency: 'ETB',
    quantity: 1200,
    remaining_quantity: 340,
    description: 'Open lawn seating with 360-degree mountain views and full concert access.',
    perks: ['Main Stage Access', 'Food Truck Village Entry'],
    max_per_order: 6,
    is_active: true
  },
  {
    id: 'tt-music-2',
    event_id: 'evt-entoto-music-fest',
    name: 'VIP Sky Deck',
    price: 2500,
    currency: 'ETB',
    quantity: 200,
    remaining_quantity: 28,
    description: 'Elevated covered canopy seating, complimentary welcome drink, and private bar access.',
    perks: ['Elevated Canopy Seating', 'Complimentary Welcome Drink', 'Private Restrooms', 'Dedicated Express Entry'],
    max_per_order: 4,
    is_active: true
  },

  // Event 3: Horn of Africa Hackathon (Free Event)
  {
    id: 'tt-hack-1',
    event_id: 'evt-hoa-hackathon',
    name: 'Free Hacker Pass',
    price: 0,
    currency: 'ETB',
    quantity: 300,
    remaining_quantity: 88,
    description: '100% Free registration for developers, designers, and innovators. Meals and swag included.',
    perks: ['36-Hour Hackathon Access', 'Free Meals & Energy Drinks', 'Cloud API Credits', 'Hackathon T-Shirt'],
    max_per_order: 1,
    is_active: true
  },

  // Event 4: Great Ethiopian Run Gala
  {
    id: 'tt-run-1',
    event_id: 'evt-run-gala',
    name: 'Standard Runner Pass',
    price: 500,
    currency: 'ETB',
    quantity: 3000,
    remaining_quantity: 750,
    description: 'Official running bib number, race t-shirt, hydration stations, and finisher medal.',
    perks: ['Official T-Shirt & Bib', 'Finisher Medal', 'Post-Race Music Concert'],
    max_per_order: 4,
    is_active: true
  },

  // Event 5: Afro-Beats Live Concert
  {
    id: 'tt-afro-1',
    event_id: 'evt-afrobeats-live',
    name: 'Regular Standing',
    price: 800,
    currency: 'ETB',
    quantity: 1500,
    remaining_quantity: 410,
    description: 'General festival standing grounds right in the action.',
    perks: ['Concert Grounds Access', 'Festival Wristband'],
    max_per_order: 6,
    is_active: true
  },
  {
    id: 'tt-afro-2',
    event_id: 'evt-afrobeats-live',
    name: 'VIP Golden Circle',
    price: 3200,
    currency: 'ETB',
    quantity: 300,
    remaining_quantity: 45,
    description: 'Exclusive zone directly in front of the stage with private bottle service and lounge chairs.',
    perks: ['Front Stage Golden Circle', 'Welcome Cocktail', 'Artist Meet & Greet Raffle'],
    max_per_order: 4,
    is_active: true
  },

  // Event 6: Full-Stack AI Masterclass (Online)
  {
    id: 'tt-ai-1',
    event_id: 'evt-ai-masterclass',
    name: 'Live Virtual Ticket',
    price: 950,
    currency: 'ETB',
    quantity: 500,
    remaining_quantity: 210,
    description: 'Interactive Zoom stream, GitHub repository code access, and recording for 1 year.',
    perks: ['Live Stream Access', 'Q&A with Instructor', 'Full Code Repositories', 'Lifetime Video Replay'],
    max_per_order: 2,
    is_active: true
  }
];

export const INITIAL_EVENTS: Event[] = [
  {
    id: 'evt-tech-summit-2026',
    organizer_id: 'usr-organizer-1',
    organizer: INITIAL_USERS[1],
    category_id: 'cat-tech',
    category: INITIAL_CATEGORIES[1],
    title: 'Addis Tech Summit 2026: AI & The African Digital Economy',
    slug: 'addis-tech-summit-2026',
    short_description: 'East Africa’s largest gathering of tech founders, AI researchers, software engineers, and global venture capitalists.',
    description: `Addis Tech Summit 2026 unites over 2,500 innovators, creators, and technology leaders across the continent and beyond.

Over two action-packed days, experience:
• 40+ Keynote speakers and fireside chats on Agentic AI, Fintech, and Cloud Infrastructure.
• Live Startup Pitch Competition with \$50,000 in non-dilutive grant prizes.
• Hands-on developer workshops covering LLM fine-tuning, Rust, and modern distributed systems.
• Dedicated Investor & Founder Speed Networking lounge.

Whether you are building your next startup or scaling enterprise architecture, this is the premier event of the year in Addis Ababa.`,
    cover_image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=800&q=80'
    ],
    event_type: 'physical',
    venue_name: 'Millennium Hall Main Auditorium',
    city: 'Addis Ababa',
    address: 'Bole Road, Next to Edna Mall, Addis Ababa',
    country: 'Ethiopia',
    start_date: '2026-11-28',
    start_time: '09:00',
    end_date: '2026-11-29',
    end_time: '18:00',
    capacity: 2500,
    status: 'published',
    featured: true,
    trending: true,
    sales_start_date: '2026-10-01T00:00:00Z',
    sales_end_date: '2026-11-27T23:59:59Z',
    terms_and_conditions: 'All tickets are non-refundable after Nov 20, 2026. Student ticket holders must present valid student photo identification upon entry. Badges must be worn at all times.',
    reviews_count: 38,
    average_rating: 4.9,
    created_at: '2026-09-15T12:00:00Z'
  },
  {
    id: 'evt-entoto-music-fest',
    organizer_id: 'usr-organizer-1',
    organizer: INITIAL_USERS[1],
    category_id: 'cat-music',
    category: INITIAL_CATEGORIES[0],
    title: 'Entoto Sunset Acoustic & Jazz Festival',
    slug: 'entoto-sunset-acoustic-jazz-festival',
    short_description: 'An unforgettable evening of soulful Ethio-Jazz, acoustic melodies, and pine-scented breezes atop Entoto Mountain.',
    description: `Immerse yourself in melodic magic as the sun sets over Addis Ababa. The Entoto Sunset Acoustic & Jazz Festival brings together celebrated Ethio-jazz legends and contemporary indie vocalists for a one-of-a-kind open-air performance.

Featuring:
• Mulatu Astatke Tribute Ensemble
• Acoustic solo performances under the pine trees
• Gourmet local food pairings and organic honey wine tastings
• Sustainable bonfire gathering after twilight

Dress warmly for cool mountain evening breezes. Shuttle transport available from Mexico Square and Bole.`,
    cover_image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1514306191717-452ec28c7814?auto=format&fit=crop&w=800&q=80'
    ],
    event_type: 'physical',
    venue_name: 'Entoto Natural Park Amphitheater',
    city: 'Addis Ababa',
    address: 'Entoto Natural Park, North Addis Ababa',
    country: 'Ethiopia',
    start_date: '2026-12-05',
    start_time: '16:00',
    end_date: '2026-12-05',
    end_time: '23:30',
    capacity: 1500,
    status: 'published',
    featured: true,
    trending: true,
    sales_start_date: '2026-10-15T00:00:00Z',
    sales_end_date: '2026-12-05T15:00:00Z',
    terms_and_conditions: 'Outside food or beverages are prohibited. Children under 12 enter free with an accompanying adult ticket holder.',
    reviews_count: 52,
    average_rating: 4.8,
    created_at: '2026-09-20T10:00:00Z'
  },
  {
    id: 'evt-hoa-hackathon',
    organizer_id: 'usr-organizer-1',
    organizer: INITIAL_USERS[1],
    category_id: 'cat-tech',
    category: INITIAL_CATEGORIES[1],
    title: 'Horn of Africa 36-Hour Hackathon & Innovation Expo',
    slug: 'horn-of-africa-hackathon',
    short_description: 'Build solutions in HealthTech, AgriTech, and Financial Inclusion with top engineering teams.',
    description: `36 intense hours of coding, rapid prototyping, and high-energy mentorship. 
Competitors will tackle challenges presented by enterprise partners with over 300,000 ETB in cash bounties and incubation spots.

Free food, high-speed fiber internet, hardware testing labs, and sleeping pods provided on-site.`,
    cover_image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
    gallery: [],
    event_type: 'physical',
    venue_name: 'ICT Park Innovation Center',
    city: 'Addis Ababa',
    address: 'ICT Park, Goro Road, Addis Ababa',
    country: 'Ethiopia',
    start_date: '2026-12-12',
    start_time: '08:00',
    end_date: '2026-12-13',
    end_time: '20:00',
    capacity: 300,
    status: 'published',
    featured: false,
    trending: true,
    terms_and_conditions: 'Participants must bring their own laptops. Code created during hackathon belongs entirely to the team.',
    reviews_count: 14,
    average_rating: 5.0,
    created_at: '2026-10-01T09:00:00Z'
  },
  {
    id: 'evt-run-gala',
    organizer_id: 'usr-organizer-1',
    organizer: INITIAL_USERS[1],
    category_id: 'cat-sports',
    category: INITIAL_CATEGORIES[4],
    title: 'Meskel Square 10K International Run & Music Fest',
    slug: 'meskel-square-10k-run-gala',
    short_description: 'Join 10,000 runners through the vibrant heart of the capital followed by a giant musical celebration.',
    description: `Feel the world-famous Ethiopian running pulse! Run or walk alongside legendary Olympic athletes, community runners, and fitness champions through scenic avenues of Addis Ababa, concluding at Meskel Square with live music and awards.`,
    cover_image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80',
    gallery: [],
    event_type: 'physical',
    venue_name: 'Meskel Square Plaza',
    city: 'Addis Ababa',
    address: 'Meskel Square, Kirkos Subcity, Addis Ababa',
    country: 'Ethiopia',
    start_date: '2026-12-20',
    start_time: '06:30',
    end_date: '2026-12-20',
    end_time: '14:00',
    capacity: 5000,
    status: 'published',
    featured: true,
    trending: false,
    terms_and_conditions: 'All runners must collect race kit 48 hours prior. Medical assistance is stationed every 2.5 kilometers.',
    reviews_count: 47,
    average_rating: 4.9,
    created_at: '2026-09-01T15:00:00Z'
  },
  {
    id: 'evt-afrobeats-live',
    organizer_id: 'usr-organizer-1',
    organizer: INITIAL_USERS[1],
    category_id: 'cat-music',
    category: INITIAL_CATEGORIES[0],
    title: 'Afro-Fusion New Year Extravaganza',
    slug: 'afro-fusion-new-year-extravaganza',
    short_description: 'Celebrate the festive season with premier African artists, pyrotechnics, and unstoppable dance rhythms.',
    description: `High-octane sound, mesmerizing light shows, and headlining chart-topping international artists. Welcome the holiday season in style with festival food lanes, VIP lounges, and dancing until sunrise.`,
    cover_image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
    gallery: [],
    event_type: 'physical',
    venue_name: 'Ghion Hotel Royal Gardens',
    city: 'Addis Ababa',
    address: 'Near Stadium, Ras Desta Damtew St, Addis Ababa',
    country: 'Ethiopia',
    start_date: '2026-12-31',
    start_time: '19:00',
    end_date: '2027-01-01',
    end_time: '04:00',
    capacity: 2500,
    status: 'published',
    featured: true,
    trending: true,
    terms_and_conditions: '18+ event. Valid national ID or passport required at the gate.',
    reviews_count: 29,
    average_rating: 4.7,
    created_at: '2026-10-05T14:00:00Z'
  },
  {
    id: 'evt-ai-masterclass',
    organizer_id: 'usr-organizer-1',
    organizer: INITIAL_USERS[1],
    category_id: 'cat-education',
    category: INITIAL_CATEGORIES[3],
    title: 'Building Production Autonomous AI Agents Masterclass',
    slug: 'production-ai-agents-masterclass',
    short_description: 'Live interactive coding bootcamp on building, deploying, and monitoring autonomous agentic architectures.',
    description: `Step beyond basic chatbots. In this comprehensive, code-driven masterclass, you will learn to build enterprise multi-agent systems with tool-calling, reflection loops, memory persistence, and sandbox sandboxing.`,
    cover_image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80',
    gallery: [],
    event_type: 'online',
    online_url: 'https://eventora.live/stream/ai-masterclass',
    venue_name: 'Live Virtual Workshop (Zoom + Interactive Lab)',
    city: 'Online',
    country: 'Global',
    start_date: '2026-11-21',
    start_time: '14:00',
    end_date: '2026-11-21',
    end_time: '19:00',
    capacity: 500,
    status: 'published',
    featured: false,
    trending: false,
    terms_and_conditions: 'Replay access will be sent via email within 24 hours after broadcast.',
    reviews_count: 19,
    average_rating: 4.95,
    created_at: '2026-10-10T11:00:00Z'
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'bkg-demo-1',
    booking_reference: 'EVT-789421A9',
    user_id: 'usr-customer-1',
    event_id: 'evt-tech-summit-2026',
    customer_name: 'Abebe Kebede',
    customer_email: 'customer@eventora.com',
    customer_phone: '+251911234567',
    total_tickets: 2,
    subtotal_amount: 2400,
    discount_amount: 0,
    fee_amount: 0,
    total_amount: 2400,
    currency: 'ETB',
    status: 'confirmed',
    notes: 'Excited for the AI keynotes!',
    created_at: '2026-11-02T14:32:00Z',
    items: [
      {
        id: 'bi-demo-1',
        booking_id: 'bkg-demo-1',
        ticket_type_id: 'tt-tech-2',
        ticket_type_name: 'Regular General Pass',
        quantity: 2,
        unit_price: 1200,
        total_price: 2400
      }
    ],
    payment: {
      id: 'pay-demo-1',
      booking_id: 'bkg-demo-1',
      transaction_reference: 'TXN-TELEBIRR-89218374',
      payment_gateway: 'telebirr',
      amount: 2400,
      currency: 'ETB',
      status: 'completed',
      payment_date: '2026-11-02T14:33:10Z',
      created_at: '2026-11-02T14:32:00Z'
    }
  }
];

export const INITIAL_TICKETS: Ticket[] = [
  {
    id: 'tkt-demo-1',
    ticket_number: 'TKT-89AF20C1-01',
    booking_id: 'bkg-demo-1',
    event_id: 'evt-tech-summit-2026',
    ticket_type_id: 'tt-tech-2',
    attendee_name: 'Abebe Kebede',
    attendee_email: 'customer@eventora.com',
    qr_token: 'qr_a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0',
    status: 'valid',
    created_at: '2026-11-02T14:33:10Z'
  },
  {
    id: 'tkt-demo-2',
    ticket_number: 'TKT-89AF20C1-02',
    booking_id: 'bkg-demo-1',
    event_id: 'evt-tech-summit-2026',
    ticket_type_id: 'tt-tech-2',
    attendee_name: 'Guest of Abebe Kebede',
    attendee_email: 'customer@eventora.com',
    qr_token: 'qr_b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef1',
    status: 'valid',
    created_at: '2026-11-02T14:33:10Z'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    event_id: 'evt-tech-summit-2026',
    user_id: 'usr-customer-1',
    user_name: 'Abebe Kebede',
    user_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    comment: 'The speaker lineup is incredible. Booking through Eventora took literally 45 seconds using Telebirr!',
    is_verified_attendee: true,
    created_at: '2026-11-03T09:15:00Z'
  },
  {
    id: 'rev-2',
    event_id: 'evt-entoto-music-fest',
    user_id: 'usr-customer-2',
    user_name: 'Bethlehem Haile',
    user_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    comment: 'Entoto at sunset with live jazz is unmatched. The digital tickets with instant Apple/Google wallet sync made getting into the venue seamless.',
    is_verified_attendee: true,
    created_at: '2026-10-25T18:40:00Z'
  }
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    user_id: 'usr-customer-1',
    title: 'Booking Confirmed!',
    message: 'Your booking EVT-789421A9 for Addis Tech Summit 2026 has been confirmed. View tickets in your dashboard.',
    type: 'success',
    is_read: false,
    link: '/dashboard/customer',
    created_at: '2026-11-02T14:33:15Z'
  },
  {
    id: 'notif-2',
    user_id: 'usr-organizer-1',
    title: 'New Ticket Sold',
    message: 'Abebe Kebede purchased 2x Regular General Pass tickets for Addis Tech Summit 2026.',
    type: 'info',
    is_read: false,
    link: '/dashboard/organizer',
    created_at: '2026-11-02T14:33:12Z'
  }
];

export const INITIAL_SETTINGS: PlatformSetting[] = [
  {
    key: 'platform_name',
    value: 'EVENTORA',
    description: 'Platform Brand Name'
  },
  {
    key: 'default_currency',
    value: 'ETB',
    description: 'Default Operating Currency'
  },
  {
    key: 'platform_fee_percent',
    value: '5.0',
    description: 'Transaction Commission (%)'
  },
  {
    key: 'telebirr_enabled',
    value: 'true',
    description: 'Telebirr Mobile Payment Gateway'
  },
  {
    key: 'chapa_enabled',
    value: 'true',
    description: 'Chapa Fintech Payment Gateway'
  },
  {
    key: 'stripe_enabled',
    value: 'true',
    description: 'Stripe International Credit/Debit Card Gateway'
  },
  {
    key: 'require_event_approval',
    value: 'true',
    description: 'Whether new organizer events require admin approval'
  }
];
