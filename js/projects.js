/**
 * Projects & Certificates Interactive Engine
 * Data model, category filtering, and modal viewer
 */

// Project Dataset with comprehensive architectural details
const projectsData = [
  {
    id: "neuroshield",
    category: "ai-cyber",
    title: "NeuroShield AI",
    badge: "AI & Cybersecurity",
    image: "assets/images/project-neuroshield.svg",
    shortDesc: "Autonomous network threat detection and DDoS intrusion mitigation engine using deep learning and packet stream anomaly classification.",
    longDesc: "NeuroShield AI is an intelligent cybersecurity sentinel built to protect modern enterprise cloud architectures against distributed denial-of-service (DDoS) attacks, brute-force anomalies, and zero-day packet exploits in real-time. By applying convolutional-LSTM neural architectures directly over network packet telemetry streams, it achieves sub-3ms anomaly classification.",
    techStack: ["Python", "PyTorch", "Networking", "Cybersecurity", "Sockets", "Docker"],
    features: [
      "Real-time packet inspection processing 140,000+ packets/sec",
      "Sub-3ms neural anomaly classification with 99.8% precision",
      "Automated iptables firewall rule synthesis and active threat mitigation",
      "Dynamic Grafana and WebSocket telemetry visualizer dashboard"
    ],
    github: "https://github.com/esubap/neuroshield-ai",
    demo: "#"
  },
  {
    id: "nexusflow",
    category: "fullstack",
    title: "NexusFlow LMS",
    badge: "Enterprise Full-Stack",
    image: "assets/images/project-nexusflow.svg",
    shortDesc: "Scalable school and university learning management system built with Java Spring Boot, microservices, and a responsive frontend.",
    longDesc: "NexusFlow is a high-availability school and learning management platform designed for universities and K-12 institutions. Featuring strict role-based access control (RBAC), multi-tenant student portals, automated grading pipelines, and interactive attendance analytics, it supports thousands of concurrent users.",
    techStack: ["Java", "Spring Boot", "HTML5", "CSS3", "JavaScript", "PostgreSQL"],
    features: [
      "Role-Based Access Control (RBAC) supporting Students, Faculty & Administrators",
      "Automated grade calculation, transcript generation, and attendance analytics",
      "Interactive course portal with assignment submission and real-time announcements",
      "High-throughput RESTful API designed with Spring Data JPA and PostgreSQL"
    ],
    github: "https://github.com/esubap/nexusflow-school-lms",
    demo: "#"
  },
  {
    id: "cybersentinel",
    category: "ai-cyber",
    title: "CyberSentinel Auditor",
    badge: "Security & Python",
    image: "assets/images/project-cybersentinel.svg",
    shortDesc: "Automated vulnerability scanner and compliance auditing tool scanning for OWASP Top 10 vulnerabilities and network misconfigurations.",
    longDesc: "CyberSentinel is a command-line and web-integrated penetration testing automation suite. It runs multi-threaded reconnaissance across targeted subnets and web endpoints, detecting SQL injection vectors, cross-site scripting (XSS), missing security headers, weak TLS handshakes, and unpatched service CVEs.",
    techStack: ["Python", "Cybersecurity", "Networking", "OWASP", "JavaScript", "REST API"],
    features: [
      "Asynchronous asynchronous crawling engine scanning 200+ endpoints/minute",
      "Comprehensive verification for OWASP Top 10 web vulnerabilities",
      "Automated PDF and JSON executive risk score reports with remediation steps",
      "Custom regex signatures for sensitive API key and credential leak detection"
    ],
    github: "https://github.com/esubap/cybersentinel-audit",
    demo: "#"
  },
  {
    id: "aetherui",
    category: "fullstack",
    title: "AetherUI Platform",
    badge: "Modern Web / Frontend",
    image: "assets/images/project-aetherui.svg",
    shortDesc: "Ultra-fast reactive web design system and interactive component portal engineered with zero external framework dependencies.",
    longDesc: "AetherUI demonstrates the full potential of modern vanilla web standards. Engineered using native Web Components, Custom CSS properties, and ES6+ JavaScript, it delivers a glassmorphic, accessible, 120 FPS user experience with 0kb framework overhead and a 99+ Google Lighthouse score.",
    techStack: ["HTML5", "CSS3", "JavaScript", "Web Components", "A11y", "Responsive UI"],
    features: [
      "Zero dependencies: 100% native HTML5, modern CSS Grid/Flexbox, and ES6+",
      "Comprehensive WCAG 2.1 AAA accessibility with complete keyboard navigation",
      "Adaptive dark/neon theme engine with CSS variable design tokens",
      "Silky 120 FPS micro-interactions and hardware-accelerated animations"
    ],
    github: "https://github.com/esubap/aether-web-ui",
    demo: "#"
  },
  {
    id: "synapse",
    category: "ai-cyber",
    title: "SynapseAI Assistant",
    badge: "AI & Full-Stack",
    image: "assets/images/project-synapse.svg",
    shortDesc: "Context-aware AI knowledge assistant and semantic search engine powered by retrieval-augmented generation (RAG) and WebSockets.",
    longDesc: "SynapseAI is a conversational AI system that connects enterprise documentation with large language models using dense vector embeddings. Built with Python, LangChain, and FastAPI, it indexes technical codebases and engineering wikis to provide factual, verifiable answers with instant source citations.",
    techStack: ["Python", "AI", "Vector DB", "JavaScript", "FastAPI", "WebSockets"],
    features: [
      "Dense vector semantic search across thousands of pages in milliseconds",
      "Low-latency streaming responses via bidirectional WebSockets",
      "Hallucination guardrails with inline source attribution and confidence scoring",
      "Interactive query playground with responsive dark-slate interface"
    ],
    github: "https://github.com/esubap/synapse-ai-rag",
    demo: "#"
  },
  {
    id: "packetpulse",
    category: "networking",
    title: "PacketPulse Sniffer",
    badge: "Networking & Java",
    image: "assets/images/project-packetpulse.svg",
    shortDesc: "Real-time network packet analyzer, promiscuous telemetry collector, and live protocol bandwidth distributor written in Java.",
    longDesc: "PacketPulse is a deep packet inspection tool that captures raw network frames directly from physical and virtual network adapters. It dissects Ethernet, IP, TCP, UDP, and ICMP headers in real-time, displaying live bandwidth distribution histograms and detecting unusual connection spikes.",
    techStack: ["Java", "Networking", "TCP/IP", "Sockets", "Wireshark Protocol", "Multi-Threading"],
    features: [
      "Multi-threaded raw socket capture with zero packet buffer drops",
      "Deep protocol decoder: Ethernet II, IPv4/IPv6, TCP, UDP, ICMP, DNS, HTTP/S",
      "Live graphical bandwidth oscilloscope and packet length distribution",
      "Exportable PCAP file format compatible with standard Wireshark analyzers"
    ],
    github: "https://github.com/esubap/packetpulse-sniffer",
    demo: "#"
  }
];

