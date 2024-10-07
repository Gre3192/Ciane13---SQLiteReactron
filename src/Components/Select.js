const Select = ({ items, def }) => {
  return (
    <>
      <select defaultValue={def} className="border rounded-xl p-2 cursor-pointer">
        {items.map((item, index) => (
          <option key={index} value={item}>
            {item}
          </option>
        ))}
      </select>
    </>
  );
};

export default Select;
