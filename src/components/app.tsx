import { Main } from '@/components/main'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { useEffect, useState } from 'react'

const App = () => {
  const [data, setData] = useState<Record<string, (string|number)[]>>()

  useEffect(() => {
    fetch('https://fulljoin-mock-server.vercel.app/api')
      .then(res => res.json())
      .then(data => setData(data))
  }, [])

  return data ? (
    <Main data={data} />
  ) : (
    <div className="flex flex-col w-screen h-screen justify-center items-center">
    <LoadingSpinner />
    </div>
  )
}

export default App