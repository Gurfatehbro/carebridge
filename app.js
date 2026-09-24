/**
 * CareBridge HealthCare - Medical Tourism Application Logic
 * UIUX Pro Max Interactive Suite
 */

// ==========================================
// 1. DATA REPOSITORIES (Delhi Hospitals & Doctors)
// ==========================================

const EXCHANGE_RATES = {
  USD: { rate: 1.0, symbol: '$', prefix: true },
  EUR: { rate: 0.92, symbol: '€', prefix: true },
  AED: { rate: 3.67, symbol: 'د.إ ', prefix: true },
  GBP: { rate: 0.79, symbol: '£', prefix: true },
  INR: { rate: 86.5, symbol: '₹', prefix: true }
};

let currentCurrency = 'USD';

const COST_DATABASE = {
  cabg: {
    name: 'Heart Bypass Surgery (CABG)',
    usa: 120000,
    uk: 45000,
    uae: 32000,
    delhi: 6200,
    recoveryDays: '7-10 Days Hospital Stay'
  },
  knee: {
    name: 'Robotic Total Knee Replacement (Unilateral)',
    usa: 48000,
    uk: 22000,
    uae: 19000,
    delhi: 4200,
    recoveryDays: '4-5 Days Hospital Stay'
  },
  hip: {
    name: 'Total Hip Replacement (Bilateral)',
    usa: 65000,
    uk: 28000,
    uae: 24000,
    delhi: 6800,
    recoveryDays: '5-7 Days Hospital Stay'
  },
  liver: {
    name: 'Living Donor Liver Transplant',
    usa: 320000,
    uk: 160000,
    uae: 125000,
    delhi: 28500,
    recoveryDays: '18-22 Days Hospital Stay'
  },
  kidney: {
    name: 'Kidney Transplant',
    usa: 150000,
    uk: 75000,
    uae: 55000,
    delhi: 13500,
    recoveryDays: '10-14 Days Hospital Stay'
  },
  bmt: {
    name: 'Allogeneic Bone Marrow Transplant (BMT)',
    usa: 280000,
    uk: 130000,
    uae: 95000,
    delhi: 24000,
    recoveryDays: '21-30 Days In Clean Room'
  },
  cyberknife: {
    name: 'CyberKnife Robotic Radiation (Full Course)',
    usa: 55000,
    uk: 26000,
    uae: 21000,
    delhi: 5500,
    recoveryDays: 'Outpatient (3-5 Sessions)'
  },
  ivf: {
    name: 'IVF + ICSI (1 Complete Cycle)',
    usa: 18000,
    uk: 9500,
    uae: 8200,
    delhi: 2900,
    recoveryDays: '15-20 Days in Delhi'
  },
  spine: {
    name: 'Spine Lumbar Fusion (TLIF)',
    usa: 75000,
    uk: 32000,
    uae: 28000,
    delhi: 5800,
    recoveryDays: '5-6 Days Hospital Stay'
  }
};

const HOSPITAL_DETAILS = {
  'Indraprastha Apollo Hospitals': {
    title: 'Indraprastha Apollo Hospitals',
    location: 'Sarita Vihar, Mathura Road, South Delhi 110076',
    accreditations: ['JCI USA Accredited (Consecutively since 2005)', 'NABH', 'NABL'],
    beds: '710 Beds (140 Critical Care Beds)',
    highlights: [
      'Pioneer in living donor liver transplants with over 4,000+ completed transplants.',
      'Comprehensive Cancer Center with CyberKnife VSI, Novalis Tx, and PET-CT.',
      'Dedicated International Patient Lounge with multi-lingual guest managers.',
      'On-site currency exchange, FRRO visa desk, prayer rooms & halal catering.'
    ],
    keyDoctors: ['Dr. Subhash Gupta (Liver Transplant)', 'Dr. Muthu Jothi (Pediatric Heart)', 'Dr. Sandeep Batra (Medical Oncology)']
  },
  'Max Super Speciality Hospital Saket': {
    title: 'Max Super Speciality Hospital, Saket',
    location: '1, 2, Press Enclave Marg, Saket, South Delhi 110017',
    accreditations: ['JCI USA Accredited', 'NABH Certified', 'Green OT Certification'],
    beds: '530+ Beds (120 ICU Beds)',
    highlights: [
      'First hospital in North India to install the Da Vinci Xi Robotic Surgical System.',
      'Max Institute of Cancer Care equipped with TrueBeam STx and Intra-Operative MRI.',
      'Excellence center for robotic knee replacement and minimally invasive cardiac surgeries.',
      'Direct tie-ups with 4-star serviced apartments in Saket with full kitchenettes.'
    ],
    keyDoctors: ['Dr. Harit Chaturvedi (Surgical Oncology)', 'Dr. Bipin Walia (Spine Surgery)', 'Dr. S. K. S. Marya (Joint Replacement)']
  },
  'Fortis Escorts Heart Institute': {
    title: 'Fortis Escorts Heart Institute (FEHI)',
    location: 'Okhla Road, New Friends Colony, South Delhi 110025',
    accreditations: ['JCI USA Accredited', 'NABH (Asia’s Premier Cardiac Institute)'],
    beds: '310 Beds (Dedicated 100 Cardiac Critical Beds)',
    highlights: [
      'Recognized globally as one of the world’s landmark institutions for cardiovascular science.',
      'Over 200,000 coronary angiographies and 90,000 cardiac surgeries performed.',
      'Specialized Transcatheter Aortic Valve Replacement (TAVR) and ECMO advanced program.',
      'Dedicated 24/7 International Cardiac Emergency Airlift Response.'
    ],
    keyDoctors: ['Dr. Ashok Seth (Chairman Cardiology)', 'Dr. Z. S. Meharwal (Cardiovascular Surgery)', 'Dr. Krishna S. Iyer (Pediatric Cardiac)']
  },
  'BLK-Max Super Speciality Hospital': {
    title: 'BLK-Max Super Speciality Hospital',
    location: 'Pusa Road, Karol Bagh, Central Delhi 110005',
    accreditations: ['JCI USA Accredited', 'NABH Certified', 'Largest Bone Marrow Center'],
    beds: '650 Beds (125 Critical Care Beds, 17 Modular OTs)',
    highlights: [
      'Houses Asia’s largest standalone Bone Marrow Transplant (BMT) center with HEPA filtered units.',
      'Center for advanced Robotic Hepatobiliary, GI and Bariatric Surgery.',
      'Located in the heart of Delhi, 20 minutes from central transit hubs.',
      'Full embassy liaison team facilitating swift treatment clearance.'
    ],
    keyDoctors: ['Dr. Dharma Choudhary (Bone Marrow Transplant)', 'Dr. Surender Kumar Dabas (Robotic Head & Neck Oncology)', 'Dr. Deep Goel (Bariatric Surgery)']
  },
  'Medanta - The Medicity': {
    title: 'Medanta - The Medicity',
    location: 'CH Bakhtawar Singh Rd, Sector 38, Gurugram, Delhi NCR 122001',
    accreditations: ['JCI USA Accredited', 'NABH Certified', 'Newsweek World Best Hospital List'],
    beds: '1,250+ Beds (350+ ICU Beds, 40 State-of-Art Operation Theaters)',
    highlights: [
      'Founded by eminent heart surgeon Dr. Naresh Trehan spanning 43 acres.',
      'Top multi-organ transplant institute (Living donor liver, heart, lung, kidney).',
      'Dedicated Flying Doctors India air ambulance evacuation fleet.',
      'In-house international wing serving patients from over 160 nations.'
    ],
    keyDoctors: ['Dr. Naresh Trehan (Chief Cardiac Surgeon)', 'Dr. Arvinder Singh Soin (Chief Liver Surgeon)', 'Dr. Ashok Vaid (Medical Oncology)']
  },
  'Sir Ganga Ram Hospital': {
    title: 'Sir Ganga Ram Hospital',
    location: 'Rajinder Nagar, New Delhi 110060',
    accreditations: ['NABH Certified', 'NABL Accredited Laboratory'],
    beds: '675 Beds (100 ICU Beds, 60 Multi-Super Specialties)',
    highlights: [
      'Premier tertiary care trust hospital with 7 decades of surgical prestige.',
      'Pioneer of Minimal Access Surgery and clinical genetics in South Asia.',
      'World-class Reproductive Medicine & IVF center with over 12,000+ IVF babies.',
      'Significantly cost-effective while maintaining benchmark tertiary clinical outcomes.'
    ],
    keyDoctors: ['Dr. Abha Majumdar (Reproductive Medicine/IVF)', 'Dr. Saumitra Rawat (Surgical Gastroenterology)', 'Dr. D. S. Rana (Nephrology)']
  },
  'Manipal Hospital Dwarka': {
    title: 'Manipal Hospital, Dwarka',
    location: 'Sector 6, Dwarka, New Delhi 110075 (10 Mins from Airport)',
    accreditations: ['NABH Certified', 'NABL Accredited', 'ISO 9001'],
    beds: '380 Beds (118 Critical ICUs, 13 Modular OTs)',
    highlights: [
      'Closest quaternary super-specialty hospital to Indira Gandhi International Airport (DEL).',
      'Advanced digital monitoring ICUs and AI-guided radiation therapy suites.',
      'Integrated cancer institute and robotic joint reconstruction center.',
      'VIP airport concierge with instant ambulance and limousine escort.'
    ],
    keyDoctors: ['Dr. (Col.) Manjinder Sandhu (Cardiology)', 'Dr. Sanjeev Kumar (Orthopedics)', 'Dr. Peush Bajpai (Medical Oncology)']
  },
  'Fortis Memorial Research Institute': {
    title: 'Fortis Memorial Research Institute (FMRI)',
    location: 'Sector 44, Gurugram, Delhi NCR 122002',
    accreditations: ['JCI USA Accredited', 'NABH', 'Ranked #2 Globally by Top Master Healthcare'],
    beds: '1,000 Planned Beds (15 Voice-Modulated Modular OTs)',
    highlights: [
      'Referred to as the "Next Generation Hospital" with cutting-edge medical robotics.',
      'Brain Suite with Intra-operative MRI for precision neuro-oncology surgery.',
      'Specialized pediatric cardiac ICU and bone marrow transplant suites.',
      'Spacious luxury suites and dedicated Arabic, French, and Russian patient lounges.'
    ],
    keyDoctors: ['Dr. Vinod Raina (Onco-Sciences)', 'Dr. Sandeep Vaishya (Neuro & Gamma Knife)', 'Dr. Subhash Chandra (Interventional Cardiology)']
  }
};

