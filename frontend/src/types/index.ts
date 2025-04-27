export interface Hospital {
    id: number;
    name: string;
    services: Service[];
  }
  
  export interface Service {
    id: number;
    name: string;
    timeSlots: TimeSlot[];
  }
  
  export interface TimeSlot {
    id: number;
    time: string;
    isBooked: boolean;
  }
  
  export interface Booking {
    id: number;
    timeSlotId: number;
  }