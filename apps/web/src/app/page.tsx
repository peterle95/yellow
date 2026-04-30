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
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <Aurora
        colorStops={["#7cff67", "#B497CF", "#5227FF"]}
        blend={1}
        amplitude={2.5}
        speed={0.2}
      /> 
      <div className="">
        <CardNav
            logo={logo}
            logoAlt="Company Logo"
            items={items}
            baseColor="#fff"
            menuColor="#000"
            buttonBgColor="#111"
            buttonTextColor="#fff"
            ease="power3.out"
        />
      </div>
    </div>
  )
}

export default App;
