import { TeamMember, AlumniMember, EventItem, GalleryItem } from './types';

/* ===================== TEAM ===================== */

export const TEAM_MEMBERS: TeamMember[] = [
  { id: 1, name: "Kishlaya Sinha", role: "President", image: "/team/kishlaya.webp", socials: { linkedin: "https://www.linkedin.com/in/kishlaya-sinha-9134a0211" } },

  { id: 2, name: "Aditya Agarwal", role: "Vice President", image: "/team/aditya.webp", socials: { linkedin: "https://www.linkedin.com/in/aditya2227" } },
  { id: 3, name: "Saumya Kumari", role: "Vice President", image: "/team/saumya.webp", socials: { linkedin: "#" } },

  { id: 4, name: "Vishal Kumar Singh", role: "Secretary", image: "/team/vishalkr.webp", socials: { linkedin: "#" } },
  { id: 5, name: "Shivam Lal", role: "Treasurer", image: "/team/shivam.webp", socials: { linkedin: "#" } },


  { id: 6, name: "Prem Kumar Singh", role: "Event Head", image: "/team/premkumar.webp", socials: { linkedin: "#" } },
  { id: 7, name: "Priyanka Agrawal", role: "Event Lead", image: "/team/priyanka.webp", socials: { linkedin: "#" } },
  { id: 8, name: "Abhishek Anand", role: "Event Lead", image: "/team/abhishek.webp", socials: { linkedin: "#" } },

  { id: 9, name: "Kalpana", role: "Design Head", image: "/team/kalpana.webp", socials: { linkedin: "#" } },
  { id: 10, name: "Shalini Shalu", role: "Design Lead", image: "/team/shalini.webp", socials: { linkedin: "#" } },
  { id: 11, name: "Niharika Soni", role: "Design Lead", image: "/team/niharika.webp", socials: { linkedin: "#" } },

  { id: 12, name: "Gargi Priya", role: "Webmaster", image: "/team/gargi.webp", socials: { linkedin: "#" } },

  { id: 13, name: "Pratik Raj", role: "Resource Head", image: "/team/pratik.webp", socials: { linkedin: "#" } },
  { id: 14, name: "Rohit Gupta", role: "Resource Lead", image: "/team/rohitgupta.webp", socials: { linkedin: "#" } },
  { id: 15, name: "Prince Chaturvedi", role: "Resource Lead", image: "/team/prince.webp", socials: { linkedin: "#" } },

  { id: 16, name: "Bhavini Awasthi", role: "Finance Head", image: "/team/bhavini.webp", socials: { linkedin: "#" } },
  { id: 17, name: "Tushan Jyoti", role: "Finance Lead", image: "/team/tushan.webp", socials: { linkedin: "#" } },

  { id: 18, name: "Shayan Ahmad Khan", role: "PR Head", image: "/team/shayan.webp", socials: { linkedin: "#" } },
  { id: 19, name: "Arfa Khanam", role: "PR Lead", image: "/team/arfa.webp", socials: { linkedin: "#" } },

  /* ===================== MEMBERS ===================== */

  { id: 26, name: "Anjali Kumari", role: "Member", image: "/team/anjalicsejunior.webp", socials: { linkedin: "#" } },
  { id: 21, name: "Ram Kishan Mehta", role: "Member", image: "/team/ram.webp", socials: { linkedin: "#" } },
  { id: 43, name: "Ashutosh Kumar", role: "Member", image: "/team/ashutosh.webp", socials: { linkedin: "#" } },
  { id: 27, name: "Raj Yash Gupta", role: "Member", image: "/team/rajyash.webp", socials: { linkedin: "#" } },

  { id: 33, name: "Rajeev Raj", role: "Member", image: "/team/rajeev.webp", socials: { linkedin: "#" } },
  { id: 38, name: "Kanan Kotwani", role: "Member", image: "/team/kanan.webp", socials: { linkedin: "#" } },
  { id: 40, name: "Sahil Suman", role: "Member", image: "/team/sahil.webp", socials: { linkedin: "#" } },
  { id: 36, name: "Khushboo", role: "Member", image: "/team/khushboo.webp", socials: { linkedin: "#" } },

  { id: 20, name: "Aditya Kumar", role: "Member", image: "/team/adityakumar.webp", socials: { linkedin: "#" } },
  { id: 25, name: "Ritu Raj", role: "Member", image: "/team/rituraj.webp", socials: { linkedin: "#" } },
  { id: 24, name: "Daya Shankar", role: "Member", image: "/team/dayashankar.webp", socials: { linkedin: "#" } },
  { id: 29, name: "Aayush Babu", role: "Member", image: "/team/aayushbabu.webp", socials: { linkedin: "#" } },

  { id: 34, name: "Anushka Nandan", role: "Member", image: "/team/anushka.webp", socials: { linkedin: "#" } },
  { id: 32, name: "Aditi Maharor", role: "Member", image: "/team/aditimaharor.webp", socials: { linkedin: "#" } },
  { id: 37, name: "Shreyanka Basak", role: "Member", image: "/team/shreyanka.webp", socials: { linkedin: "#" } },
  { id: 42, name: "Soumya Sharma", role: "Member", image: "/team/soumya.webp", socials: { linkedin: "#" } },

  { id: 39, name: "Prisha Raj", role: "Member", image: "/team/prisha.webp", socials: { linkedin: "#" } },
  { id: 41, name: "Krish", role: "Member", image: "/team/krish.webp", socials: { linkedin: "#" } },
  { id: 22, name: "Vijay Kumar Das", role: "Member", image: "/team/vijay.webp", socials: { linkedin: "#" } },
  { id: 23, name: "Shivam Singh", role: "Member", image: "/team/shivamsingh.webp", socials: { linkedin: "#" } },

  { id: 28, name: "Kshitij Tiwari", role: "Member", image: "/team/kshitij.webp", socials: { linkedin: "#" } },
  { id: 31, name: "Aayush Arya", role: "Member", image: "/team/ayusharya.webp", socials: { linkedin: "#" } },
  { id: 35, name: "Abhishek Bharti", role: "Member", image: "/team/abhishekbharti.webp", socials: { linkedin: "#" } },
];

