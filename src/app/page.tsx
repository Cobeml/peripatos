"use client";
import React from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import Head from 'next/head';
import { SparklesCore } from "../components/ui/sparkles";
import { TypewriterEffectSmooth } from "../components/ui/typewriter-effect";
import { ContainerScroll } from "../components/ui/container-scroll-animation";
import { CardBody, CardContainer, CardItem } from "../components/ui/3d-card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion"


const World = dynamic(() => import("../components/ui/globe").then((m) => m.World), {
  ssr: false,
});

export default function Home() {
  const words = [
    {
      text: "Scroll",
      className: "text-2xl",
    },
    {
      text: "down",
      className: "text-2xl",
    },
    {
      text: "to",
      className: "text-2xl",
    },
    {
      text: "learn",
      className: "text-2xl",
    },
    {
      text: "more",
      className: "text-2xl",
    },
  ];
  const cursorClassName = "lock rounded-sm w-[3px] h-3 sm:h-4 xl:h-7 bg-pink-400 justify-bottom";
  const className = "justify-center items-center";
  const globeConfig = {
    pointSize: 4,
    globeColor: "#062056",
    showAtmosphere: true,
    atmosphereColor: "#FFFFFF",
    atmosphereAltitude: 0.1,
    emissive: "#062056",
    emissiveIntensity: 0.1,
    shininess: 0.9,
    polygonColor: "rgba(255,255,255,0.7)",
    ambientLight: "#38bdf8",
    directionalLeftLight: "#ffffff",
    directionalTopLight: "#ffffff",
    pointLight: "#ffffff",
    arcTime: 1000,
    arcLength: 0.9,
    rings: 1,
    maxRings: 3,
    initialPosition: { lat: 22.3193, lng: 114.1694 },
    autoRotate: true,
    autoRotateSpeed: 0.5,
  };
  const colors = ["#06b6d4", "#3b82f6", "#6366f1"];
  const sampleArcs = [
    {
      order: 1,
      startLat: -19.885592,
      startLng: -43.951191,
      endLat: -22.9068,
      endLng: -43.1729,
      arcAlt: 0.1,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 1,
      startLat: 28.6139,
      startLng: 77.209,
      endLat: 3.139,
      endLng: 101.6869,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 1,
      startLat: -19.885592,
      startLng: -43.951191,
      endLat: -1.303396,
      endLng: 36.852443,
      arcAlt: 0.5,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 2,
      startLat: 1.3521,
      startLng: 103.8198,
      endLat: 35.6762,
      endLng: 139.6503,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 2,
      startLat: 51.5072,
      startLng: -0.1276,
      endLat: 3.139,
      endLng: 101.6869,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 2,
      startLat: -15.785493,
      startLng: -47.909029,
      endLat: 36.162809,
      endLng: -115.119411,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 3,
      startLat: -33.8688,
      startLng: 151.2093,
      endLat: 22.3193,
      endLng: 114.1694,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 3,
      startLat: 21.3099,
      startLng: -157.8581,
      endLat: 40.7128,
      endLng: -74.006,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 3,
      startLat: -6.2088,
      startLng: 106.8456,
      endLat: 51.5072,
      endLng: -0.1276,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 4,
      startLat: 11.986597,
      startLng: 8.571831,
      endLat: -15.595412,
      endLng: -56.05918,
      arcAlt: 0.5,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 4,
      startLat: -34.6037,
      startLng: -58.3816,
      endLat: 22.3193,
      endLng: 114.1694,
      arcAlt: 0.7,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 4,
      startLat: 51.5072,
      startLng: -0.1276,
      endLat: 48.8566,
      endLng: -2.3522,
      arcAlt: 0.1,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 5,
      startLat: 14.5995,
      startLng: 120.9842,
      endLat: 51.5072,
      endLng: -0.1276,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 5,
      startLat: 1.3521,
      startLng: 103.8198,
      endLat: -33.8688,
      endLng: 151.2093,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 5,
      startLat: 34.0522,
      startLng: -118.2437,
      endLat: 48.8566,
      endLng: -2.3522,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 6,
      startLat: -15.432563,
      startLng: 28.315853,
      endLat: 1.094136,
      endLng: -63.34546,
      arcAlt: 0.7,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 6,
      startLat: 37.5665,
      startLng: 126.978,
      endLat: 35.6762,
      endLng: 139.6503,
      arcAlt: 0.1,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 6,
      startLat: 22.3193,
      startLng: 114.1694,
      endLat: 51.5072,
      endLng: -0.1276,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 7,
      startLat: -19.885592,
      startLng: -43.951191,
      endLat: -15.595412,
      endLng: -56.05918,
      arcAlt: 0.1,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 7,
      startLat: 48.8566,
      startLng: -2.3522,
      endLat: 52.52,
      endLng: 13.405,
      arcAlt: 0.1,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 7,
      startLat: 52.52,
      startLng: 13.405,
      endLat: 34.0522,
      endLng: -118.2437,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 8,
      startLat: -8.833221,
      startLng: 13.264837,
      endLat: -33.936138,
      endLng: 18.436529,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 8,
      startLat: 49.2827,
      startLng: -123.1207,
      endLat: 52.3676,
      endLng: 4.9041,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 8,
      startLat: 1.3521,
      startLng: 103.8198,
      endLat: 40.7128,
      endLng: -74.006,
      arcAlt: 0.5,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 9,
      startLat: 51.5072,
      startLng: -0.1276,
      endLat: 34.0522,
      endLng: -118.2437,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 9,
      startLat: 22.3193,
      startLng: 114.1694,
      endLat: -22.9068,
      endLng: -43.1729,
      arcAlt: 0.7,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 9,
      startLat: 1.3521,
      startLng: 103.8198,
      endLat: -34.6037,
      endLng: -58.3816,
      arcAlt: 0.5,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 10,
      startLat: -22.9068,
      startLng: -43.1729,
      endLat: 28.6139,
      endLng: 77.209,
      arcAlt: 0.7,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 10,
      startLat: 34.0522,
      startLng: -118.2437,
      endLat: 31.2304,
      endLng: 121.4737,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 10,
      startLat: -6.2088,
      startLng: 106.8456,
      endLat: 52.3676,
      endLng: 4.9041,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 11,
      startLat: 41.9028,
      startLng: 12.4964,
      endLat: 34.0522,
      endLng: -118.2437,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 11,
      startLat: -6.2088,
      startLng: 106.8456,
      endLat: 31.2304,
      endLng: 121.4737,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 11,
      startLat: 22.3193,
      startLng: 114.1694,
      endLat: 1.3521,
      endLng: 103.8198,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 12,
      startLat: 34.0522,
      startLng: -118.2437,
      endLat: 37.7749,
      endLng: -122.4194,
      arcAlt: 0.1,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 12,
      startLat: 35.6762,
      startLng: 139.6503,
      endLat: 22.3193,
      endLng: 114.1694,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 12,
      startLat: 22.3193,
      startLng: 114.1694,
      endLat: 34.0522,
      endLng: -118.2437,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 13,
      startLat: 52.52,
      startLng: 13.405,
      endLat: 22.3193,
      endLng: 114.1694,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 13,
      startLat: 11.986597,
      startLng: 8.571831,
      endLat: 35.6762,
      endLng: 139.6503,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 13,
      startLat: -22.9068,
      startLng: -43.1729,
      endLat: -34.6037,
      endLng: -58.3816,
      arcAlt: 0.1,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 14,
      startLat: -33.936138,
      startLng: 18.436529,
      endLat: 21.395643,
      endLng: 39.883798,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
  ];
  return (
    <>
      <Head>
        <title>Peripatos - Education Network</title>
        <link rel="icon" href="favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="apple-icon.png"
        />
        <link rel="icon" type="image/png" sizes="32x32" href="icon32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="favicon16x16.png" />
      </Head>
    
    <div className="min-h-screen min-w-screen flex flex-col w-full bg-black items-center justify-center overflow-auto rounded-md text-pink-100">
      <div className="fixed top-0 left-0 w-full z-50 bg-black border-b-2 border-white py-2 px-4 rounded-md">
        <div className="flex items-center justify-between w-full"> {/* Flex container for alignment */}
          <a href="#" rel="noopener noreferrer">
            <Image src="/peripatos/peripa-logo.png" alt="Logo" className="mr-8" width={60} height={60} />
          </a>
          <a href="#waiting-list" className="justify-end">
            Join Waiting List
          </a>
        </div>
      </div>
      <div className="min-h-screen flex flex-col items-center justify-center">
        <ContainerScroll>
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-4xl sm:text-6xl lg:text-9xl font-bold text-center">
              Peripatos
            </h1>
            <div className="w-[16rem] h-[4rem] sm:w-[30rem] sm:h-[8rem] lg:w-[60rem] lg:h-[15rem] relative">
              {/* Gradients */}
              <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-ingigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
              <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
              <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/2 blur-sm" />
              <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/2" />

              {/* Core component */}
              <SparklesCore
                background="transparent"
                minSize={0.4}
                maxSize={1}
                particleDensity={1200}
                className="w-full h-full"
                particleColor="#FFFFD0"
              />

              {/* Radial Gradient to prevent sharp edges */}
              <div className="absolute inset-0 w-full h-full bg-black [mask-image:radial-gradient(350px_200px_at_top,transparent_50%,white)]"></div>
            </div>
            <div className="px-4 sm:px-16 lg:px-40 2xl:px-60">
              <p className="border-l-2 border-r-2 mt-3 pl-6 border-pink-400">
                Peripatos is a peer-to-peer education network and marketplace in which 
                teachers, students, property owners, and investors can participate. It 
                consists of an underlying decentralized protocol layer verified using 
                the Peripatos blockchain to ensure stability and freedom, as well as a 
                client-side layer to allow for a user-friendly interface. Peripatos hopes 
                to be the place where truth can be pursued unabashedly, free from the 
                bureaucratic death trap.
              </p>
              <TypewriterEffectSmooth words={words} cursorClassName={cursorClassName} className={className} />
            </div>
          </div>
        </ContainerScroll>
      </div>
      <div className="px-4 sm:px-16 lg:px-40 2xl:px-60 relative flex flex-col justify-center">
        <CardContainer className="w-[15rem] md:w-[30rem] lg:w-[55rem]">
          <CardBody className="bg-gray-50 group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black w-full h-full rounded-xl ">
            <CardItem translateZ="20" className="w-full">
              <Image
                src="/peripatos/aristotle.png"
                height="1000"
                width="1000"
                className="h-auto w-full object-cover rounded-xl group-hover/card:shadow-xl"
                alt="thumbnail"
              />
            </CardItem>
            <CardItem
              as="p"
              translateZ="20"
              className="text-neutral-500 text-sm mt-2 dark:text-neutral-300 italic"
            >
              Aristotle&apos;s School by Gustav Adolph Spangenberg
            </CardItem>
          </CardBody>
        </CardContainer>
        <blockquote className="border-l-2 pl-6 italic">
          The term peripatetic is a transliteration of the ancient Greek word 
          περιπατητικός (peripatētikós), which means &quot;of walking&quot; or &quot;given to 
          walking about&quot;... Aristotle&apos;s school came to be so named because of the 
          peripatoi (&quot;walkways&quot;, some covered or with colonnades) of the Lyceum 
          where the members met. The legend that the name came from Aristotle&apos;s 
          alleged habit of walking while lecturing may have started with Hermippus 
          of Smyrna.
        </blockquote>
        <div className="flex justify-end">
          <a className="[&:not(:first-child)]:mt-6 text-pink-400" href="https://en.wikipedia.org/wiki/Peripatetic_school" target="_blank" rel="noopener noreferrer">
            - Wikipedia (Peripatetic School)
          </a>
        </div>
        <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
          Freedom Education
        </h2>
        <p className="[&:not(:first-child)]:mt-6">
          Greater truth is worth pursuing and progression toward truth is best 
          undertaken by utilizing the wisdom and knowledge of past humans. This is Peripatos&apos;s {" "}
          <a href="https://thenetworkstate.com/the-one-commandment" className="font-medium text-primary text-pink-400" target="_blank" rel="noopener noreferrer">
            One Commandment
          </a>
          .
        </p>
        <p className="[&:not(:first-child)]:mt-6">
          Groups differ on what they believe ultimate truth is, if it can be attained, and some 
          doubt the existence of fundamental truths. Additionally, throughout history, evil has proliferated 
          in the name of truth. However, when caught in the face of greater wisdom and technology, 
          evil has sought recourse through the desemination of untruths and lies. 
        </p>
        <p className="[&:not(:first-child)]:mt-6">
          In pursuit of truth, humans 
          have created models and maps of all kinds (
          <a href="https://en.wikipedia.org/wiki/Scientific_modelling" className="font-medium text-primary text-pink-400" target="_blank" rel="noopener noreferrer">
            technical
          </a>
          , {" "}
          <a href="https://www.thecollector.com/moral-philosophy-the-5-most-important-ethical-theories/" className="font-medium text-primary text-pink-400" target="_blank" rel="noopener noreferrer">
            moral
          </a>
          , and {" "}
          <a href="https://www.worldhistory.org/collection/223/religions-of-the-world/" className="font-medium text-primary text-pink-400" target="_blank" rel="noopener noreferrer">
            spiritual
          </a>
          ) which have 
          given rise to beauty, prosperity, and progress. As long as we continue 
          to build better models and draw better maps, humans will continue to tend toward greater prosperity.
        </p>
        <p className="[&:not(:first-child)]:mt-6">
          The necessary moral consequence of this is education, which is best defined as the processs
          of passing wisdom and knowledge from one generation to the next. The educational process is facilitated via communication between teachers and students. This may seem 
          rhetorical but when put in simple terms, the bloatware present in our modern education systems becomes 
          blatantly obvious.
        </p>
        <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
          New Educational Paradigm
        </h3>
        <p className="[&:not(:first-child)]:mt-6">
          Education does not necessitate a state/board sealed {" "}
          <a href="https://en.wikipedia.org/wiki/List_of_books_banned_by_governments" className="font-medium text-primary text-pink-400" target="_blank" rel="noopener noreferrer">
            stamp of approval
          </a>
          {" "} on topics and textbooks. It also doesn&apos;t necessitate a 
          {" "}
          <a href="https://www.tuftsdaily.com/article/2024/04/tufts-cost-of-attendance-reaches-record-breaking-92167-for-upcoming-academic-year" className="font-medium text-primary text-pink-400" target="_blank" rel="noopener noreferrer">
            six figure price tag
          </a>
          . When it comes to resource allocation, a career bureaucrat often lacks the experience and incentive structure 
          to make sound decisions. The {" "}
          <a href="https://saifedean.com/poe" className="font-medium text-primary text-pink-400" target="_blank" rel="noopener noreferrer">
            best allocators
          </a>
          {" "}are individuals driven by passion, interest, and unmet market demand.
        </p>
        <p className="[&:not(:first-child)]:mt-6">
          Peripatos provides the marketplace whereby individuals can monetize their knowledge and wisdom by passing it on to others 
          in the form of text, video, or in-person material. This frees educators to teach what they want and how they want at a price 
          of their choosing. 
        </p>
        <p className="[&:not(:first-child)]:mt-6">
          Peripatos also provides a marketplace which allows property owners to monetize venues by renting out the space to educators. 
          It is undeniable that in person education is often preferrable. Through the power of {" "}
          <a href="https://en.wikipedia.org/wiki/Network_effect" className="font-medium text-primary text-pink-400" target="_blank" rel="noopener noreferrer">
            network effects
          </a>
          , Peripatos allows for 
          the organic formation of thriving campuses.
        </p>
        <CardContainer className="w-[15rem] md:w-[30rem] lg:w-[55rem]">
          <CardBody className="bg-gray-50 group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black w-full h-full rounded-xl ">
            <CardItem translateZ="20" className="w-full">
              <Image
                src="/peripatos/campus.png"
                height="1000"
                width="1000"
                className="h-auto w-full object-cover rounded-xl group-hover/card:shadow-xl"
                alt="thumbnail"
              />
            </CardItem>
            <CardItem
              as="p"
              translateZ="20"
              className="text-neutral-500 text-sm mt-2 dark:text-neutral-300 italic"
            >
              Network Effect Campus Vibes
            </CardItem>
          </CardBody>
        </CardContainer>
        <p className="[&:not(:first-child)]:mt-6">
          Lastly, Peripatos acts as a marketplace whereby educators and property owners can sell partial ownership of their owned 
          entities (educational material/venues) to investors. Partial ownership grants a proportional percentage of the revenue generated and 
          possibly governance depending on the percentage of ownership and terms of sale.
        </p>
        <p className="[&:not(:first-child)]:mt-6">
          Peripatos&apos;s marketplace gives way to a thriving educational environment through which high quality education is globally accessible.
        </p>
        <div className="max-w-7xl mx-auto relative overflow-hidden sm:h-[16rem] sm:w-[16rem] md:h-[30rem] md:w-[30rem] lg:h-[60rem] lg:w-[60rem]">
          <div className="absolute w-full h-72 md:h-full z-10">
            <World data={sampleArcs} globeConfig={globeConfig} />
          </div>
        </div>
        <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
          Protocol Layer
        </h3>
        <p className="[&:not(:first-child)]:mt-6">
          Peripatos is made up of an underlying {" "} 
          <a href="https://knightcolumbia.org/content/protocols-not-platforms-a-technological-approach-to-free-speech" className="font-medium text-primary text-pink-400" target="_blank" rel="noopener noreferrer">
            protocol 
          </a>
          {" "}layer, built using a Tendermint Proof of Stake blockchain, and an adaptable client-side layer. 
        </p>
        <p className="[&:not(:first-child)]:mt-6">
          The protocol layer is used as the ledger and central database for all marketplace transactions and commodities. The ledger is secured by staking 
          the $PTOS token. All transactions and activity occuring on the protocol layer incurs fees, earned by $PTOS stakers.
        </p>
        <p className="[&:not(:first-child)]:mt-6">
          The types of commodities which can be owned or traded can be separated into three types: Ownership NFTs, Access NFTs, and Profile NFTs. The 
          Ownership NFTs signify ownership of either educational material or a venue. The holder of the Ownership NFT receives the revenue associated 
          with the owned entity. Access NFT holders can access encrypted information and content associated with respective Ownership NFTs. Profile NFTs 
          are soulbound NFTs which track the reputation of a user.
        </p>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Ownership NFTs</AccordionTrigger>
            <AccordionContent>
            Ownership NFTs can be minted by anyone who would like to sell educational material or a venue on the Peripatos marketplace. The wallet 
            address which mints the Ownership NFT receives the Ownership NFT and has full access to mutate and edit it as they choose. They can 
            additionally choose other wallet addresses which can edit its content. Ownership NFTs can be split into any number of smaller parts, 
            each signifying a proportionally partial share of the revenue associated with the parent Ownership NFT. When splitting, the holder can 
            choose what mutation permissions each of the children Ownership NFTs have. The children cannot be granted permissions which the parent 
            Ownership NFT does not have. Additonally, anyone can leave a review associated with an Ownership NFT describing their experience with 
            the product.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Access NFTs</AccordionTrigger>
            <AccordionContent>
            All Ownership NFTs contain information or content which is encrypted and inaccessible except to the holders of the Ownership NFTs and holders 
            of respective Access NFTs. The encrypted content could be anything from educational material, directions to access the venue location, or 
            directions to access high-memory content like videos which could not be stored onchain. Access NFTs can be minted by holders of Ownership 
            NFT with Access NFT minting permissions. The minter can set parameters for the Access NFTs including during what time period the encrypted 
            content can be accessed and if the Access NFT can be resold.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Profile NFTs</AccordionTrigger>
            <AccordionContent>
            Profile NFTs are soulbound NFTs, meaning that once minted they cannot be traded. They contain simple information like a name and a 
            bio which are mutable by the holder. Additionally, anyone can leave a review associated with a holder&apos;s Profile NFT, describing their 
            experience with the user. Anyone can mint a Profile NFT. Users are incentivized to mint them as developing a solid reputation 
            increases engagement.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
          Client-Side Layer
        </h3>
        <p className="[&:not(:first-child)]:mt-6">
          Clients are the user interfaces through which users interact with the protocol layer. Anyone can create and host a client. Different clients 
          provide different user experiences, interface conventions, business models, and additional features. Using a different client may often feel 
          like using a completely different application.
        </p>
        <p className="[&:not(:first-child)]:mt-6">
          The competitiion between clients is fundamentally different from the competition between other educational/online platforms. This is because 
          all clients have access to the underlying Peripatos protocol layer containing the network of users and content. This network of users and 
          content is the most valuable asset many educational/online platforms have. 
        </p>
        <p className="[&:not(:first-child)]:mt-6">
          Switching from client to client is like switching from 
          YouTube to another video sharing platform which has access to all of YouTube&apos;s content and your past activity (if you like). This drastic 
          decrease in friction in the user&apos;s ability to opt in or out of a given client&apos;s feature set, business model, and policies allows for greater 
          competition between clients. This high degree of competition results in a highly differntiated and competitive 
          client market.
        </p>
        <p className="[&:not(:first-child)]:mt-6">
          This flexibile yet decentralized approach is important to maintain resilience in the face of information controversy and regulatory 
          crackdown. In the case of information controversy each client&apos;s handling (or lack thereof) will be judged by users and the client&apos;s 
          actions will cause the client to lose or gain activity at the margin as a consequence. This incentive structure has all clients competing 
          for the approval of users in their moderation decisions.
        </p>
        <p className="[&:not(:first-child)]:mt-6">
          This approach also lends itself to provide the &quot;it just works!&quot; moments everyone appreciates. Allowing for competing clients allows each 
          client to provide a different user experience as well as additional features. Many of these features will provide conveniences which the 
          protocol layer itself is incapable of providing (native video hosting, on demand video streaming, interactive content modules, personalized 
          feeds, fiat payment). Additionally, the competition of user interfaces allows for different clients to cater to different users. While many 
          will prefer that the techno-mumbo-jumbo remain under the hood, some will opt for greater customization and clarity.
        </p>
        <p className="[&:not(:first-child)]:mt-6">
          As the Peripatos user base expands, so will the incentive for new clients to enter the market and for existing clients to improve. Clients 
          are free to operate under different business models to cover their operatonal costs and seek profit. To remain competitive, clients will 
          choose their business model based on their structure and user preference.
        </p>
        <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
          Just Build It
        </h3>
        <p className="[&:not(:first-child)]:mt-6">
          Many think of an individual&apos;s levers on society&apos;s ailments as either {" "}
          <a href="https://en.wikipedia.org/wiki/Exit,_Voice,_and_Loyalty" className="font-medium text-primary text-pink-400" target="_blank" rel="noopener noreferrer">
            Exit or Voice
          </a>
          . However, when the exit alternative is only worse or 
          requires immense discomfort, these tools leave the unsatisfied class impotent to peaceful change. In these scenarios, many 
          (rightfully) unsatisfied with their institutions are emboldened to destructive violence resulting in {" "}
          <a href="https://en.wikipedia.org/wiki/French_Revolution" className="font-medium text-primary text-pink-400" target="_blank" rel="noopener noreferrer">
            chaos
          </a>
          , leaving a power vacuum in their 
          wake. Those who fill this vacuum are often charasmatic, idealistic, and power hungry. The institutions they create run the risk of becoming 
          more dogmatic than what came before.
        </p>
        <p className="[&:not(:first-child)]:mt-6">
          The only choice this leaves the unsatisfied but pragmatic class is Build. This means to build better and more easily accessible exit strategies 
          to animate and empower others. The decrease in friction allows for peaceful but meaningful change.
        </p>
        <p className="[&:not(:first-child)]:mt-6">
          Peripatos&apos;s goal is to build a thriving educational environment free from needless bureaucracy. The modern educational institutions are too 
          often {" "}
          <a href="https://fred.stlouisfed.org/series/CGBD2024" className="font-medium text-primary text-pink-400" target="_blank" rel="noopener noreferrer">
            unhelpful
          </a>
          , {" "}
          <a href="https://libertarianinstitute.org/articles/the-great-escape-from-government-schools/" className="font-medium text-primary text-pink-400" target="_blank" rel="noopener noreferrer">
            uninteresting
          </a>
          , and {" "}
          <a href="https://www.bestcolleges.com/research/average-cost-of-college/" className="font-medium text-primary text-pink-400" target="_blank" rel="noopener noreferrer">
            expensive
          </a>
          . However, for most it is still the best choice and the education it provides is undeniably 
          important. Education&apos;s importance make the faults of the modern education system all the more dire.
        </p>
        <p className="[&:not(:first-child)]:mt-6">
          The common exit strategies are also unsuitable to most; Homeschooling can be isolating and taxing on the parents and online courses are often 
          less engaging than their state sponsored, in-person counterparts. 
        </p>
        <p className="[&:not(:first-child)]:mt-6">
          Peripatos&apos;s free marketplace for in-person and online education hopes to foster more potent and flexible exit strategies for those interested 
          in the unabashed pursuit of truth. We are providing the protocol level tools for others to Build thriving alternatives. Whether it be as a 
          educator, venue owner, client, investor, or student, we are reducing the friction to sustainably pursue this third path.
        </p>
        <p className="[&:not(:first-child)]:mt-6">
          Just Build It.
        </p>
      </div>
      <div className="h-[40rem] min-h-screen w-full rounded-md bg-neutral-950 relative flex flex-col items-center justify-center antialiased">
        <div className="w-full absolute inset-0 h-screen">
          <SparklesCore
            id="tsparticlesfullpage"
            background="transparent"
            minSize={0.6}
            maxSize={1.4}
            particleDensity={100}
            className="w-full h-full"
            particleColor="#FFFFD0"
          />
        </div>
        <div id="waiting-list" className="absolute inset-0 w-full h-full bg-black [mask-image:radial-gradient(600px_400px_at_center,transparent_50%,white)]"></div>
        <div className="mx-auto p-4">
          <h1 className="relative z-10 text-4xl sm:text-6xl lg:text-9xl font-bold text-center">
            Join the waitlist
          </h1>
          <p></p>
          <p className="text-neutral-500 max-w-lg mx-auto my-2 text-sm text-center relative z-10">
            Joining will grant you early access to upcoming releases as well as keep you updated on Peripatos.
          </p>
          <input
            type="text"
            placeholder="example@peripatos.com"
            className="rounded-lg border border-neutral-800 focus:ring-2 focus:ring-teal-500  w-full relative z-10 mt-4  bg-neutral-950 placeholder:text-neutral-700"
          />
        </div>
      </div>
    </div>
    </>
  );
}
