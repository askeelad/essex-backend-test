'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import api from '../../lib/api';
import NavBar from '../../components/NavBar';
import { Hospital, Service } from '../../types';
import { Toaster, toast } from 'react-hot-toast';

const hospitalSchema = z.object({
  name: z.string().min(1),
});

const serviceSchema = z.object({
  name: z.string().min(1),
  hospitalId: z.number().int(),
});

const timeSlotSchema = z.object({
  serviceId: z.number().int(),
  time: z.string().datetime(),
});

export default function AdminDashboard() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [hospitalName, setHospitalName] = useState('');
  const [serviceName, setServiceName] = useState('');
  const [selectedHospitalId, setSelectedHospitalId] = useState<number | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
  const [timeSlotDate, setTimeSlotDate] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    console.log("Stored Role:", storedRole);
    if (storedRole !== 'admin') {
      router.push('/login');
    }
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

  useEffect(() => {
    const fetchServices = async () => {
      if (selectedHospitalId) {
        try {
          const { data } = await api.get(`/services/${selectedHospitalId}`);
          setServices(data);
        } catch (err) {
          setServices([]);
          toast.error('Failed to fetch services');
        }
      } else {
        setServices([]);
      }
    };
    fetchServices();
  }, [selectedHospitalId]);

  const handleCreateHospital = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      hospitalSchema.parse({ name: hospitalName });
      const { data } = await api.post('/admin/hospital', { name: hospitalName });
      setHospitals([...hospitals, data.hospital]);
      setHospitalName('');
      toast.success('Hospital created successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to create hospital');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!selectedHospitalId) {
        throw new Error('Hospital ID is required');
      }
      serviceSchema.parse({ name: serviceName, hospitalId: selectedHospitalId });

      const { data } = await api.post('/admin/service', {
        name: serviceName,
        hospitalId: selectedHospitalId,
      });
      setServices([...services, data.service]);
      setServiceName('');
      toast.success('Service created successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to create service');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTimeSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!selectedServiceId) {
        throw new Error('Service ID is required');
      }
      const isoString = new Date(timeSlotDate).toISOString();
      timeSlotSchema.parse({ serviceId: selectedServiceId, time: isoString });

      await api.post('/admin/timeslot', {
        serviceId: selectedServiceId,
        time: isoString,
      });
      setTimeSlotDate('');
      toast.success('Time slot created successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to create time slot');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <NavBar />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8 text-primary">Admin Dashboard</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Create Hospital */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Create Hospital</h2>
            <form onSubmit={handleCreateHospital}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-gray-700">Hospital Name</label>
                <input
                  type="text"
                  value={hospitalName}
                  onChange={(e) => setHospitalName(e.target.value)}
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-secondary"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-black text-white py-2 rounded-lg font-semibold ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 transition'}`}
              >
                {isLoading ? 'Creating...' : 'Create Hospital'}
              </button>
            </form>
          </div>

          {/* Create Service */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Create Service</h2>
            <form onSubmit={handleCreateService}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-gray-700">Hospital</label>
                <select
                  value={selectedHospitalId || ''}
                  onChange={(e) => setSelectedHospitalId(parseInt(e.target.value))}
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-secondary"
                  required
                >
                  <option value="" disabled>Select Hospital</option>
                  {hospitals.map((hospital) => (
                    <option key={hospital.id} value={hospital.id}>
                      {hospital.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-gray-700">Service Name</label>
                <input
                  type="text"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-secondary"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-black text-white py-2 rounded-lg font-semibold ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 transition'}`}
              >
                {isLoading ? 'Creating...' : 'Create Service'}
              </button>
            </form>
          </div>

          {/* Create Time Slot */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Create Time Slot</h2>
            <form onSubmit={handleCreateTimeSlot}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-gray-700">Hospital</label>
                <select
                  value={selectedHospitalId || ''}
                  onChange={(e) => setSelectedHospitalId(parseInt(e.target.value))}
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-secondary"
                  required
                >
                  <option value="" disabled>Select Hospital First</option>
                  {hospitals.map((hospital) => (
                    <option key={hospital.id} value={hospital.id}>
                      {hospital.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-gray-700">Service</label>
                <select
                  value={selectedServiceId || ''}
                  onChange={(e) => setSelectedServiceId(parseInt(e.target.value))}
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-secondary"
                  required
                >
                  <option value="" disabled>Select Service</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-gray-700">Time Slot</label>
                <input
                suppressHydrationWarning
                  type="datetime-local"
                  value={timeSlotDate}
                  onChange={(e) => setTimeSlotDate(e.target.value)}
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-secondary"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-black text-white py-2 rounded-lg font-semibold ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 transition'}`}
              >
                {isLoading ? 'Creating...' : 'Create Time Slot'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
