import { NextPage } from "next";
import { NextSeo } from "next-seo";

const Feedback: NextPage = () => {
  return (
    <>
      <NextSeo title="Feedback" />
      <section className="aspect-1">
        <iframe
          name="Feedback"
          src="https://docs.google.com/forms/d/e/1FAIpQLSes3vXNhl9QM7-KkjmsVtLBjFiCN8gznptpoV0Xs63WszbdoQ/viewform?embedded=true"
          height="100%"
          width="100%"
        >
          Loading...
        </iframe>
      </section>
    </>
  );
};

export default Feedback;
