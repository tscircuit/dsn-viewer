import { useState, useCallback } from "react"
import { PCBViewer } from "@tscircuit/pcb-viewer"
import {
  convertDsnSessionToCircuitJson,
  DsnPcb,
  DsnSession,
  parseDsnToCircuitJson,
  parseDsnToDsnJson,
} from "dsn-converter"

function App() {
  const [circuitJson, setCircuitJson] = useState<any>(null)
  const [inDsnSessionMode, setInDsnSessionMode] = useState(false)
  const [sessionFile, setSessionFile] = useState<string | null>(null)
  const [dsnPcbFile, setDsnPcbFile] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const isSessionFileUploaded = Boolean(sessionFile)
  const isDsnPcbFileUploaded = Boolean(dsnPcbFile)

  const processFile = useCallback(async (content: string) => {
    setError(null)

    try {
      if (!inDsnSessionMode) {
        setCircuitJson(parseDsnToCircuitJson(content))
        return
      }

      if (content.trim().startsWith("(pcb")) {
        setDsnPcbFile(content)
      } else if (content.trim().startsWith("(session")) {
        setSessionFile(content)
      } else {
        setError("Invalid file format. Please upload a valid DSN PCB or session file.")
        return
      }

      const updatedSessionContent = content.trim().startsWith("(session") ? content : sessionFile
      const updatedPcbContent = content.trim().startsWith("(pcb") ? content : dsnPcbFile

      if (updatedSessionContent && updatedPcbContent) {
        const dsnPcb = parseDsnToDsnJson(updatedPcbContent) as DsnPcb
        const dsnSession = parseDsnToDsnJson(updatedSessionContent) as DsnSession
        setCircuitJson(convertDsnSessionToCircuitJson(dsnPcb, dsnSession))
      }
    } catch (err) {
      console.error("Processing error:", err)
      setError("Failed to process file. Please check the format.")
    }
  }, [inDsnSessionMode, sessionFile, dsnPcbFile])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    Array.from(e.dataTransfer.files).forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => processFile(e.target?.result as string)
      reader.readAsText(file)
    })
  }, [processFile])

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const content = e.clipboardData.getData("text")
    if (content) processFile(content)
  }, [processFile])

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
        <div>
          <button
            onClick={() => {
              setCircuitJson(null)
              setSessionFile(null)
              setDsnPcbFile(null)
              setError(null)
            }}
            className="mb-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md"
          >
            Upload Different Files
          </button>
          <PCBViewer circuitJson={circuitJson} height={800} />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="text-center max-w-2xl w-full">
            <h1 className="text-3xl font-bold mb-4">Specctra DSN File Viewer</h1>
            
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-md text-red-300">
                {error}
              </div>
            )}

            {inDsnSessionMode ? (
              <div className="space-y-4">
                <p className="text-gray-400 mb-2">
                  Drag and drop or paste both required files:
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 bg-gray-800/50 p-3 rounded-md">
                    <span className={isSessionFileUploaded ? "text-green-500" : "text-red-500"}>
                      {isSessionFileUploaded ? "✅" : "❌"}
                    </span>
                    <span className="text-gray-300">Session File</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-800/50 p-3 rounded-md">
                    <span className={isDsnPcbFileUploaded ? "text-green-500" : "text-red-500"}>
                      {isDsnPcbFileUploaded ? "✅" : "❌"}
                    </span>
                    <span className="text-gray-300">DSN PCB File</span>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <p className="text-gray-400 mb-2">Drag and drop a DSN file here</p>
                <p className="text-gray-400">or paste DSN content with Ctrl/CMD+V</p>
                <div className="flex gap-4 justify-center mt-6">
                  <button
                    className="underline hover:text-blue-400"
                    onClick={() => {
                      fetch("/exampledsn.dsn")
                        .then((response) => response.text())
                        .then(processFile)
                        .catch(() => setError("Failed to load example DSN file."))
                    }}
                  >
                    open example
                  </button>
                  <button
                    className="underline hover:text-blue-400"
                    onClick={() => setInDsnSessionMode(true)}
                  >
                    upload session
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="text-gray-400 text-sm mt-16">
            Unofficial Specctra DSN Parser/Viewer created by{" "}
            <a
              className="underline hover:text-blue-400"
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
