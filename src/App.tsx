import React, { useEffect, useRef, useState, useReducer } from "react";
import "./App.scss";
import { createMachine, assign } from "xstate";
import { useMachine } from "@xstate/react";

// interface FileDropContext {
//   count: number;
// }

// const FileDropMachine = createMachine<FileDropContext>({
// });

const states = {
  IDLE: "IDLE",
  HOVERING: "HOVERING",
  DRAGGING: "DRAGGING",
  UPLOADING: "UPLOADING",
  ERROR: "ERROR",
  SUCCESS: "SUCCESS"
};

const events = {
  MOUSEENTER: "MOUSEENTER",
  MOUSELEAVE: "MOUSELEAVE",
  CLICK: "CLICK",
  DRAGENTER: "DRAGENTER",
  DRAGLEAVE: "",
  DROP: "DROP",
  PROCESSING: "PROCESSING",
  ERROR: "ERROR",
  SUCCESS: "SUCCESS",
  RESET: "RESET"
};

// This sucks and I need to fix to XState!!!!

const fileDropMachine = {
  id: "filedrop",
  initial: states.IDLE,
  context: {
    progress: 0
  },
  states: {
    [states.IDLE]: {
      on: {
        [events.CLICK]: states.UPLOADING,
        [events.MOUSEENTER]: states.HOVERING
      }
    },
    [states.HOVERING]: {
      on: {
        [events.CLICK]: states.UPLOADING,
        [events.MOUSELEAVE]: states.IDLE
      }
    },
    [states.DRAGGING]: {
      on: {
        [events.DRAGLEAVE]: [{ target: states.ERROR, cond: "hasError" }]
      }
    },
    [states.UPLOADING]: {
      on: { [events.SUCCESS]: states.SUCCESS }
    },
    [states.ERROR]: {
      entry: "showError",
      on: { [events.DRAGLEAVE]: states.DRAGGING }
    },
    [states.SUCCESS]: {
      on: {
        [events.CLICK]: states.IDLE,
        [events.RESET]: states.IDLE
      }
    }
  }
};

function fileDropReducer(state, event) {
  return (
    (fileDropMachine.states[state] &&
      fileDropMachine.states[state].on[event]) ||
    state
  );
}

/* ---------------------------------- */

function CloudIcon({ state }) {
  const svgDisplayProps = {
    viewBox: "0 0 32 32",
    width: "100",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeMiterlimit: "2",
    fill: "none",
    stroke: "#000",
    strokeWidth: "2"
  };

  return (
    <div className="cloud-icon">
      <svg className="cloud" data-hidden="false" {...svgDisplayProps}>
        <path d="M18 22h6.001A5.003 5.003 0 0029 17a4.997 4.997 0 00-3.117-4.634 5.503 5.503 0 00-7.789-3.813 7 7 0 00-13.082 3.859A5.007 5.007 0 002 17c0 2.761 2.232 5 4.999 5H13" />
      </svg>
      <svg
        className="line"
        data-hidden={[states.UPLOADING, states.HOVERING].includes(state)}
        {...svgDisplayProps}
      >
        <path d="M18 22h-5" />
      </svg>
      <svg
        className="arrow"
        data-hidden={![states.UPLOADING, states.HOVERING].includes(state)}
        {...svgDisplayProps}
      >
        <path d="M15.5 15.151v11.824-11.824z" />
        <path d="M12.075 18.34l3.425-3.528 3.425 3.528" />
      </svg>
      <svg
        className="check"
        data-hidden={![states.SUCCESS].includes(state)}
        {...svgDisplayProps}
      >
        <path d="M11.4 15.787l3.426 2.553 5.774-5.556" />
      </svg>
    </div>
  );
}

/* ---------------------------------- */

function Progress(props) {
  const { duration } = props;
  const valueRef = useRef(0);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      valueRef.current = valueRef.current + 1;
      setValue(valueRef.current);
    }, duration / 100);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <>
      <p className="progress-label">Image.png</p>
      <progress min={0} max={100} value={value} />
    </>
  );
}

/* ---------------------------------- */

const TIMEOUT = 1000;

function FileUploader() {
  const [state, dispatch] = useReducer(
    fileDropReducer,
    fileDropMachine.initial
  );

  useEffect(() => {
    switch (state) {
      case states.UPLOADING:
        setTimeout(() => dispatch(events.SUCCESS), TIMEOUT);
        break;
      case states.SUCCESS:
        setTimeout(() => dispatch(events.RESET), TIMEOUT);
        break;
    }
  }, [state]);

  const showProgress = [states.UPLOADING].includes(state);

  return (
    <div
      className="file-uploader"
      data-state={state}
      onDragEnter={() => dispatch("MOUSEENTER")}
      onDragLeave={() => dispatch("MOUSELEAVE")}
      onDrop={() => dispatch("CLICK")}
      onMouseEnter={() => dispatch("MOUSEENTER")}
      onMouseLeave={() => dispatch("MOUSELEAVE")}
      onClick={() => dispatch("CLICK")}
    >
      <CloudIcon state={state} />

      {/* <input
        ref={fileInputRef}
        className="file-input"
        type="file"
        multiple
        onChange={filesSelected}
      /> */}

      <div className="message">
        <strong data-hidden={![states.IDLE, states.HOVERING].includes(state)}>
          Upload
          {/* Drag & Drop image file here or click to select an image. */}
        </strong>

        <strong
          className="message-uploading"
          data-hidden={![states.UPLOADING].includes(state)}
        >
          Uploading
        </strong>

        <strong
          className="message-done"
          data-hidden={![states.SUCCESS].includes(state)}
        >
          Done!
        </strong>
      </div>

      <div className="progress" data-hidden={!showProgress}>
        {showProgress && <Progress duration={TIMEOUT} />}
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="app">
      <FileUploader />
    </div>
  );
}

export default App;
