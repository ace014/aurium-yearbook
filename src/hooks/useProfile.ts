import { useState } from "react";

// dawaton nato ang user ug setUser as parameters gikan sa parent component
export function useProfile(user: any, setUser: any) {
  // state para makabalo ta kung nag edit ba ang user o ga view lang sa iyang profile
  const [isEditing, setIsEditing] = useState(false);

  // kani mu-trigger inig click sa 'Save Changes' sa form
  const handleSaveProfile = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    
    // I-update nato ang global state ni user apil na ang bag-ong "position" field
    setUser({
        ...user, 
        name: fd.get('name') as string, 
        email: fd.get('email') as string,
        position: fd.get('position') as string // <--- Gi-add nako ni para ma customize nila ilahang job title
    });
    
    // i-close ang edit mode human ug save para balik sa view mode
    setIsEditing(false);
  };

  // helper function para ablihan ang edit mode
  const handleOpenEdit = () => setIsEditing(true);
  
  // helper function if mu-cancel
  const handleCancelEdit = () => setIsEditing(false);

  return {
    isEditing,
    handleSaveProfile,
    handleOpenEdit,
    handleCancelEdit
  };
}