import React from "react";

function RoleField({ value }) {
  return (
      <input
        type="text"
        name="role"
        value={value}
        disabled
        className="w-full border rounded px-3 py-2 bg-gray-100"
      />
  );
}

export default RoleField;