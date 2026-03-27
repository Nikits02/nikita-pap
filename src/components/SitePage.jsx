import Footer from "./Footer";
import Navbar from "./Navbar";

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
