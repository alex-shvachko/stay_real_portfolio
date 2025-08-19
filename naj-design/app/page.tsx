"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import GalaxyCanvas from "@/components/galaxy-canvas"
import MouseSpotlight from "@/components/mouse-spotlight"
import ContactModal from "@/components/contact-modal"

export default function Home() {
  const aboutRef = useRef<HTMLDivElement>(null)
  const [activeSection, setActiveSection] = useState("home")
  const [activeProject, setActiveProject] = useState<string | null>(null)
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const windowHeight = window.innerHeight

      if (scrollPosition < windowHeight * 0.5) {
        setActiveSection("home")
      } else if (scrollPosition < windowHeight * 1.5) {
        setActiveSection("about")
      } else if (scrollPosition < windowHeight * 2.5) {
        setActiveSection("projects")
      } else {
        setActiveSection("services")
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId)
    if (section) {
      window.scrollTo({
        top: section.offsetTop,
        behavior: "smooth",
      })
    }
  }

  const handleProjectHover = (projectType: string | null) => {
    setActiveProject(projectType)
  }

  const handleContactClick = () => {
    setIsContactModalOpen(true)
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <MouseSpotlight />
      <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />

      <nav className="fixed top-0 left-0 w-full bg-black/50 z-50 backdrop-blur-sm shadow-md flex justify-between items-center p-4 md:p-5">
        <div className="flex items-center">
          <Image
            src="/images/naj-logo-outline.png"
            alt="NAJ Design Logo"
            width={50}
            height={30}
            className="mr-4 rounded-3xl"
          />
        </div>
        <div className="flex flex-col md:flex-row gap-2 md:gap-10">
          <Link
            href="#home"
            onClick={(e) => {
              e.preventDefault()
              scrollToSection("home")
            }}
            className={`px-5 py-2 rounded-lg transition-all uppercase tracking-wider text-sm md:text-base ${
              activeSection === "home" ? "bg-white/10 transform -translate-y-0.5" : "hover:bg-white/5"
            }`}
          >
            Accueil
          </Link>
          <Link
            href="#about"
            onClick={(e) => {
              e.preventDefault()
              scrollToSection("about")
            }}
            className={`px-5 py-2 rounded-lg transition-all uppercase tracking-wider text-sm md:text-base ${
              activeSection === "about" ? "bg-white/10 transform -translate-y-0.5" : "hover:bg-white/5"
            }`}
          >
            About Me
          </Link>
          <Link
            href="#projects"
            onClick={(e) => {
              e.preventDefault()
              scrollToSection("projects")
            }}
            className={`px-5 py-2 rounded-lg transition-all uppercase tracking-wider text-sm md:text-base ${
              activeSection === "projects" ? "bg-white/10 transform -translate-y-0.5" : "hover:bg-white/5"
            }`}
          >
            Projets
          </Link>
          <Link
            href="#services"
            onClick={(e) => {
              e.preventDefault()
              scrollToSection("services")
            }}
            className={`px-5 py-2 rounded-lg transition-all uppercase tracking-wider text-sm md:text-base ${
              activeSection === "services" ? "bg-white/10 transform -translate-y-0.5" : "hover:bg-white/5"
            }`}
          >
            Services
          </Link>
          <button
            onClick={handleContactClick}
            className="px-5 py-2 rounded-lg transition-all duration-300 uppercase tracking-wider text-sm md:text-base bg-white text-black hover:bg-gray-200 hover:transform hover:-translate-y-0.5 hover:scale-105 active:scale-95"
          >
            Contact Me
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative h-screen flex items-center justify-center">
        <GalaxyCanvas id="homeCanvas" withConstellations={true} />
        <div className="relative z-10 text-center flex flex-col items-center">
          <div className="mb-6">
            <Image
              src="/images/naj-logo-solid.png"
              alt="NAJ Design Logo"
              width={150}
              height={90}
              className="animate-pulse rounded-3xl"
              style={{ animationDuration: "3s" }}
            />
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-medium font-poppins animate-title">NAJ DESIGN</h1>
        </div>
        <button
          onClick={() => scrollToSection("about")}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 w-10 h-10 border-r-2 border-b-2 border-white rotate-45 animate-bounce opacity-80 hover:opacity-100 transition-opacity"
          aria-label="Scroll down"
        />
      </section>

      {/* About Me Section */}
      <section id="about" ref={aboutRef} className="relative h-screen flex items-center justify-center p-4">
        <GalaxyCanvas id="aboutCanvas" withConstellations={true} />
        <div className="relative z-10 max-w-4xl text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-8 text-white font-poppins animate-title">About Me</h2>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6 text-left">
              <div className="bg-black/40 backdrop-blur-sm p-6 rounded-xl border border-white/10 shadow-glow">
                <h3 className="text-xl font-bold mb-3 text-gray-200 font-poppins">Creative Vision</h3>
                <p className="text-gray-100 font-open-sans">
                  Passionate graphic designer specializing in logo creation and brand identity. I transform abstract
                  ideas into concrete, memorable visual symbols that tell your brand's unique story.
                </p>
              </div>

              <div className="bg-black/40 backdrop-blur-sm p-6 rounded-xl border border-white/10 shadow-glow">
                <h3 className="text-xl font-bold mb-3 text-gray-200 font-poppins">Design Philosophy</h3>
                <p className="text-gray-100 font-open-sans">
                  Every logo is more than just an image—it's the heart of your brand. I believe in creating timeless
                  designs that communicate your values and attract your target audience.
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center space-y-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-gray-300/20 rounded-full blur-xl"></div>
                <Image
                  src="/images/naj-logo-solid.png"
                  alt="NAJ Design Logo"
                  width={200}
                  height={120}
                  className="relative z-10 animate-pulse rounded-3xl"
                  style={{ animationDuration: "4s" }}
                />
              </div>

              <div className="bg-black/40 backdrop-blur-sm p-6 rounded-xl border border-white/10 shadow-glow">
                <h3 className="text-xl font-bold mb-3 text-gray-200 font-poppins">My Approach</h3>
                <p className="text-gray-100 font-open-sans text-center">
                  Listening to your needs, understanding your vision, and collaborating to bring your brand to life with
                  impactful, aesthetic designs that make a lasting impression.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="relative h-screen">
        <GalaxyCanvas id="projectsCanvas" />

        <div className="relative z-10 h-full flex flex-col md:flex-row">
          <ProjectHalf
            title="Projet : Enso"
            description="Création d'un logo fluide et équilibré, inspiré par le cercle zen. Il évoque l'harmonie et la croissance, avec un design minimaliste et des lignes épurées."
            imagePath="/images/enso-logo.png"
            imageAlt="Logo Enso - Illustration minimaliste d'un chat zen avec typographie"
            projectType="enso"
            activeProject={activeProject}
            onHover={handleProjectHover}
          />
          <ProjectHalf
            title="Projet : STREETEUX"
            description="Création d'un logo typographique audacieux avec des formes géométriques modernes. Un design urbain et contemporain qui capture l'esprit street avec une esthétique raffinée."
            imagePath="/images/streeteux-logo.png"
            imageAlt="Logo STREETEUX - Design typographique moderne en rouge"
            projectType="creative"
            activeProject={activeProject}
            onHover={handleProjectHover}
          />
          <ProjectHalf
            title="Projet : BoostUp"
            description="Conception d'un logo dynamique et énergique, symbolisant l'ascension et le progrès. Des formes audacieuses et une typographie forte pour la confiance."
            imagePath="/images/boostup-logo.png"
            imageAlt="Logo BoostUp - Design moderne avec cube 3D et typographie sur fond bleu"
            projectType="boostup"
            activeProject={activeProject}
            onHover={handleProjectHover}
          />
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="relative h-screen flex items-center justify-center p-4">
        <GalaxyCanvas id="servicesCanvas" />
        <div className="relative z-10 max-w-3xl bg-black/70 p-8 md:p-10 rounded-xl shadow-glow text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-200 font-poppins">
            Mes Services en Design Graphique
          </h2>

          <div className="mb-8 py-6 border-y border-white/20">
            <div className="flex flex-col items-center justify-center">
              <p className="text-2xl md:text-3xl font-bold text-white mb-2">1 LOGO = 600 EURO</p>
              <div className="w-16 h-1 bg-white/50 my-2"></div>
              <p className="text-lg text-gray-300">Design professionnel et unique</p>
            </div>
          </div>

          <div className="space-y-4 text-gray-100 font-open-sans">
            <p>
              En tant que designer graphique passionné, je transforme vos idées en{" "}
              <strong>identités visuelles percutantes</strong>. Mon expertise se concentre sur la{" "}
              <strong>création de logos uniques et mémorables</strong> qui racontent l&apos;histoire de votre marque.
            </p>
            <p>
              Que vous soyez une startup, une PME ou une grande entreprise, je vous accompagne dans la conception de
              votre logo, en veillant à ce qu&apos;il reflète vos valeurs et attire votre public cible. Chaque logo est
              une œuvre d&apos;art, pensée pour être <strong>intemporelle et efficace</strong>.
            </p>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/5 backdrop-blur-sm p-4 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-300">
                <h3 className="font-bold text-lg mb-2">Inclus</h3>
                <ul className="text-sm text-left list-disc pl-5 space-y-1">
                  <li>Recherche et concept</li>
                  <li>3 propositions</li>
                  <li>Fichiers source</li>
                  <li>Révisions illimitées</li>
                </ul>
              </div>

              <div className="bg-white/5 backdrop-blur-sm p-4 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-300">
                <h3 className="font-bold text-lg mb-2">Délai</h3>
                <p className="text-sm">Livraison en 7 jours ouvrables après validation du brief</p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm p-4 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-300">
                <h3 className="font-bold text-lg mb-2">Format</h3>
                <p className="text-sm">Fichiers vectoriels (AI, EPS, SVG, PDF) et PNG haute résolution</p>
              </div>
            </div>

            <button
              onClick={handleContactClick}
              className="mt-8 px-8 py-3 bg-white text-black rounded-lg font-bold hover:bg-gray-200 transition-all duration-300 hover:scale-105 transform"
            >
              Demander un devis
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-black/80 py-8 px-4 text-center">
        <div className="container mx-auto flex flex-col items-center">
          <Image
            src="/images/naj-logo-solid.png"
            alt="NAJ Design Logo"
            width={60}
            height={36}
            className="mb-4 rounded-3xl"
          />
          <p className="text-white/70 text-sm">© {new Date().getFullYear()} NAJ DESIGN. Tous droits réservés.</p>
          <div className="mt-4 flex space-x-4">
            <a href="#" className="text-white/70 hover:text-white transition-colors">
              Instagram
            </a>
            <a href="#" className="text-white/70 hover:text-white transition-colors">
              Behance
            </a>
            <a href="#" className="text-white/70 hover:text-white transition-colors">
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </main>
  )
}