const DOCTOR_DETAILS = {
  'Dr. Ashok Seth': {
    name: 'Dr. Ashok Seth',
    title: 'Padma Bhushan & Padma Shri Awardee',
    designation: 'Chairman, Fortis Escorts Heart Institute, New Delhi',
    experience: '42+ Years Surgical Excellence',
    credentials: 'MBBS, MD, FRCP (London, Edinburgh, Ireland), FACC (USA), FSCAI (USA)',
    surgeries: 'Over 50,000 Angiographies and 20,000 Angioplasties',
    bio: 'Dr. Ashok Seth is globally recognized as one of the most prolific interventional cardiologists in modern medicine. He has pioneered cutting-edge techniques including Directional Coronary Atherectomy, Stents, Percutaneous Myocardial Revascularization, and Transcatheter Aortic Valve Implantation (TAVI/TAVR). Conferred national awards by the President of India and honored with national fellowship chairs across Europe and America.',
    specialties: ['Complex Angioplasty & Bifurcation Stenting', 'TAVI / TAVR Transcatheter Heart Valve', 'Laser Angioplasty', 'Pediatric Heart Interventions']
  },
  'Dr. Naresh Trehan': {
    name: 'Dr. Naresh Trehan',
    title: 'Padma Bhushan & Padma Shri Awardee',
    designation: 'Chairman & Managing Director, Medanta - The Medicity',
    experience: '52+ Years Clinical & Surgical Eminence',
    credentials: 'MBBS, Diplomat American Board of Surgery, Diplomat American Board of Cardiothoracic Surgery',
    surgeries: 'Over 48,000 Open Heart Surgeries performed',
    bio: 'Dr. Naresh Trehan is a legendary cardiovascular and cardiothoracic surgeon trained at New York University Medical Center. Former personal surgeon to the President of India, he founded Medanta, building one of the greatest healthcare ecosystems in Asia. He is a global pioneer in minimally invasive cardiac surgery and robotic beating-heart coronary artery bypass.',
    specialties: ['Minimally Invasive CABG', 'Robotic Cardiac Surgery', 'Cardiothoracic Surgery', 'Heart Transplants & Artificial Hearts']
  },
  'Dr. Arvinder Singh Soin': {
    name: 'Dr. Arvinder Singh Soin',
    title: 'Padma Shri Awardee',
    designation: 'Chairman, Liver Transplantation Institute, Medanta',
    experience: '34+ Years Pioneering Surgical Experience',
    credentials: 'MBBS, MS, FRCS (Glasgow), FRCS (Edinburgh)',
    surgeries: 'Over 3,800 Living Donor Liver Transplants (95% Success Rate)',
    bio: 'Dr. A.S. Soin pioneered living donor liver transplantation in India. Trained at University of Cambridge and King’s College Hospital London, he leads one of the world’s largest and most successful liver transplant programs. His team performs more than 25-30 successful liver transplants every month with clinical outcomes matching international centers of excellence.',
    specialties: ['Living Donor Liver Transplant', 'Pediatric Liver Transplant', 'Complex Hepato-Pancreato-Biliary (HPB) Surgery', 'Liver Cancer Resection']
  },
  'Dr. Harit Chaturvedi': {
    name: 'Dr. Harit Chaturvedi',
    title: 'President, Indian Association of Surgical Oncology',
    designation: 'Chairman, Max Institute of Cancer Care, Saket',
    experience: '32+ Years Cancer Surgery Mastery',
    credentials: 'MBBS, MS, M.Ch (Surgical Oncology)',
    surgeries: 'Over 22,000 Oncological Surgeries',
    bio: 'Dr. Harit Chaturvedi is among India’s most distinguished surgical oncologists. He leads Max Healthcare’s comprehensive oncology care system. He specializes in Da Vinci robotic cancer resections, breast conserving cancer surgeries, head & neck reconstructive oncological surgery, and gastrointestinal malignancies.',
    specialties: ['Robotic Surgical Oncology', 'Gastrointestinal & Colorectal Cancer', 'Breast Preservation Surgery', 'Head & Neck Cancer']
  },
  'Dr. S. K. S. Marya': {
    name: 'Dr. S. K. S. Marya',
    title: 'Former President, Asia Pacific Arthroplasty Society',
    designation: 'Chairman, Joint Replacement & Orthopedics, Max Healthcare',
    experience: '38+ Years Orthopedic Leadership',
    credentials: 'MBBS, MS (Ortho), M.Ch (Ortho, Liverpool, UK), FRCS (Glasgow, England)',
    surgeries: 'Over 18,000 Joint Replacements (Knee & Hip)',
    bio: 'Dr. S.K.S. Marya is recognized across the world for his expertise in computerized navigation and robotic total knee & hip arthroplasty. He has trained hundreds of surgeons globally and is celebrated for handling high-risk joint revisions with rapid post-operative walking protocols.',
    specialties: ['Robotic Total Knee Replacement', 'Total Hip Replacement (Anterior & Posterior)', 'Revision Arthroplasty', 'Complex Deformity Correction']
  },
  'Dr. Bipin Walia': {
    name: 'Dr. Bipin Walia',
    title: 'Armed Forces Medical Leader & Neuro Pioneer',
    designation: 'Senior Director & Head of Spine Surgery, Max Saket',
    experience: '30+ Years Neuro-Spine Mastery',
    credentials: 'MBBS, MS, M.Ch (Neurosurgery, AIIMS)',
    surgeries: 'Over 9,000 Spine and Brain Surgeries',
    bio: 'Dr. Bipin Walia trained at AIIMS New Delhi and completed advanced neurosurgery fellowships at University of Erlangen Germany, Medical University of South Carolina, and Zurich. He is an acknowledged maestro of endoscopic spine surgery, motion-preserving disc replacement, and spinal tumor microsurgery.',
    specialties: ['Minimally Invasive Spine Surgery', 'Artificial Disc Replacement', 'Spinal Deformity & Scoliosis', 'Brain & Spine Microsurgery']
  },
  'Dr. Abha Majumdar': {
    name: 'Dr. Abha Majumdar',
    title: 'Pioneer of IVF in Northern India',
    designation: 'Director & Head, IVF and Reproductive Medicine, Sir Ganga Ram Hospital',
    experience: '37+ Years Fertility Breakthroughs',
    credentials: 'MBBS, MS (Obs & Gynae), FICS, FICOG',
    surgeries: 'Over 12,000+ Successful IVF Pregnancies',
    bio: 'Dr. Abha Majumdar is the pioneer who established the IVF center at Sir Ganga Ram Hospital in 1990. She is renowned internationally for solving complex cases of repeated implantation failure, advanced maternal age pregnancies, donor egg protocols, and pre-implantation genetic screening (PGT-A).',
    specialties: ['IVF / ICSI Cycles', 'Blastocyst Culture & Cryopreservation', 'Repeated Implantation Failure', 'Pre-Implantation Genetic Diagnosis (PGD)']
  },
  'Dr. Vinod Raina': {
    name: 'Dr. Vinod Raina',
    title: 'Former Head of Medical Oncology, AIIMS New Delhi',
    designation: 'Chairman, Onco-Sciences & Bone Marrow Transplant, FMRI',
    experience: '40+ Years Oncology Authority',
    credentials: 'MBBS, MD, MRCP (UK), FRCP (Edinburgh, London)',
    surgeries: 'Over 700 Stem Cell & Bone Marrow Transplants',
    bio: 'Dr. Vinod Raina is one of India’s most revered oncologists. He spent over 23 years at AIIMS New Delhi where he performed the country’s first autologous stem cell transplant. He has led over 50 international cancer drug clinical trials and is an authority on targeted immunotherapies, leukemia, lymphoma, and lung cancer.',
    specialties: ['Bone Marrow & Stem Cell Transplant', 'Targeted Molecular & Immunotherapy', 'Breast & Lung Cancer Oncology', 'Hematological Malignancies']
  }
};

