import { useState, useCallback } from "react"
import { PCBViewer } from "@tscircuit/pcb-viewer"
import { parseDsnToCircuitJson } from "dsn-converter"

function App() {
  const [circuitJson, setCircuitJson] = useState<any>(null)

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = async (e) => {
        const dsnContent = e.target?.result as string
        try {
          const json = parseDsnToCircuitJson(dsnContent)
          setCircuitJson(json)
        } catch (err) {
          console.error("Failed to parse DSN file:", err)
          alert("Failed to parse DSN file. Please check the format.")
        }
      }
      reader.readAsText(file)
    }
  }, [])

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const dsnContent = e.clipboardData.getData("text")
    if (dsnContent) {
      try {
        const json = parseDsnToCircuitJson(dsnContent)
        setCircuitJson(json)
      } catch (err) {
        console.error("Failed to parse DSN content:", err)
        alert("Failed to parse DSN content. Please check the format.")
      }
    }
  }, [])

  return (
    <div
      className="min-h-screen bg-gray-900 text-white p-4"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onPaste={handlePaste}
      // biome-ignore lint/a11y/noNoninteractiveTabindex: we need this for drag and drop
      tabIndex={0}
    >
      {circuitJson ? (
        <PCBViewer circuitJson={circuitJson} height={800} />
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">
              Specctra DSN File Viewer
            </h1>
            <p className="text-gray-400 mb-2">Drag and drop a DSN file here</p>
            <p className="text-gray-400">
              or paste DSN content with Ctrl/CMD+V
            </p>
            {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
            <div
              className="underline cursor-pointer"
              onClick={() => {
                fetch("/exampledsn.dsn")
                  .then((response) => response.text())
                  .then((dsnContent) => {
                    try {
                      const json = parseDsnToCircuitJson(dsnContent)
                      setCircuitJson(json)
                    } catch (err) {
                      console.error("Failed to parse example DSN:", err)
                      alert("Failed to parse example DSN file.")
                    }
                  })
                  .catch((err) => {
                    console.error("Failed to load example DSN:", err)
                    alert("Failed to load example DSN file.")
                  })
              }}
            >
              open example
            </div>
          </div>
          <div className="text-gray-400 text-sm mt-16">
            Unofficial Specctra DSN Parser/Viewer created by{" "}
            <a
              className="underline"
              href="https://github.com/tscircuit/tscircuit"
            >
              tscircuit
            </a>
            , get the{" "}
            <a
              className="underline"
              href="https://github.com/tscircuit/dsn-viewer"
            >
              source code here
            </a>
            .
          </div>
          <a className="mt-4" href="https://github.com/tscircuit/tscircuit">
            <img
              src="https://img.shields.io/github/stars/tscircuit/tscircuit?style=social"
              alt="GitHub stars"
            />
          </a>
        </div>
      )}
    </div>
  )
}

export default App
