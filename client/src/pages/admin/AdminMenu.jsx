import { useEffect, useState } from "react";
import api from "../../api/axios";
import Loader from "../../components/Loader";

const emptyItemForm = { name: "", description: "", price: "", categoryId: "", isVeg: true };

export default function AdminMenu() {
  const [restaurants, setRestaurants] = useState([]);
  const [restaurantId, setRestaurantId] = useState("");
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [itemForm, setItemForm] = useState(emptyItemForm);
  const [editingItemId, setEditingItemId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/restaurants").then(({ data }) => {
      setRestaurants(data.restaurants);
      if (data.restaurants.length > 0) setRestaurantId(data.restaurants[0]._id);
      setLoading(false);
    });
  }, []);

  const loadRestaurantData = async (rid) => {
    if (!rid) return;
    const [catRes, menuRes] = await Promise.all([
      api.get("/categories", { params: { restaurantId: rid } }),
      api.get("/menu", { params: { restaurantId: rid } }),
    ]);
    setCategories(catRes.data.categories);
    setItems(menuRes.data.items);
  };

  useEffect(() => {
    loadRestaurantData(restaurantId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurantId]);

  const addCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    await api.post("/categories", { restaurantId, name: newCategory });
    setNewCategory("");
    loadRestaurantData(restaurantId);
  };

  const deleteCategory = async (id) => {
    if (!window.confirm("Delete this category? Menu items under it will remain but lose their category link.")) return;
    await api.delete(`/categories/${id}`);
    loadRestaurantData(restaurantId);
  };

  const handleItemChange = (e) => {
    const { name, value, type, checked } = e.target;
    setItemForm({ ...itemForm, [name]: type === "checkbox" ? checked : value });
  };

  const submitItem = async (e) => {
    e.preventDefault();
    const payload = { ...itemForm, restaurantId, price: Number(itemForm.price) };
    if (editingItemId) {
      await api.put(`/menu/${editingItemId}`, payload);
    } else {
      await api.post("/menu", payload);
    }
    setItemForm(emptyItemForm);
    setEditingItemId(null);
    loadRestaurantData(restaurantId);
  };

  const editItem = (item) => {
    setItemForm({
      name: item.name,
      description: item.description,
      price: item.price,
      categoryId: item.categoryId?._id || "",
      isVeg: item.isVeg,
    });
    setEditingItemId(item._id);
  };

  const toggleAvailability = async (item) => {
    await api.put(`/menu/${item._id}`, { available: !item.available });
    loadRestaurantData(restaurantId);
  };

  const deleteItem = async (id) => {
    if (!window.confirm("Delete this menu item?")) return;
    await api.delete(`/menu/${id}`);
    loadRestaurantData(restaurantId);
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h1>Menu Management</h1>

      <label>Restaurant</label>
      <select value={restaurantId} onChange={(e) => setRestaurantId(e.target.value)}>
        {restaurants.map((r) => <option key={r._id} value={r._id}>{r.name}</option>)}
      </select>

      <h3>Categories</h3>
      <form className="inline-form" onSubmit={addCategory}>
        <input placeholder="New category name" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />
        <button type="submit" className="btn-primary">Add Category</button>
      </form>
      <div className="chip-row">
        {categories.map((c) => (
          <span className="chip" key={c._id}>
            {c.name} <button className="chip-remove" onClick={() => deleteCategory(c._id)}>×</button>
          </span>
        ))}
      </div>

      <h3>Menu Items</h3>
      <form className="inline-form" onSubmit={submitItem}>
        <input name="name" placeholder="Item name" required value={itemForm.name} onChange={handleItemChange} />
        <input name="price" type="number" placeholder="Price" required value={itemForm.price} onChange={handleItemChange} />
        <select name="categoryId" required value={itemForm.categoryId} onChange={handleItemChange}>
          <option value="">-- Category --</option>
          {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
        <label className="checkbox-inline">
          <input type="checkbox" name="isVeg" checked={itemForm.isVeg} onChange={handleItemChange} /> Veg
        </label>
        <textarea name="description" placeholder="Description" value={itemForm.description} onChange={handleItemChange} rows={2} />
        <button type="submit" className="btn-primary">{editingItemId ? "Update" : "Add"} Item</button>
        {editingItemId && <button type="button" className="link-btn" onClick={() => { setItemForm(emptyItemForm); setEditingItemId(null); }}>Cancel</button>}
      </form>

      <table className="admin-table">
        <thead>
          <tr><th>Name</th><th>Category</th><th>Price</th><th>Veg</th><th>Available</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item._id}>
              <td>{item.name}</td>
              <td>{item.categoryId?.name}</td>
              <td>₹{item.price}</td>
              <td>{item.isVeg ? "Veg" : "Non-Veg"}</td>
              <td>
                <button className="link-btn" onClick={() => toggleAvailability(item)}>
                  {item.available ? "Available" : "Unavailable"}
                </button>
              </td>
              <td>
                <button className="link-btn" onClick={() => editItem(item)}>Edit</button>
                <button className="link-btn danger" onClick={() => deleteItem(item._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
