import { Club } from "@prisma/client";
import { PostgrestResponse } from "@supabase/supabase-js";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { supabase } from "../lib/supabase";
import Button from "./Button";
import Input from "./Input";
import SlideOver from "./SlideOver";
import Textarea from "./Textarea";

type CreateClubInputs = {
  name: string;
  description: string;
  coverImageUrl: string;
};

const CreateClub = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let toastId: string | undefined;
    if (isLoading) {
      toastId = toast.loading("Creating the club...");
    }

    return () => toast.remove(toastId);
  }, [isLoading]);

  const methods = useForm<CreateClubInputs>();
  const submitHandler: SubmitHandler<CreateClubInputs> = (data) =>
    createClub(data);

  async function createClub(data: CreateClubInputs) {
    setIsLoading(true);

    try {
      const { data: clubData, error: createClubError } = (await supabase
        .from("Club")
        .insert({
          ...data,
          updatedAt: new Date().toISOString(),
        })) as PostgrestResponse<Club>;

      if (createClubError) {
        throw new Error(createClubError.message);
      }

      const userId = session?.user.id;
      const clubId = clubData?.[0].id;
      const { error: createUserInClubError } = await supabase
        .from("UserInClub")
        .insert({
          userId,
          clubId,
          role: "ADMIN",
          isApproved: true,
          joinedAt: new Date().toISOString(),
        });

      if (createUserInClubError) {
        throw new Error(createUserInClubError.message);
      }

      toast.success("Successfully created the club");
      router.push(`/clubs/${clubId}`);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Button variant="accent" onClick={() => setOpen(true)}>
        Create a club
      </Button>

      <SlideOver
        open={open}
        setOpen={setOpen}
        methods={methods}
        submitHandler={submitHandler}
        isLoading={isLoading}
        title="New club"
        description="Get started by filling in the information below to create your new club."
      >
        <Input type="url" label="Cover Image URL" name="coverImageUrl" />
        <Input label="Name" name="name" />
        <Textarea label="Description" name="description" />
      </SlideOver>
    </>
  );
};

export default CreateClub;
