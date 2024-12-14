import Output from '../../../pages/output/page'; // Correct relative path
import Link from 'next/link'
export default function ShowDataPage() {
  return (
    <div>
      <Output /> {/* Render the Output component */}

      <Link href="/showpageone"> {}
        <button style={{ padding: '10px', fontSize: '16px',color:'blue' }}>
          input data
        </button>
      </Link>

    </div>
  );
}
