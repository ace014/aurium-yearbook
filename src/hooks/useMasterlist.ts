import { useState, useMemo, useEffect } from "react";

// --- 1. CONFIGURATION (Kept existing config) ---
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

// --- KOI'S UPDATED STATUS MAPPING (1-5) ---
export const STATUS_STEPS = [
  { id: 1, label: "Registered", color: "bg-stone-500" },      // Student signed up, waiting for mod
  { id: 2, label: "Approved", color: "bg-blue-500" },        // Mod verified, student can log in
  { id: 3, label: "Booked", color: "bg-orange-500" },        // Pictorial schedule set
  { id: 4, label: "Attended", color: "bg-purple-500" },      // Pictorial done
  { id: 5, label: "Fully Verified", color: "bg-green-600" }, // Final data check done (Masterlist ready)
];

export const DEPARTMENT_ORDER = ACADEMIC_CONFIG.map(d => d.name);

// --- DATA GENERATOR ---
const generateMockData = () => {
  const firstNames = ["James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda", "William", "Elizabeth", "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica", "Thomas", "Sarah", "Charles", "Karen"];
  const middleNames = ["Santos", "Reyes", "Cruz", "Bautista", "Ocampo", "Garcia", "Mendoza", "Torres", "Aquino", "Flores", "Castillo", "Villanueva", "Ramos", "Vargas"];
  const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark"];
  const suffixes = ["", "", "", "", "Jr.", "III", "IV"]; 

  let allStudents: any[] = [];
  let globalCounter = 1;

  ACADEMIC_CONFIG.forEach(dept => {
    dept.courses.forEach(courseObj => {
      let programsToGenerate = courseObj.majors.length > 0 
        ? courseObj.majors.map(major => `${courseObj.name} - ${major}`) 
        : [courseObj.name];

      programsToGenerate.forEach(programName => {
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
            
            // --- UPDATED LOGIC: Randomize between 1 (Registered) and 5 (Fully Verified) ---
            statusStep: Math.floor(Math.random() * 5) + 1, 
            
            nickname: fname.substring(0, 4) + "y",
            photo: `https://ui-avatars.com/api/?name=${fname}+${lname}&background=random&size=512`,
            
            // --- NEW FIELDS: For the photos uploaded in the verification step ---
            photo_grad: null, 
            photo_creative: null,

            details: {
              address: "Visayan Village, Tagum City",
              contact: "09123456789",
              email: `${fname.toLowerCase()}@umindanao.edu.ph`,
              personalEmail: `${fname.toLowerCase()}@gmail.com`,
              thesis: "Research on Modern Practices",
              father: `Mr. ${lname}`,
              mother: `Mrs. ${lname}`,
              guardian: "N/A",
              // --- FIX: ADDED MISSING BIRTHDATE FOR UI MATCH ---
              birthdate: "May 15, 2002" 
            }
          });
          globalCounter++;
        }
      });
    });
  });

  return allStudents;
};

const MOCK_MASTER_LIST = generateMockData();

export function useMasterlist() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  
  // Filters
  const [activeDeptFilter, setActiveDeptFilter] = useState<string>("ALL");
  const [activeStatusFilter, setActiveStatusFilter] = useState<string>("ALL"); // New Filter for Steps 1-5
  
  const [expandedDepts, setExpandedDepts] = useState<string[]>([]);

  // Filtering Logic
  const processedData = useMemo(() => {
    const filtered = MOCK_MASTER_LIST.filter(s => {
      // 1. Name/ID Search
      const matchesSearch = 
        s.lname.toLowerCase().includes(searchQuery.toLowerCase()) || 
        s.fname.toLowerCase().includes(searchQuery.toLowerCase()) || 
        s.idNumber.includes(searchQuery);

      // 2. Department Filter
      const matchesDept = activeDeptFilter === "ALL" || s.department === activeDeptFilter;

      // 3. Status Filter (New Logic based on Koi's 1-5 steps)
      const matchesStatus = activeStatusFilter === "ALL" || s.statusStep === parseInt(activeStatusFilter);

      return matchesSearch && matchesDept && matchesStatus;
    });

    // Grouping Logic (Department -> Program)
    const groups: Record<string, Record<string, typeof MOCK_MASTER_LIST>> = {};
    const deptCounts: Record<string, number> = {};

    filtered.forEach(student => {
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

    return { groups, sortedDepts, deptCounts, totalResults: filtered.length };
  }, [searchQuery, activeDeptFilter, activeStatusFilter]);

  // Auto-expand on search
  useEffect(() => {
    if (searchQuery) {
        setExpandedDepts(processedData.sortedDepts); 
    } else {
        setExpandedDepts([]); 
    }
  }, [searchQuery, processedData.sortedDepts]);

  const toggleDept = (dept: string) => {
    setExpandedDepts(prev => 
      prev.includes(dept) ? prev.filter(d => d !== dept) : [...prev, dept]
    );
  };

  return {
    searchQuery,
    setSearchQuery,
    selectedStudent,
    setSelectedStudent,
    activeDeptFilter,
    setActiveDeptFilter,
    activeStatusFilter,     // Exporting this for the UI
    setActiveStatusFilter,  // Exporting this for the UI
    expandedDepts,
    toggleDept,
    processedData,
    DEPARTMENT_ORDER,
    STATUS_STEPS
  };
}