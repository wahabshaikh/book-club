import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AcceptInvitation from "../../components/AcceptInvitation";
import CreateEvent from "../../components/CreateEvent";
import EventList from "../../components/EventList";
import MemberList from "../../components/MemberList";
import { supabase } from "../../lib/supabase";

const ClubDetails: NextPage = () => {
  const router = useRouter();
  const { id } = router.query as { id: string };
  const clubId = parseInt(id);

  const { data: session } = useSession();
  const userId = session?.user.id;

  const [name, setName] = useState("");
  const [isApproved, setIsApproved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchClubData(clubId: number) {
      setIsLoading(true);

      try {
        const { data, error } = (await supabase
          .from("UserInClub")
          .select("Club(name), isApproved")
          .eq("clubId", clubId)
          .eq("userId", userId)
          .single()) as PostgrestSingleResponse<{
          Club: { name: string };
          isApproved: boolean;
        }>;

        if (error) throw new Error(error.message);

        if (!data) throw new Error(`No data found`);

        setName(data.Club.name);
        setIsApproved(data.isApproved);
      } catch (error: any) {
        console.error(error);
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchClubData(clubId);
  }, [clubId, userId]);

  if (isLoading) return <p>Loading...</p>;

  return (
    <>
      <NextSeo title={name} />
      <header className="flex items-center justify-between">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
          {name}
        </h2>

        {isApproved ? (
          <CreateEvent clubId={clubId} />
        ) : (
          <AcceptInvitation
            clubId={clubId}
            approveUser={() => setIsApproved(true)}
          />
        )}
      </header>
      <section className="mt-8 grid lg:grid-cols-3 gap-8">
        {/* Event List */}
        <section className="lg:col-span-2">
          <EventList clubId={clubId} />
        </section>

        {/* Member List */}
        <section>
          <MemberList clubId={clubId} />
        </section>
      </section>
    </>
  );
};

export default ClubDetails;
