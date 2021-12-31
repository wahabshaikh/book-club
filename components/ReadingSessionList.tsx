import { CalendarIcon, ChevronRightIcon } from "@heroicons/react/solid";
import { ReadingSession } from "@prisma/client";
import { PostgrestResponse } from "@supabase/supabase-js";
import format from "date-fns/format";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { supabase } from "../lib/supabase";

interface ReadingSessionListProps {
  clubId: number;
}

const ReadingSessionList = ({ clubId }: ReadingSessionListProps) => {
  const [readingSessions, setReadingSessions] = useState<ReadingSession[]>([]);

  useEffect(() => {
    async function fetchReadingSessions() {
      try {
        const { data: readingSessions, error } = (await supabase
          .from("ReadingSession")
          .select("*")
          .filter("clubId", "eq", clubId)) as PostgrestResponse<ReadingSession>;

        if (error) throw new Error(error.message);

        setReadingSessions(readingSessions || []);
      } catch (error: any) {
        console.error(error);
        toast.error(error.message);
      }
    }

    fetchReadingSessions();

    const subscription = supabase
      .from("UserInClub")
      .on("*", () => {
        fetchReadingSessions();
      })
      .subscribe();

    return () => {
      supabase.removeSubscription(subscription);
    };
  }, [clubId]);

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Reading Sessions
        </h3>
      </div>
      <ul role="list" className="divide-y divide-gray-200">
        {readingSessions.map(({ id, name, meetingUrl, scheduledAt }) => (
          <li key={id}>
            <a
              href={meetingUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="block hover:bg-gray-50"
            >
              <div className="px-4 py-4 flex items-center sm:px-6">
                <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                  <div className="truncate">
                    <div className="flex text-sm">
                      <p className="font-medium text-indigo-600 truncate">
                        {name}
                      </p>
                    </div>
                    <div className="mt-2 flex">
                      <div className="flex items-center text-sm text-gray-500">
                        <CalendarIcon
                          className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                        <p>
                          Scheduled on{" "}
                          <time dateTime={new Date(scheduledAt).toISOString()}>
                            {format(
                              new Date(scheduledAt),
                              "E, MMM d, yyyy 'at' hh:mm a"
                            )}
                          </time>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="ml-5 flex-shrink-0">
                  <ChevronRightIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReadingSessionList;
