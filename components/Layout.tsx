import { ReactNode } from "react";
import Container from "./Container";
import Navbar from "./Navbar";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Navbar />
      <main className="mt-4">
        <Container>{children}</Container>
      </main>
    </>
  );
};

export default Layout;
