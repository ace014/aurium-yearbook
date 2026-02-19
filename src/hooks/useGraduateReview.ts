import { useState, useMemo, useEffect } from "react";

// --- 1. CONFIGURATION ---
export const ACADEMIC_CONFIG = [
  {
    name: "GRADUATE SCHOOL",
    courses: [
      { name: "MASTER OF ARTS IN EDUCATION (MAED)", majors: ["EDUCATIONAL MANAGEMENT", "GUIDANCE & COUNSELING", "PHYSICAL EDUCATION", "TEACHING ENGLISH", "TEACHING MATHEMATICS", "TEACHING SCIENCE"] },
      { name: "MASTER IN BUSINESS ADMINISTRATION", majors: [] },
      { name: "MASTER IN MANAGEMENT", majors: [] }
    ]
  },
  {
    name: "DEPARTMENT OF ENGINEERING EDUCATION",
    courses: [
      { name: "BACHELOR OF SCIENCE IN COMPUTER ENGINEERING", majors: [] },
      { name: "BACHELOR OF SCIENCE IN ELECTRICAL ENGINEERING", majors: [] },
      { name: "BACHELOR OF SCIENCE IN ELECTRONICS ENGINEERING", majors: [] }
    ]
  },
  {
    name: "DEPARTMENT OF ART AND SCIENCES EDUCATION",
    courses: [
      { name: "BACHELOR OF ARTS IN ENGLISH", majors: [] },
      { name: "BACHELOR OF SCIENCE IN PSYCHOLOGY", majors: [] }
    ]
  },
  {
    name: "DEPARTMENT OF ACCOUNTING EDUCATION",
    courses: [
      { name: "BACHELOR OF SCIENCE IN ACCOUNTANCY", majors: [] },
      { name: "BACHELOR OF SCIENCE IN ACCOUNTING TECHNOLOGY", majors: [] },
      { name: "BACHELOR OF SCIENCE IN MANAGEMENT ACCOUNTING", majors: [] }
    ]
  },
  {
    name: "DEPARTMENT OF TEACHER EDUCATION",
    courses: [
      { name: "BACHELOR OF ELEMENTARY EDUCATION (GENERALIST)", majors: [] },
      { name: "BACHELOR OF PHYSICAL EDUCATION", majors: [] },
      { name: "BACHELOR OF SECONDARY EDUCATION", majors: ["ENGLISH", "FILIPINO", "MATHEMATICS", "SCIENCE", "SOCIAL STUDIES"] }
    ]
  },
  {
    name: "DEPARTMENT OF BUSINESS ADMINISTRATION EDUCATION",
    courses: [
      { name: "BACHELOR OF SCIENCE IN BUSINESS ADMINISTRATION", majors: ["FINANCIAL MANAGEMENT", "HUMAN RESOURCE MANAGEMENT", "MARKETING MANAGEMENT"] },
      { name: "BACHELOR OF SCIENCE IN COMMERCE", majors: ["MANAGEMENT"] }
    ]
  },
  {
    name: "HOSPITALITY AND TOURISM MANAGEMENT EDUCATION",
    courses: [
      { name: "BACHELOR OF SCIENCE IN HOSPITALITY MANAGEMENT", majors: [] },
      { name: "BACHELOR OF SCIENCE IN HOTEL AND RESTAURANT MANAGEMENT", majors: [] },
      { name: "BACHELOR OF SCIENCE IN TOURISM MANAGEMENT", majors: [] },
      { name: "BACHELOR OF ARTS IN ECONOMICS", majors: [] }
    ]
  },
  {
    name: "DEPARTMENT OF CRIMINAL JUSTICE EDUCATION",
    courses: [
      { name: "BACHELOR OF SCIENCE IN CRIMINOLOGY", majors: [] }
    ]
  },
  {
    name: "DEPARTMENT OF COMPUTING EDUCATION",
    courses: [
      { name: "BACHELOR OF SCIENCE IN COMPUTER SCIENCE", majors: [] },
      { name: "BACHELOR OF SCIENCE IN INFORMATION TECHNOLOGY", majors: [] }
    ]
  },
  {
    name: "DEPARTMENT OF NURSING EDUCATION",
    courses: [
      { name: "BACHELOR OF SCIENCE IN NURSING", majors: [] }
    ]
  }
];

