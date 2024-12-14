import Checkappointment from '../../../pages/checkappointment/page'; // Correct relative path
import Link from 'next/link'
export default function ShowDataPage() {
  return (
    <div>
      <Checkappointment /> {/* Render the Output component */}

      <Link href="/showapproval"> {}
        <button style={{ padding: '10px', fontSize: '16px',color:'blue' }}>
          input data
        </button>
      </Link>

    </div>
  );
}
