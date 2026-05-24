
import {
  router,
  useLocalSearchParams,
} from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useCart } from '../../src/context/CartContext';

export default function CartScreen() {
  const {
    cart,
    increaseQty,
    decreaseQty,
    addToCart,
  } = useCart();
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const { reorder } =
    useLocalSearchParams();
  useEffect(() => {
    if (reorder) {
      try {
        const items = JSON.parse(
          reorder as string
        );

        items.forEach((item: any) => {
          for (
            let i = 0;
            i < (item.qty || 1);
            i++
          ) {
            addToCart({
              ...item,
              qty: 1,
            });
          }
        });
      } catch (error) {
        if (__DEV__) {
          console.log(error);
        }
      }
    }
  }, [reorder]);

  

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * (item.qty || 1),
    0
  );

  const deliveryFee = 1;
  const platformFee = 2;
  const discount = couponApplied ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal + deliveryFee + platformFee - discount;



  const handleCheckout = () => {
    if (cart.length === 0) {
      Alert.alert('Cart is empty');
      return;
    }

    // 🔥 OPEN MAP FIRST
    router.push('/select-location');
  };
  const handleCoupon = () => {
    if (coupon.trim().toUpperCase() === 'FRESH10') {
      setCouponApplied(true);
      Alert.alert('Coupon Applied!', '10% discount added.');
    } else {
      Alert.alert('Invalid Coupon', 'Please enter a valid code.');
    }
  };

  

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />

      {}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
        >
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.topTitle}>My Cart</Text>
          <Text style={styles.topSub}>
            {cart.length} {cart.length === 1 ? 'item' : 'items'}
          </Text>
        </View>
        <View style={styles.deliveryBadge}>
          <Text style={styles.deliveryBadgeText}>🚀 10 mins</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {}
        {cart.length === 0 ? (
          <View style={styles.emptyCart}>
            <Text style={styles.emptyEmoji}>🛒</Text>
            <Text style={styles.emptyTitle}>Your cart is empty</Text>
            <Text style={styles.emptySub}>
              Add fresh items to get started
            </Text>
            <TouchableOpacity
              style={styles.shopBtn}
              onPress={() => router.back()}
            >
              <Text style={styles.shopBtnText}>Browse Products</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {}
            <View style={styles.itemsSection}>
              {cart.map((item, index) => (
                <View key={index} style={styles.card}>
                  <Image
                    source={{ uri: item.image }}
                    style={styles.image}
                  />

                  <View style={styles.info}>
                    <Text style={styles.name} numberOfLines={2}>
                      {item.name}
                    </Text>
                    <Text style={styles.price}>
                      ₹{item.price}
                      <Text style={styles.perUnit}> / unit</Text>
                    </Text>

                    <View style={styles.qtyRow}>
                      <TouchableOpacity
                        style={styles.qtyBtn}
                        onPress={() => decreaseQty(item.name)}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.qtyBtnText}>−</Text>
                      </TouchableOpacity>

                      <Text style={styles.qtyNumber}>
                        {item.qty || 1}
                      </Text>

                      <TouchableOpacity
                        style={[styles.qtyBtn, styles.qtyBtnAdd]}
                        onPress={() => increaseQty(item.name)}
                        activeOpacity={0.8}
                      >
                        <Text style={[styles.qtyBtnText, styles.qtyBtnAddText]}>
                          +
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {}
                  <Text style={styles.itemTotal}>
                    ₹{item.price * (item.qty || 1)}
                  </Text>
                </View>
              ))}
            </View>

            {}
            <View style={styles.couponBox}>
              <Text style={styles.couponLabel}>🎟  Apply Coupon</Text>
              <View style={styles.couponRow}>
                <TextInput
                  placeholder="Enter coupon code"
                  placeholderTextColor="#9ca3af"
                  style={styles.couponInput}
                  value={coupon}
                  onChangeText={setCoupon}
                  autoCapitalize="characters"
                  editable={!couponApplied}
                />
                <TouchableOpacity
                  style={[
                    styles.couponApplyBtn,
                    couponApplied && styles.couponApplied,
                  ]}
                  onPress={handleCoupon}
                  disabled={couponApplied}
                >
                  <Text style={styles.couponApplyText}>
                    {couponApplied ? '✓ Applied' : 'Apply'}
                  </Text>
                </TouchableOpacity>
              </View>
              {couponApplied && (
                <Text style={styles.couponSuccess}>
                  FRESH10 applied — ₹{discount} saved!
                </Text>
              )}
            </View>

            {}
            <View style={styles.billBox}>
              <Text style={styles.billTitle}>Bill Details</Text>

              <View style={styles.divider} />

              <View style={styles.billRow}>
                <Text style={styles.billLabel}>
                  Subtotal ({cart.length} items)
                </Text>
                <Text style={styles.billValue}>₹{subtotal}</Text>
              </View>

              <View style={styles.billRow}>
                <Text style={styles.billLabel}>Delivery Fee</Text>
                <Text style={[styles.billValue, styles.greenText]}>
                  ₹{deliveryFee}
                </Text>
              </View>

              <View style={styles.billRow}>
                <Text style={styles.billLabel}>Platform Fee</Text>
                <Text style={styles.billValue}>₹{platformFee}</Text>
              </View>

              {couponApplied && (
                <View style={styles.billRow}>
                  <Text style={[styles.billLabel, styles.greenText]}>
                    Discount (FRESH10)
                  </Text>
                  <Text style={[styles.billValue, styles.greenText]}>
                    −₹{discount}
                  </Text>
                </View>
              )}

              <View style={styles.divider} />

              <View style={styles.billRow}>
                <Text style={styles.totalLabel}>Total Payable</Text>
                <Text style={styles.totalValue}>₹{total}</Text>
              </View>

              {couponApplied && (
                <View style={styles.savingsBanner}>
                  <Text style={styles.savingsText}>
                    🎉 You're saving ₹{discount} on this order!
                  </Text>
                </View>
              )}
            </View>
          </>
        )}

        <View style={{ height: 110 }} />
      </ScrollView>

      {}
      {cart.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.footerLeft}>
            <Text style={styles.footerAmount}>₹{total}</Text>
            <Text style={styles.footerItems}>
              {cart.length} {cart.length === 1 ? 'item' : 'items'}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.checkout}
            onPress={handleCheckout}
            activeOpacity={0.88}
          >
            <Text style={styles.checkoutText}>Proceed to Pay →</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}



