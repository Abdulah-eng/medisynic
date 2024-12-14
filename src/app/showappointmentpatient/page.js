import Appointment from '../../../pages/appointmentpatient/page'; // Correct relative path
import Link from 'next/link'
export default function ShowDataPage() {
  return (
    <div>
      <Appointment /> {/* Render the Output component */}

      <Link href="/showcheckappointment"> {}
        <button style={{ padding: '10px', fontSize: '16px',color:'blue' }}>
          input data
        </button>
      </Link>

    </div>
  );
}
