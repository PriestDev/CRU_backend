export interface FaqProps {
  id: number;
  question: string;
  answer: string;
}

export const faqs: FaqProps[] = [
  {
    id: 1,
    question: "How do I track my CampusRide?",
    answer:
      "You can track your ride in real-time from the Trips page once a driver accepts your request.",
  },
  {
    id: 2,
    question: "CampusRide payment methods",
    answer:
      "CampusRide supports wallet payments, bank transfers, and selected debit cards.",
  },
  {
    id: 3,
    question: "Lost & Found policy",
    answer:
      "If you forget an item in a ride, report it through the support section within 24 hours.",
  },
  {
    id: 4,
    question: "Scheduled ride cancellation",
    answer:
      "Scheduled rides can be cancelled up to 10 minutes before pickup without any penalty.",
  },
  {
    id: 5,
    question: "How does carpooling work?",
    answer:
      "Carpooling matches students heading in the same direction so they can share rides and reduce costs.",
  },
  {
    id: 6,
    question: "Can I schedule rides in advance?",
    answer:
      "Yes, you can book rides ahead of time for classes, events, or airport trips.",
  },
  {
    id: 7,
    question: "How are ride prices calculated?",
    answer: "Prices are based on distance, traffic conditions, and ride type.",
  },
  {
    id: 8,
    question: "What should I do if my driver is late?",
    answer:
      "You can contact the driver directly through the app or report delays to support.",
  },
  {
    id: 9,
    question: "How do delivery requests work?",
    answer:
      "Enter pickup and drop-off locations, then a nearby rider will be assigned to your package.",
  },
  {
    id: 10,
    question: "Is CampusRide available at night?",
    answer:
      "Yes, CampusRide operates 24/7 with additional safety measures for late-night rides.",
  },
];