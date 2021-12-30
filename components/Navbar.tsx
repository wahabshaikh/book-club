import { Fragment, useEffect, useState } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { BellIcon, MenuIcon, XIcon } from "@heroicons/react/outline";
import Container from "./Container";
import classNames from "classnames";
import Image from "next/image";
import Link from "next/link";
import Avatar from "./Avatar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const navLinks = [
  { title: "Dashboard", href: "/dashboard" },
  { title: "Clubs", href: "/clubs" },
  { title: "Feedback", href: "/feedback" },
];

const menuItems = [
  { title: "Your Profile", href: "/profile" },
  { title: "Sign out", href: "/api/auth/signout" },
];

const Navbar = () => {
  const { data: session } = useSession({ required: true });
  const router = useRouter();

  const [current, setCurrent] = useState(router.pathname);

  useEffect(() => {
    setCurrent(router.pathname);
  }, [router.pathname]);

  if (!session?.user) return null;

  const email = session?.user.email;
  const name = session?.user.name;
  const image = session?.user.image;

  return (
    <Disclosure as="nav" className="bg-white shadow">
      {({ open }) => (
        <>
          <Container>
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <Image
                    src="/logo.png"
                    alt="Book Club"
                    height={64}
                    width={64}
                  />
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  {navLinks.map(({ title, href }) => (
                    <Link key={title} href={href}>
                      <a
                        className={classNames(
                          "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium",
                          current === href
                            ? "border-indigo-500 text-gray-900"
                            : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                        )}
                      >
                        {title}
                      </a>
                    </Link>
                  ))}
                </div>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                <button
                  type="button"
                  className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button>

                {/* Profile dropdown */}
                <Menu as="div" className="ml-3 relative">
                  <div>
                    <Menu.Button className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      <span className="sr-only">Open user menu</span>
                      <Avatar
                        image={image}
                        name={name}
                        height={32}
                        width={32}
                      />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                      {menuItems.map(({ title, href }) => (
                        <Menu.Item key={title} as={Link} href={href}>
                          <a
                            className={classNames(
                              "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            )}
                          >
                            {title}
                          </a>
                        </Menu.Item>
                      ))}
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
              <div className="-mr-2 flex items-center sm:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </Container>

          <Disclosure.Panel className="sm:hidden">
            <div className="pt-2 pb-3 space-y-1">
              {navLinks.map(({ title, href }) => (
                <Disclosure.Button key={title} as={Link} href={href}>
                  <a
                    className={classNames(
                      "block pl-3 pr-4 py-2 border-l-4 text-base font-medium",
                      current === href
                        ? "bg-indigo-50 border-indigo-500 text-indigo-700"
                        : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                    )}
                  >
                    {title}
                  </a>
                </Disclosure.Button>
              ))}
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <Avatar name={name} image={image} height={40} width={40} />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">
                    {name}
                  </div>
                  <div className="text-sm font-medium text-gray-500">
                    {email}
                  </div>
                </div>
                <button
                  type="button"
                  className="ml-auto flex-shrink-0 bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-3 space-y-1">
                {menuItems.map(({ title, href }) => (
                  <Disclosure.Button as={Link} href={href} key={title}>
                    <a className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 active:text-gray-800 active:bg-gray-100">
                      {title}
                    </a>
                  </Disclosure.Button>
                ))}
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Navbar;