const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },

  // Top Bar
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 54,
    paddingBottom: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },

  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  backIcon: {
    fontSize: 24,
    color: '#111827',
    lineHeight: 30,
  },

  topTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.4,
    textAlign: 'center',
  },

  topSub: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 1,
  },

  deliveryBadge: {
    backgroundColor: '#f0fdf4',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },

  deliveryBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#16a34a',
  },

  scrollContent: {
    padding: 16,
  },

  // Empty State
  emptyCart: {
    alignItems: 'center',
    paddingTop: 80,
    gap: 10,
  },

  emptyEmoji: {
    fontSize: 56,
    marginBottom: 8,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.3,
  },

  emptySub: {
    fontSize: 14,
    color: '#9ca3af',
  },

  shopBtn: {
    marginTop: 16,
    backgroundColor: '#052e16',
    paddingHorizontal: 28,
    paddingVertical: 13,
    borderRadius: 14,
  },

  shopBtnText: {
    color: '#4ade80',
    fontWeight: '700',
    fontSize: 14,
  },

  // Items
  itemsSection: {
    gap: 10,
    marginBottom: 14,
  },

  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f3f4f6',
    gap: 12,
  },

  image: {
    width: 76,
    height: 76,
    borderRadius: 14,
    backgroundColor: '#f9fafb',
  },

  info: {
    flex: 1,
  },

  name: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    lineHeight: 19,
    marginBottom: 3,
  },

  price: {
    fontSize: 15,
    fontWeight: '800',
    color: '#052e16',
    marginBottom: 8,
  },

  perUnit: {
    fontSize: 11,
    fontWeight: '400',
    color: '#9ca3af',
  },

  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  qtyBtn: {
    width: 30,
    height: 30,
    borderRadius: 9,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  qtyBtnAdd: {
    backgroundColor: '#052e16',
    borderColor: '#052e16',
  },

  qtyBtnText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#374151',
    lineHeight: 22,
  },

  qtyBtnAddText: {
    color: '#4ade80',
  },

  qtyNumber: {
    fontWeight: '800',
    fontSize: 15,
    color: '#111827',
    minWidth: 20,
    textAlign: 'center',
  },

  itemTotal: {
    fontSize: 14,
    fontWeight: '800',
    color: '#374151',
    alignSelf: 'flex-start',
    marginTop: 2,
  },

  // Coupon
  couponBox: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  couponLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 10,
    letterSpacing: 0.2,
  },

  couponRow: {
    flexDirection: 'row',
    gap: 10,
  },

  couponInput: {
    flex: 1,
    height: 44,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    letterSpacing: 1,
  },

  couponApplyBtn: {
    paddingHorizontal: 18,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#052e16',
    justifyContent: 'center',
    alignItems: 'center',
  },

  couponApplied: {
    backgroundColor: '#16a34a',
  },

  couponApplyText: {
    color: '#4ade80',
    fontWeight: '700',
    fontSize: 13,
  },

  couponSuccess: {
    marginTop: 8,
    fontSize: 12,
    color: '#16a34a',
    fontWeight: '600',
  },

  // Bill
  billBox: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 14,
  },

  billTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.3,
    marginBottom: 14,
  },

  divider: {
    height: 1,
    backgroundColor: '#f3f4f6',
    marginVertical: 12,
  },

  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  billLabel: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500',
  },

  billValue: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '600',
  },

  greenText: {
    color: '#16a34a',
  },

  totalLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
  },

  totalValue: {
    fontSize: 17,
    fontWeight: '800',
    color: '#052e16',
  },

  savingsBanner: {
    marginTop: 12,
    backgroundColor: '#f0fdf4',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },

  savingsText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#16a34a',
    textAlign: 'center',
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingHorizontal: 18,
    paddingVertical: 14,
    paddingBottom: 28,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },

  footerLeft: {
    flex: 1,
  },

  footerAmount: {
    fontSize: 20,
    fontWeight: '800',
    color: '#052e16',
    letterSpacing: -0.5,
  },

  footerItems: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 1,
  },

  checkout: {
    flex: 2,
    backgroundColor: '#052e16',
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: 'center',
  },

  checkoutText: {
    color: '#4ade80',
    fontWeight: '800',
    fontSize: 15,
    letterSpacing: 0.2,
  },
});