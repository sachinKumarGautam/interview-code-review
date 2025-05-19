import React, { useState, useEffect } from "react";
import { getUser } from "../api/userApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Assuming these exist

interface User {
  id: string;
  name: string;
  email: string;
}

const UserProfile: React.FC<{ userId: string }> = ({ userId }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const fetchedUser = await getUser(userId);
        setUser(fetchedUser);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return (
      <>
        <p>User not found.</p>
      </>
    ); // Code Quality: Inconsistent return type.  Should be a Fragment.
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{user.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Email: {user.email}</p>
      </CardContent>
    </Card>
  );
};

export default UserProfile;
