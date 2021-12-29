import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { supabase } from "../lib/supabase";
import Button from "./Button";
import Input from "./Input";
import SlideOver from "./SlideOver";

type CreateEventInputs = {
  name: string;
  meetingUrl: string;
  scheduledAt: string;
  duration: number;
};

interface CreateEventProps {
  clubId: number;
}

const CreateEvent = ({ clubId }: CreateEventProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let toastId: string | undefined;
    if (isLoading) {
      toastId = toast.loading("Creating the event...");
    }

    return () => toast.remove(toastId);
  }, [isLoading]);

  const methods = useForm<CreateEventInputs>();
  const submitHandler: SubmitHandler<CreateEventInputs> = (data) =>
    createEvent(data);

  async function createEvent(data: CreateEventInputs) {
    setIsLoading(true);

    try {
      const { error } = await supabase.from("Event").insert({
        clubId,
        ...data,
      });

      if (error) throw new Error(error.message);

      toast.success("Successfully created the event");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>Create an event</Button>

      <SlideOver
        open={open}
        setOpen={setOpen}
        methods={methods}
        submitHandler={submitHandler}
        isLoading={isLoading}
        title="New event"
        description="Get started by filling in the information below to create your new event."
      >
        <Input label="Name" name="name" />
        <Input type="url" label="Meeting URL" name="meetingUrl" />
        <Input type="datetime-local" label="Date & Time" name="scheduledAt" />
        <Input type="number" label="Duration (in minutes)" name="duration" />
      </SlideOver>
    </>
  );
};

export default CreateEvent;
