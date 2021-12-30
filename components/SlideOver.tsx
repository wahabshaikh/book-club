import { Dispatch, Fragment, ReactNode, SetStateAction } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import Button from "./Button";
import { FormProvider, SubmitHandler, UseFormReturn } from "react-hook-form";

interface SlideOverProps {
  children: ReactNode;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  methods: UseFormReturn<any, object>;
  submitHandler: SubmitHandler<any>;
  isLoading: boolean;
  title: string;
  description: string;
}

const SlideOver = ({
  children,
  open,
  setOpen,
  methods,
  submitHandler,
  isLoading,
  title,
  description,
}: SlideOverProps) => {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 overflow-hidden"
        onClose={setOpen}
      >
        <div className="absolute inset-0 overflow-hidden">
          <Dialog.Overlay className="absolute inset-0" />

          <div className="fixed inset-y-0 pl-16 max-w-full right-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-500 sm:duration-700"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-500 sm:duration-700"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <div className="w-screen max-w-md">
                <FormProvider {...methods}>
                  <form
                    className="h-full divide-y divide-gray-200 flex flex-col bg-white shadow-xl"
                    onSubmit={methods.handleSubmit(submitHandler)}
                  >
                    <div className="flex-1 h-0 overflow-y-auto">
                      <div className="py-6 px-4 bg-brand sm:px-6">
                        <div className="flex items-center justify-between">
                          <Dialog.Title className="text-lg font-bold text-accent">
                            {title}
                          </Dialog.Title>
                          <div className="ml-3 h-7 flex items-center">
                            <button
                              type="button"
                              className="bg-brand rounded-md text-accent hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                              onClick={() => setOpen(false)}
                            >
                              <span className="sr-only">Close panel</span>
                              <XIcon className="h-6 w-6" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                        <div className="mt-1">
                          <p className="text-sm text-gray-500">{description}</p>
                        </div>
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="px-4 divide-y divide-gray-200 sm:px-6">
                          <div className="space-y-6 pt-6 pb-5">{children}</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0 px-4 py-4 flex justify-end">
                      <Button variant="white" onClick={() => setOpen(false)}>
                        Cancel
                      </Button>
                      <Button
                        variant="accent"
                        type="submit"
                        className="ml-4"
                        disabled={isLoading}
                      >
                        Save
                      </Button>
                    </div>
                  </form>
                </FormProvider>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default SlideOver;
