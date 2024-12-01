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

  const isSessionFileUploaded = Boolean(sessionFile)
  const isDsnPcbFileUploaded = Boolean(dsnPcbFile)

  const processDsnUploadOrPaste = (content: string) => {
    if (!inDsnSessionMode) {
      try {
        const json = parseDsnToCircuitJson(content)
        setCircuitJson(json)
      } catch (err) {
        console.log(err)
        console.error("Failed to parse DSN content:", err)
        alert("Failed to parse DSN content. Please check the format.")
      }
      return
    }

    let dsnPcbContent = dsnPcbFile
    let sessionContent = sessionFile

    if (content.trim().startsWith("(pcb")) {
      dsnPcbContent = content
      setDsnPcbFile(content)
    }

    if (content.trim().startsWith("(session")) {
      sessionContent = content
      setSessionFile(content)
    }

    if (sessionContent && dsnPcbContent) {
      const dsnPcb = parseDsnToDsnJson(dsnPcbContent) as DsnPcb
      const dsnSession = parseDsnToDsnJson(sessionContent) as DsnSession
      try {
        setCircuitJson(convertDsnSessionToCircuitJson(dsnPcb, dsnSession))
      } catch (err) {
        console.log(err)
        console.error("Failed to convert DSN session to circuit JSON:", err)
        alert("Failed to convert DSN session to circuit JSON.")
      }
    }
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = async (e) => {
        const dsnContent = e.target?.result as string
        processDsnUploadOrPaste(dsnContent)
      }
      reader.readAsText(file)
    }
  }, [])

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const dsnContent = e.clipboardData.getData("text")
    if (dsnContent) {
      processDsnUploadOrPaste(dsnContent)
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
            {!inDsnSessionMode && (
              <>
                <p className="text-gray-400 mb-2">
                  Drag and drop a DSN file here
                </p>
                <p className="text-gray-400">
                  or paste DSN content with Ctrl/CMD+V
                </p>
              </>
            )}
            {inDsnSessionMode && (
              <>
                <p className="text-gray-400 mb-2">
                  Drag and drop or paste a DSN session and original (DSN PCB)
                  file here
                </p>
                <p className="text-gray-400">
                  You must upload both files to see the results.
                </p>
                <p className="text-gray-400">
                  {isSessionFileUploaded ? "✅" : "❌"} Session file uploaded
                </p>
                <p className="text-gray-400">
                  {isDsnPcbFileUploaded ? "✅" : "❌"} DSN PCB file uploaded
                </p>
              </>
            )}
            {!inDsnSessionMode && (
              <div className="flex gap-4 justify-center">
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
                <div
                  className="underline cursor-pointer"
                  onClick={() => {
                    setInDsnSessionMode(true)
                  }}
                >
                  upload session
                </div>
              </div>
            )}
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
