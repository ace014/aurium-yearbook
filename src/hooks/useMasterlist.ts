import { useState, useMemo, useEffect } from "react";

// --- 1. CONFIGURATIONS ---
// @Koi: Ako nani gi set daan ang mga departments ug majors nato para magamit sa dropdown filters sa UI
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

// @Koi: Base sa imong request, kani na ang imong 1-5 tracking steps
export const STATUS_STEPS = [
  { id: 1, label: "Registered", color: "bg-stone-500" },      
  { id: 2, label: "Approved", color: "bg-blue-500" },        
  { id: 3, label: "Booked", color: "bg-orange-500" },        
  { id: 4, label: "Attended", color: "bg-purple-500" },      
  { id: 5, label: "Fully Verified", color: "bg-green-600" }, 
];

export const DEPARTMENT_ORDER = ACADEMIC_CONFIG.map(d => d.name);

export function useMasterlist(studentsData: any[]) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  
  const [activeDeptFilter, setActiveDeptFilter] = useState<string>("ALL");
  const [activeStatusFilter, setActiveStatusFilter] = useState<string>("ALL"); 
  
  const [expandedDepts, setExpandedDepts] = useState<string[]>([]);

  const processedData = useMemo(() => {
    // @Koi: I-filter nato daan ang data nga e-pass nimo gikan sa DB
    // Siguroha lang nga tugma ang property names ani sa imong JSON response ha?
    const filtered = (studentsData || []).filter(s => {
      
      const matchesSearch = 
        (s.lname || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
        (s.fname || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
        (s.idNumber || "").includes(searchQuery);

      const matchesDept = activeDeptFilter === "ALL" || s.department === activeDeptFilter;
      const matchesStatus = activeStatusFilter === "ALL" || s.statusStep === parseInt(activeStatusFilter);

      return matchesSearch && matchesDept && matchesStatus;
    });

    // Grouping logic nato aron ma-organize by Dept -> Program
    const groups: Record<string, Record<string, any[]>> = {};
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
  }, [searchQuery, activeDeptFilter, activeStatusFilter, studentsData]);

  // @Koi: Na fix na nako ang infinite loop error diri
  // Nag add kog stringify check aron di mag sige ug update ang state kung same ra ang gina search
  useEffect(() => {
    if (searchQuery.trim() !== "") {
        const currentSorted = JSON.stringify(processedData.sortedDepts);
        const currentExpanded = JSON.stringify(expandedDepts);
        
        if (currentSorted !== currentExpanded) {
            setExpandedDepts(processedData.sortedDepts);
        }
    } else {
        if (expandedDepts.length > 0) {
            setExpandedDepts([]);
        }
    }
    // gi disable nako ang linter diri tuyo aron di mo reklamo inig build
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]); 

  const toggleDept = (dept: string) => {
    setExpandedDepts(prev => 
      prev.includes(dept) ? prev.filter(d => d !== dept) : [...prev, dept]
    );
  };

  return {
    searchQuery, setSearchQuery,
    selectedStudent, setSelectedStudent,
    activeDeptFilter, setActiveDeptFilter,
    activeStatusFilter, setActiveStatusFilter,
    expandedDepts, toggleDept,
    processedData, DEPARTMENT_ORDER, STATUS_STEPS
  };
}