// ==========================================
// 2. DOM INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileMenu();
  initFaqAccordion();
  initCostCalculator();
  initHospitalFilters();
  initDoctorFilters();
  initCurrencySelector();
  initLanguageSelector();
  initTabSwitchers();
});

// ==========================================
// 3. CURRENCY SWITCHER LOGIC
// ==========================================

function initCurrencySelector() {
  const currencySelect = document.getElementById('currencySelect');
  if (!currencySelect) return;

  currencySelect.addEventListener('change', (e) => {
    currentCurrency = e.target.value;
    updateCostComparison();
    showToast(`Currency switched to ${currentCurrency}`);
  });
}

function formatCost(valUSD) {
  const config = EXCHANGE_RATES[currentCurrency] || EXCHANGE_RATES.USD;
  const converted = Math.round(valUSD * config.rate);
  return `${config.symbol}${converted.toLocaleString()}`;
}

// ==========================================
// 3B. MULTILINGUAL TRANSLATION ENGINE (i18n)
// ==========================================

let currentLanguage = localStorage.getItem('carebridge_language') || 'en';

const TRANSLATIONS = {
  en: {
    top_badge: '24/7 International Desk',
    top_helpline: 'Emergency / Helpline: +91 8585931010',
    top_location: 'Delhi NCR Central Hub (Indira Gandhi Int\'l Airport Concierge)',
    top_call_btn: 'Call: 8585931010',
    call_helpline: 'Call Desk: +91 8585931010',
    nav_specialties: 'Specialties',
    nav_hospitals: 'Delhi Hospitals',
    nav_doctors: 'Renowned Doctors',
    nav_calculator: 'Cost Calculator',
    nav_concierge: 'International Concierge',
    nav_journey: 'Patient Journey',
    nav_testimonials: 'Success Stories',
    btn_second_opinion: 'Free 2nd Opinion',
    btn_get_estimate: 'Get Free Estimate',
    hero_title: 'World-Class Medical Care in <span class="gradient-text">Delhi NCR</span>.<br>Save Up to <span class="highlight-pill">70–80%</span> on Surgeries.',
    hero_desc: 'Seamless medical tourism bridging global patients to <strong>Delhi\'s top super-specialty hospitals</strong> (Apollo, Max, Fortis, Medanta, BLK-Max, Sir Ganga Ram) & internationally accredited surgeons. Zero waiting list, 100% free consultation & complete concierge service.',
    cta_badge: 'Fast 24-Hour Assessment',
    cta_title: 'Receive Your Free Delhi Treatment Plan & Quote',
    cta_desc: 'Upload your medical reports now or call our 24/7 international patient coordinator directly at +91 8585931010.',
    cta_btn_quote: 'Get Free Hospital Quotes',
    cta_call_btn: 'Call: 8585931010',
    dock_free_opinion: 'Free Opinion',
    form_label_phone: 'Mobile / Phone Number *',
    footer_about: 'Connecting patients globally to Delhi NCR\'s most prestigious JCI and NABH accredited hospitals and world-renowned doctors. Providing uncompromised quality, cost clarity, and end-to-end concierge services.',
    footer_heading_hospitals: 'Top Delhi Hospitals',
    footer_heading_specialties: 'Top Specialties',
    footer_heading_patients: 'International Patients'
  },
  hi: {
    top_badge: '24/7 अंतरराष्ट्रीय सहायता डेस्क',
    top_helpline: 'आपातकालीन / हेल्पलाइन: +91 8585931010',
    top_location: 'दिल्ली एनसीआर सेंट्रल हब (इंदिरा गांधी एयरपोर्ट सहायता)',
    top_call_btn: 'कॉल करें: 8585931010',
    call_helpline: 'कॉल डेस्क: +91 8585931010',
    nav_specialties: 'विशेषताएं',
    nav_hospitals: 'दिल्ली के अस्पताल',
    nav_doctors: 'प्रसिद्ध डॉक्टर्स',
    nav_calculator: 'खर्च कैलकुलेटर',
    nav_concierge: 'अंतरराष्ट्रीय सेवाएं',
    nav_journey: 'मरीज की यात्रा',
    nav_testimonials: 'सफलता की कहानियां',
    btn_second_opinion: 'मुफ्त दूसरी राय',
    btn_get_estimate: 'मुफ्त खर्च का अनुमान',
    hero_title: 'दिल्ली एनसीआर में विश्वस्तरीय चिकित्सा सुविधा.<br>सर्जरी पर <span class="highlight-pill">70–80%</span> तक बचत करें।',
    hero_desc: 'विदेशी मरीजों को दिल्ली के शीर्ष सुपर-स्पेशियलिटी अस्पतालों (अपोलो, मैक्स, फोर्टिस, मेदांता, बीएलके-मैक्स, सर गंगा राम) और अंतरराष्ट्रीय सर्जनों से जोड़ना। शून्य प्रतीक्षा सूची, 100% मुफ्त परामर्श और संपूर्ण सहायता।',
    cta_badge: '24 घंटे में त्वरित समीक्षा',
    cta_title: 'दिल्ली से अपना मुफ्त इलाज प्लान और खर्च का अनुमान प्राप्त करें',
    cta_desc: 'अपनी मेडिकल रिपोर्ट्स अभी अपलोड करें या हमारे 24/7 अंतरराष्ट्रीय समन्वयक से +91 8585931010 पर बात करें।',
    cta_btn_quote: 'मुफ्त अस्पताल कोट्स प्राप्त करें',
    cta_call_btn: 'कॉल करें: 8585931010',
    dock_free_opinion: 'मुफ्त राय',
    form_label_phone: 'मोबाइल / फोन नंबर *',
    footer_about: 'विश्वभर के मरीजों को दिल्ली एनसीआर के प्रतिष्ठित JCI और NABH प्रमाणित अस्पतालों और प्रसिद्ध डॉक्टरों से जोड़ना। गुणवत्ता, लागत पारदर्शिता और संपूर्ण सहायता।',
    footer_heading_hospitals: 'दिल्ली के शीर्ष अस्पताल',
    footer_heading_specialties: 'प्रमुख विशेषताएं',
    footer_heading_patients: 'अंतरराष्ट्रीय मरीज'
  },
  ar: {
    top_badge: 'مكتب المرضى الدوليين 24/7',
    top_helpline: 'خط المساعدة والطوارئ: 8585931010 91+',
    top_location: 'مركز دلهي الطبي (خدمة استقبال مطار إنديرا غاندي الدولي)',
    top_call_btn: 'اتصل: 8585931010',
    call_helpline: 'اتصل بالمكتب: 8585931010 91+',
    nav_specialties: 'التخصصات الطبية',
    nav_hospitals: 'مستشفيات دلهي',
    nav_doctors: 'أشهر الأطباء',
    nav_calculator: 'حاسبة التكاليف',
    nav_concierge: 'الخدمات الدولية',
    nav_journey: 'رحلة العلاج',
    nav_testimonials: 'قصص النجاح',
    btn_second_opinion: 'رأي طبي ثانٍ مجاناً',
    btn_get_estimate: 'احصل على تقدير مجاني',
    hero_title: 'رعاية طبية عالمية المستوى في <span class="gradient-text">دلهي</span>.<br>وفّر حتى <span class="highlight-pill">70–80%</span> من تكاليف الجراحة.',
    hero_desc: 'ربط المرضى الدوليين بأرقى مستشفيات دلهي المعتمدة دولياً (أبولو، ماكس، فورتيس، ميدانتا، بي إل كيه، وسير جانجا رام) وجراحين عالميين. بدون قوائم انتظار، استشارة مجانية 100% وخدمة كونسيرج متكاملة.',
    cta_badge: 'تقييم فوري خلال 24 ساعة',
    cta_title: 'احصل على خطة علاج وتقدير تكلفة مجاناً من دلهي',
    cta_desc: 'أرسل تقاريرك الطبية الآن أو اتصل بمنسق المرضى الدوليين مباشرة على 8585931010 91+.',
    cta_btn_quote: 'طلب عروض أسعار المستشفيات مجاناً',
    cta_call_btn: 'اتصل: 8585931010',
    dock_free_opinion: 'استشارة مجانية',
    form_label_phone: 'رقم الهاتف / الجوال *',
    footer_about: 'ربط المرضى حول العالم بأعرق مستشفيات دلهي المعتمدة دولياً من JCI وNABH ونخبة الأطباء العالميين. جودة لا تضاهى، وضوح تام في التكاليف، وخدمات استقبال ومرافقة متكاملة.',
    footer_heading_hospitals: 'أفضل مستشفيات دلهي',
    footer_heading_specialties: 'أهم التخصصات الجراحية',
    footer_heading_patients: 'المرضى الدوليين'
  },
  ru: {
    top_badge: 'Круглосуточный международный отдел',
    top_helpline: 'Горячая линия: +91 8585931010',
    top_location: 'Главный хаб Дели (консьерж-сервис в аэропорту им. Индиры Ганди)',
    top_call_btn: 'Тел: 8585931010',
    call_helpline: 'Позвонить: +91 8585931010',
    nav_specialties: 'Специальности',
    nav_hospitals: 'Больницы Дели',
    nav_doctors: 'Ведущие врачи',
    nav_calculator: 'Калькулятор цен',
    nav_concierge: 'Международный сервис',
    nav_journey: 'Этапы лечения',
    nav_testimonials: 'Отзывы пациентов',
    btn_second_opinion: 'Второе мнение бесплатно',
    btn_get_estimate: 'Получить расчет',
    hero_title: 'Медицинская помощь мирового уровня в <span class="gradient-text">Дели</span>.<br>Экономьте до <span class="highlight-pill">70–80%</span> на операциях.',
    hero_desc: 'Организация лечения для иностранных пациентов в лучших клиниках Дели (Apollo, Max, Fortis, Medanta, BLK-Max, Sir Ganga Ram). Без очередей, 100% бесплатные консультации и полное сопровождение.',
    cta_badge: 'Оценка состояния за 24 часа',
    cta_title: 'Получите бесплатный план лечения и расчет стоимости',
    cta_desc: 'Отправьте медицинские выписки или позвоните координатору по номеру +91 8585931010.',
    cta_btn_quote: 'Получить расчет от больниц',
    cta_call_btn: 'Позвонить: 8585931010',
    dock_free_opinion: 'Бесплатное мнение',
    form_label_phone: 'Номер телефона / мобильного *',
    footer_about: 'Соединяем пациентов со всего мира с аккредитованными клиниками Дели (JCI, NABH) и ведущими профессорами. Гарантия качества, прозрачные цены и полное сопровождение.',
    footer_heading_hospitals: 'Лучшие больницы Дели',
    footer_heading_specialties: 'Основные направления',
    footer_heading_patients: 'Иностранным пациентам'
  },
  fr: {
    top_badge: 'Bureau International 24/7',
    top_helpline: 'Ligne d\'urgence: +91 8585931010',
    top_location: 'Centre de Delhi (Conciergerie à l\'aéroport Indira Gandhi)',
    top_call_btn: 'Appel: 8585931010',
    call_helpline: 'Appeler: +91 8585931010',
    nav_specialties: 'Spécialités',
    nav_hospitals: 'Hôpitaux de Delhi',
    nav_doctors: 'Médecins renommés',
    nav_calculator: 'Calculateur de coût',
    nav_concierge: 'Conciergerie internationale',
    nav_journey: 'Parcours patient',
    nav_testimonials: 'Témoignages',
    btn_second_opinion: '2ème Avis Gratuit',
    btn_get_estimate: 'Obtenir un devis',
    hero_title: 'Soins médicaux d\'excellence à <span class="gradient-text">Delhi</span>.<br>Économisez jusqu\'à <span class="highlight-pill">70 à 80%</span> sur les chirurgies.',
    hero_desc: 'Tourisme médical de premier ordre reliant les patients aux meilleurs hôpitaux de Delhi (Apollo, Max, Fortis, Medanta, BLK-Max, Sir Ganga Ram). Sans liste d\'attente, consultation 100% gratuite et conciergerie complète.',
    cta_badge: 'Évaluation rapide en 24h',
    cta_title: 'Recevez votre plan de traitement et devis gratuit à Delhi',
    cta_desc: 'Téléchargez vos rapports médicaux ou appelez notre coordinateur 24/7 au +91 8585931010.',
    cta_btn_quote: 'Obtenir les devis des hôpitaux',
    cta_call_btn: 'Appel: 8585931010',
    dock_free_opinion: 'Avis Gratuit',
    form_label_phone: 'Numéro de téléphone portable *',
    footer_about: 'Mise en relation des patients du monde entier avec les hôpitaux accrédités JCI et NABH de Delhi et des médecins de renommée mondiale. Qualité sans compromis et transparence des coûts.',
    footer_heading_hospitals: 'Meilleurs hôpitaux de Delhi',
    footer_heading_specialties: 'Spécialités majeures',
    footer_heading_patients: 'Patients internationaux'
  },
  sw: {
    top_badge: 'Dawati la Kimataifa 24/7',
    top_helpline: 'Nambari ya Dharura: +91 8585931010',
    top_location: 'Kituo cha Delhi (Huduma ya Uwanja wa Ndege wa Indira Gandhi)',
    top_call_btn: 'Piga: 8585931010',
    call_helpline: 'Piga Simu: +91 8585931010',
    nav_specialties: 'Ubingwa wa Matibabu',
    nav_hospitals: 'Hospitali za Delhi',
    nav_doctors: 'Madaktari Maarufu',
    nav_calculator: 'Kikokotoo cha Gharama',
    nav_concierge: 'Huduma za Kimataifa',
    nav_journey: 'Safari ya Mgonjwa',
    nav_testimonials: 'Ushuhuda wa Wagonjwa',
    btn_second_opinion: 'Maoni ya Pili Bure',
    btn_get_estimate: 'Pata Makadirio Bure',
    hero_title: 'Huduma za Kimatibabu za Kiwango cha Juu <span class="gradient-text">Delhi</span>.<br>Okoa Hadi <span class="highlight-pill">70–80%</span> kwa Upasuaji.',
    hero_desc: 'Daraja la utalii wa kimatibabu linalounganisha wagonjwa na hospitali bora za Delhi (Apollo, Max, Fortis, Medanta, BLK, Ganga Ram). Hakuna foleni, mashauriano 100% bure na huduma kamili.',
    cta_badge: 'Tathmini ya Haraka ya Saa 24',
    cta_title: 'Pata Mpango na Makadirio Yako ya Matibabu Bure',
    cta_desc: 'Tuma ripoti zako za matibabu sasa au piga simu kwa mratibu wetu kwa +91 8585931010.',
    cta_btn_quote: 'Pata Makadirio ya Hospitali Bure',
    cta_call_btn: 'Piga: 8585931010',
    dock_free_opinion: 'Maoni Bure',
    form_label_phone: 'Nambari ya Simu ya Mkononi *',
    footer_about: 'Kuunganisha wagonjwa kote ulimwenguni na hospitali zilizoidhinishwa za JCI na NABH za Delhi na madaktari maarufu duniani. Ubora usio na kifani na uwazi wa gharama.',
    footer_heading_hospitals: 'Hospitali Bora za Delhi',
    footer_heading_specialties: 'Taaluma Kuu za Matibabu',
    footer_heading_patients: 'Wagonjwa wa Kimataifa'
  },
  bn: {
    top_badge: '২৪/৭ আন্তর্জাতিক হেল্পডেস্ক',
    top_helpline: 'জরুরি হেল্পলাইন: +91 8585931010',
    top_location: 'দিল্লি প্রধান কেন্দ্র (ইন্দিরা গান্ধী বিমানবন্দর সহায়তা)',
    top_call_btn: 'কল করুন: 8585931010',
    call_helpline: 'কল করুন: +91 8585931010',
    nav_specialties: 'চিকিৎসা বিভাগ',
    nav_hospitals: 'দিল্লির হাসপাতাল',
    nav_doctors: 'বিশিষ্ট ডাক্তারগণ',
    nav_calculator: 'খরচ ক্যালকুলেটর',
    nav_concierge: 'আন্তর্জাতিক সেবা',
    nav_journey: 'রোগীর পথচলা',
    nav_testimonials: 'সাফল্যের গল্প',
    btn_second_opinion: 'ফ্রি দ্বিতীয় মতামত',
    btn_get_estimate: 'ফ্রি খরচের হিসাব নিন',
    hero_title: '<span class="gradient-text">দিল্লি এনসিআর</span>-এ বিশ্বমানের চিকিৎসা সেবা।<br>অস্ত্রোপচারে <span class="highlight-pill">৭০–৮০%</span> পর্যন্ত সাশ্রয় করুন।',
    hero_desc: 'আন্তর্জাতিক রোগীদের দিল্লির শীর্ষস্থানীয় সুপার-স্পেশালিটি হাসপাতাল (অ্যাপোলো, ম্যাক্স, ফোর্টিস, মেদান্ত, বিএলকে-ম্যাক্স, স্যার গঙ্গা রাম) এবং বিশ্বখ্যাত সার্জনদের সাথে যুক্ত করা। কোনও অপেক্ষার তালিকা নেই, ১০০% ফ্রি পরামর্শ এবং সম্পূর্ণ সহায়তা।',
    cta_badge: '২৪ ঘণ্টার মধ্যে পর্যালোচনা',
    cta_title: 'দিল্লি থেকে আপনার ফ্রি চিকিৎসা পরিকল্পনা ও খরচের হিসাব পান',
    cta_desc: 'আপনার মেডিকেল রিপোর্ট আপলোড করুন বা সরাসরি আমাদের হেল্পলাইনে কল করুন +91 8585931010।',
    cta_btn_quote: 'হাসপাতালের ফ্রি খরচের হিসাব নিন',
    cta_call_btn: 'কল করুন: 8585931010',
    dock_free_opinion: 'ফ্রি মতামত',
    form_label_phone: 'মোবাইল / ফোন নম্বর *',
    footer_about: 'বিশ্বজুড়ে রোগীদের দিল্লির মর্যাদাপূর্ণ জেসিআই এবং এনএবিএইচ স্বীকৃত হাসপাতাল এবং বিশ্বখ্যাত চিকিৎসকদের সাথে সংযুক্ত করা। আপসহীন মান এবং পূর্ণাঙ্গ সহায়তা।',
    footer_heading_hospitals: 'দিল্লির শীর্ষ হাসপাতাল',
    footer_heading_specialties: 'প্রধান চিকিৎসা বিভাগ',
    footer_heading_patients: 'আন্তর্জাতিক রোগী'
  }
};

