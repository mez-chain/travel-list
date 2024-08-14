import { useState } from "react";

export default function PackingList({
  items,
  onDeleteItem,
  onUpdateItem,
  onClearItems,
}) {
  const [sortBy, setSortBy] = useState("input");
  let sortedItems;

  if (sortBy === "input") sortedItems = items;

  if (sortBy === "description")
    sortedItems = items
      .slice()
      .sort((a, b) => a.description.localeCompare(b.description));

  if (sortBy === "packed")
    sortedItems = items
      .slice()
      .sort((a, b) => Number(a.packed) - Number(b.packed));

  const [showPopup, setShowPopup] = useState(false);

  function togglePopup() {
    setShowPopup(!showPopup);
  }

  return (
    <div className="list">
      <ul>
        {sortedItems.map((item) => (
          <Item
            item={item}
            onDeleteItem={onDeleteItem}
            onUpdateItem={onUpdateItem}
            key={item.id}
          />
        ))}
      </ul>

      <div className="actions">
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="input">SORT BY INPUT ORDER</option>
          <option value="description">SORT BY DESCRIPTION</option>
          <option value="packed">SORT BY PACKED STATUS</option>
        </select>

        <button onClick={togglePopup}>CLEAR LIST</button>
        <ChoicePopup
          togglePopup={togglePopup}
          showPopup={showPopup}
          onClearItems={onClearItems}
        />
      </div>
    </div>
  );
}

function Item({ item, onDeleteItem, onUpdateItem }) {
  const itemStyle = { textDecoration: "line-through", color: "gray" };

  return (
    <li>
      <input
        type="checkbox"
        value={item.packed}
        checked={item.packed}
        onChange={() => onUpdateItem(item.id)}
      />
      <span style={item.packed ? itemStyle : {}}>
        {item.quantity} {item.description}
      </span>
      <button onClick={() => onDeleteItem(item.id)}>❌</button>
    </li>
  );
}

function ChoicePopup({ showPopup, onClearItems, togglePopup }) {
  function handleChoice(choice) {
    if (choice === "yes") onClearItems();
    else togglePopup();
    togglePopup();
  }
  return (
    showPopup && (
      <div className="popup">
        <h3>Do you want to clear the list?</h3>
        <button onClick={() => handleChoice("yes")}>Yes</button>
        <button onClick={() => handleChoice("no")}>No</button>
      </div>
    )
  );
}