// Certificates Dataset
const certificatesData = [
  {
    id: "cert-sec",
    title: "CompTIA Security+ (SY0-701)",
    issuer: "CompTIA",
    idCode: "COMP001029384",
    date: "Issued Nov 2024",
    image: "assets/images/cert-security.svg",
    skills: ["Cybersecurity", "OWASP", "Threat Defense", "Cryptography"],
    desc: "Validates foundational cybersecurity acumen covering enterprise threat analysis, network defense, cryptographic primitives, risk management, and identity governance."
  },
  {
    id: "cert-ccna",
    title: "Cisco Certified Network Associate (CCNA)",
    issuer: "Cisco Systems",
    idCode: "CSCO14892011",
    date: "Issued Aug 2024",
    image: "assets/images/cert-ccna.svg",
    skills: ["Networking", "TCP/IP", "Subnetting", "Routing & Switching"],
    desc: "Demonstrates mastery of network architecture, IP connectivity, subnetting, OSPF/EIGRP routing protocols, VLANs, and network security automation."
  },
  {
    id: "cert-java",
    title: "Oracle Certified Professional: Java SE 17",
    issuer: "Oracle Corporation",
    idCode: "OCP-JAVA-88120",
    date: "Issued May 2024",
    image: "assets/images/cert-java.svg",
    skills: ["Java", "Spring Boot", "OOP", "Concurrency"],
    desc: "Validates deep enterprise mastery of Java language syntax, JVM garbage collection, multithreading, concurrency models, Streams API, and object-oriented design."
  },
  {
    id: "cert-ai",
    title: "Deep Learning & Machine Learning Specialization",
    issuer: "DeepLearning.AI / Stanford",
    idCode: "DL-STANFORD-491",
    date: "Issued Feb 2024",
    image: "assets/images/cert-ai.svg",
    skills: ["AI", "Neural Networks", "Python", "PyTorch"],
    desc: "Rigorous specialization covering mathematical neural network architectures, backpropagation, CNNs for computer vision, Transformers, and LLM fine-tuning."
  },
  {
    id: "cert-web",
    title: "Meta Certified Full-Stack Web Developer",
    issuer: "Meta / Coursera",
    idCode: "META-DEV-90214",
    date: "Issued Oct 2023",
    image: "assets/images/cert-web.svg",
    skills: ["HTML", "CSS", "JavaScript", "Full-Stack"],
    desc: "Demonstrates comprehensive full-stack expertise: semantic HTML5, modern CSS3 layout systems, ES6+ JavaScript, REST APIs, databases, and UX responsiveness."
  },
  {
    id: "cert-py",
    title: "Certified Associate in Python Programming (PCAP)",
    issuer: "Python Institute",
    idCode: "PCAP-31-03-882",
    date: "Issued Jul 2023",
    image: "assets/images/cert-python.svg",
    skills: ["Python", "Automation", "Networking", "Data Structures"],
    desc: "Validates proficiency in object-oriented Python, file I/O operations, network socket interactions, package distribution, and system automation scripting."
  }
];

