import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import MemberList from "../../components/MemberList";
import { supabase } from "../../lib/supabase";

const ClubDetails: NextPage = () => {
  const router = useRouter();
  const { id } = router.query as { id: string };
  const clubId = parseInt(id);

  const [name, setName] = useState("");

  useEffect(() => {
    async function fetchClubData(clubId: number) {
      try {
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
      }
    }

    fetchClubData(clubId);
  }, [clubId]);

  return (
    <>
      <NextSeo title={name} />
      <header className="flex items-center justify-between">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
          {name}
        </h2>
      </header>
      <section className="mt-8 grid lg:grid-cols-3 gap-8">
        {/* Event List */}
        <section className="lg:col-span-2">Event List</section>

        {/* Member List */}
        <MemberList clubId={clubId} />
      </section>
    </>
  );
};

export default ClubDetails;
