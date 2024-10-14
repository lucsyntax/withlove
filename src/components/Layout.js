import React from "react";
import Background from "./Background";
import Footer from "./Footer";
import Link from "next/link";
import Image from "next/image";
import logo from "../../public/images/logo-header.svg";

const Layout = ({ children }) => {
  return (
    <div className="relative min-h-screen">
      <Background />

      <header className="z-10 relative p-1.5 bg-black/80 text-center">
        <div className="flex flex-row aligm-center justify-center">
          <Link href="/">
            <Image src={logo} width={250} height={35} />
          </Link>
        </div>
      </header>

      <main className="z-10 relative">{children}</main>

      <Footer />
    </div>
  );
};

export default Layout;