// Initialize Filtering and Modal Triggers on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  setupProjectFiltering();
  setupSkillsFiltering();
  setupModalHandlers();
});

// Setup Project Category Filter Buttons
function setupProjectFiltering() {
  const filterBtns = document.querySelectorAll('.project-filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filterValue === 'all' || cardCategory.includes(filterValue)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

// Setup Skills Filter Buttons
function setupSkillsFiltering() {
  const filterBtns = document.querySelectorAll('.skills-filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  if (!filterBtns.length || !skillCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filterValue === 'all' || cardCategory.includes(filterValue)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

// Setup Modal Popups for Projects & Certificates
function setupModalHandlers() {
  const modalOverlay = document.getElementById('details-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalBody = document.getElementById('modal-dynamic-content');

  if (!modalOverlay || !modalCloseBtn || !modalBody) return;

  // Function to open Project Modal
  window.openProjectModal = function(projectId) {
    const project = projectsData.find(p => p.id === projectId);
    if (!project) return;

    modalBody.innerHTML = `
      <div class="modal-media">
        <img src="${project.image}" alt="${project.title} Preview" />
      </div>
      <div class="modal-header-info">
        <div class="modal-category">${project.badge}</div>
        <h2 class="modal-title">${project.title}</h2>
      </div>
      <p class="modal-body-text">${project.longDesc}</p>
      
      <h3 style="font-size: 1.15rem; margin-bottom: 12px; color: var(--text-primary);">Key Architectural Highlights</h3>
      <ul class="modal-feature-list">
        ${project.features.map(f => `
          <li class="modal-feature-item">
            <i class="fa-solid fa-circle-check"></i>
            <span>${f}</span>
          </li>
        `).join('')}
      </ul>

      <div style="margin-bottom: 24px;">
        <h4 style="font-size: 0.88rem; color: var(--text-muted); font-family: var(--font-mono); text-transform: uppercase; margin-bottom: 8px;">Technologies Applied</h4>
        <div class="project-tech-stack" style="margin-bottom: 0;">
          ${project.techStack.map(t => `<span class="tech-tag">${t}</span>`).join('')}
        </div>
      </div>

      <div class="modal-actions">
        <a href="${project.github}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
          <i class="fa-brands fa-github"></i> View GitHub Repository
        </a>
        <button class="btn btn-secondary btn-sm" onclick="closeModal()">
          Close Window
        </button>
      </div>
    `;

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  // Function to open Certificate Modal
  window.openCertModal = function(certId) {
    const cert = certificatesData.find(c => c.id === certId);
    if (!cert) return;

    modalBody.innerHTML = `
      <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 24px; padding-bottom: 20px; border-bottom: 1px solid var(--border-subtle);">
        <div style="width: 80px; height: 80px; border-radius: 18px; background: #0f172a; padding: 10px; border: 1px solid var(--border-subtle); display: flex; align-items: center; justify-content: center;">
          <img src="${cert.image}" alt="${cert.title}" style="width: 100%; height: 100%; object-fit: contain;" />
        </div>
        <div>
          <span style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--accent-cyan); font-weight: 600;">${cert.issuer}</span>
          <h2 style="font-size: 1.45rem; margin-top: 4px;">${cert.title}</h2>
          <span style="font-size: 0.85rem; color: var(--text-muted); font-family: var(--font-mono);">${cert.date}</span>
        </div>
      </div>

      <div style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.25); border-radius: 8px; padding: 12px 16px; margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between;">
        <span style="font-size: 0.88rem; color: #a7f3d0;"><i class="fa-solid fa-shield-halved"></i> Official Credential ID:</span>
        <strong style="font-family: var(--font-mono); color: var(--accent-emerald);">${cert.idCode}</strong>
      </div>

      <p class="modal-body-text">${cert.desc}</p>

      <div style="margin-bottom: 24px;">
        <h4 style="font-size: 0.88rem; color: var(--text-muted); font-family: var(--font-mono); text-transform: uppercase; margin-bottom: 8px;">Competencies Verified</h4>
        <div class="project-tech-stack" style="margin-bottom: 0;">
          ${cert.skills.map(s => `<span class="tech-tag">${s}</span>`).join('')}
        </div>
      </div>

      <div class="modal-actions">
        <a href="#contact" class="btn btn-primary btn-sm" onclick="closeModal()">
          <i class="fa-solid fa-paper-plane"></i> Inquire About Verification
        </a>
        <button class="btn btn-secondary btn-sm" onclick="closeModal()">
          Close
        </button>
      </div>
    `;

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  // Close modal function
  window.closeModal = function() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
  };

  modalCloseBtn.addEventListener('click', closeModal);

  // Close when clicking backdrop
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });
}