function initLanguageSelector() {
  const langSelect = document.getElementById('languageSelect');
  const mobileLangSelect = document.getElementById('mobileLanguageSelect');

  const handleLangChange = (lang) => {
    setLanguage(lang);
  };

  if (langSelect) {
    langSelect.value = currentLanguage;
    langSelect.addEventListener('change', (e) => handleLangChange(e.target.value));
  }

  if (mobileLangSelect) {
    mobileLangSelect.value = currentLanguage;
    mobileLangSelect.addEventListener('change', (e) => handleLangChange(e.target.value));
  }

  // Protect labels initially
  protectLanguageLabels();

  // Watch for any Google Translate DOM alterations to guarantee labels stay intact
  const selects = [document.getElementById('languageSelect'), document.getElementById('mobileLanguageSelect')].filter(Boolean);
  selects.forEach(sel => {
    const observer = new MutationObserver(() => protectLanguageLabels());
    observer.observe(sel, { childList: true, subtree: true, characterData: true });
  });

  // Apply on initial load if saved language is not default English
  if (currentLanguage && currentLanguage !== 'en') {
    applyLanguage(currentLanguage, false);
  }
}

const CANONICAL_LANGUAGES = {
  en: 'English',
  hi: 'हिन्दी (Hindi)',
  ar: 'العربية (Arabic)',
  ru: 'Русский (Russian)',
  uz: "O'zbek tili (Uzbek)",
  bn: 'বাংলা (Bengali)',
  fr: 'Français (French)',
  sw: 'Kiswahili (Swahili)',
  fa: 'فارسی (Persian)',
  ur: 'اردو (Urdu)',
  ps: 'پښتو (Pashto)',
  es: 'Español (Spanish)',
  de: 'Deutsch (German)',
  tr: 'Türkçe (Turkish)',
  id: 'Bahasa Indonesia',
  vi: 'Tiếng Việt (Vietnamese)',
  my: 'မြန်မာ (Burmese)',
  am: 'አማርኛ (Amharic)',
  so: 'Soomaali (Somali)'
};

