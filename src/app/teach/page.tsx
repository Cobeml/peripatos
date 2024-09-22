"use client";
import React, { useState, useEffect } from 'react';
import Navbar from "../../components/ui/navbar";
import { Button } from "../../components/ui/button";
import { BentoGrid, BentoGridItem } from "../../components/ui/bento-grid";
import { db } from '../../lib/firebase/firebase';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { useAuth } from '../../lib/contexts/AuthContext';
import CreateCourseModal from '../../components/create-course-modal';
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";

interface Course {
  id: string;
  title: string;
  description: string;
  medium: string;
  published: boolean;
  authorId: string;
}

export default function Teach() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchCourses();
    }
  }, [user]);

  const fetchCourses = async () => {
    if (!user) return;
    const coursesCollection = collection(db, 'courses');
    const q = query(coursesCollection, where("authorId", "==", user.uid));
    const coursesSnapshot = await getDocs(q);
    const coursesList = coursesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
    setCourses(coursesList);
  };

  const handleCreateCourse = async (courseData: Omit<Course, 'id' | 'authorId' | 'published'>) => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'courses'), {
        ...courseData,
        authorId: user.uid,
        published: false
      });
      setIsModalOpen(false);
      fetchCourses();
    } catch (error) {
      console.error('Error creating course:', error);
      alert('Failed to create course. Please try again.');
    }
  };

  return (
    <div className="min-h-screen w-full bg-black text-pink-100">
      <Navbar />
      <div className="min-h-screen w-full px-4 pt-20">
        <div className="flex justify-between items-center mb-8">
          <Tabs defaultValue="my-courses" className="w-full">
            <TabsList className="grid w-full grid-cols-1 h-auto bg-transparent">
              <TabsTrigger 
                value="my-courses" 
                className="text-2xl font-bold py-2 justify-start data-[state=active]:bg-transparent data-[state=active]:text-pink-100 data-[state=active]:shadow-none relative"
              >
                My Courses
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-pink-600"></span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="bg-pink-600 hover:bg-pink-700 text-white ml-[10rem]"
          >
            Create Course
          </Button>
        </div>
        <BentoGrid className="mx-auto">
          {courses.map((course) => (
            <BentoGridItem
              key={course.id}
              title={course.title}
              description={
                <>
                  {course.description}
                  <p className="mt-2">Medium: {course.medium}</p>
                  <p>Status: {course.published ? 'Published' : 'Draft'}</p>
                </>
              }
              header={<div className="w-full h-48 bg-gradient-to-br from-neutral-900 to-neutral-800"></div>}
              icon={null}
            />
          ))}
        </BentoGrid>
      </div>
      <CreateCourseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateCourse}
      />
    </div>
  );
}