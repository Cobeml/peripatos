"use client";
import React, { useState, useEffect } from "react";
import Navbar from "../../components/ui/navbar";
import ToggleableTabs from '../../components/ui/toggleable-tabs';
import { BentoGrid, BentoGridItem } from "../../components/ui/bento-grid";
import { db } from '../../lib/firebase/firebase';
import { collection, getDocs, DocumentData } from 'firebase/firestore';
import {
  IconClipboardCopy,
  IconFileBroken,
  IconSignature,
  IconTableColumn,
  IconArrowWaveRightUp,
  IconBoxAlignTopLeft,
  IconBoxAlignRightFilled,
} from "@tabler/icons-react";

interface Course extends DocumentData {
  id: string;
  title: string;
  description: string;
  image: string;
}

export default function Learn() {
    const [items, setItems] = useState<any[]>([]);

    useEffect(() => {
        const fetchCourses = async () => {
            const coursesCollection = collection(db, 'courses');
            const coursesSnapshot = await getDocs(coursesCollection);
            const coursesList = coursesSnapshot.docs.map(doc => {
                const data = doc.data() as Course;
                return {
                    title: data.title,
                    description: data.description,
                    header: <img src={data.image} alt={data.title} className="w-full h-48 object-cover" />,
                    icon: getRandomIcon(),
                };
            });
            setItems(coursesList);
        };

        fetchCourses();
    }, []);

    const tabsData = [
        {
            label: 'Explore Courses',
            content: 
            <BentoGrid className="mx-auto">
                {items.map((item, i) => (
                    <BentoGridItem
                    key={i}
                    title={item.title}
                    description={item.description}
                    header={item.header}
                    icon={item.icon}
                    />
                ))}
            </BentoGrid>
        },
        {
          label: 'My Learning',
          content: <div className="min-h-[calc(100vh-12rem)] p-4">My Learning content goes here</div>
        }
    ];

    return (
        <div className="min-h-screen w-full bg-black text-pink-100">
            <Navbar />
            <div className="min-h-screen w-full px-4 pt-20">
                <ToggleableTabs tabs={tabsData} defaultTab="Explore Courses" />
            </div>
        </div>
    );
}

const Skeleton = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100"></div>
);

const icons = [
  <IconClipboardCopy className="h-4 w-4 text-neutral-500" />,
  <IconFileBroken className="h-4 w-4 text-neutral-500" />,
  <IconSignature className="h-4 w-4 text-neutral-500" />,
  <IconTableColumn className="h-4 w-4 text-neutral-500" />,
  <IconArrowWaveRightUp className="h-4 w-4 text-neutral-500" />,
  <IconBoxAlignTopLeft className="h-4 w-4 text-neutral-500" />,
  <IconBoxAlignRightFilled className="h-4 w-4 text-neutral-500" />,
];

function getRandomIcon() {
  return icons[Math.floor(Math.random() * icons.length)];
}
