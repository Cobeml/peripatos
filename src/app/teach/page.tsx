"use client";
import React, { useState } from 'react';
import Navbar from "../../components/ui/navbar";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { db } from '../../lib/firebase/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function Teach() {
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    price: '',
    format: 'online',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCourseData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'courses'), courseData);
      alert('Course created successfully!');
      setCourseData({ title: '', description: '', price: '', format: 'online' });
    } catch (error) {
      console.error('Error creating course:', error);
      alert('Failed to create course. Please try again.');
    }
  };

  return (
    <div className="min-h-screen w-full bg-black text-pink-100">
      <Navbar />
      <div className="min-h-screen w-full px-4 pt-20">
        <h1 className="text-4xl font-bold mb-8">Create a New Course</h1>
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          <Input
            type="text"
            name="title"
            value={courseData.title}
            onChange={handleInputChange}
            placeholder="Course Title"
            className="mb-4"
          />
          <Textarea
            name="description"
            value={courseData.description}
            onChange={handleInputChange}
            placeholder="Course Description"
            className="mb-4"
          />
          <Input
            type="number"
            name="price"
            value={courseData.price}
            onChange={handleInputChange}
            placeholder="Course Price"
            className="mb-4"
          />
          <select
            name="format"
            value={courseData.format}
            onChange={handleInputChange}
            className="w-full p-2 mb-4 bg-black border border-pink-100 rounded"
          >
            <option value="online">Online</option>
            <option value="in-person">In-person</option>
            <option value="hybrid">Hybrid</option>
          </select>
          <Button type="submit" className="w-full">Create Course</Button>
        </form>
      </div>
    </div>
  );
}