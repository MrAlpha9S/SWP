import React from "react";

function EmailField({ value, onChange }) {
  return (
      <input
        type="email"
        name="email"
        value={value}
        onChange={onChange}
        className="w-full border rounded px-3 py-2"
      />
  );
}

export default EmailField;