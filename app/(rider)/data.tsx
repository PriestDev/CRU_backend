// app/(rider)/data.tsx

export interface rideProps {
  id: number;
  name: string;
  image: string;
  type: "Ride" | "Carpool" | "Package";
  pickup: string;
  dropoff: string;
  price: number;
  distance: string;
  onViewDetails?: () => void;
}

export const rides: rideProps[] = [
  {
    id: 1,
    name: "Sarah Miller",
    image: "https://placehold.net/avatar-4.svg",
    type: "Ride",
    pickup: "Faculty of Arts",
    dropoff: "Main Gate",
    price: 1450,
    distance: "3.1 km",
  },
  {
    id: 2,
    name: "Marcus Chen",
    image: "https://placehold.net/avatar-4.svg",
    type: "Package",
    pickup: "Hostel A",
    dropoff: "Faculty of Law",
    price: 820,
    distance: "0.6 km",
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    image: "https://placehold.net/avatar-4.svg",
    type: "Carpool",
    pickup: "Engineering Block",
    dropoff: "Student Union",
    price: 2200,
    distance: "5 km",
  },
];
