// =========================
// ONE WAY TRIPS
// =========================

export interface OneWayTrip {
  id: string;
  passengerName: string;
  pickup: string;
  destination: string;
  date: string;
  time: string;
  price: number;
  distance: string;
  status: "pending" | "completed" | "cancelled";
}

export const oneWayTrips: OneWayTrip[] = [
  {
    id: "OW001",
    passengerName: "Daniel Johnson",
    pickup: "Main Campus Gate",
    destination: "Mile 3 Park",
    date: "2026-05-25",
    time: "08:30 AM",
    price: 12,
    distance: "6 km",
    status: "pending",
  },
  {
    id: "OW002",
    passengerName: "Sophia Lee",
    pickup: "GRA Junction",
    destination: "Uniport Choba",
    date: "2026-05-25",
    time: "10:00 AM",
    price: 18,
    distance: "11 km",
    status: "completed",
  },
];

// =========================
// ROUND TRIPS
// =========================

export interface RoundTrip {
  id: string;
  passengerName: string;
  pickup: string;
  destination: string;

  departureDate: string;
  departureTime: string;

  returnDate: string;
  returnTime: string;

  totalPrice: number;
  status: "upcoming" | "completed" | "cancelled";
}

export const roundTrips: RoundTrip[] = [
  {
    id: "RT001",
    passengerName: "Michael Adams",
    pickup: "Rumuola",
    destination: "Airport Road",

    departureDate: "2026-05-28",
    departureTime: "07:00 AM",

    returnDate: "2026-05-28",
    returnTime: "06:00 PM",

    totalPrice: 40,
    status: "upcoming",
  },
  {
    id: "RT002",
    passengerName: "Grace Williams",
    pickup: "Uniport",
    destination: "Pleasure Park",

    departureDate: "2026-05-30",
    departureTime: "11:00 AM",

    returnDate: "2026-05-30",
    returnTime: "08:30 PM",

    totalPrice: 32,
    status: "completed",
  },
];

// =========================
// SCHEDULED TRIPS
// =========================

export interface ScheduledTrip {
  id: string;
  routeName: string;
  pickup: string;
  destination: string;

  recurringDays: string[];

  departureTime: string;

  availableSeats: number;

  vehicleType: string;

  price: number;
}

export const scheduledTrips: ScheduledTrip[] = [
  {
    id: "SC001",
    routeName: "Campus Morning Shuttle",
    pickup: "Alakahia",
    destination: "Main Campus",

    recurringDays: ["Monday", "Wednesday", "Friday"],

    departureTime: "07:15 AM",

    availableSeats: 5,

    vehicleType: "Bus",

    price: 4,
  },
  {
    id: "SC002",
    routeName: "Evening Tech Route",
    pickup: "Garrison",
    destination: "Oil Mill",

    recurringDays: ["Tuesday", "Thursday"],

    departureTime: "06:00 PM",

    availableSeats: 3,

    vehicleType: "Mini Van",

    price: 7,
  },
];

// =========================
// MULTI STOP TRIPS
// =========================

export interface MultiStopTrip {
  id: string;

  driverName: string;

  startingPoint: string;

  stops: string[];

  finalDestination: string;

  departureTime: string;

  totalPrice: number;

  seatsLeft: number;
}

export const multiStopTrips: MultiStopTrip[] = [
  {
    id: "MS001",

    driverName: "Kelvin Scott",

    startingPoint: "Rumuokoro",

    stops: [
      "Artillery Junction",
      "GRA Phase 2",
      "Waterlines",
    ],

    finalDestination: "Mile 1",

    departureTime: "09:00 AM",

    totalPrice: 15,

    seatsLeft: 4,
  },
  {
    id: "MS002",

    driverName: "Jane Cooper",

    startingPoint: "Choba",

    stops: [
      "Uniport Gate",
      "Alakahia",
      "Rumuosi",
    ],

    finalDestination: "Ada George",

    departureTime: "02:30 PM",

    totalPrice: 10,

    seatsLeft: 2,
  },
];

// =========================
// CARPOOL TRIPS
// =========================

export interface CarpoolTrip {
  id: string;

  driverName: string;
  driverImage: string;

  rating: number;
  totalRides: number;

  from: string;
  to: string;

  departureTime: string;
  arrivalTime: string;

  pricePerSeat: number;

  seatsLeft: number;

  vehicleType: string;

  genderPreference?: "male" | "female" | "any";

  musicAllowed?: boolean;

  acAvailable?: boolean;
}

export const carpoolTrips: CarpoolTrip[] = [
  {
    id: "CP001",

    driverName: "Alex Rivers",
    driverImage: "https://placehold.net/avatar-4.svg",

    rating: 4.9,
    totalRides: 124,

    from: "Main Campus North Gate",
    to: "Downtown Tech Hub",

    departureTime: "08:30 AM",
    arrivalTime: "09:15 AM",

    pricePerSeat: 5.50,

    seatsLeft: 2,

    vehicleType: "Electric Keke",

    genderPreference: "any",

    musicAllowed: true,

    acAvailable: false,
  },
  {
    id: "CP002",

    driverName: "Sarah Miles",
    driverImage: "https://placehold.net/avatar-4.svg",

    rating: 4.7,
    totalRides: 89,

    from: "Rumuola",
    to: "GRA Phase 3",

    departureTime: "07:45 AM",
    arrivalTime: "08:20 AM",

    pricePerSeat: 8.00,

    seatsLeft: 1,

    vehicleType: "Sedan",

    genderPreference: "female",

    musicAllowed: true,

    acAvailable: true,
  },
];