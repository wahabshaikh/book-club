import { HeartIcon } from "@heroicons/react/solid";
import classNames from "classnames";
import type { GetStaticProps, NextPage } from "next";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import Button from "../components/Button";
import Container from "../components/Container";

const rules = [
  "The first rule of Book Club is: you do not talk about other book clubs.",
  "The second rule of Book Club is: you DO NOT talk about other book clubs!",
  "Third rule of Book Club: if someone yells “stop!”, gets bored, or zones out, the session is over.",
  "Fourth rule: only two people to a session.",
  "Fifth rule: one book at a time, fellas.",
  "Sixth rule: the sessions are for reading. No chit chat, no binge-watching, no work discussion.",
  "Seventh rule: reading sessions will go on as long as they have to.",
  "And the eighth and final rule: if this is your first time at Book Club, you have to read.",
];

const steps = [
  {
    illustration: "/assets/undraw-login.svg",
    title: "Sign In",
    description: "Sign in to the application using Google",
  },
  {
    illustration: "/assets/undraw-team.svg",
    title: "Create/Join a Club",
    description: "Create a new club or join an existing one",
  },
  {
    illustration: "/assets/undraw-online-calendar.svg",
    title: "Schedule a Session",
    description: "Schedule a reading session by adding a meeting link",
  },
  {
    illustration: "/assets/undraw-agreement.svg",
    title: "Pick a Partner",
    description: "Pick an accountability partner from the club members",
  },
  {
    illustration: "/assets/undraw-reading.svg",
    title: "Read and Discuss",
    description: "Read! And as an exercise, discuss what you have read",
  },
  {
    illustration: "/assets/undraw-time-management.svg",
    title: "Repeat",
    description:
      "Repeat the sessions regularly with same partner or club, or chose a different one",
  },
];

const Home: NextPage = () => {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <Container className="py-4">
      <header>
        <nav className="flex items-center justify-between">
          <Image height={64} width={64} src="/logo.png" alt="Book Club" />
          <Button
            variant="accent"
            onClick={() =>
              router.push(session ? "/dashboard" : "/api/auth/signin")
            }
          >
            {session ? "Dashboard" : "Sign in"}
          </Button>
        </nav>
      </header>

      <main className="mt-8 lg:mt-12">
        <section
          id="home"
          className="rounded-md bg-brand px-8 py-12 grid md:grid-cols-2"
        >
          <div className="flex flex-col justify-center space-y-4">
            <h1 className="font-serif font-bold text-3xl lg:text-4xl xl:text-5xl text-accent">
              Welcome to Book Club
            </h1>
            <p className="text-sm xl:text-base text-gray-500 font-medium">
              Book Club is an online platform to create accountability groups
              helping you reach your reading goals.
            </p>
            <div>
              <Button
                className="mt-2"
                onClick={() =>
                  router.push(session ? "/dashboard" : "/api/auth/signin")
                }
              >
                Get started
              </Button>
            </div>
          </div>
          <div className="hidden md:block relative h-64 w-auto">
            <Image
              src="/assets/undraw-reading-time.svg"
              alt=""
              layout="fill"
              objectFit="contain"
            />
          </div>
        </section>

        <section id="rules" className="mt-20">
          <h2 className="font-serif font-bold text-3xl lg:text-4xl xl:text-5xl text-center text-accent partial-underline">
            Rules of Book Club
          </h2>
          <ol className="py-12 lg:py-16 space-y-8">
            {rules.map((rule, index) => (
              <Rule key={index} number={index + 1} text={rule} />
            ))}
          </ol>
        </section>

        <section id="steps" className="mt-20">
          <h2 className="font-serif font-bold text-3xl lg:text-4xl xl:text-5xl text-center text-accent partial-underline">
            Steps to Follow
          </h2>
          <ul className="py-12 lg:py-16 grid lg:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <Step
                key={index}
                illustration={step.illustration}
                title={step.title}
                description={step.description}
              />
            ))}
          </ul>
        </section>
      </main>

      <footer>
        <p className="text-center text-gray-500 font-medium">
          Made with <HeartIcon className="h-5 w-5 inline text-red-500" /> by{" "}
          <a
            href="https://twitter.com/iwahabshaikh"
            target="_blank"
            rel="noreferrer noopener"
            className="text-accent font-semibold"
          >
            Wahab Shaikh
          </a>
        </p>
      </footer>
    </Container>
  );
};

interface RuleProps {
  number: number;
  text: string;
}

const Rule = ({ number, text }: RuleProps) => {
  return (
    <li
      className={classNames(
        "max-w-lg mx-auto rounded-full flex items-center bg-brand p-4",
        !(number % 2) && "flex-row-reverse"
      )}
    >
      <p className="flex-shrink-0 h-10 w-10 rounded-full inline-flex items-center justify-center bg-accent font-bold text-xl font-serif text-white">
        {number}
      </p>
      <p className="mx-3 text-sm xl:text-base text-gray-500 font-medium">
        {text}
      </p>
    </li>
  );
};

interface StepProps {
  illustration: string;
  title: string;
  description: string;
}

const Step = ({ illustration, title, description }: StepProps) => {
  return (
    <li className="flex flex-col bg-brand rounded-md p-4">
      <div className="relative h-24 lg:h-32 w-auto">
        <Image src={illustration} alt="" layout="fill" objectFit="contain" />
      </div>
      <div className="mt-4 text-center">
        <h3 className="font-serif font-bold text-xl text-accent">{title}</h3>
        <p className="px-4 text-sm xl:text-base text-gray-500 font-medium">
          {description}
        </p>
      </div>
    </li>
  );
};

export const getStaticProps: GetStaticProps = () => {
  return { props: { withoutLayout: true } };
};

export default Home;
