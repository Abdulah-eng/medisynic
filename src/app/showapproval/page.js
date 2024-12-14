import Approval from '../../../pages/approval/page'; // Correct relative path
import Link from 'next/link'
export default function ShowDataPage() {
  return (
    <div>
      <Approval /> {/* Render the Output component */}

      <Link href="/"> {}
        <button style={{ padding: '10px', fontSize: '16px',color:'blue' }}>
          input data
        </button>
      </Link>

    </div>
  );
}
