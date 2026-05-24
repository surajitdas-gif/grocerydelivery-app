
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardTypeOptions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';

// ─── Design Tokens ────────────────────────────────────────────────────────────

const GOLD = '#B8962E';
const GOLD_LIGHT = '#D4AF5A';
const GOLD_FAINT = '#FDF6E7';
const GOLD_BORDER = '#E8D5A0';
const CREAM = '#FAFAF7';
const SURFACE = '#FFFFFF';
const SURFACE2 = '#F5F3EE';
const INK = '#1A1611';
const INK_MID = '#4A4238';
const INK_MUTED = '#9B9082';

// ─── Types ────────────────────────────────────────────────────────────────────

type Product = {
  _id?: string;
  name: string;
  price: number;
  quantity: string;
  image: string;
  category: string;
};

// ─── FormField Component ──────────────────────────────────────────────────────

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
        placeholderTextColor={INK_MUTED}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType ?? 'default'}
        style={[fieldStyles.input, focused && fieldStyles.inputFocused]}
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
    fontSize: 10,
    fontWeight: '700',
    color: GOLD,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 7,
  },
  input: {
    backgroundColor: SURFACE2,
    borderWidth: 1.5,
    borderColor: '#E8E4DC',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 14,
    color: INK,
    fontWeight: '500',
  },
  inputFocused: {
    borderColor: GOLD,
    backgroundColor: SURFACE,
  },
});

