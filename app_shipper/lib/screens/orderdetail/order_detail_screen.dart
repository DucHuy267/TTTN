import 'package:flutter/material.dart';
import 'package:app_shipper/services/api_services.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:url_launcher/url_launcher.dart';

class OrderDetailScreen extends StatefulWidget {
  final String orderId;

  const OrderDetailScreen({required this.orderId, super.key});

  @override
  _OrderDetailScreenState createState() => _OrderDetailScreenState();
}

class _OrderDetailScreenState extends State<OrderDetailScreen> {
  Map<String, dynamic>? order;
  bool isLoading = true;
  bool isUpdating = false; // Trạng thái cập nhật

  @override
  void initState() {
    super.initState();
    fetchOrderDetail();
  }

  Future<void> fetchOrderDetail() async {
    try {
      final data = await ApiService.getOrderById(widget.orderId);
      if (mounted) {
        setState(() {
          order = data;
          isLoading = false;
        });
      }
    } catch (error) {
      print('Lỗi: $error');
      if (mounted) {
        setState(() {
          isLoading = false;
        });
      }
    }
  }

  // Hàm cập nhật trạng thái đơn hàng
  Future<void> _updateOrderStatus(String action) async {
    final prefs = await SharedPreferences.getInstance();
    String? shipperId = prefs.getString('user_id');

    if (shipperId == null) {
      print('Không tìm thấy user_id trong SharedPreferences');
      return;
    }

    setState(() => isUpdating = true);

    try {
      bool success = false;
      if (action == 'shipped') {
        success = await ApiService.confirmShipment(widget.orderId, shipperId);
      } else if (action == 'success') {
        success = await ApiService.confirmDelivery(widget.orderId, shipperId);
      }

      if (success && mounted) {
        setState(() {
          order!['status'] = action;
        });

      }
      else {
        print('Lỗi cập nhật trạng thái đơn hàng');
      }
    } catch (error) {
      print('Lỗi cập nhật trạng thái: $error');
    }

    if (mounted) setState(() => isUpdating = false);
  }

  // Hàm mở Google Maps với địa chỉ
  void _openMap(String address) async {
    final Uri googleMapsUri = Uri.parse("https://www.google.com/maps/search/?api=1&query=${Uri.encodeComponent(address)}");

    if (!await launchUrl(googleMapsUri, mode: LaunchMode.externalApplication)) {
      throw 'Không thể mở Google Maps';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Chi tiết đơn hàng')),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : order == null
          ? const Center(child: Text('Không tìm thấy đơn hàng'))
          : Padding(
        padding: const EdgeInsets.all(5),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildInfoCard(),
            const SizedBox(height: 8),
            _buildProductList(),
            const Spacer(),
            if (isUpdating)
              const Center(child: CircularProgressIndicator())
            else if (order!['status'] == 'processing')
              _buildConfirmButton('Nhận đơn', Colors.orange, () {
                _updateOrderStatus('shipped');
              })
            else if (order!['status'] == 'shipped')
                _buildConfirmButton('Đã giao hàng', Colors.green, () {
                  _updateOrderStatus('success');
                }),
          ],
        ),
      ),
    );
  }

  // Thông tin đơn hàng trong Card
  Widget _buildInfoCard() {
    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(6)),
      elevation: 3,
      child: Padding(
        padding: const EdgeInsets.all(10),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildInfoRow(Icons.receipt, 'Mã đơn hàng:', order!['orderId'] ?? 'Không có'),
            _buildInfoRow(Icons.person, 'Khách hàng:', order!['userInfo']?['name'] ?? 'Không có'),
            _buildInfoRow(
              Icons.location_on,
              'Địa chỉ:',
              order!['userInfo']?['address'] ?? 'Không có',
              isMultiline: true,
              isAddress: true, // Thêm biểu tượng bản đồ
            ),
            _buildCashCollection(),
            _buildInfoRow(
              Icons.info,
              'Trạng thái:',
              getOrderStatus(order!['status'] ?? 'unknown'),
              color: getStatusColor(order!['status'] ?? 'unknown'),
              isBold: true,
            ),
          ],
        ),
      ),
    );
  }

  // Danh sách sản phẩm
  Widget _buildProductList() {
    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      elevation: 3,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Sản phẩm:', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            ...(order!['products'] != null
                ? order!['products'].map<Widget>((product) {
              return ListTile(
                leading: const Icon(Icons.shopping_bag, color: Colors.blue),
                title: Text(product['productId']?['name'] ?? 'Không có tên sản phẩm'),
                trailing: Text('x${product['quantity'] ?? 0}', style: const TextStyle(fontWeight: FontWeight.bold)),
              );
            }).toList()
                : [const Text('Không có sản phẩm')]),
          ],
        ),
      ),
    );
  }

  // Hiển thị số tiền thu
  Widget _buildCashCollection() {
    String paymentMethod = order!['paymentMethod']?.toString().toLowerCase() ?? 'unknown';
    String cashCollected = (paymentMethod == 'cod')
        ? '${order!['totalPrice'] ?? 0} VNĐ'
        : '0 VNĐ';

    return _buildInfoRow(
      Icons.monetization_on,
      'Thu tiền',
      cashCollected,
      color: (paymentMethod == 'cod') ? Colors.red : Colors.green,
    );
  }

  // Widget tạo dòng thông tin có Icon và hỗ trợ xuống dòng
  Widget _buildInfoRow(IconData icon, String label, String value, {bool isBold = false, Color? color, bool isMultiline = false, bool isAddress = false}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        crossAxisAlignment: isMultiline ? CrossAxisAlignment.start : CrossAxisAlignment.center,
        children: [
          Icon(icon, size: 20, color: Colors.blue),
          const SizedBox(width: 8),
          Expanded(
            child: RichText(
              text: TextSpan(
                style: const TextStyle(fontSize: 15, color: Colors.black),
                children: [
                  TextSpan(text: label, style: const TextStyle(fontWeight: FontWeight.w500)),
                  const TextSpan(text: ' '),
                  TextSpan(
                    text: value,
                    style: TextStyle(fontWeight: isBold ? FontWeight.bold : FontWeight.normal, color: color),
                  ),
                ],
              ),
            ),
          ),
          if (isAddress && value != 'Không có')
            IconButton(
              icon: const Icon(Icons.map, color: Colors.red),
              onPressed: () => _openMap(value),
            ),
        ],
      ),
    );
  }

  // Chuyển đổi trạng thái đơn hàng sang tiếng Việt
  String getOrderStatus(String status) {
    switch (status.toLowerCase()) {
      case 'processing': return 'Chờ lấy hàng';
      case 'shipped': return 'Đang giao hàng';
      case 'success': return 'Đã giao thành công';
      default: return 'Không xác định';
    }
  }

  Color getStatusColor(String status) {
    switch (status.toLowerCase()) {
      case 'processing': return Colors.blue;
      case 'shipped': return Colors.purple;
      case 'success': return Colors.green;
      default: return Colors.grey;
    }
  }
}

// Nút xác nhận đơn hàng
Widget _buildConfirmButton(String text, Color color, VoidCallback? onPressed) {
  return SizedBox(
    width: double.infinity,
    height: 50,
    child: ElevatedButton(
      onPressed: onPressed,
      style: ElevatedButton.styleFrom(
        backgroundColor: color,
        foregroundColor: Colors.white,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        elevation: 5,
      ),
      child: Text(text, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
    ),
  );
}
