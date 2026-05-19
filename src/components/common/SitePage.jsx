import Footer from "../layout/Footer";
import Navbar from "../layout/Navbar";

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
