import { ChevronRightIcon } from "@heroicons/react/solid";
import { Role } from "@prisma/client";
import { PostgrestResponse } from "@supabase/supabase-js";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { supabase } from "../lib/supabase";
import Badge from "./Badge";

type ClubListItem = {
  id: number;
  name: string;
  role: Role;
  isApproved: boolean;
};

const ClubList = () => {
  const { data: session } = useSession();
  const userId = session?.user.id;

  const [clubs, setClubs] = useState<ClubListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchClubs() {
      try {
        setIsLoading(true);

        const { data, error } = (await supabase
          .from("UserInClub")
          .select("role, isApproved, Club(id, name)")
          .filter("userId", "eq", userId)) as PostgrestResponse<{
          Club: { id: number; name: string };
          role: Role;
          isApproved: boolean;
        }>;

        if (error) throw new Error(error.message);

        const clubs = data?.map(({ role, isApproved, Club: { id, name } }) => ({
          id,
          name,
          role,
          isApproved,
        }));

        setClubs(clubs || []);
      } catch (error: any) {
        console.error(error);
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchClubs();

    const subscription = supabase
      .from("UserInClub")
      .on("*", fetchClubs)
      .subscribe();

    return () => {
      supabase.removeSubscription(subscription);
    };
  }, [userId]);

  if (isLoading) return <p>Loading...</p>;

  if (!clubs.length) return <p>No clubs found! Create a new club.</p>;

  return (
    <div className="bg-brand shadow overflow-hidden sm:rounded-md">
      <ul role="list" className="divide-y divide-gray-200">
        {clubs.map(({ id, name, role, isApproved }) => (
          <li key={id}>
            <Link href={`/clubs/${id}`}>
              <a className="block hover:bg-gray-50">
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-800">
                      {name}
                    </h3>
                    <div className="flex-shrink-0 flex items-center">
                      <Badge
                        variant={
                          role === "ADMIN"
                            ? "primary"
                            : isApproved
                            ? "secondary"
                            : "tertiary"
                        }
                      >
                        {role}
                      </Badge>
                      <ChevronRightIcon
                        className="ml-3 h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </div>
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClubList;
