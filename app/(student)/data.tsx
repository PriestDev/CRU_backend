interface serviceProps {
    name: string,
    link: string,
    icon: any
}

export const services:serviceProps[] = [
    {
        name: "Book",
        link: "/book-ride",
        icon: <span className="material-symbols-outlined">electric_rickshaw</span>
    },
    {
        name: "Package",
        link: "/delivery",
        icon: <span className="material-symbols-outlined">inventory_2</span>
    },
    {
        name: "Carpool",
        link: "/carpool",
        icon: <span className="material-symbols-outlined">groups</span>
    },
    {
        name: "Staff VIP",
        link: "/",
        icon: <span className="material-symbols-outlined">workspace_premium</span>
    }
]

export interface tripProps {
  from: string;
  to: string;
  date: string;
  time: string;
  status: "completed" | "upcoming" | "cancelled";
  type: "ride" | "delivery" | "carpool";
  price: number;
}

export const trips: tripProps[] = [
  {
    from: "Delta Park",
    to: "Choba",
    date: "2026-05-26",
    time: "08:00 AM",
    status: "upcoming",
    type: "ride",
    price: 500
  },
  {
    from: "Abuja Campus",
    to: "Alakahia",
    date: "2026-05-24",
    time: "06:30 PM",
    status: "completed",
    type: "delivery",
    price: 700
  },
  {
    from: "Choba",
    to: "Uniport Main Gate",
    date: "2026-05-27",
    time: "09:15 AM",
    status: "upcoming",
    type: "carpool",
    price: 300
  },
  {
    from: "Aluu",
    to: "Delta Park",
    date: "2026-05-22",
    time: "04:45 PM",
    status: "completed",
    type: "ride",
    price: 800
  },
  {
    from: "Uniport Main Gate",
    to: "Alakahia",
    date: "2026-05-28",
    time: "07:20 AM",
    status: "upcoming",
    type: "delivery",
    price: 400
  },
  {
    from: "Delta Park",
    to: "Abuja Campus",
    date: "2026-05-20",
    time: "01:00 PM",
    status: "cancelled",
    type: "carpool",
    price: 600
  },
  {
    from: "Choba",
    to: "Aluu",
    date: "2026-05-29",
    time: "05:30 PM",
    status: "upcoming",
    type: "ride",
    price: 750
  },
  {
    from: "Alakahia",
    to: "Delta Park",
    date: "2026-05-23",
    time: "10:10 AM",
    status: "completed",
    type: "delivery",
    price: 450
  },
  {
    from: "Abuja Campus",
    to: "Uniport Main Gate",
    date: "2026-05-30",
    time: "03:40 PM",
    status: "upcoming",
    type: "carpool",
    price: 350
  },
  {
    from: "Aluu",
    to: "Choba",
    date: "2026-05-21",
    time: "11:50 AM",
    status: "cancelled",
    type: "ride",
    price: 650
  },
  {
    from: "Delta Park",
    to: "Alakahia",
    date: "2026-06-01",
    time: "08:25 AM",
    status: "upcoming",
    type: "delivery",
    price: 500
  },
  {
    from: "Uniport Main Gate",
    to: "Abuja Campus",
    date: "2026-05-25",
    time: "02:15 PM",
    status: "completed",
    type: "carpool",
    price: 350
  }
];

export interface NotificationProps {
  title: string;
  message: string;
  time: string;
  type: "ride" | "delivery" | "promo" | "system";
  isRead: boolean;
}

export const notifications: NotificationProps[] = [
  {
    title: "Your ride is 2 mins away",
    message: "Driver Michael is arriving at the Engineering Building pickup point.",
    time: "Now",
    type: "ride",
    isRead: false,
  },
  {
    title: "Package delivered successfully",
    message: "Your campus-store parcel was dropped off at the main mailroom.",
    time: "45m",
    type: "delivery",
    isRead: true,
  },
  {
    title: "New discount for Carpooling!",
    message: "Get 20% off your next 3 shared rides between North and South Campus.",
    time: "2h",
    type: "promo",
    isRead: true,
  },
  {
    title: "System Update",
    message: "We’ve updated our terms of service and improved ride safety features.",
    time: "5h",
    type: "system",
    isRead: true,
  },
  {
    title: "Ride Completed",
    message: "Your trip to Student Union is finished. Don’t forget to rate your driver.",
    time: "Yesterday",
    type: "ride",
    isRead: true,
  },
  {
    title: "Carpool matched successfully",
    message: "You’ve been matched with 2 riders heading to Choba Junction.",
    time: "Yesterday",
    type: "ride",
    isRead: true,
  },
  {
    title: "Delivery rider assigned",
    message: "Your package is now with a rider and on the way to Alakahia.",
    time: "1d",
    type: "delivery",
    isRead: true,
  },
  {
    title: "Ride cancelled",
    message: "Your ride request from Delta Park was cancelled due to driver unavailability.",
    time: "1d",
    type: "ride",
    isRead: true,
  },
  {
    title: "Weekly travel summary",
    message: "You completed 6 rides and saved ₦2,400 this week.",
    time: "2d",
    type: "system",
    isRead: true,
  },
  {
    title: "Promo unlocked!",
    message: "You unlocked a free ride discount after 10 completed trips.",
    time: "3d",
    type: "promo",
    isRead: false,
  }
];