interface ProjectHalfProps {
  title: string
  description: string
  imagePath: string
  imageAlt: string
  projectType: "enso" | "creative" | "boostup"
  activeProject: string | null
  onHover: (projectType: string | null) => void
}

function ProjectHalf({
  title,
  description,
  imagePath,
  imageAlt,
  projectType,
  activeProject,
  onHover,
}: ProjectHalfProps) {
  const isExpanded = activeProject === projectType
  const isAnyProjectActive = activeProject !== null
  const isThisProjectActive = isAnyProjectActive && isExpanded

  return (
    <div
      className={`w-full md:w-1/3 h-full bg-black/60 flex items-center justify-center transition-all duration-700 relative overflow-hidden ${
        isExpanded ? "fixed inset-0 z-50 md:w-full" : ""
      }`}
      onMouseEnter={() => onHover(projectType)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Special handling for Enso project with enlarging animation */}
      {projectType === "enso" && (
        <div
          className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ease-out ${isExpanded ? "scale-150" : "scale-90 opacity-90"}`}
        >
          <div className="relative w-full h-full max-w-lg max-h-lg">
            <Image
              src={imagePath || "/placeholder.svg"}
              alt={imageAlt}
              fill
              className="object-contain rounded-3xl"
              priority
            />
          </div>
          {isExpanded && <div className="absolute inset-0 bg-black/40 rounded-2xl" />}
        </div>
      )}

      {/* Special handling for BoostUp project with enlarging animation */}
      {projectType === "boostup" && (
        <div
          className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ease-out ${isExpanded ? "scale-150" : "scale-90 opacity-90"}`}
        >
          <div className="relative w-full h-full max-w-lg max-h-lg">
            <Image
              src={imagePath || "/placeholder.svg"}
              alt={imageAlt}
              fill
              className="object-contain rounded-3xl"
              priority
              style={{
                objectFit: "contain",
                maxWidth: "100%",
                maxHeight: "100%",
              }}
            />
          </div>
          {isExpanded && <div className="absolute inset-0 bg-black/30 rounded-2xl" />}
        </div>
      )}

      {/* Text content - only visible on hover */}
      <div
        className={`p-6 md:p-8 max-w-md text-center relative z-10 transition-all duration-700 ${
          isThisProjectActive ? "opacity-100 transform translate-y-8" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Enhanced text container for better legibility when expanded */}
        <div className="bg-black/80 backdrop-blur-sm p-6 rounded-xl border border-white/20 shadow-2xl">
          <h3 className="text-2xl md:text-3xl font-bold mb-4 font-poppins text-white text-shadow-lg">{title}</h3>
          <p className="mb-6 font-open-sans text-gray-100 text-shadow-md">{description}</p>
        </div>
      </div>

      {/* Special handling for STREETEUX project with larger default size */}
      {projectType === "creative" && (
        <div
          className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ease-out ${
            isExpanded ? "scale-150" : "scale-100 opacity-90"
          }`}
        >
          <div className="relative w-full h-full max-w-lg max-h-lg">
            <Image
              src={imagePath || "/placeholder.svg"}
              alt={imageAlt}
              fill
              className="object-contain rounded-3xl"
              priority
              style={{
                objectFit: "contain",
                maxWidth: "100%",
                maxHeight: "100%",
              }}
            />
          </div>
          {isExpanded && <div className="absolute inset-0 bg-black/50 rounded-2xl" />}
        </div>
      )}
    </div>
  )
}
