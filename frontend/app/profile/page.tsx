"use client";

import { useEffect, useState } from "react";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get("/api/users/profile", { withCredentials: true })
      .then((res) => setUser(res.data))
      .catch(() => setError("Failed to fetch user data"));
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      {error ? <p className="text-red-500">{error}</p> : <p>{user?.email}</p>}
    </div>
  );
};

export default Profile;
