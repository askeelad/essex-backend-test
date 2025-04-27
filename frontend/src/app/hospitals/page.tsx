'use client';
import { useState, useEffect } from 'react';
import api from '../../lib/api';
import { Hospital, Service, TimeSlot } from '../../types';
import NavBar from '../../components/NavBar';
import { z } from 'zod';

const bookingSchema = z.object({
  serviceId: z.number().int(),
  timeSlotId: z.number().int(),
});

export default function Hospitals() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const { data } = await api.get('/hospitals');
        setHospitals(data);
      } catch (err) {
        setError('Failed to fetch hospitals');
      }
    };
    fetchHospitals();
  }, []);

  const fetchServices = async (hospitalId: number) => {
    try {
      const { data } = await api.get(`/services/${hospitalId}`);
      setServices(data);
      setSelectedService(null);
      setSelectedTimeSlot(null);
    } catch (err) {
      setError('Failed to fetch services');
    }
  };

  const handleHospitalSelect = (hospital: Hospital) => {
    setSelectedHospital(hospital);
    fetchServices(hospital.id);
  };

  const handleBook = async () => {
    if (!selectedService || !selectedTimeSlot) {
      setError('Please select a service and time slot');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      bookingSchema.parse({
        serviceId: selectedService.id,
        timeSlotId: selectedTimeSlot.id,
      });
      await api.post(`/book/${selectedService.id}/${selectedTimeSlot.id}`);
      alert('Booking successful!');
      setSelectedService(null);
      setSelectedTimeSlot(null);
      fetchServices(selectedHospital!.id); // Refresh available slots
    } catch (err) {
      setError('Booking failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8 text-primary">Book an Appointment</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Select Hospital</h2>
            <ul className="space-y-2">
              {hospitals.map((hospital) => (
                <li
                  key={hospital.id}
                  className={`p-3 rounded-lg cursor-pointer ${selectedHospital?.id === hospital.id ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                  onClick={() => handleHospitalSelect(hospital)}
                >
                  {hospital.name}
                </li>
              ))}
            </ul>
          </div>
          {selectedHospital && (
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Services</h2>
              {services.length === 0 ? (
                <p className="text-gray-500">No services available</p>
              ) : (
                <ul className="space-y-2">
                  {services.map((service) => (
                    <li
                      key={service.id}
                      className={`p-3 rounded-lg cursor-pointer ${selectedService?.id === service.id ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                      onClick={() => setSelectedService(service)}
                    >
                      {service.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
          {selectedService && (
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Available Time Slots</h2>
              {selectedService.timeSlots.length === 0 ? (
                <p className="text-gray-500">No time slots available</p>
              ) : (
                <ul className="space-y-2">
                  {selectedService.timeSlots.map((slot) => (
                    <li
                      key={slot.id}
                      className={`p-3 rounded-lg cursor-pointer ${selectedTimeSlot?.id === slot.id ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                      onClick={() => setSelectedTimeSlot(slot)}
                    >
                      {new Date(slot.time).toLocaleTimeString()}
                    </li>
                  ))}
                </ul>
              )}
              {selectedTimeSlot && (
                <button
                  onClick={handleBook}
                  disabled={isLoading}
                  className={`mt-6 w-full bg-black text-white py-2 rounded-lg font-semibold ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 transition'}`}
                >
                  {isLoading ? 'Booking...' : 'Book Appointment'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}