function protectLanguageLabels() {
  ['languageSelect', 'mobileLanguageSelect'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    Array.from(el.options).forEach(opt => {
      if (CANONICAL_LANGUAGES[opt.value]) {
        opt.textContent = CANONICAL_LANGUAGES[opt.value];
      }
    });
  });
}

function setLanguage(lang) {
  currentLanguage = lang;
  localStorage.setItem('carebridge_language', lang);

  // Sync both dropdowns
  const langSelect = document.getElementById('languageSelect');
  const mobileLangSelect = document.getElementById('mobileLanguageSelect');
  if (langSelect) langSelect.value = lang;
  if (mobileLangSelect) mobileLangSelect.value = lang;

  applyLanguage(lang, true);
  protectLanguageLabels();
}

function applyLanguage(lang, showNotification = true) {
  // 1. Set HTML dir and lang attributes (RTL for Arabic, Persian, Urdu, Pashto)
  const RTL_LANGUAGES = ['ar', 'fa', 'ur', 'ps'];
  const isRTL = RTL_LANGUAGES.includes(lang);
  document.documentElement.lang = lang;
  document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');

  // 2. Apply dictionary translations to all [data-i18n] elements
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) {
      el.innerHTML = TRANSLATIONS[lang][key];
    } else if (TRANSLATIONS.en && TRANSLATIONS.en[key]) {
      el.innerHTML = TRANSLATIONS.en[key];
    }
  });

  // 3. Trigger Google Translate for deep document translation
  try {
    document.cookie = `googtrans=/en/${lang}; path=/;`;
    if (window.location.hostname) {
      document.cookie = `googtrans=/en/${lang}; domain=${window.location.hostname}; path=/;`;
      document.cookie = `googtrans=/en/${lang}; domain=.${window.location.hostname}; path=/;`;
    }

    const triggerCombo = () => {
      const gtCombo = document.querySelector('.goog-te-combo');
      if (gtCombo) {
        if (gtCombo.value !== lang) {
          gtCombo.value = lang;
          gtCombo.dispatchEvent(new Event('change'));
        }
        return true;
      }
      return false;
    };

    if (!triggerCombo()) {
      let retries = 0;
      const interval = setInterval(() => {
        retries++;
        if (triggerCombo() || retries > 12) {
          clearInterval(interval);
          protectLanguageLabels();
        }
      }, 250);
    }
  } catch (err) {
    console.warn('Google Translate sync:', err);
  }

  // Ensure labels stay protected
  protectLanguageLabels();

  // 4. Toast notification
  if (showNotification) {
    const toastMsgs = {
      en: 'Language switched to English',
      hi: 'भाषा बदलकर हिन्दी कर दी गई है',
      ar: 'تم تحويل لغة الموقع إلى العربية بنجاح',
      ru: 'Язык успешно переключен на Русский',
      uz: 'Til O\'zbek tiliga o\'zgartirildi',
      fr: 'Langue changée en Français avec succès',
      sw: 'Lugha imebadilishwa kuwa Kiswahili',
      bn: 'ভাষা সফলভাবে বাংলায় পরিবর্তন করা হয়েছে',
      fa: 'زبان با موفقیت به فارسی تغییر یافت',
      ur: 'زبان کامیابی سے اردو میں تبدیل ہو گئی ہے',
      es: 'Idioma cambiado a Español',
      de: 'Sprache auf Deutsch umgestellt',
      tr: 'Dil Türkçe olarak değiştirildi'
    };
    showToast(toastMsgs[lang] || `Language switched to ${CANONICAL_LANGUAGES[lang] || lang}`);
  }
}

