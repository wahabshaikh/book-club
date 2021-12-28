import { NextPage } from "next";
import { useSession } from "next-auth/react";
import ClubList from "../components/ClubList";
import CreateClub from "../components/CreateClub";

const Dashboard: NextPage = () => {
  const { data: session } = useSession();
  const userId = session?.user.id;

  return (
    <>
      <header className="flex items-center justify-between">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
          Dashboard
        </h2>
        <CreateClub />
      </header>
      <main className="mt-8">{userId && <ClubList userId={userId} />}</main>
    </>
  );
};

export default Dashboard;
