import { useRouter } from "next/router";
import Button from "./Button";

interface ClubCardProps {
  id: number;
  coverImageUrl: string;
  name: string;
  description: string;
}

const ClubCard = ({ id, coverImageUrl, name, description }: ClubCardProps) => {
  const router = useRouter();

  return (
    <li className="flex flex-col overflow-hidden border rounded-md shadow-sm">
      <div className="bg-white">
        <img
          src={coverImageUrl}
          alt={name}
          className="max-h-96 w-full aspect-1 object-cover"
        />
      </div>
      <div className="flex-1 flex flex-col justify-between text-center bg-brand p-4">
        <h3 className="font-serif font-bold text-xl text-accent">{name}</h3>
        <p className="px-4 text-sm xl:text-base text-gray-500 font-medium">
          {description}
        </p>
        <Button
          className="mt-4 w-full"
          onClick={() => router.push(`club/${id}`)}
        >
          View Club
        </Button>
      </div>
    </li>
  );
};

export default ClubCard;
