import Changeavailibility from '../../../pages/changeavail/page'; // Correct relative path
import Link from 'next/link'
export default function ShowDataPage() {
  return (
    <div>
      <Changeavailibility /> {/* Render the Output component */}

      <Link href="/showappointmentpatient"> {}
        <button style={{ padding: '10px', fontSize: '16px',color:'blue' }}>
          input data
        </button>
      </Link>

    </div>
  );
}
