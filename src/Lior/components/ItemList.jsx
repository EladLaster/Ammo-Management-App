import Item from "./Item";

function ItemList({ items }) {
  return (
    <ul>
      {items.map((item) => (
        <Item key={item.item_id} item={item} />
      ))}
    </ul>
  );
}

export default ItemList;