// ==========================================
// 4. COST CALCULATOR LOGIC
// ==========================================

function initCostCalculator() {
  updateCostComparison();
}

function updateCostComparison() {
  const select = document.getElementById('calcProcedureSelect');
  if (!select) return;

  const key = select.value;
  const data = COST_DATABASE[key];
  if (!data) return;

  const costUSAEl = document.getElementById('costUSA');
  const costUKEl = document.getElementById('costUK');
  const costUAEEl = document.getElementById('costUAE');
  const costDelhiEl = document.getElementById('costDelhi');
  const savingsAmountEl = document.getElementById('savingsAmount');

  const formattedUSA = formatCost(data.usa);
  const formattedUK = formatCost(data.uk);
  const formattedUAE = formatCost(data.uae);
  const formattedDelhi = formatCost(data.delhi);

  if (costUSAEl) costUSAEl.textContent = formattedUSA;
  if (costUKEl) costUKEl.textContent = formattedUK;
  if (costUAEEl) costUAEEl.textContent = formattedUAE;
  if (costDelhiEl) costDelhiEl.textContent = formattedDelhi;

  // Percentage & savings vs USA
  const rawDiff = data.usa - data.delhi;
  const percentSaved = Math.round((rawDiff / data.usa) * 100);
  const formattedSaved = formatCost(rawDiff);

  if (savingsAmountEl) {
    savingsAmountEl.textContent = `${formattedSaved} (${percentSaved}% Saved)`;
  }

  // Update dynamic widths of bars relative to max (USA = 100%)
  const ukBar = document.querySelector('.uk-bar');
  const uaeBar = document.querySelector('.uae-bar');
  const delhiBar = document.querySelector('.delhi-bar');

  if (ukBar) ukBar.style.width = `${Math.round((data.uk / data.usa) * 100)}%`;
  if (uaeBar) uaeBar.style.width = `${Math.round((data.uae / data.usa) * 100)}%`;
  if (delhiBar) delhiBar.style.width = `${Math.max(10, Math.round((data.delhi / data.usa) * 100))}%`;
}

