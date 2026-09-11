import { Maximize2, Minus, X } from "lucide-react";

declare global {
  interface Window {
    electronWindow?: {
      minimize: () => void;
      toggleMaximize: () => void;
      close: () => void;
      showNotification: (notification: {
        title: string;
        body: string;
        route?: string;
      }) => void;
      onNotificationClick: (callback: (route: string) => void) => () => void;
      openMediaSettings: (kind: "camera" | "microphone") => Promise<boolean>;
    };
  }
}

export function WindowControls() {
  const controls = window.electronWindow;
  if (!controls) return null;

  return (
    <div className="electron-window-controls ms-1 flex shrink-0 items-center overflow-hidden rounded-xl border border-border/80 bg-card shadow-sm">
      <button
        type="button"
        className="group grid size-9 place-items-center bg-amber-50 text-amber-700 transition-colors hover:bg-amber-400 hover:text-amber-950 dark:bg-amber-950/55 dark:text-amber-300 dark:hover:bg-amber-400 dark:hover:text-amber-950"
        onClick={controls.minimize}
        title="Minimize"
        aria-label="Minimize window"
      >
        <Minus className="size-4 stroke-[2.2] transition-transform group-hover:scale-110" />
      </button>
      <button
        type="button"
        className="group grid size-9 place-items-center border-x border-border/80 bg-emerald-50 text-emerald-700 transition-colors hover:bg-emerald-500 hover:text-white dark:bg-emerald-950/55 dark:text-emerald-300 dark:hover:bg-emerald-500 dark:hover:text-white"
        onClick={controls.toggleMaximize}
        title="Maximize or restore"
        aria-label="Maximize or restore window"
      >
        <Maximize2 className="size-3.5 stroke-[2.1] transition-transform group-hover:scale-110" />
      </button>
      <button
        type="button"
        className="group grid size-9 place-items-center bg-red-50 text-red-700 transition-colors hover:bg-red-600 hover:text-white dark:bg-red-950/55 dark:text-red-300 dark:hover:bg-red-600 dark:hover:text-white"
        onClick={controls.close}
        title="Close"
        aria-label="Close window"
      >
        <X className="size-4 stroke-[2.2] transition-transform group-hover:scale-110" />
      </button>
    </div>
  );
}
