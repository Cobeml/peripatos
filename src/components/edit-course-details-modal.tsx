import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface EditCourseDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (courseData: { description: string; medium: string; price: number; location: string; schedule: string }) => void;
  initialData: { description: string; medium: string; price: number; location: string; schedule: string };
}

const EditCourseDetailsModal: React.FC<EditCourseDetailsModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [description, setDescription] = useState(initialData.description);
  const [medium, setMedium] = useState(initialData.medium);
  const [price, setPrice] = useState(initialData.price.toString());
  const [location, setLocation] = useState(initialData.location);
  const [schedule, setSchedule] = useState(initialData.schedule);

  useEffect(() => {
    setDescription(initialData.description);
    setMedium(initialData.medium);
    setPrice(initialData.price.toString());
    setLocation(initialData.location);
    setSchedule(initialData.schedule);
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ description, medium, price: parseFloat(price), location, schedule });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Course Details</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="Course Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="text-black"
          />
          <Select onValueChange={setMedium} value={medium} required>
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
          <Input
            type="number"
            placeholder="Course Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="text-black"
          />
          <Input
            placeholder="Course Location/Link"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="text-black"
          />
          <Textarea
            placeholder="Course Schedule (e.g., Meeting times)"
            value={schedule}
            onChange={(e) => setSchedule(e.target.value)}
            className="text-black"
          />
          <Button type="submit">Update Course Details</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCourseDetailsModal;
