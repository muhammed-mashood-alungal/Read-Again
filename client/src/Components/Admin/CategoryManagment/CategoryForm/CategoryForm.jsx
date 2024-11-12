import React, { useState } from 'react';

const RightSidebar = () => {
  const [newCategory, setNewCategory] = useState({ name: '', image: '' });
  const handleCreateCategory = (e) => {
    e.preventDefault();
    // Add API call for creating a new category here
    console.log('Creating category:', newCategory);
    // Reset form
    setNewCategory({ name: '', image: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCategory(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="category-form ">
        <h4 className="card-title">Create New Category</h4>
        <form onSubmit={handleCreateCategory}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={newCategory.name}
              onChange={handleInputChange}
              className="form-control"
              placeholder="Category name"
              />
          </div>
          <div className="form-group">
            <label>Image URL</label>
            <input
              type="text"
              name="image"
              value={newCategory.image}
              onChange={handleInputChange}
              className="form-control"
              placeholder="Image URL"
            />
          </div>
          <button type="submit" className="primary-btn">
            Create
          </button>
        </form>
      </div>
  );
};

export default RightSidebar;