export const DEPARTMENT_ORDER = ACADEMIC_CONFIG.map(d => d.name);

// --- 2. STATUS STEPS ---
export const STATUS_STEPS = [
  { id: 1, label: "Registered" },
  { id: 2, label: "Approved" },
  { id: 3, label: "Booked" },
  { id: 4, label: "Attended" },
  { id: 5, label: "Fully Verified" },
  { id: 6, label: "Pictorial" }, 
];

// --- 3. DATA GENERATOR ---
const generateMockData = () => {
  const firstNames = ["James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda", "David", "Elizabeth", "Sarah", "Joseph", "Thomas", "Charles", "Christopher", "Daniel", "Matthew", "Anthony", "Donald", "Mark"];
  const middleNames = ["Santos", "Reyes", "Cruz", "Bautista", "Ocampo", "Garcia", "Mendoza", "Torres", "Aquino", "Flores"];
  const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson"];
  const suffixes = ["", "", "", "", "Jr.", "III"]; 

  let allStudents: any[] = [];
  let globalCounter = 1;

  ACADEMIC_CONFIG.forEach(dept => {
    dept.courses.forEach(courseObj => {
      let programs = courseObj.majors.length > 0 ? courseObj.majors.map(m => `${courseObj.name} - ${m}`) : [courseObj.name];

      programs.forEach(programName => {
        const numStudents = Math.floor(Math.random() * 15) + 5; 

        for (let i = 0; i < numStudents; i++) {
          const fname = firstNames[Math.floor(Math.random() * firstNames.length)];
          const mname = middleNames[Math.floor(Math.random() * middleNames.length)];
          const lname = lastNames[Math.floor(Math.random() * lastNames.length)];
          const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
          
          allStudents.push({
            id: `STU-${globalCounter}`,
            idNumber: `2024-${String(globalCounter).padStart(5, '0')}`,
            lname, fname, mname, suffix,
            department: dept.name,
            course: courseObj.name,
            major: programName.includes('-') ? programName.split('-')[1].trim() : "N/A",
            program: programName,
            statusStep: 4, 
            status: "pending",
            nickname: fname.substring(0, 4) + "y",
            photo: `https://ui-avatars.com/api/?name=${fname}+${lname}&background=random&size=512`, 
            photo_grad: null, 
            photo_creative: null,
            details: {
              address: "Visayan Village, Tagum City",
              contactNum: "09123456789",
              personalEmail: `${fname.toLowerCase()}@gmail.com`,
              thesis: "Research on Modern Systems",
              father: `Mr. ${lname}`,
              mother: `Mrs. ${lname}`,
              guardian: "N/A",
              birthdate: "2002-05-15"
            },
            last_edited_by: null,
            last_edited_at: null
          });
          globalCounter++;
        }
      });
    });
  });

  return allStudents;
};

const MOCK_GRADUATES = generateMockData();

