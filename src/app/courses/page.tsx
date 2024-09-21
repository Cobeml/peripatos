"use client";
import React, { useState, useEffect } from 'react';
import Navbar from "../../components/ui/navbar";
import { BentoGrid, BentoGridItem } from "../../components/ui/bento-grid";
import { Button } from "../../components/ui/button";
import { db } from '../../lib/firebase/firebase';
import { collection, getDocs, DocumentData } from 'firebase/firestore';

interface Course extends DocumentData {
  id: string;
  title: string;
  description: string;
  image: string;
}

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const coursesCollection = collection(db, 'courses');
      const coursesSnapshot = await getDocs(coursesCollection);
      const coursesList = coursesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Course[];
      setCourses(coursesList);
    };

    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen w-full bg-black text-pink-100">
      <Navbar />
      <div className="min-h-screen w-full px-4 pt-20">
        <h1 className="text-4xl font-bold mb-8">Explore Courses</h1>
        <BentoGrid className="mx-auto">
          {courses.map((course, i) => (
            <React.Fragment key={course.id}>
              <BentoGridItem
                title={course.title}
                description={course.description}
                header={<img src={course.image} alt={course.title} className="w-full h-48 object-cover" />}
                icon={null}
              />
              <Button className="mt-4">Enroll Now</Button>
            </React.Fragment>
          ))}
        </BentoGrid>
      </div>
    </div>
  );
}