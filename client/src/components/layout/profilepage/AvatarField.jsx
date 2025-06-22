import React from "react";

function AvatarField({ value, onChange }) {
  return (
    <div className="mb-4">
      <label className="block mb-1 font-semibold">Avatar</label>
      <input
        type="text"
        name="avatar"
        value={value}
        onChange={onChange}
        className="w-full border rounded px-3 py-2 mb-2"
        placeholder="Link ảnh đại diện"
      />
      {value && (
        <img src={value} alt="avatar" className="w-20 h-20 rounded-full border mx-auto" />
      )}
    </div>
  );
}

export default AvatarField;