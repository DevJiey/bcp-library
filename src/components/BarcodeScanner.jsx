import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  BrowserMultiFormatReader,
} from "@zxing/browser";

import {
  FaCamera,
  FaTimes,
  FaSyncAlt,
} from "react-icons/fa";

function BarcodeScanner({
  open,
  onClose,
  onDetected,
}) {
  const videoRef =
    useRef(null);

  const controlsRef =
    useRef(null);

  const [error, setError] =
    useState("");

  const [starting, setStarting] =
    useState(false);

  const stopScanner = () => {
    try {
      controlsRef.current?.stop();
    } catch {
      // scanner already stopped
    }

    controlsRef.current = null;
  };

  useEffect(() => {
    if (!open) {
      stopScanner();
      return;
    }

    let cancelled = false;

    const startScanner =
      async () => {
        try {
          setStarting(true);
          setError("");

          const reader =
            new BrowserMultiFormatReader();

          const devices =
            await BrowserMultiFormatReader.listVideoInputDevices();

          if (
            cancelled
          ) {
            return;
          }

          if (
            !devices ||
            devices.length === 0
          ) {
            setError(
              "No camera was found on this device."
            );

            return;
          }

          let selectedDeviceId =
            devices[0].deviceId;

          const rearCamera =
            devices.find(
              (device) => {
                const label =
                  String(
                    device.label ||
                      ""
                  ).toLowerCase();

                return (
                  label.includes(
                    "back"
                  ) ||
                  label.includes(
                    "rear"
                  ) ||
                  label.includes(
                    "environment"
                  )
                );
              }
            );

          if (rearCamera) {
            selectedDeviceId =
              rearCamera.deviceId;
          } else if (
            devices.length > 1
          ) {
            selectedDeviceId =
              devices[
                devices.length - 1
              ].deviceId;
          }

          const controls =
            await reader.decodeFromVideoDevice(
              selectedDeviceId,
              videoRef.current,
              (result) => {
                if (!result) {
                  return;
                }

                const text =
                  result
                    .getText()
                    .trim();

                if (!text) {
                  return;
                }

                stopScanner();

                onDetected(
                  text
                );
              }
            );

          if (
            cancelled
          ) {
            controls.stop();
            return;
          }

          controlsRef.current =
            controls;
        } catch (err) {
          console.error(
            "Barcode scanner error:",
            err
          );

          if (
            err?.name ===
            "NotAllowedError"
          ) {
            setError(
              "Camera permission was denied. Allow camera access or enter the barcode manually."
            );
          } else if (
            err?.name ===
            "NotFoundError"
          ) {
            setError(
              "No available camera was found."
            );
          } else {
            setError(
              "Unable to start the camera scanner. You can still enter the barcode manually."
            );
          }
        } finally {
          if (
            !cancelled
          ) {
            setStarting(false);
          }
        }
      };

    startScanner();

    return () => {
      cancelled = true;
      stopScanner();
    };
  }, [
    open,
    onDetected,
  ]);

  const handleClose = () => {
    stopScanner();
    onClose();
  };

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/80 p-3 backdrop-blur-sm sm:p-4">

      <div className="flex max-h-[95vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* HEADER */}
        <div className="flex shrink-0 items-center justify-between bg-gradient-to-r from-[#0F4C97] to-blue-700 px-5 py-4 text-white sm:px-6 sm:py-5">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
              <FaCamera />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-100">
                Barcode Scanner
              </p>

              <h2 className="mt-0.5 text-lg font-bold sm:text-xl">
                Scan Book Barcode
              </h2>
            </div>

          </div>

          <button
            type="button"
            onClick={
              handleClose
            }
            className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-white/15"
            aria-label="Close barcode scanner"
          >
            <FaTimes />
          </button>

        </div>

        {/* BODY */}
        <div className="overflow-y-auto p-4 sm:p-6">

          <div className="relative overflow-hidden rounded-2xl bg-black">

            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="aspect-[4/3] w-full object-cover"
            />

            {/* Scan guide */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">

              <div className="relative h-32 w-[82%] max-w-sm rounded-xl border-2 border-white/90">

                <span className="absolute -left-0.5 -top-0.5 h-5 w-5 border-l-4 border-t-4 border-emerald-400" />

                <span className="absolute -right-0.5 -top-0.5 h-5 w-5 border-r-4 border-t-4 border-emerald-400" />

                <span className="absolute -bottom-0.5 -left-0.5 h-5 w-5 border-b-4 border-l-4 border-emerald-400" />

                <span className="absolute -bottom-0.5 -right-0.5 h-5 w-5 border-b-4 border-r-4 border-emerald-400" />

                <div className="absolute left-3 right-3 top-1/2 h-0.5 -translate-y-1/2 bg-red-500/80" />

              </div>

            </div>

            {starting && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/65 text-white">

                <FaSyncAlt className="animate-spin text-2xl" />

                <p className="mt-3 text-sm font-medium">
                  Starting camera...
                </p>

              </div>
            )}

          </div>

          {error ? (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-600">
              {error}
            </div>
          ) : (
            <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm leading-6 text-blue-700">
              Position the printed barcode inside the guide. The barcode will be captured automatically once detected.
            </div>
          )}

          <p className="mt-4 text-center text-xs leading-5 text-slate-400">
            Works with phone or tablet cameras and desktop/laptop webcams. If camera scanning is unavailable, close this window and enter the barcode manually.
          </p>

        </div>

        {/* FOOTER */}
        <div className="shrink-0 border-t border-slate-100 bg-white px-4 py-4 sm:px-6">

          <button
            type="button"
            onClick={
              handleClose
            }
            className="w-full rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Cancel Scan
          </button>

        </div>

      </div>

    </div>
  );
}

export default BarcodeScanner;