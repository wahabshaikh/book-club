import { Role } from "@prisma/client";
import { PostgrestResponse } from "@supabase/supabase-js";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { supabase } from "../lib/supabase";
import Avatar from "./Avatar";
import Badge from "./Badge";
import Button from "./Button";
import InviteMember from "./InviteMember";

interface MemberListProps {
  clubId: number;
}

const MemberList = ({ clubId }: MemberListProps) => {
  const { data: session } = useSession();
  const userId = session?.user.id;

  const [members, setMembers] = useState<
    {
      id: string;
      name: string;
      email: string;
      image: string;
      role: Role;
      isApproved: boolean;
    }[]
  >([]);

  useEffect(() => {
    async function fetchMembers() {
      try {
        const { data, error } = (await supabase
          .from("UserInClub")
          .select("role, isApproved, User(id, name, email, image)")
          .filter("clubId", "eq", clubId)) as PostgrestResponse<{
          role: Role;
          isApproved: boolean;
          User: {
            id: string;
            name: string;
            email: string;
            image: string;
          };
        }>;

        if (error) throw new Error(error.message);

        const members = data?.map(({ role, isApproved, User }) => ({
          role,
          isApproved,
          ...User,
        }));

        setMembers(members || []);
      } catch (error: any) {
        console.error(error);
        toast.error(error.message);
      }
    }
    fetchMembers();

    const subscription = supabase
      .from("UserInClub")
      .on("*", () => {
        fetchMembers();
      })
      .subscribe();

    return () => {
      supabase.removeSubscription(subscription);
    };
  }, [clubId]);

  async function approveMember(memberId: string) {
    try {
      const { error } = await supabase
        .from("UserInClub")
        .update({
          role: "MEMBER",
          isApproved: true,
          joinedAt: new Date().toISOString(),
        })
        .eq("userId", memberId)
        .eq("clubId", clubId);

      if (error) throw new Error(error.message);

      toast.success("Successfully approved member");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    }
  }

  const isAdmin = !!(
    members.find((member) => member.id === userId)?.role === "ADMIN"
  );

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Members</h3>
        {isAdmin && <InviteMember clubId={clubId} />}
      </div>
      <ul role="list" className="divide-y divide-gray-200">
        {members.map(({ id, name, email, image, role, isApproved }) => (
          <li
            key={email}
            className="px-4 py-5 sm:px-6 flex justify-between items-center"
          >
            <div className="flex">
              <Avatar image={image} name={name} height={40} width={40} />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{name}</p>
                <p className="text-sm text-gray-500">{email}</p>
              </div>
            </div>
            <div className="inline-flex flex-col items-end">
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
              {isAdmin && role === "REQUESTED" && (
                <Button
                  variant="pill"
                  className="mt-1.5"
                  onClick={() => approveMember(id)}
                >
                  Approve
                </Button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MemberList;
