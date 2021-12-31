import { ReadingSession } from "@prisma/client";
import {
  PostgrestResponse,
  PostgrestSingleResponse,
} from "@supabase/supabase-js";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { supabase } from "../lib/supabase";
import Button from "./Button";
import Input from "./Input";
import SelectPartner from "./SelectPartner";
import SlideOver from "./SlideOver";

type Partner = { id: string; name: string; image: string };

type CreateReadingSessionInputs = {
  name: string;
  meetingUrl: string;
  scheduledAt: string;
};

interface CreateReadingSessionProps {
  clubId: number;
}

const CreateReadingSession = ({ clubId }: CreateReadingSessionProps) => {
  const { data: session } = useSession();
  const userId = session?.user.id;

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [partner, setPartner] = useState<Partner | null>(null);
  const [members, setMembers] = useState<Partner[]>([]);

  useEffect(() => {
    async function fetchApprovedMembers() {
      const { data, error } = (await supabase
        .from("UserInClub")
        .select("User(id, name, image)")
        .filter("clubId", "eq", clubId)
        .filter("isApproved", "eq", true)) as PostgrestResponse<{
        User: {
          id: string;
          name: string;
          image: string;
        };
      }>;

      if (error) throw new Error(error.message);

      const members = data
        ?.map(({ User }) => ({
          ...User,
        }))
        ?.filter((member) => member.id !== userId);

      setMembers(members || []);
      setPartner(members?.[0] || null);
    }

    fetchApprovedMembers();
  }, [clubId, userId]);

  useEffect(() => {
    let toastId: string | undefined;
    if (isLoading) {
      toastId = toast.loading("Creating the reading session...");
    }

    return () => toast.remove(toastId);
  }, [isLoading]);

  const methods = useForm<CreateReadingSessionInputs>();
  const submitHandler: SubmitHandler<CreateReadingSessionInputs> = (data) =>
    createReadingSession(data);

  async function createReadingSession(data: CreateReadingSessionInputs) {
    setIsLoading(true);

    try {
      if (!partner)
        throw new Error(`Cannot create a reading session without a partner`);

      const { data: readingSessionData, error: createReadingSessionError } =
        (await supabase
          .from("ReadingSession")
          .insert({
            clubId,
            ...data,
          })
          .single()) as PostgrestSingleResponse<ReadingSession>;

      if (createReadingSessionError)
        throw new Error(createReadingSessionError.message);

      const readingSessionId = readingSessionData?.id;

      const { error } = await supabase.from("UserInReadingSession").insert([
        { readingSessionId, userId },
        { readingSessionId, userId: partner.id },
      ]);

      if (error) throw new Error(error.message);

      toast.success("Successfully created the reading session");
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
        Create a reading session
      </Button>

      <SlideOver
        open={open}
        setOpen={setOpen}
        methods={methods}
        submitHandler={submitHandler}
        isLoading={isLoading}
        title="New reading session"
        description="Get started by filling in the information below to create your new reading session."
      >
        <Input label="Name" name="name" />
        <Input type="url" label="Meeting URL" name="meetingUrl" />
        <Input type="datetime-local" label="Date & Time" name="scheduledAt" />
        {partner && (
          <SelectPartner
            members={members}
            partner={partner}
            setPartner={setPartner}
          />
        )}
      </SlideOver>
    </>
  );
};

export default CreateReadingSession;
