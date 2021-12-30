import { Club } from "@prisma/client";
import { PostgrestResponse } from "@supabase/supabase-js";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ClubCard from "../../components/ClubCard";
import { supabase } from "../../lib/supabase";

const Clubs: NextPage = () => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchClubs() {
      setIsLoading(true);

      try {
        const { data: clubs, error } = (await supabase
          .from("Club")
          .select(
            "id, coverImageUrl, name, description"
          )) as PostgrestResponse<Club>;

        if (error) throw new Error(error.message);

        setClubs(clubs || []);
      } catch (error: any) {
        console.error(error);
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchClubs();
  }, []);

  if (isLoading) return <p>Loading...</p>;

  return (
    <>
      <header className="flex items-center justify-between">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
          Clubs
        </h2>
      </header>
      <ul className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-8">
        {clubs.map((club) => (
          <ClubCard
            key={club.id}
            id={club.id}
            name={club.name}
            description={club.description}
            coverImageUrl={club.coverImageUrl}
          />
        ))}
      </ul>
    </>
  );
};

export default Clubs;
