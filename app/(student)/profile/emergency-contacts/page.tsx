"use client";

import PageHeader from "@/components/layout/pageHeader";
import { useState } from "react";
import Button from "@/components/ui/button";
import AddContact from "./addContact";

interface contactProps {
  id: number;
  name: string;
  number: string;
  relationship: "Parent" | "Friend" | "Guardian";
  message?: string;
}

const availableContacts: contactProps[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    number: "+234 803 000 0000",
    relationship: "Guardian",
  },
];

const Page = () => {
  const [addContact, setAddContact] = useState(false);
  const [contacts, setContacts] = useState(availableContacts);

  const deleteContact = (id: number) => {
    setContacts((prev) => prev.filter((user) => user.id !== id));
  };

  return (
    <div>
      <div className="border-b border-(--stroke)">
        <PageHeader text="Emergency Contacts" />
      </div>

      <main className="p-4 space-y-4">
        <div className="flex flex-col items-center gap-1">
          <div className="w-30 h-30 rounded-full flex flex-col items-center justify-center text-white bg-(--appRed) border-4 shadow">
            <h1 className="font-black text-2xl">SOS</h1>
            <p>HOLD</p>
          </div>

          <p className="text-(--appRed) font-bold">
            Hold for 3 seconds to trigger SOS
          </p>
        </div>

        <p>
          Add up to two trusted contacts for campus safety. These people will be
          notified if you use the emergency SOS feature.
        </p>

        <div className="space-y-2">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="rounded-lg border border-(--stroke) p-4 bg-white flex justify-between items-center"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-12 h-12 rounded-full bg-(--primary)/10 flex items-center justify-center">
                  <span className="material-symbols-outlined">person</span>
                </div>

                <div>
                  <p className="font-bold text-base flex items-center gap-1">
                    {contact.name}

                    <span className="font-normal text-[10px] bg-(--primary)/10 rounded-full p-0.5 px-2.5">
                      {contact.relationship}
                    </span>
                  </p>

                  <p>{contact.number}</p>
                </div>
              </div>

              <span
                className="material-symbols-outlined cursor-pointer"
                onClick={() => deleteContact(contact.id)}
              >
                delete
              </span>
            </div>
          ))}
        </div>

        <div>
          {availableContacts.length < 2 && (
            <div className=" flex flex-col items-center justify-center border-2 border-dashed border-(--stroke) rounded-lg px-2 py-8 text-center text-(--lightText) border-spacing-10">
              <p className=" text-sm font-semibold">
                {2 - availableContacts.length}{" "}
                {2 - availableContacts.length === 1 ? "slot" : "slots"}{" "}
                available
              </p>
              <p>Increase your safety circle by adding a second contact.</p>
            </div>
          )}
        </div>
        <Button
          text="Add Emergency Contact"
          bgColor="primary"
          type="button"
          onClick={() => setAddContact(true)}
        />
        <div className=" bg-(--primary)/10 rounded-lg p-4 border border-(--primary)/20 flex gap-2">
          <span className="material-symbols-outlined text-(--primary)">
            info
          </span>
          <p>
            Your emergency contacts will receive an SMS with your live location
            only when you trigger an SOS alert through the CampusRide app.
          </p>
        </div>
      </main>

      {addContact && <AddContact />}
    </div>
  );
};

export default Page;
