export default [
  {
    fullName: "Dr. Shahwaiz Khan",
    specialization: "Cardiology",
    qualification: "MBBS, MD, FCPS (Cardiology)",
    experienceYears: 15,
    profileImageUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=200&auto=format&fit=crop",
    bio: "Senior cardiologist with over 15 years of experience in interventional cardiology and cardiovascular medicine. Specializes in managing heart failure, hypertension, and performing complex angioplasties.",
    averageRating: 4.8,
    reviewCount: 2,
    consultationFee: 2500,
    isFeatured: true,
    isActive: true,
    availability: [
      {
        dayOfWeek: "Monday",
        slots: ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM"]
      },
      {
        dayOfWeek: "Wednesday",
        slots: ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM"]
      },
      {
        dayOfWeek: "Friday",
        slots: ["02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM"]
      }
    ],
    reviews: [
      {
        userName: "Ali Ahmed",
        rating: 5,
        comment: "Excellent doctor. Very professional and explains the diagnosis clearly.",
        createdAt: new Date("2026-06-15")
      },
      {
        userName: "Sara Khan",
        rating: 4.6,
        comment: "Good experience. The clinic was clean, and Dr. Shahwaiz was extremely thorough.",
        createdAt: new Date("2026-06-20")
      }
    ]
  },
  {
    fullName: "Dr. Ayesha Alvi",
    specialization: "Pediatrics",
    qualification: "MBBS, DCH, FCPS (Pediatrics)",
    experienceYears: 10,
    profileImageUrl: "https://images.unsplash.com/photo-1594824813573-246434de83fb?q=80&w=200&auto=format&fit=crop",
    bio: "Compassionate pediatrician dedicated to providing comprehensive healthcare for children from infancy through adolescence. Expert in developmental monitoring, immunizations, and pediatric illnesses.",
    averageRating: 4.9,
    reviewCount: 2,
    consultationFee: 1500,
    isFeatured: true,
    isActive: true,
    availability: [
      {
        dayOfWeek: "Tuesday",
        slots: ["10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM"]
      },
      {
        dayOfWeek: "Thursday",
        slots: ["10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM"]
      },
      {
        dayOfWeek: "Saturday",
        slots: ["11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "01:00 PM"]
      }
    ],
    reviews: [
      {
        userName: "Zainab Malik",
        rating: 5,
        comment: "Amazing pediatrician! My kids love her, and she is so gentle.",
        createdAt: new Date("2026-06-10")
      },
      {
        userName: "Bilal Malik",
        rating: 4.8,
        comment: "Highly recommended pediatric specialist in the city.",
        createdAt: new Date("2026-06-18")
      }
    ]
  },
  {
    fullName: "Dr. Kamran Qureshi",
    specialization: "Dermatology",
    qualification: "MBBS, MCPS (Dermatology)",
    experienceYears: 8,
    profileImageUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=200&auto=format&fit=crop",
    bio: "Consultant Dermatologist and Cosmetologist specializing in acne, eczema, psoriasis, hair loss, and anti-aging treatments. Expert in advanced laser procedures.",
    averageRating: 4.5,
    reviewCount: 1,
    consultationFee: 2000,
    isFeatured: false,
    isActive: true,
    availability: [
      {
        dayOfWeek: "Monday",
        slots: ["02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM"]
      },
      {
        dayOfWeek: "Wednesday",
        slots: ["02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM"]
      }
    ],
    reviews: [
      {
        userName: "Hamza Niaz",
        rating: 4.5,
        comment: "Acne treatments worked great. Very satisfied.",
        createdAt: new Date("2026-06-25")
      }
    ]
  },
  {
    fullName: "Dr. Maria Yusuf",
    specialization: "Gynecology",
    qualification: "MBBS, FCPS (Gynecology & Obstetrics)",
    experienceYears: 12,
    profileImageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=200&auto=format&fit=crop",
    bio: "Consultant Gynecologist offering comprehensive women's health services. Specializes in high-risk pregnancy care, family planning, and reproductive endocrinology.",
    averageRating: 4.7,
    reviewCount: 1,
    consultationFee: 2200,
    isFeatured: true,
    isActive: true,
    availability: [
      {
        dayOfWeek: "Tuesday",
        slots: ["02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM"]
      },
      {
        dayOfWeek: "Friday",
        slots: ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM"]
      }
    ],
    reviews: [
      {
        userName: "Amina Bibi",
        rating: 4.7,
        comment: "Very polite, patient, and knowledgeable doctor.",
        createdAt: new Date("2026-06-28")
      }
    ]
  },
  {
    fullName: "Dr. Fahad Meer",
    specialization: "General Physician",
    qualification: "MBBS, FCPS (Medicine)",
    experienceYears: 7,
    profileImageUrl: "https://images.unsplash.com/photo-1637059824899-a441006a6875?q=80&w=200&auto=format&fit=crop",
    bio: "General Physician specializing in primary care, chronic disease management (diabetes, asthma), and diagnostic workups. Dedicated to preventive family health.",
    averageRating: 4.6,
    reviewCount: 0,
    consultationFee: 1000,
    isFeatured: false,
    isActive: true,
    availability: [
      {
        dayOfWeek: "Monday",
        slots: ["11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM"]
      },
      {
        dayOfWeek: "Wednesday",
        slots: ["11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM"]
      },
      {
        dayOfWeek: "Thursday",
        slots: ["11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM"]
      }
    ],
    reviews: []
  }
];
