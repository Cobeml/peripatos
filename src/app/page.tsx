"use client";
import React from "react";
import Image from 'next/image'
import { SparklesCore } from "../components/ui/sparkles";
import { TypewriterEffectSmooth } from "../components/ui/typewriter-effect";
import { ContainerScroll } from "../components/ui/container-scroll-animation";
import { CardBody, CardContainer, CardItem } from "../components/ui/3D-card";

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
  return (
    <div className="min-h-screen flex flex-col w-full bg-black items-center justify-center overflow-auto rounded-md text-pink-100">
      <div className="fixed top-0 left-0 w-full z-50 bg-black border-b-2 border-white py-2 px-4 rounded-md">
        <div className="flex items-center justify-between w-full"> {/* Flex container for alignment */}
          <a href="#" rel="noopener noreferrer">
            <Image src="/peripa-logo.png" alt="Logo" className="mr-8" width={60} height={60} />
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" className="justify-end">
            Join Mailing List
          </a>
        </div>
      </div>
      <div className="min-h-screen flex flex-col items-center justify-center">
        <ContainerScroll>
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-9xl font-bold text-center">
              Peripatos
            </h1>
            <div className="w-[60rem] h-[15rem] relative">
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
            <div className="w-[80rem]">
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
      <div className="w-[80rem]">
        <CardContainer className="w-[55rem]">
          <CardBody className="bg-gray-50 group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black w-full h-full rounded-xl ">
            <CardItem translateZ="20" className="w-full">
              <Image
                src="/aristotle.png"
                height="1000"
                width="1000"
                className="h-auto w-full object-cover rounded-xl group-hover/card:shadow-xl"
                alt="thumbnail"
              />
            </CardItem>
            <CardItem
              as="p"
              translateZ="20"
              className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300 italic"
            >
              Aristotle's School by Gustav Adolph Spangenberg
            </CardItem>
          </CardBody>
        </CardContainer>
        <blockquote className="border-l-2 pl-6 italic">
          The term peripatetic is a transliteration of the ancient Greek word 
          περιπατητικός (peripatētikós), which means "of walking" or "given to 
          walking about"... Aristotle's school came to be so named because of the 
          peripatoi ("walkways", some covered or with colonnades) of the Lyceum 
          where the members met. The legend that the name came from Aristotle's 
          alleged habit of walking while lecturing may have started with Hermippus 
          of Smyrna.
        </blockquote>
        <div className="flex justify-end">
          <a className="leading-7 [&:not(:first-child)]:mt-6 text-pink-400" href="https://en.wikipedia.org/wiki/Peripatetic_school" target="_blank" rel="noopener noreferrer">
            - Wikipedia (Peripatetic School)
          </a>
        </div>
        <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
          Freedom Education
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          There is a higher truth worth pursuing and that progression toward truth is best 
          undertaken by utilizing the wisdom and knowledge of past humans. This is Peripatos's {" "}
          <a href="https://thenetworkstate.com/the-one-commandment" className="font-medium text-primary text-pink-400" target="_blank" rel="noopener noreferrer">
            One Commandment
          </a>
          . The necessary moral consequence of this is education, which is best defined as the processs
          of passing wisdom and knowledge from one generation to the next.
        </p>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          The educational process is facilitated via communication between teachers and students. This may seem 
          rhetorical but when put in simple terms, the bloatware present in our modern education systems becomes 
          blatantly obvious.
        </p>
        <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
          The Joke Tax
        </h3>
      </div>
    </div>
  );
}
