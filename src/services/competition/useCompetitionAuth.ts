import { useCallback, useEffect, useState } from "react";
import { supabase } from "../../supabase";
import {
  getCurrentProfile,
  signInWithGoogle,
  signOutCompetitionUser,
  upsertUserProfile,
} from "./competition.service";
import type { CompetitionUser } from "./types";

export function useCompetitionAuth() {
  const [profile, setProfile] = useState<CompetitionUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    setIsLoading(true);
    try {
      setProfile(await getCurrentProfile());
    } catch (error) {
      console.error(error);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
    if (!supabase) return undefined;

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        setProfile(null);
        return;
      }

      upsertUserProfile(session.user)
        .then(setProfile)
        .catch((error) => {
          console.error(error);
          setProfile(null);
        });
    });

    return () => data.subscription.unsubscribe();
  }, [loadProfile]);

  return {
    profile,
    isAdmin: profile?.role === "admin",
    isLoading,
    signIn: signInWithGoogle,
    signOut: signOutCompetitionUser,
    reloadProfile: loadProfile,
  };
}
