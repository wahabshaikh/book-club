import { ChevronRightIcon } from "@heroicons/react/solid";
import { Role } from "@prisma/client";
import { PostgrestResponse } from "@supabase/supabase-js";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { supabase } from "../lib/supabase";
import Badge from "./Badge";
import Button from "./Button";

interface ClubListProps {
  userId: string;
}

const ClubList = ({ userId }: ClubListProps) => {
  const [clubs, setClubs] = useState<
    { id: number; name: string; role: Role; isApproved: boolean }[]
  >([]);
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
      .on("INSERT", fetchClubs)
      .subscribe();

    return () => {
      supabase.removeSubscription(subscription);
    };
  }, [userId]);

  async function acceptInvitation(clubId: number, userId: string) {
    try {
      const { error } = await supabase
        .from("UserInClub")
        .update({ isApproved: true, joinedAt: new Date().toISOString() })
        .eq("clubId", clubId)
        .eq("userId", userId);

      if (error) throw new Error(error.message);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    }
  }

  if (isLoading) return <p>Loading...</p>;

  if (!clubs.length) return <p>No clubs found! Create a new club.</p>;

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul role="list" className="divide-y divide-gray-200">
        {clubs.map(({ id, name, role, isApproved }) => (
          <li key={id}>
            <Link href={`/clubs/${id}`}>
              <a className="block hover:bg-gray-50">
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-indigo-600 truncate">
                        {name}
                      </p>
                      <Badge
                        variant={
                          role === "ADMIN"
                            ? "primary"
                            : isApproved
                            ? "secondary"
                            : "tertiary"
                        }
                        className="mt-1.5"
                      >
                        {role}
                      </Badge>
                    </div>
                    <div className="flex-shrink-0 flex items-center">
                      {!isApproved && (
                        <Button
                          variant="pill"
                          onClick={() => acceptInvitation(id, userId)}
                        >
                          Accept
                        </Button>
                      )}
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