export function useGraduateReview(staffUser: any, selectedStudent: any, setSelectedStudent: any) {
  const [searchTerm, setSearchTerm] = useState("");
  const [graduates, setGraduates] = useState(MOCK_GRADUATES);
  const [isEditing, setIsEditing] = useState(false);
  
  // Managing the folder expansion state
  const [expandedDepts, setExpandedDepts] = useState<string[]>([]);

  // 1. Filter logic
  const filteredList = useMemo(() => {
    return graduates.filter(g => 
      g.lname.toLowerCase().includes(searchTerm.toLowerCase()) || 
      g.fname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.idNumber.includes(searchTerm) 
    );
  }, [graduates, searchTerm]);

  // 2. Grouping Logic (Folder Structure) with PENDING COUNT
  const processedData = useMemo(() => {
    const groups: Record<string, Record<string, typeof MOCK_GRADUATES>> = {};
    const deptCounts: Record<string, number> = {};
    
    // --- UPDATED LOGIC: Count how many tasks are actually left ---
    let pendingCount = 0;

    filteredList.forEach(student => {
      // If status is not verified, it counts as pending work
      if (student.status !== 'verified') {
        pendingCount++;
      }

      if (!groups[student.department]) {
        groups[student.department] = {};
        deptCounts[student.department] = 0;
      }
      if (!groups[student.department][student.program]) {
        groups[student.department][student.program] = [];
      }
      groups[student.department][student.program].push(student);
      deptCounts[student.department]++;
    });

    const sortedDepts = Object.keys(groups).sort((a, b) => {
      const indexA = DEPARTMENT_ORDER.indexOf(a);
      const indexB = DEPARTMENT_ORDER.indexOf(b);
      return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
    });

    return { 
        groups, 
        sortedDepts, 
        deptCounts, 
        totalResults: filteredList.length, 
        pendingCount // <--- Export this to UI
    };
  }, [filteredList]);

  // Auto-expand folders on search ("Viola" effect)
  useEffect(() => {
    if (searchTerm) {
        setExpandedDepts(processedData.sortedDepts); 
    } else {
        setExpandedDepts([]); 
    }
  }, [searchTerm, processedData.sortedDepts]);

  const toggleDept = (dept: string) => {
    setExpandedDepts(prev => 
      prev.includes(dept) ? prev.filter(d => d !== dept) : [...prev, dept]
    );
  };

  // --- SAVE EDIT HANDLER ---
  const handleSaveEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const timestamp = new Date().toLocaleString();

    const updates = {
        fname: (formData.get("fname") as string) || selectedStudent.fname,
        lname: (formData.get("lname") as string) || selectedStudent.lname,
        mname: (formData.get("mname") as string) || selectedStudent.mname,
        suffix: (formData.get("suffix") as string) || "", 
        nickname: (formData.get("nickname") as string) || "",
        course: (formData.get("course") as string) || selectedStudent.course,
        major: (formData.get("major") as string) || selectedStudent.major,
        details: {
            ...selectedStudent.details,
            address: (formData.get("address") as string) || selectedStudent.details.address,
            contactNum: (formData.get("contactNum") as string) || selectedStudent.details.contactNum,
            personalEmail: (formData.get("personalEmail") as string) || selectedStudent.details.personalEmail,
        },
        // Note: Editing info doesn't automatically verify them, we keep current status unless finalized
        last_edited_by: staffUser.name,
        last_edited_at: timestamp,
    };

    setGraduates(prev => prev.map(g => g.id === selectedStudent.id ? { ...g, ...updates } : g));
    setSelectedStudent((prev: any) => ({ ...prev, ...updates }));
    setIsEditing(false);
  };

  // --- PHOTO UPLOAD HANDLER ---
  const handlePhotoUpload = (type: 'grad' | 'creative', file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
       const result = reader.result as string;
       const updateKey = type === 'grad' ? 'photo_grad' : 'photo_creative';
       
       setGraduates(prev => prev.map(g => g.id === selectedStudent.id ? { ...g, [updateKey]: result } : g));
       setSelectedStudent((prev: any) => ({ ...prev, [updateKey]: result }));
    };
    reader.readAsDataURL(file);
  };

  // --- FINALIZE / VERIFY HANDLER ---
  const handleFinalize = () => {
    const timestamp = new Date().toLocaleString();
    const update = { 
        status: "verified", 
        statusStep: 5, 
        last_edited_by: staffUser.name, 
        last_edited_at: timestamp 
    };
    setGraduates(prev => prev.map(g => g.id === selectedStudent.id ? { ...g, ...update } : g));
    setSelectedStudent((prev: any) => ({ ...prev, ...update }));
  };

  return {
    searchTerm,
    setSearchTerm,
    processedData, 
    expandedDepts,
    toggleDept,
    isEditing,
    setIsEditing,
    handleSaveEdit,
    handlePhotoUpload, 
    handleFinalize
  };
}