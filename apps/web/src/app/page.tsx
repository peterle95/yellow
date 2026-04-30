import Test from "../components/test"
import CardNav from "../components/CardNav"
import logo from "../../public/file.svg"
import Aurora from '../components/Aurora';

const App = () => {
  const items = [
    {
      label: "About",
      bgColor: "#1B1722",
      textColor: "#fff",
      links: [
        { label: "Company", href: "/about/company", ariaLabel: "About Company" },
        { label: "Careers", href: "/about/careers", ariaLabel: "About Careers" }
      ]
    },
    {
      label: "Projects",
      bgColor: "#2F293A",
      textColor: "#fff",
      links: [
        { label: "Featured", href: "/projects/featured", ariaLabel: "Featured Projects" },
        { label: "Case Studies", href: "/projects/case-studies", ariaLabel: "Project Case Studies" }
      ]
    },
    {
      label: "Contact",
      bgColor: "#2F293A",
      textColor: "#fff",
      links: [
        { label: "Email", href: "mailto:hello@example.com", ariaLabel: "Email us" },
        { label: "Twitter", href: "https://twitter.com/example", ariaLabel: "Twitter" },
        { label: "LinkedIn", href: "https://linkedin.com/company/example", ariaLabel: "LinkedIn" }
      ]
    }
  ];

    return (
    // 1. Added 'relative' for positioning and 'bg-black' for that premium glow
    // 2. 'overflow-hidden' prevents the aurora from causing weird scrollbars
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-zinc-950 font-sans overflow-hidden">
      
      {/* Background Layer */}
      {/* 3. 'pointer-events-none' ensures you can still click your buttons! */}
      {/* 4. '-z-10' keeps it strictly in the background */}
      <div className="absolute inset-0 pointer-events-none z-1">
        <Aurora
          colorStops={["#7cff67", "#B497CF", "#5227FF"]}
          blend={0.5}      // Reduced blend slightly for a sharper, more realistic effect
          amplitude={1.5}    // Adjusted for a more balanced height
          speed={0.2}
        />
      </div>

      {/* Content Layer */}
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-transparent sm:items-start">
        
        <CardNav
          logo={logo}
          logoAlt="Company Logo"
          items={items}
          baseColor="black" // Making the nav blend in
          menuColor="#fff"
          buttonBgColor="#c84545ff"
          buttonTextColor="#000"
          ease="power3.out"
        />
      </main>
    </div>
  )

}

export default App;
