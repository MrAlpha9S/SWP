import React from "react";

function CreatedAtField({ value }) {
  return (
      <input
        type="text"
        name="created_at"
        value={value ? new Date(value).toLocaleString() : ""}
        disabled
        className="w-full border rounded px-3 py-2 bg-gray-100"
      />
  );
}

export default CreatedAtField;