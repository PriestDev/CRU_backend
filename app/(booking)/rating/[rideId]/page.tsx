export default async function RidePage({ params }: { params: any }) {
  // 1. Next.js automatically grabs the ID from the URL
  const rideId = params.rideid; 

  // 2. Display it on the screen
  return (
    <div>
      <h1>Ride Details Page</h1>
      <p>You are looking at ride number: {rideId}</p>
    </div>
  )
}
