import { Role } from "@prisma/client";
import { PostgrestResponse } from "@supabase/supabase-js";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AcceptInvitation from "../../components/AcceptInvitation";
import Button from "../../components/Button";
import CreateEvent from "../../components/CreateEvent";
import EventList from "../../components/EventList";
import MemberList from "../../components/MemberList";
import { prisma } from "../../lib/prisma";
import { supabase } from "../../lib/supabase";

interface ClubDetailsProps {
  club: string;
}

const ClubDetails: NextPage<ClubDetailsProps> = ({ club }) => {
  const { id: clubId, name } = JSON.parse(club) as { id: number; name: string };

  const { data: session } = useSession();
  const userId = session?.user.id;

  const [isApproved, setIsApproved] = useState(false);
  const [isInvited, setIsInvited] = useState(false);
  const [hasRequested, setHasRequested] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchClubData(clubId: number) {
      setIsLoading(true);

      try {
        const { data, error } = (await supabase
          .from("UserInClub")
          .select("role, isApproved")
          .eq("clubId", clubId)
          .eq("userId", userId)) as PostgrestResponse<{
          role: Role;
          isApproved: boolean;
        }>;

        if (error) throw new Error(error.message);

        if (!!data?.length) {
          const { role, isApproved } = data[0];
          setIsApproved(isApproved);
          setIsInvited(role === "MEMBER");
          setHasRequested(role === "REQUESTED");
        }
      } catch (error: any) {
        console.error(error);
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchClubData(clubId);
  }, [clubId, userId]);

  async function joinClub() {
    try {
      const { error } = await supabase
        .from("UserInClub")
        .insert({ userId, clubId, role: "REQUESTED" });

      if (error) throw new Error(error.message);

      setHasRequested(true);
      toast.success("Successfully requested to join");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    }
  }

  if (isLoading) return <p>Loading...</p>;

  return (
    <>
      <NextSeo title={name} />
      <header className="flex items-center justify-between">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
          {name}
        </h2>

        {isApproved && <CreateEvent clubId={clubId} />}

        {!isApproved && isInvited && (
          <AcceptInvitation
            clubId={clubId}
            approveUser={() => setIsApproved(true)}
          />
        )}

        {!isApproved && !isInvited && !hasRequested && (
          <Button variant="accent" onClick={() => joinClub()}>
            Join
          </Button>
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

export const getStaticPaths: GetStaticPaths = async () => {
  const clubs = await prisma.club.findMany({ select: { id: true } });

  const paths = clubs.map((club) => ({ params: { id: club.id.toString() } }));

  return { paths, fallback: "blocking" };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const clubId = parseInt(String(params?.id));

  const club = await prisma.club.findUnique({
    where: { id: clubId },
    select: { id: true, name: true },
  });

  if (!club) return { notFound: true };

  return { props: { club: JSON.stringify(club) } };
};

export default ClubDetails;
