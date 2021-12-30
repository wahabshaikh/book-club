import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import { DefaultSeo } from "next-seo";
import Layout from "../components/Layout";
import NextNProgress from "nextjs-progressbar";

function CustomApp({
  Component,
  pageProps: { session, withoutLayout, ...pageProps },
}: AppProps) {
  return (
    <>
      <DefaultSeo
        defaultTitle="Book Club"
        titleTemplate="%s | Book Club"
        description="Book Club is an online platform to create accountability groups helping you reach your reading goals."
        canonical="https://www.bookclub.rocks/"
        openGraph={{
          url: "https://www.bookclub.rocks/",
          title: "Book Club",
          description:
            "Book Club is an online platform to create accountability groups helping you reach your reading goals.",
          images: [{ url: "https://www.bookclub.rocks/logo.png" }],
        }}
        twitter={{
          // Update later
          site: "@wahabshaikh_",
          cardType: "summary_large_image",
        }}
        additionalLinkTags={[
          {
            rel: "apple-touch-icon",
            sizes: "180x180",
            href: "/apple-touch-icon.png",
          },
          {
            rel: "icon",
            type: "image/png",
            sizes: "32x32",
            href: "/favicon-32x32.png",
          },
          {
            rel: "icon",
            type: "image/png",
            sizes: "16x16",
            href: "/favicon-16x16.png",
          },
          {
            rel: "manifest",
            href: "/site.webmanifest",
          },
          {
            rel: "mask-icon",
            href: "/safari-pinned-tab.svg",
            color: "#5bbad5",
          },
        ]}
        additionalMetaTags={[
          { name: "msapplication-TileColor", content: "#da532c" },
          { name: "theme-color", content: "#ffffff" },
        ]}
      />
      <SessionProvider session={session}>
        {withoutLayout ? (
          <Component {...pageProps} />
        ) : (
          <Layout>
            <NextNProgress color="#4F46E5" />
            <Component {...pageProps} />
          </Layout>
        )}
        <Toaster />
      </SessionProvider>
    </>
  );
}

export default CustomApp;