/* ===================== ALUMNI (2022) ===================== */

export const ALUMNI_MEMBERS: AlumniMember[] = [
  { id: 1, name: "Priyanshu Shankar", batch: "2022", image: "/alumni/priyanshu.webp", linkedin: "#" },
  { id: 2, name: "Sakshi Sharan", batch: "2022", image: "/alumni/sakshisharan.webp", linkedin: "#" },
  { id: 3, name: "Shashwat Srivastava", batch: "2022", image: "/placeholder.svg", linkedin: "#" },
  { id: 4, name: "Yuvika", batch: "2022", image: "/placeholder.svg", linkedin: "#" },
  { id: 5, name: "Anshika Pandey", batch: "2022", image: "/alumni/anshika.webp", linkedin: "#" },
  { id: 6, name: "Prem Kamal", batch: "2022", image: "/alumni/premkamal.webp", linkedin: "#" },
  { id: 7, name: "Parth Kumar", batch: "2022", image: "/alumni/parth.webp", linkedin: "#" },
  { id: 8, name: "Shubham Ghosh", batch: "2022", image: "/placeholder.svg", linkedin: "#" },
  { id: 9, name: "Pragati", batch: "2022", image: "/alumni/pragati.svg", linkedin: "#" },
  { id: 10, name: "Aditya Kumar", batch: "2022", image: "/alumni/aditya.svg", linkedin: "#" },
  { id: 11, name: "Rishav", batch: "2022", image: "/alumni/rishav.webp", linkedin: "#" },
  { id: 12, name: "Shweta", batch: "2022", image: "/alumni/shwetachoudhari.webp", linkedin: "#" },
  { id: 13, name: "Tripti Kumari", batch: "2022", image: "/alumni/tripti.webp", linkedin: "#" },
];

/* ===================== EVENTS ===================== */

export const EVENTS: EventItem[] = [
  {
    id: 1,
    title: "INgeniEUX 2.0",
    date: "Coming Soon",
    category: "Tech Event",
    description: "Our flagship tech innovation event.",
    image: "/events/placeholder.svg",
  },
  {
    id: 2,
    title: "Xordium 4.0",
    date: "Nov 5 	6 Nov 9, 2025",
    category: "Annual Tech + Fun Event",
    description: "The biggest annual fest by Ignite Club.",
    image: "/events/placeholder.svg",
  },
  {
    id: 3,
    title: "Humanoid & Beyond Workshop",
    date: "Oct 8, 2025",
    category: "Workshop",
    description: "Introductory session on Robotics, IoT & AI.",
    image: "/events/placeholder.svg",
  },
];

/* ===================== GALLERY ===================== */

export const GALLERY_IMAGES: GalleryItem[] = [
  { id: 1, src: "/gallery/placeholder.svg", alt: "Xordium Crowd", category: "Events" },
  { id: 2, src: "/gallery/placeholder.svg", alt: "Prize Distribution", category: "Awards" },
  { id: 3, src: "/gallery/placeholder.svg", alt: "Team Meet", category: "Community" },
  { id: 4, src: "/gallery/placeholder.svg", alt: "Workshop Session", category: "Events" },
  { id: 5, src: "/gallery/placeholder.svg", alt: "Robotics Demo", category: "Projects" },
  { id: 6, src: "/gallery/placeholder.svg", alt: "Guest Lecture", category: "Events" },
];