// ─── ProductCard Component ────────────────────────────────────────────────────

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
      {/* Gold top accent line */}
      <View style={styles.cardTopLine} />

      <Image source={{ uri: item.image }} style={styles.productImage} />

      <View style={styles.cardBody}>
        <View style={styles.cardRow}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productPrice}>₹{item.price}</Text>
        </View>

        <View style={styles.cardMeta}>
          <View style={styles.metaChip}>
            <Text style={styles.metaChipText}>{item.category}</Text>
          </View>
          <View style={[styles.metaChip, { backgroundColor: SURFACE2 }]}>
            <Text style={[styles.metaChipText, { color: INK_MID }]}>{item.quantity}</Text>
          </View>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.editBtn} onPress={() => onEdit(item)}>
            <Text style={styles.editText}>✏ Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => onDelete(item._id || '')}
          >
            <Text style={styles.deleteText}>✕ Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const FILTERS = [
  'All',
  'Vegetables',
  'Fruits',
  'Milk',
  'Snacks',
  'Grains',
  'Eggs',
  'Cleaning',
  'Others',
];

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [editId, setEditId] = useState('');
  const [uploading, setUploading] = useState(false);

  const BASE_URL = 'https://grocerydelivery-backend.onrender.com';

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/products/all-products`);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log(error);
      setProducts([]);
    }
  };

  const pickAndUploadImage = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) { Alert.alert('Permission required'); return; }

      const result = await ImagePicker.launchImageLibraryAsync({
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

      const response = await fetch(`${BASE_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();

      if (data.success) {
        setImage(data.imageUrl);
        Alert.alert('Success', 'Image uploaded successfully');
      } else {
        Alert.alert('Upload Failed');
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const uploadProduct = async () => {
    if (!name || !price || !quantity || !image || !category) {
      Alert.alert('Please fill all fields');
      return;
    }
    try {
      const url = editId
        ? `${BASE_URL}/api/products/update-product/${editId}`
        : `${BASE_URL}/api/products/add-product`;

      await fetch(url, {
        method: editId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          price: Number(price),
          quantity,
          image,
          category,
        }),
      });

      Alert.alert('Success', editId ? 'Product updated' : 'Product uploaded');
      setName(''); setPrice(''); setQuantity('');
      setImage(''); setCategory(''); setEditId('');
      loadProducts();
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Something went wrong');
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await fetch(`${BASE_URL}/api/products/delete-product/${id}`, {
        method: 'DELETE',
      });
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
    await AsyncStorage.multiRemove(['token', 'user', 'deliveryUser', 'adminUser']);
    router.replace('/auth/login' as any);
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={INK} />

      {/* ══ HEADER ══════════════════════════════════════════════════════════ */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerEye}>CONTROL PANEL</Text>
          <Text style={styles.headerTitle}>Admin Dashboard</Text>
          <Text style={styles.headerSub}>Manage Grocery Products</Text>
        </View>

        <View style={styles.headerRight}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{products.length} Products</Text>
          </View>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ══ ADMIN MENU ══════════════════════════════════════════════════════ */}
      <View style={styles.adminMenu}>
        <TouchableOpacity
          style={styles.menuCard}
          onPress={() => router.push('/admin/orders')}
        >
          <Text style={styles.menuEmoji}>📦</Text>
          <Text style={styles.menuTitle}>Orders</Text>
          <Text style={styles.menuSub}>Manage orders</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuCard}
          onPress={() =>
            router.push('/admin/users')
          }
        >
          <Text style={styles.menuEmoji}>👥</Text>

          <Text style={styles.menuTitle}>
            Users
          </Text>

          <Text style={styles.menuSub}>
            Customer data
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuCard}>
          <Text style={styles.menuEmoji}>🚚</Text>
          <Text style={styles.menuTitle}>Delivery</Text>
          <Text style={styles.menuSub}>Delivery boys</Text>
        </TouchableOpacity>
      </View>

      {/* ══ SCROLL BODY ═════════════════════════════════════════════════════ */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── ADD / EDIT FORM ─────────────────────────────────────────── */}
        <View style={styles.formCard}>
          {/* Card header */}
          <View style={styles.formHeader}>
            <View style={styles.formHeaderDot} />
            <Text style={styles.formHeaderTitle}>
              {editId ? 'Edit Product' : 'Add New Product'}
            </Text>
          </View>

          <FormField
            label="Product Name"
            placeholder="e.g. Fresh Broccoli"
            value={name}
            onChangeText={setName}
          />
          <FormField
            label="Price (₹)"
            placeholder="e.g. 49"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
          />
          <FormField
            label="Quantity"
            placeholder="e.g. 1kg / 500g / 1L"
            value={quantity}
            onChangeText={setQuantity}
          />
          <FormField
            label="Category"
            placeholder="Vegetables / Fruits / Dairy"
            value={category}
            onChangeText={setCategory}
          />

          {/* Image picker */}
          <Text style={fieldStyles.label}>Product Image</Text>
          <TouchableOpacity style={styles.uploadBtn} onPress={pickAndUploadImage}>
            {uploading ? (
              <ActivityIndicator color={GOLD} />
            ) : (
              <Text style={styles.uploadText}>
                {image ? '✓ Image Selected — Change' : '📷  Choose Product Image'}
              </Text>
            )}
          </TouchableOpacity>

          {image ? (
            <Image source={{ uri: image }} style={styles.previewImage} />
          ) : null}

          {/* Submit */}
          <TouchableOpacity style={styles.submitBtn} onPress={uploadProduct}>
            <Text style={styles.submitText}>
              {editId ? '✓  Update Product' : '+  Upload Product'}
            </Text>
          </TouchableOpacity>

          {/* Cancel edit */}
          {editId ? (
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => {
                setName(''); setPrice(''); setQuantity('');
                setImage(''); setCategory(''); setEditId('');
              }}
            >
              <Text style={styles.cancelText}>Cancel Edit</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {/* ── ALL PRODUCTS ────────────────────────────────────────────── */}
        <View style={styles.sectionRow}>
          <View>
            <Text style={styles.sectionEye}>INVENTORY</Text>
            <Text style={styles.sectionTitle}>All Products</Text>
          </View>
          <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>{products.length}</Text>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 15 }}
        >
          {FILTERS.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setSelectedCategory(cat)}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                marginRight: 8,
                borderRadius: 20,
                backgroundColor:
                  selectedCategory === cat
                    ? GOLD
                    : SURFACE,
              }}
            >
              <Text
                style={{
                  color:
                    selectedCategory === cat
                      ? '#fff'
                      : INK,
                  fontWeight: '700',
                }}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {(
          selectedCategory === 'All'
            ? products
            : products.filter(
              p =>
                p.category?.toLowerCase() ===
                selectedCategory.toLowerCase()
            )
        ).map((item, index) => (

          <View
            key={item._id ?? index}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#fff',
              padding: 12,
              borderRadius: 12,
              marginBottom: 10
            }}
          >

            <Image
              source={{ uri: item.image }}
              style={{
                width: 55,
                height: 55,
                borderRadius: 8
              }}
            />

            <View
              style={{
                flex: 1,
                marginLeft: 10
              }}
            >
              <Text>{item.name}</Text>
              <Text>{item.category}</Text>
            </View>

            <Text>₹{item.price}</Text>

            <TouchableOpacity
              onPress={() => editProduct(item)}
              style={{ marginLeft: 10 }}
            >
              <Text>✏</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                deleteProduct(item._id || '')
              }
              style={{ marginLeft: 10 }}
            >
              <Text>🗑</Text>
            </TouchableOpacity>

          </View>

        ))}

        <View style={{ height: 48 }} />
      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const SHADOW_SM = {
  shadowColor: '#B8962E',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 8,
  elevation: 2,
};

const SHADOW_MD = {
  shadowColor: '#1A1611',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.10,
  shadowRadius: 14,
  elevation: 4,
};

const styles = StyleSheet.create({

  // ── Root ─────────────────────────────────────────────────────────────────
  root: {
    flex: 1,
    backgroundColor: CREAM,
  },

  // ── Header ───────────────────────────────────────────────────────────────
  header: {
    backgroundColor: INK,
    paddingTop: 56,
    paddingBottom: 24,
    paddingHorizontal: 22,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headerEye: {
    fontSize: 9,
    fontWeight: '700',
    color: GOLD,
    letterSpacing: 2.5,
    marginBottom: 6,
  },

  headerTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },

  headerSub: {
    color: 'rgba(255,255,255,0.45)',
    marginTop: 4,
    fontSize: 12,
    fontWeight: '400',
  },

  headerRight: {
    alignItems: 'flex-end',
    gap: 10,
  },

  badge: {
    backgroundColor: 'rgba(184,150,46,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(184,150,46,0.35)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 50,
  },

  badgeText: {
    color: GOLD_LIGHT,
    fontWeight: '700',
    fontSize: 12,
  },

  logoutBtn: {
    backgroundColor: 'rgba(220,38,38,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(220,38,38,0.25)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },

  logoutText: {
    color: '#F87171',
    fontWeight: '700',
    fontSize: 12,
  },

  // ── Admin Menu ────────────────────────────────────────────────────────────
  adminMenu: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 6,
    gap: 10,
  },

  menuCard: {
    backgroundColor: SURFACE,
    flex: 1,
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: GOLD_BORDER,
    ...SHADOW_SM,
  },

  menuEmoji: {
    fontSize: 26,
  },

  menuTitle: {
    marginTop: 8,
    fontWeight: '800',
    fontSize: 13,
    color: INK,
  },

  menuSub: {
    marginTop: 3,
    fontSize: 10,
    color: INK_MUTED,
    textAlign: 'center',
  },

  // ── Scroll ────────────────────────────────────────────────────────────────
  scroll: {
    flex: 1,
  },

  scrollContent: {
    padding: 18,
  },

  // ── Form Card ─────────────────────────────────────────────────────────────
  formCard: {
    backgroundColor: SURFACE,
    borderRadius: 22,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1.5,
    borderColor: GOLD_BORDER,
    ...SHADOW_MD,
  },

  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EDE9E0',
  },

  formHeaderDot: {
    width: 4,
    height: 22,
    borderRadius: 2,
    backgroundColor: GOLD,
  },

  formHeaderTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: INK,
    letterSpacing: -0.3,
  },

  uploadBtn: {
    backgroundColor: GOLD_FAINT,
    borderWidth: 1.5,
    borderColor: GOLD_BORDER,
    borderStyle: 'dashed',
    paddingVertical: 14,
    borderRadius: 14,
    marginBottom: 14,
  },

  uploadText: {
    color: GOLD,
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 13,
  },

  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: GOLD_BORDER,
  },

  submitBtn: {
    backgroundColor: INK,
    paddingVertical: 15,
    borderRadius: 14,
    marginTop: 4,
  },

  submitText: {
    color: GOLD_LIGHT,
    textAlign: 'center',
    fontWeight: '800',
    fontSize: 14,
    letterSpacing: 0.3,
  },

  cancelBtn: {
    paddingVertical: 12,
    marginTop: 10,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E8E4DC',
  },

  cancelText: {
    color: INK_MUTED,
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 13,
  },

  // ── Section Header ────────────────────────────────────────────────────────
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  sectionEye: {
    fontSize: 9,
    fontWeight: '700',
    color: GOLD,
    letterSpacing: 2,
    marginBottom: 3,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: INK,
    letterSpacing: -0.5,
  },

  countBadge: {
    backgroundColor: GOLD_FAINT,
    borderWidth: 1,
    borderColor: GOLD_BORDER,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },

  countBadgeText: {
    color: GOLD,
    fontWeight: '800',
    fontSize: 13,
  },

  // ── Product Card ──────────────────────────────────────────────────────────
  card: {
    backgroundColor: SURFACE,
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#EDE9E0',
    ...SHADOW_SM,
  },

  cardTopLine: {
    height: 3,
    backgroundColor: GOLD,
    width: '100%',
  },

  cardBody: {
    padding: 14,
  },

  productImage: {
    width: '100%',
    height: 170,
  },

  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
    marginTop: 4,
  },

  productName: {
    fontSize: 16,
    fontWeight: '800',
    color: INK,
    flex: 1,
    marginRight: 8,
  },

  productPrice: {
    fontSize: 17,
    fontWeight: '800',
    color: GOLD,
  },

  cardMeta: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },

  metaChip: {
    backgroundColor: GOLD_FAINT,
    borderWidth: 1,
    borderColor: GOLD_BORDER,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 50,
  },

  metaChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: GOLD,
  },

  productCategory: {
    color: INK_MUTED,
    marginTop: 4,
    fontSize: 13,
  },

  productQuantity: {
    color: INK_MUTED,
    marginTop: 2,
    fontSize: 13,
  },

  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },

  editBtn: {
    flex: 1,
    backgroundColor: GOLD_FAINT,
    borderWidth: 1,
    borderColor: GOLD_BORDER,
    paddingVertical: 11,
    borderRadius: 12,
  },

  editText: {
    textAlign: 'center',
    color: GOLD,
    fontWeight: '700',
    fontSize: 13,
  },

  deleteBtn: {
    flex: 1,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    paddingVertical: 11,
    borderRadius: 12,
  },

  deleteText: {
    textAlign: 'center',
    color: '#DC2626',
    fontWeight: '700',
    fontSize: 13,
  },
});