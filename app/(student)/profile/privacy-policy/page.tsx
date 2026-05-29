"use client";

import PageHeader from "@/components/layout/pageHeader";
import Button from "@/components/ui/button"

const page = () => {
  return (
    <div>
      <div className="border-b border-(--stroke)">
        <PageHeader
          text="Privacy Policy"
          extra={
            <span className="material-symbols-outlined text-(--primary)">
              edit
            </span>
          }
        />
      </div>
      <main className="p-4 space-y-4">
        <div>
          <h4 className="text-lg font-bold">Your privacy matters</h4>
          <p className="text-(--lightText)">Last updated: June 1 , 2026</p>
        </div>
        <div className="space-y-4">
          {/* number 1 */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-(--primary)">
              1. Information We Collect
            </h4>
            <p className="text-(--lightText)">
              At CampusRide, we collect personal information such as your name,
              student ID, and university email address to verify your identity
              and campus eligibility.
            </p>
            <section className="space-y-2 bg-white rounded-lg p-2">
              <div className="flex gap-1">
                <span className="material-symbols-outlined text-(--primary)">
                  location_on
                </span>
                <p>
                  Real-time location data for ride matching and safety tracking.
                </p>
              </div>
              <div className="flex gap-1">
                <span className="material-symbols-outlined text-(--primary)">
                  credit_card
                </span>
                <p>
                  Payment information processed securely via encrypted
                  providers.
                </p>
              </div>
              <div className="flex gap-1">
                <span className="material-symbols-outlined text-(--primary)">
                  directions_car
                </span>
                <p>Vehicle details and driving records for student drivers.</p>
              </div>
            </section>
          </div>
          {/* number 2 */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-(--primary)">
              2. How We Use Your Data
            </h4>
            <p className="text-(--lightText)">
              Your data is used to improve our services, facilitate rides, and
              ensure the safety of our campus community.
            </p>
            <section className="space-y-2">
              <div className="flex gap-1 bg-(--primary)/10 rounded-lg p-2 items-center">
                <span className="material-symbols-outlined text-(--primary)">
                  security
                </span>
                <p className="font-semibold">Enhanced safety monitoring.</p>
              </div>
              <div className="flex gap-1 bg-(--primary)/10 rounded-lg p-2 items-center">
                <span className="material-symbols-outlined text-(--primary)">
                  route
                </span>
                <p className="font-semibold">Route optimization.</p>
              </div>
              <div className="flex gap-1 bg-(--primary)/10 rounded-lg p-2 items-center">
                <span className="material-symbols-outlined text-(--primary)">
                  support_agent
                </span>
                <p className="font-semibold">Customer support.</p>
              </div>
            </section>
          </div>
          {/* number 3 */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-(--primary)">
              3. User Rights
            </h4>
            <p className="text-(--lightText)">
              We believe you should have control over your information. As a
              CampusRide user, you have the right to:
            </p>
            <section className="space-y-2">
              <ul className="list-disc list-inside space-y-1">
                <li>
                  <b>Access & Export:</b> Request a copy of all personal data we
                  hold about you.
                </li>
                <li>
                  <b>Deletion:</b> Request the permanent deletion of your
                  account and associated data..
                </li>
                <li>
                  <b>Correction:</b> Update any inaccurate or incomplete
                  personal information.
                </li>
              </ul>
            </section>
          </div>
          {/* number 4 */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-(--primary)">
              4. Security Measures
            </h4>
            <p className="text-(--lightText)">
              We implement industry-standard encryption and security protocols
              to protect your data from unauthorized access, loss, or
              destruction. We do not sell your personal information to third
              parties for marketing purposes.
            </p>
          </div>
          {/* support */}
          <div className="bg-(--primary) text-white rounded-lg p-4 py-8 space-y-2">
            <h4 className="text-sm font-bold">Questions?</h4>
            <p className="text-white/50">
              If you have concerns about your privacy or our data practices,
              please reach out to our privacy officer.
            </p>
            <Button text="Contact Support" bgColor="white" type="button" className="text-(--primary)"/>
          </div>
        </div>
      </main>
    </div>
  );
};

export default page;