// ==========================================
// 5. HOSPITAL FILTERS
// ==========================================

function initHospitalFilters() {
  const buttons = document.querySelectorAll('#hospitalFilters .filter-btn');
  const cards = document.querySelectorAll('#hospitalsGrid .hospital-card');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');
      cards.forEach(card => {
        const tags = card.getAttribute('data-tags') || '';
        if (filterVal === 'all' || tags.includes(filterVal)) {
          card.style.display = 'flex';
          card.style.animation = 'fadeInUp 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

function filterHospitalTag(tag) {
  const btn = document.querySelector(`#hospitalFilters .filter-btn[data-filter="${tag}"]`);
  if (btn) {
    btn.click();
  }
}

// ==========================================
// 6. DOCTOR FILTERS
// ==========================================

function initDoctorFilters() {
  const buttons = document.querySelectorAll('#doctorFilters .filter-btn');
  const cards = document.querySelectorAll('#doctorsGrid .doctor-card');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-docfilter');
      cards.forEach(card => {
        const spec = card.getAttribute('data-docspecialty') || '';
        if (filterVal === 'all' || spec === filterVal) {
          card.style.display = 'flex';
          card.style.animation = 'fadeInUp 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

function filterBySpecialty(specialtyName) {
  // Map specialty to hospital and doctor filters
  const docMap = {
    'Cardiology': 'cardiology',
    'Oncology': 'oncology',
    'Orthopedics': 'orthopedics',
    'Organ Transplant': 'transplant',
    'Neurology': 'neurology',
    'IVF': 'ivf'
  };

  const targetFilter = docMap[specialtyName] || 'all';

  // Scroll smoothly to doctors section
  const docSection = document.getElementById('doctors');
  if (docSection) {
    docSection.scrollIntoView({ behavior: 'smooth' });
    const btn = document.querySelector(`#doctorFilters .filter-btn[data-docfilter="${targetFilter}"]`);
    if (btn) btn.click();
    showToast(`Showing Delhi specialists for ${specialtyName}`);
  }
}

// ==========================================
// 7. SMART DISCOVERY FINDER
// ==========================================

function initTabSwitchers() {
  const tabs = document.querySelectorAll('.finder-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const tabType = tab.getAttribute('data-tab');
      const searchInput = document.getElementById('searchQuery');
      if (searchInput) {
        if (tabType === 'treatment') searchInput.placeholder = "e.g. Heart Bypass, Knee Replacement, CyberKnife...";
        if (tabType === 'hospital') searchInput.placeholder = "e.g. Apollo, Max Saket, Medanta, Fortis...";
        if (tabType === 'doctor') searchInput.placeholder = "e.g. Dr. Ashok Seth, Dr. Naresh Trehan...";
      }
    });
  });
}

function handleSmartSearch(e) {
  e.preventDefault();
  const query = (document.getElementById('searchQuery')?.value || '').toLowerCase().trim();
  const specialty = document.getElementById('specialtySelect')?.value || 'all';
  const location = document.getElementById('locationFilter')?.value || 'all';

  showToast(`Searching Delhi hospitals & doctors for "${query || specialty}"...`);

  // Target appropriate section based on input
  if (query.includes('dr') || query.includes('doctor') || query.includes('trehan') || query.includes('seth') || query.includes('marya') || query.includes('chaturvedi')) {
    const docSec = document.getElementById('doctors');
    if (docSec) docSec.scrollIntoView({ behavior: 'smooth' });
  } else if (location !== 'all' || query.includes('hospital') || query.includes('apollo') || query.includes('max') || query.includes('fortis')) {
    const hospSec = document.getElementById('hospitals');
    if (hospSec) hospSec.scrollIntoView({ behavior: 'smooth' });
    if (location !== 'all') {
      const locBtn = document.querySelector(`#hospitalFilters .filter-btn[data-filter="${location}"]`);
      if (locBtn) locBtn.click();
    }
  } else {
    // Scroll to specialties or hospitals
    const hospSec = document.getElementById('hospitals');
    if (hospSec) hospSec.scrollIntoView({ behavior: 'smooth' });
  }
}

function quickFilterTag(tag) {
  const input = document.getElementById('searchQuery');
  if (input) {
    input.value = tag;
    const form = document.getElementById('smartFinderForm');
    if (form) form.dispatchEvent(new Event('submit'));
  }
}

// ==========================================
// 8. DETAIL MODALS (Hospital & Doctor Profiles)
// ==========================================

function openHospitalModal(hospitalName) {
  const data = HOSPITAL_DETAILS[hospitalName];
  if (!data) return;

  const content = document.getElementById('detailModalContent');
  if (!content) return;

  content.innerHTML = `
    <div class="modal-header">
      <span class="modal-badge">Hospital Profile & Infrastructure</span>
      <h2 class="modal-title" style="margin-top: 6px;">${data.title}</h2>
      <p class="modal-subtitle" style="color: #38bdf8;">📍 ${data.location}</p>
    </div>

    <div style="margin-bottom: 24px;">
      <h4 style="font-family: var(--font-heading); color: #fff; margin-bottom: 8px;">Key Accreditations:</h4>
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        ${data.accreditations.map(acc => `<span class="badge-accred jci-badge">${acc}</span>`).join('')}
      </div>
    </div>

    <div style="background: rgba(5, 12, 23, 0.6); padding: 18px; border-radius: 12px; margin-bottom: 24px; border: 1px solid rgba(255,255,255,0.08);">
      <p style="color: var(--primary); font-weight: 700; margin-bottom: 4px;">Capacity & Infrastructure:</p>
      <p style="color: #cbd5e1; font-size: 0.95rem;">${data.beds}</p>
    </div>

    <div style="margin-bottom: 24px;">
      <h4 style="font-family: var(--font-heading); color: #fff; margin-bottom: 12px;">Specialty Highlights & International Services:</h4>
      <ul style="list-style: none; display: flex; flex-direction: column; gap: 10px; color: #cbd5e1; font-size: 0.92rem;">
        ${data.highlights.map(h => `<li style="display: flex; gap: 10px;"><span style="color: var(--primary); font-weight: bold;">✓</span> <span>${h}</span></li>`).join('')}
      </ul>
    </div>

    <div style="margin-bottom: 30px;">
      <h4 style="font-family: var(--font-heading); color: #fff; margin-bottom: 10px;">Prominent Senior Surgeons & Faculty:</h4>
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        ${data.keyDoctors.map(doc => `<span class="feat-pill" style="font-size: 0.85rem; padding: 6px 14px;">${doc}</span>`).join('')}
      </div>
    </div>

    <div class="modal-footer" style="padding-top: 20px;">
      <div style="font-size: 0.85rem; color: #94a3b8;">
        100% Free Appointment & Visa Invitation Desk
      </div>
      <button class="btn btn-primary" onclick="closeDetailModal(); openConsultModal('Appointment - ${data.title}')">
        Request Free Opinion & Bed Booking
      </button>
    </div>
  `;

  const modal = document.getElementById('detailModal');
  if (modal) modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function openDoctorModal(docName) {
  const data = DOCTOR_DETAILS[docName];
  if (!data) return;

  const content = document.getElementById('detailModalContent');
  if (!content) return;

  content.innerHTML = `
    <div class="modal-header">
      <span class="modal-badge">${data.title}</span>
      <h2 class="modal-title" style="margin-top: 6px;">${data.name}</h2>
      <p class="modal-subtitle" style="color: #38bdf8; font-weight: 600;">${data.designation}</p>
      <p style="font-size: 0.85rem; color: #94a3b8; margin-top: 4px;">Credentials: ${data.credentials}</p>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px;">
      <div style="background: rgba(5, 12, 23, 0.6); padding: 14px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.08);">
        <span style="font-size: 0.75rem; color: #64748b; text-transform: uppercase;">Clinical Experience</span>
        <p style="font-size: 1.1rem; font-weight: 700; color: #ffffff;">${data.experience}</p>
      </div>
      <div style="background: rgba(5, 12, 23, 0.6); padding: 14px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.08);">
        <span style="font-size: 0.75rem; color: #64748b; text-transform: uppercase;">Surgical Procedures</span>
        <p style="font-size: 1.1rem; font-weight: 700; color: var(--primary);">${data.surgeries}</p>
      </div>
    </div>

    <div style="margin-bottom: 24px;">
      <h4 style="font-family: var(--font-heading); color: #fff; margin-bottom: 8px;">Physician Biography & Global Standing:</h4>
      <p style="font-size: 0.95rem; color: #cbd5e1; line-height: 1.7;">${data.bio}</p>
    </div>

    <div style="margin-bottom: 30px;">
      <h4 style="font-family: var(--font-heading); color: #fff; margin-bottom: 10px;">Key Surgical Specialties:</h4>
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        ${data.specialties.map(spec => `<span class="feat-pill" style="font-size: 0.85rem; padding: 6px 14px; background: rgba(0,210,157,0.1); border-color: rgba(0,210,157,0.3); color: #fff;">${spec}</span>`).join('')}
      </div>
    </div>

    <div class="modal-footer" style="padding-top: 20px;">
      <div style="font-size: 0.85rem; color: #94a3b8;">
        Direct Video Consultation Available
      </div>
      <button class="btn btn-primary" onclick="closeDetailModal(); openConsultModal('Video Consult - ${data.name}')">
        Book Video Consult with ${data.name}
      </button>
    </div>
  `;

  const modal = document.getElementById('detailModal');
  if (modal) modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeDetailModal() {
  const modal = document.getElementById('detailModal');
  if (modal) modal.classList.remove('active');
  document.body.style.overflow = '';
}

// ==========================================
// 9. CONSULTATION & ESTIMATE MODAL WORKFLOW
// ==========================================

function openConsultModal(context = '') {
  const modal = document.getElementById('consultModal');
  const heading = document.getElementById('modalHeading');

  if (heading && context) {
    heading.textContent = context.includes('Opinion') ? 'Request Free Doctor 2nd Opinion' : `Request Care Consultation: ${context}`;
  }

  if (modal) modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeConsultModal() {
  const modal = document.getElementById('consultModal');
  if (modal) modal.classList.remove('active');
  document.body.style.overflow = '';
}

// File Drag & Drop Simulation
function handleFileSelected(e) {
  const files = e.target.files;
  const listContainer = document.getElementById('fileUploadList');
  if (!listContainer) return;

  listContainer.innerHTML = '';
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
    const item = document.createElement('div');
    item.className = 'file-item-pill';
    item.innerHTML = `
      <span>📄 ${file.name} (${sizeMB} MB)</span>
      <span style="color: var(--primary);">✓ Attached</span>
    `;
    listContainer.appendChild(item);
  }
}

function submitConsultForm(e) {
  e.preventDefault();
  const name = document.getElementById('patientName')?.value || 'Valued Patient';
  const country = document.getElementById('patientCountry')?.value || 'International';
  const specialty = document.getElementById('modalSpecialty')?.value || 'Specialty';

  // Close modal
  closeConsultModal();

  // Reset form
  const form = document.getElementById('consultForm');
  if (form) form.reset();
  const listContainer = document.getElementById('fileUploadList');
  if (listContainer) listContainer.innerHTML = '';

  // Show detailed confirmation toast
  showToast(`Thank you, ${name}! Your reports have been forwarded to Delhi Chief Specialists. A dedicated medical coordinator will connect with you at your phone number in < 2 hours.`);
}

// ==========================================
// 10. STICKY HEADER & MOBILE NAV
// ==========================================

function initStickyHeader() {
  const header = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });
}

function initMobileMenu() {
  const btn = document.getElementById('mobileMenuBtn');
  const drawer = document.getElementById('mobileDrawer');
  const backdrop = document.getElementById('mobileDrawerBackdrop');
  const closeBtn = document.getElementById('mobileNavClose');

  const toggleMenu = (open) => {
    const shouldOpen = typeof open === 'boolean' ? open : !drawer?.classList.contains('active');
    if (shouldOpen) {
      drawer?.classList.add('active');
      backdrop?.classList.add('active');
      btn?.classList.add('active');
      document.body.style.overflow = 'hidden';
    } else {
      drawer?.classList.remove('active');
      backdrop?.classList.remove('active');
      btn?.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  btn?.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  closeBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu(false);
  });

  backdrop?.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu(false);
  });

  // Close on mobile drawer link click
  const drawerLinks = document.querySelectorAll('.mobile-drawer-link');
  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleMenu(false);
    });
  });

  // Close when clicking outside drawer
  document.addEventListener('click', (e) => {
    if (drawer?.classList.contains('active') && !drawer.contains(e.target) && !btn?.contains(e.target)) {
      toggleMenu(false);
    }
  });

  // Sync mobile currency select with desktop currency select
  const mobileCurrency = document.getElementById('mobileCurrencySelect');
  const desktopCurrency = document.getElementById('currencySelect');
  if (mobileCurrency && desktopCurrency) {
    mobileCurrency.value = currentCurrency;
    mobileCurrency.addEventListener('change', (e) => {
      desktopCurrency.value = e.target.value;
      currentCurrency = e.target.value;
      updateCostComparison();
      showToast(`Currency switched to ${currentCurrency}`);
    });
  }
}

// ==========================================
// 11. FAQ ACCORDION
// ==========================================

function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      // Close others
      faqItems.forEach(i => i.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

// ==========================================
// 12. TOAST NOTIFICATION UTILITY
// ==========================================

function showToast(message) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span style="font-size: 1.2rem;">✨</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 400);
  }, 4500);
}
