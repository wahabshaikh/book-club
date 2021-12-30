import { ExclamationCircleIcon } from "@heroicons/react/solid";
import classNames from "classnames";
import { TextareaHTMLAttributes } from "react";
import { useFormContext } from "react-hook-form";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  name: string;
}

const Textarea = ({ label, name, ...props }: TextareaProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-500">
        {label}
      </label>
      <div className="mt-1 relative rounded-md shadow-sm">
        <textarea
          id={name}
          {...register(name, { required: `${label} is required.` })}
          className={classNames(
            "block w-full sm:text-sm rounded-md border-gray-300 focus:ring-accent focus:border-accent",
            !!errors[name] &&
              "pr-10 border-red-300 text-red-900 focus:outline-none focus:ring-red-500 focus:border-red-500",
            props.readOnly && "bg-gray-300"
          )}
          {...props}
        />
        {!!errors[name] && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ExclamationCircleIcon
              className="h-5 w-5 text-red-500"
              aria-hidden="true"
            />
          </div>
        )}
      </div>
      <p className="mt-2 text-sm text-red-600" id={`${name}Error`}>
        {errors[name]?.message}
      </p>
    </div>
  );
};

export default Textarea;
