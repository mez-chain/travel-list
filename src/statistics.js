export default function Stats({ items }) {
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
