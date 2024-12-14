import Output from '../../pages/output/page'; 
import Link from 'next/link'
import Inpu from '../../pages/input/page'; 
export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
    
      <Inpu/>
      
      <Link href="/showdata"> {}
        <button style={{ padding: '10px', fontSize: '16px',color:'blue' }}>
          Go to Output Page
        </button>
      </Link>

    </div>
  );
}
