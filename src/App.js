import { useState } from "react";

// const initialItems = [
//   { id: 1, description: "Passports", quantity: 2, packed: true },
//   { id: 2, description: "Socks", quantity: 12, packed: false },
//   { id: 3, description: "Charger", quantity: 3, packed: false },
//   { id: 4, description: "Shoes", quantity: 2, packed: true },
//   { id: 5, description: "Laptop", quantity: 1, packed: false },
// ];

export default function App() {
  const [items, setItems] = useState(
    JSON.parse(localStorage.getItem("items")) || []
  );

  function handleAddItems(item) {
    setItems((items) => [...items, item]);
    localStorage.setItem("items", JSON.stringify([...items, item]));
  }

  function handleDeleteItem(id) {
    setItems((items) => items.filter((item) => item.id !== id));
    localStorage.setItem(
      "items",
      JSON.stringify(items.filter((item) => item.id !== id))
    );
  }

  function handleUpdateItem(id) {
    setItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, packed: !item.packed } : { ...item }
      )
    );
    localStorage.setItem(
      "items",
      JSON.stringify(
        items.map((item) =>
          item.id === id ? { ...item, packed: !item.packed } : item
        )
      )
    );
  }

  function handleClearItems() {
    setItems([]);
    localStorage.setItem("items", JSON.stringify([]));
  }

  return (
    <div className="app">
      <Logo />
      <Form onAddItems={handleAddItems} />
      <PackingList
        items={items}
        onDeleteItem={handleDeleteItem}
        onUpdateItem={handleUpdateItem}
        onClearItems={handleClearItems}
      />
      <Stats items={items} />
    </div>
  );
}

function Logo() {
  return <h1>🌴 Far Away 👜</h1>;
}

function Form({ onAddItems }) {
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);

  function handleSubmit(e) {
    e.preventDefault();

    if (!description) return;

    const newItem = { description, quantity, packed: false, id: Date.now() };
    onAddItems(newItem);
    setDescription("");
    setQuantity(1);
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h3>What do you need for your 😍 trip?</h3>
      <select
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
      >
        {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
          <option value={num} key={num}>
            {num}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Item..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button>Add</button>
    </form>
  );
}

function PackingList({ items, onDeleteItem, onUpdateItem, onClearItems }) {
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

function Stats({ items }) {
  if (!items.length) {
    return (
      <p className="stats">
        <em>Start adding some items to you packing list 🚀</em>
      </p>
    );
  }

  const totalItems = items.length;
  const totalPackedItems = items.filter((item) => item.packed).length;
  const percentage = Math.round((totalPackedItems / totalItems) * 100);

  return (
    <footer className="stats">
      <em>
        {percentage === 100
          ? `You got everything! Ready to go ✈️`
          : `💼 You have ${totalItems} items on your list, and
        you already packed ${totalPackedItems} (${percentage}%)`}
      </em>
    </footer>
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
