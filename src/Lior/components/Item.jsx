function Item({ item }) {
  return (
    <li>
      <b>{item.item_name}</b> - {item.category} | כמות: {item.quantity}
    </li>
  );
}

export default Item;
