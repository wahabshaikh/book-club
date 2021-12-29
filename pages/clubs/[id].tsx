import { NextPage } from "next";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import CreateEvent from "../../components/CreateEvent";
import EventList from "../../components/EventList";
import MemberList from "../../components/MemberList";
import { supabase } from "../../lib/supabase";

const ClubDetails: NextPage = () => {
  const router = useRouter();
  const { id } = router.query as { id: string };
  const clubId = parseInt(id);

  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchClubData(clubId: number) {
      try {
        setIsLoading(true);

        const { data, error } = await supabase
          .from("Club")
          .select("name")
          .eq("id", clubId)
          .single();

        if (error) throw new Error(error.message);

        setName(data.name);
      } catch (error: any) {
        console.error(error);
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchClubData(clubId);
  }, [clubId]);

  if (isLoading) return <p>Loading...</p>;

  return (
    <>
      <NextSeo title={name} />
      <header className="flex items-center justify-between">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
          {name}
        </h2>
        <CreateEvent clubId={clubId} />
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
