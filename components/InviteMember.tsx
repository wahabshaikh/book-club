import { PlusIcon } from "@heroicons/react/solid";
import { PostgrestResponse } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { supabase } from "../lib/supabase";
import Button from "./Button";
import Input from "./Input";
import SlideOver from "./SlideOver";

type InviteMemberInputs = {
  email: string;
};

interface InviteMemberProps {
  clubId: number;
}

const InviteMember = ({ clubId }: InviteMemberProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let toastId: string | undefined;
    if (isLoading) {
      toastId = toast.loading("Inviting the member...");
    }

    return () => toast.remove(toastId);
  }, [isLoading]);

  const methods = useForm<InviteMemberInputs>();
  const submitHandler: SubmitHandler<InviteMemberInputs> = (data) =>
    inviteMember(data);

  async function inviteMember(data: InviteMemberInputs) {
    setIsLoading(true);

    try {
      const { data: userData, error: fetchUserDataError } = (await supabase
        .from("User")
        .select("id")
        .eq("email", data.email)) as PostgrestResponse<{ id: string }>;

      if (fetchUserDataError) {
        throw new Error(fetchUserDataError.message);
      }

      const userId = userData?.[0].id;

      const { error: inviteMemberToClub } = await supabase
        .from("UserInClub")
        .insert({
          userId,
          clubId,
        });

      if (inviteMemberToClub) {
        throw new Error(inviteMemberToClub.message);
      }

      toast.success("Successfully invited the member");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Button variant="pill" onClick={() => setOpen(true)}>
        <PlusIcon className="h-4 w-4" />
      </Button>

      <SlideOver
        open={open}
        setOpen={setOpen}
        methods={methods}
        submitHandler={submitHandler}
        isLoading={isLoading}
        title="Invite member"
        description="Get started by filling in the information below to invite a member to your club."
      >
        <Input label="Email" name="email" />
      </SlideOver>
    </>
  );
};

export default InviteMember;
