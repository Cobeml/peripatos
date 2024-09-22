import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface CreateCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (courseData: { title: string; description: string; medium: string }) => void;
}

const CreateCourseModal: React.FC<CreateCourseModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [medium, setMedium] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, description, medium });
    setTitle('');
    setDescription('');
    setMedium('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Course</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Course Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="text-black"
          />
          <Textarea
            placeholder="Course Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="text-black"
          />
          <Select onValueChange={setMedium} required>
            <SelectTrigger className="bg-white text-gray-900">
              <SelectValue placeholder="Select Medium" className="text-gray-500" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="hybrid" className="text-gray-900 hover:bg-gray-100 hover:text-gray-700">Hybrid</SelectItem>
              <SelectItem value="online_synchronous" className="text-gray-900 hover:bg-gray-100 hover:text-gray-700">Online Synchronous</SelectItem>
              <SelectItem value="online_asynchronous" className="text-gray-900 hover:bg-gray-100 hover:text-gray-700">Online Asynchronous</SelectItem>
              <SelectItem value="in_person" className="text-gray-900 hover:bg-gray-100 hover:text-gray-700">In-Person</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit">Create Course</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCourseModal;