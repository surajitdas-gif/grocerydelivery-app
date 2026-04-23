import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';

export default function AdminDashboard() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');

  const [products, setProducts] = useState<any[]>([]);
  const [editId, setEditId] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await fetch(
        'http://172.20.10.4:5000/api/products/all-products'
      );

      const data = await res.json();

      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.log(error);
      setProducts([]);
    }
  };

  const uploadProduct = async () => {
    if (!name || !price || !quantity || !category || !image) {
      Alert.alert('All fields required');
      return;
    }

    try {
      const url = editId
        ? `http://172.20.10.4:5000/api/products/update-product/${editId}`
        : 'http://172.20.10.4:5000/api/products/add-product';

      const method = editId ? 'PUT' : 'POST';

      await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          price: Number(price),
          quantity,
          image,
          category,
        }),
      });

      Alert.alert(editId ? 'Updated ✅' : 'Uploaded ✅');

      setName('');
      setPrice('');
      setQuantity('');
      setImage('');
      setCategory('');
      setEditId('');

      loadProducts();
    } catch (error) {
      console.log(error);
      Alert.alert('Failed');
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await fetch(
        `http://172.20.10.4:5000/api/products/delete-product/${id}`,
        {
          method: 'DELETE',
        }
      );

      loadProducts();
    } catch (error) {
      console.log(error);
    }
  };

  const editProduct = (item: any) => {
    setName(item.name || '');
    setPrice(String(item.price || ''));
    setQuantity(item.quantity || '');
    setImage(item.image || '');
    setCategory(item.category || '');
    setEditId(item._id || '');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Admin Dashboard 🛠️</Text>

      <TextInput
        placeholder="Product name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <TextInput
        placeholder="Price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        style={styles.input}
      />

      <TextInput
        placeholder="Quantity"
        value={quantity}
        onChangeText={setQuantity}
        style={styles.input}
      />

      <TextInput
        placeholder="Category"
        value={category}
        onChangeText={setCategory}
        style={styles.input}
      />

      <TextInput
        placeholder="Image URL"
        value={image}
        onChangeText={setImage}
        style={styles.input}
      />

      <TouchableOpacity style={styles.btn} onPress={uploadProduct}>
        <Text style={styles.text}>
          {editId ? 'Update Product' : 'Upload Product'}
        </Text>
      </TouchableOpacity>

      {products.length === 0 ? (
        <Text style={styles.empty}>No products found</Text>
      ) : (
        products.map((item, index) => (
          <View key={index} style={styles.productBox}>
            <Text style={styles.name}>{item.name || 'No name'}</Text>
            <Text>₹{item.price || 0}</Text>
            <Text>{item.quantity || 'N/A'}</Text>
            <Text>{item.category || 'N/A'}</Text>

            <View style={styles.row}>
              <TouchableOpacity onPress={() => editProduct(item)}>
                <Text style={styles.edit}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => deleteProduct(item._id)}>
                <Text style={styles.delete}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 20,
  },

  input: {
    borderWidth: 1,
    padding: 12,
    marginBottom: 12,
    borderRadius: 10,
  },

  btn: {
    backgroundColor: '#16a34a',
    padding: 14,
    borderRadius: 10,
    marginBottom: 20,
  },

  text: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
  },

  empty: {
    textAlign: 'center',
    marginTop: 30,
    color: '#666',
  },

  productBox: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },

  name: {
    fontWeight: '700',
    fontSize: 16,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  edit: {
    color: 'blue',
    fontWeight: '700',
  },

  delete: {
    color: 'red',
    fontWeight: '700',
  },
});