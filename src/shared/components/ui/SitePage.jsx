import { Footer, Navbar } from "../layout";

function SitePage({ mainClassName = "page-shell", children }) {
  return (
    <>
      <Navbar />
      <main className={mainClassName}>{children}</main>
      <Footer />
    </>
  );
}

export default SitePage;
