import React from "react";

function UsernameField({ value, onChange }) {
  return (
    <input
      type="text"
      name="username"
      value={value}
      onChange={onChange}
      className="w-full border rounded px-3 py-2"
    />
  );
}

export default UsernameField;