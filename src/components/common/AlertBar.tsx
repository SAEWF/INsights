import React, { useState } from "react";
import './styles/style.css'
import Alert from 'react-bootstrap/Alert';
import text from '../../opt/Alert_Text.js';

export default function AlertBar() {
  const [show, setShow] = useState(true);

  if (show) {
    return (
      <Alert className="text-center"
        style={{
          padding: "10px",
          backgroundColor: "#6b0aea",
          color: "#fff",
          marginBottom: "0",
        }}>
        <p className="d-inline">
          {text}
        </p>
        <button onClick={() => setShow(false)} className="closebtn d-inline">
          &times;</button>
      </Alert>
    );
  }
  return <> </>;
}


