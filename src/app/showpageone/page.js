import Outputone from '../../../pages/pageone/page'; // Correct relative path
import Link from 'next/link'
export default function ShowDataPage() {
  return (
    <div>
      <Outputone /> {/* Render the Output component */}

      <Link href="/showchangeavail"> {}
        <button style={{ padding: '10px', fontSize: '16px',color:'blue' }}>
          input data
        </button>
      </Link>

    </div>
  );
}
