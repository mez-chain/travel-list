import { useState } from "react";
import Logo from "./logo";
import Form from "./form";
import PackingList from "./list";
import Stats from "./statistics";

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
