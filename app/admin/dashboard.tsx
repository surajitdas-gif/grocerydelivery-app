import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  StatusBar,
  KeyboardTypeOptions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

type Product = {
  _id?: string;
  name: string;
  price: number;
  quantity: string;
  image: string;
  category: string;
};

function FormField({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (t: string) => void;
  keyboardType?: KeyboardTypeOptions;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={fieldStyles.wrapper}>
      <Text style={fieldStyles.label}>{label}</Text>

      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#94a3b8"
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType ?? 'default'}
        style={[
          fieldStyles.input,
          focused && fieldStyles.inputFocused,
        ]}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </View>
  );
}

const fieldStyles = StyleSheet.create({
  wrapper: {
    marginBottom: 14,
  },

  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
    marginBottom: 6,
  },

  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 13,
  },

  inputFocused: {
    borderColor: '#6366f1',
    backgroundColor: '#fff',
  },
});

function ProductCard({
  item,
  onEdit,
  onDelete,
}: {
  item: Product;
  onEdit: (item: Product) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.productName}>{item.name}</Text>
      <Text>₹{item.price}</Text>
      <Text>{item.category}</Text>

      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => onEdit(item)}
        >
          <Text>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => onDelete(item._id || '')}
        >
          <Text>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function AdminDashboard() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
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
      setProducts(Array.isArray(data) ? data : []);

    } catch {
      setProducts([]);
    }
  };

  const uploadProduct = async () => {
    if (!name || !price || !quantity || !image || !category) {
      Alert.alert('Fill all fields');
      return;
    }

    const url = editId
      ? `http://172.20.10.4:5000/api/products/update-product/${editId}`
      : 'http://172.20.10.4:5000/api/products/add-product';

    await fetch(url, {
      method: editId ? 'PUT' : 'POST',
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

    setName('');
    setPrice('');
    setQuantity('');
    setImage('');
    setCategory('');
    setEditId('');

    loadProducts();
  };

  const deleteProduct = async (id: string) => {
    await fetch(
      `http://172.20.10.4:5000/api/products/delete-product/${id}`,
      {
        method: 'DELETE',
      }
    );

    loadProducts();
  };

  const editProduct = (item: Product) => {
    setName(item.name);
    setPrice(String(item.price));
    setQuantity(item.quantity);
    setImage(item.image);
    setCategory(item.category);
    setEditId(item._id || '');
  };

  const handleLogout = async () => {
    await AsyncStorage.multiRemove([
      'token',
      'user',
      'deliveryUser',
      'adminUser',
    ]);

    router.replace('/auth/login' as any);
  };

  return (
    <View style={styles.root}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#0f172a"
      />

      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>
            Admin Dashboard
          </Text>
        </View>

        <View style={styles.headerRight}>
          <Text style={styles.badge}>
            {products.length} Items
          </Text>

          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={handleLogout}
          >
            <Text style={styles.logoutText}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={{ padding: 20 }}>
        <FormField
          label="Product Name"
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />

        <FormField
          label="Price"
          placeholder="Price"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />

        <FormField
          label="Quantity"
          placeholder="Quantity"
          value={quantity}
          onChangeText={setQuantity}
        />

        <FormField
          label="Category"
          placeholder="Category"
          value={category}
          onChangeText={setCategory}
        />

        <FormField
          label="Image URL"
          placeholder="Image"
          value={image}
          onChangeText={setImage}
        />

        <TouchableOpacity
          style={styles.submitBtn}
          onPress={uploadProduct}
        >
          <Text style={styles.submitText}>
            {editId ? 'Update Product' : 'Upload Product'}
          </Text>
        </TouchableOpacity>

        {products.map((item, index) => (
          <ProductCard
            key={item._id ?? index}
            item={item}
            onEdit={editProduct}
            onDelete={deleteProduct}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },

  header: {
    backgroundColor: '#0f172a',
    paddingTop: 56,
    paddingBottom: 24,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  headerTitle: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '700',
  },

  headerRight: {
    alignItems: 'flex-end',
    gap: 8,
  },

  badge: {
    color: '#fff',
  },

  logoutBtn: {
    backgroundColor: '#fee2e2',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },

  logoutText: {
    color: '#dc2626',
    fontWeight: '700',
  },

  submitBtn: {
    backgroundColor: '#4f46e5',
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
  },

  submitText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
  },

  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 14,
    marginBottom: 14,
  },

  productName: {
    fontWeight: '700',
    fontSize: 16,
  },

  actionRow: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },

  editBtn: {
    backgroundColor: '#eef2ff',
    padding: 8,
    borderRadius: 8,
  },

  deleteBtn: {
    backgroundColor: '#fff1f2',
    padding: 8,
    borderRadius: 8,
  },
});