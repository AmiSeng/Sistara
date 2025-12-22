import Layout from "./src/components/layout/Layout";
import Hero from "./src/components/sections/Hero";
import AboutUs from "./src/components/sections/AboutUs";
import TechStack from "./src/components/sections/TechStack";
import Contact from "./src/components/sections/Contact";

export default function Home() {
  return (
    <Layout>
      <Hero />
      <AboutUs />
      <TechStack />
      <Contact />
    </Layout>
  );
}
