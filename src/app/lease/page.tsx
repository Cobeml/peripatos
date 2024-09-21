"use client";
import React, { useState, useEffect } from 'react';
import Navbar from "../../components/ui/navbar";
import { BentoGrid, BentoGridItem } from "../../components/ui/bento-grid";
import { Button } from "../../components/ui/button";
import { db } from '../../lib/firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';

interface Space {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
}

export default function RentSpaces() {
  const [spaces, setSpaces] = useState<Space[]>([]);

  useEffect(() => {
    const fetchSpaces = async () => {
      const spacesCollection = collection(db, 'spaces');
      const spacesSnapshot = await getDocs(spacesCollection);
      const spacesList = spacesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Space, 'id'>)
      }));
      setSpaces(spacesList as Space[]);
    };

    fetchSpaces();
  }, []);

  return (
    <div className="min-h-screen w-full bg-black text-pink-100">
      <Navbar />
      <div className="min-h-screen w-full px-4 pt-20">
        <h1 className="text-4xl font-bold mb-8">Rent Classroom Spaces</h1>
        <BentoGrid className="mx-auto">
          {spaces.map((space, i) => (
            <BentoGridItem
              key={space.id}
              title={space.name}
              description={
                <>
                  {space.description}
                  <p className="mt-2">Price: ${space.price}/hour</p>
                  <Button className="mt-4">Book Now</Button>
                </>
              }
              header={<img src={space.image} alt={space.name} className="w-full h-48 object-cover" />}
              icon={null}
            />
          ))}
        </BentoGrid>
      </div>
    </div>
  );
}