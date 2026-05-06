
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
  Image,
  ActivityIndicator,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

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
      <Image
        source={{ uri: item.image }}
        style={styles.productImage}
      />

      <Text style={styles.productName}>
        {item.name}
      </Text>

      <Text style={styles.productPrice}>
        ₹{item.price}
      </Text>

      <Text style={styles.productCategory}>
        {item.category}
      </Text>

      <Text style={styles.productQuantity}>
        {item.quantity}
      </Text>

      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => onEdit(item)}
        >
          <Text style={styles.editText}>
            Edit
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => onDelete(item._id || '')}
        >
          <Text style={styles.deleteText}>
            Delete
          </Text>
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

  const [uploading, setUploading] =
    useState(false);

  const BASE_URL = 'http://172.20.10.3:5000';

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/api/products/all-products`
      );

      const data = await res.json();

      setProducts(Array.isArray(data) ? data : []);

    } catch (error) {
      console.log(error);
      setProducts([]);
    }
  };
const pickAndUploadImage = async () => {
  try {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permission required');
      return;
    }

    const result =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.7,
        allowsEditing: true,
      });

    if (result.canceled) return;

    setUploading(true);

    const formData = new FormData();

    formData.append('image', {
      uri: result.assets[0].uri,
      type: 'image/jpeg',
      name: 'product.jpg',
    } as any);

    const response = await fetch(
      `${BASE_URL}/api/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const data = await response.json();

    console.log(data);

    if (data.success) {
      setImage(data.imageUrl);

      Alert.alert(
        'Success',
        'Image uploaded successfully'
      );
    } else {
      Alert.alert(
        'Upload Failed'
      );
    }

  } catch (error) {
    console.log(error);

    Alert.alert(
      'Error',
      'Image upload failed'
    );

  } finally {
    setUploading(false);
  }
};
  const uploadProduct = async () => {
    if (
      !name ||
      !price ||
      !quantity ||
      !image ||
      !category
    ) {
      Alert.alert(
        'Please fill all fields'
      );
      return;
    }

    try {
      const url = editId
        ? `${BASE_URL}/api/products/update-product/${editId}`
        : `${BASE_URL}/api/products/add-product`;

      await fetch(url, {
        method: editId ? 'PUT' : 'POST',

        headers: {
          'Content-Type':
            'application/json',
        },

        body: JSON.stringify({
          name,
          price: Number(price),
          quantity,
          image,
          category,
        }),
      });

      Alert.alert(
        'Success',
        editId
          ? 'Product updated'
          : 'Product uploaded'
      );

      setName('');
      setPrice('');
      setQuantity('');
      setImage('');
      setCategory('');
      setEditId('');

      loadProducts();

    } catch (error) {
      console.log(error);

      Alert.alert(
        'Error',
        'Something went wrong'
      );
    }
  };

  const deleteProduct = async (
    id: string
  ) => {
    try {
      await fetch(
        `${BASE_URL}/api/products/delete-product/${id}`,
        {
          method: 'DELETE',
        }
      );

      loadProducts();

    } catch (error) {
      console.log(error);
    }
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

          <Text style={styles.headerSub}>
            Manage Grocery Products
          </Text>
        </View>

        <View style={styles.headerRight}>
          <Text style={styles.badge}>
            {products.length} Products
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

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formCard}>
          <FormField
            label="Product Name"
            placeholder="Enter product name"
            value={name}
            onChangeText={setName}
          />

          <FormField
            label="Price"
            placeholder="Enter price"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
          />

          <FormField
            label="Quantity"
            placeholder="1kg / 500g / 1L"
            value={quantity}
            onChangeText={setQuantity}
          />

          <FormField
            label="Category"
            placeholder="Vegetables / Fruits"
            value={category}
            onChangeText={setCategory}
          />

          <Text style={fieldStyles.label}>
            Product Image
          </Text>

          <TouchableOpacity
            style={styles.uploadBtn}
            onPress={pickAndUploadImage}
          >
            {uploading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.uploadText}>
                Choose Product Image
              </Text>
            )}
          </TouchableOpacity>

          {image ? (
            <Image
              source={{ uri: image }}
              style={styles.previewImage}
            />
          ) : null}

          <TouchableOpacity
            style={styles.submitBtn}
            onPress={uploadProduct}
          >
            <Text style={styles.submitText}>
              {editId
                ? 'Update Product'
                : 'Upload Product'}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>
          All Products
        </Text>

        {products.map((item, index) => (
          <ProductCard
            key={item._id ?? index}
            item={item}
            onEdit={editProduct}
            onDelete={deleteProduct}
          />
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },

  header: {
    backgroundColor: '#0f172a',
    paddingTop: 58,
    paddingBottom: 26,
    paddingHorizontal: 22,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headerTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
  },

  headerSub: {
    color: '#cbd5e1',
    marginTop: 4,
  },

  headerRight: {
    alignItems: 'flex-end',
  },

  badge: {
    color: '#fff',
    marginBottom: 10,
    fontWeight: '600',
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

  scroll: {
    padding: 18,
  },

  formCard: {
    backgroundColor: '#fff',
    borderRadius: 22,
    padding: 18,
    marginBottom: 24,
  },

  uploadBtn: {
    backgroundColor: '#4f46e5',
    paddingVertical: 14,
    borderRadius: 14,
    marginBottom: 18,
  },

  uploadText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
  },

  previewImage: {
    width: '100%',
    height: 220,
    borderRadius: 18,
    marginBottom: 20,
  },

  submitBtn: {
    backgroundColor: '#111827',
    paddingVertical: 15,
    borderRadius: 14,
  },

  submitText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 15,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 14,
    color: '#0f172a',
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 14,
    marginBottom: 18,
  },

  productImage: {
    width: '100%',
    height: 180,
    borderRadius: 16,
    marginBottom: 12,
  },

  productName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },

  productPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#16a34a',
    marginTop: 4,
  },

  productCategory: {
    color: '#64748b',
    marginTop: 4,
  },

  productQuantity: {
    color: '#64748b',
    marginTop: 2,
  },

  actionRow: {
    flexDirection: 'row',
    marginTop: 14,
    gap: 10,
  },

  editBtn: {
    flex: 1,
    backgroundColor: '#eef2ff',
    paddingVertical: 12,
    borderRadius: 12,
  },

  deleteBtn: {
    flex: 1,
    backgroundColor: '#fee2e2',
    paddingVertical: 12,
    borderRadius: 12,
  },

  editText: {
    textAlign: 'center',
    color: '#4338ca',
    fontWeight: '700',
  },

  deleteText: {
    textAlign: 'center',
    color: '#dc2626',
    fontWeight: '700',
  },
});