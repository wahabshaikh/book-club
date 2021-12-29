import { useSession } from "next-auth/react";
import { useState } from "react";
import toast from "react-hot-toast";
import { supabase } from "../lib/supabase";
import Button from "./Button";

interface AcceptInvitationProps {
  clubId: number;
  approveUser: () => void;
}

const AcceptInvitation = ({ clubId, approveUser }: AcceptInvitationProps) => {
  const { data: session } = useSession();
  const userId = session?.user.id;

  const [isLoading, setIsLoading] = useState(false);

  async function acceptInvitation(clubId: number, userId: string) {
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from("UserInClub")
        .update({ isApproved: true, joinedAt: new Date().toISOString() })
        .eq("clubId", clubId)
        .eq("userId", userId);

      if (error) throw new Error(error.message);

      toast.success("Successfully accepted membership");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
      approveUser();
    }
  }

  if (!userId) return null;

  return (
    <Button
      onClick={() => acceptInvitation(clubId, userId)}
      disabled={isLoading}
    >
      Accept invitation
    </Button>
  );
};

export default AcceptInvitation;
