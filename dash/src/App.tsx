import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Card,CardTitle, CardContent, CardFooter, CardDescription, CardHeader } from './components/ui/card'
import { RunList } from './components/RunList'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { ThemeProvider } from './components/theme-provider'
import { RunShower } from './components/RunShower'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      
    <ResizablePanelGroup
      direction="horizontal"
      className="w-100 rounded-lg"
    >
      <ResizablePanel defaultSize={15}>
      <RunList />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={50}>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={25}>
            <RunShower />
          </ResizablePanel>
          <ResizableHandle />

        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
    </ThemeProvider>
    
</>

  )
}

export default App
