import { NextPage } from "next";
import ClubList from "../components/ClubList";
import CreateClub from "../components/CreateClub";

const Dashboard: NextPage = () => {
  return (
    <>
      <header className="flex items-center justify-between">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
          Dashboard
        </h2>
        <CreateClub />
      </header>
      <section className="mt-8">
        <ClubList />
      </section>
    </>
  );
};

export default Dashboard;
