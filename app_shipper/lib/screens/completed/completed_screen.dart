import 'package:app_shipper/screens/orderdetail/order_detail_screen.dart';
import 'package:flutter/material.dart';
import 'package:app_shipper/services/api_services.dart';
import 'package:shared_preferences/shared_preferences.dart';

class CompletedScreen extends StatefulWidget {
  const CompletedScreen({super.key});

  @override
  _CompletedScreenState createState() => _CompletedScreenState();
}

class _CompletedScreenState extends State<CompletedScreen> {
  List<Map<String, dynamic>> orders = [];
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    fetchOrders();
  }

  Future<void> fetchOrders() async {
    final prefs = await SharedPreferences.getInstance();
    String? userId = prefs.getString('user_id');

    if (userId == null) {
      print('Không tìm thấy user_id trong SharedPreferences');
      return;
    }
    try {
      List<Map<String, dynamic>> data = await ApiService.getOrdersByStatusAndShipper("success", userId);
      if (mounted) {
        setState(() {
          orders = data;
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Đơn hàng đã hoàn thành'),
        centerTitle: true,
        backgroundColor: Colors.green,
        elevation: 0,
      ),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : orders.isEmpty
          ? const Center(child: Text('Không có đơn hàng nào đã hoàn thành'))
          : ListView.builder(
        padding: const EdgeInsets.all(10),
        itemCount: orders.length,
        itemBuilder: (context, index) {
          var order = orders[index];
          return _buildOrderCard(order);
        },
      ),
    );
  }

  // Widget tạo Card hiển thị đơn hàng hoàn thành
  Widget _buildOrderCard(Map<String, dynamic> order) {
    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => OrderDetailScreen(orderId: order['_id']),
          ),
        );
      },
      child: Card(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        elevation: 5,
        margin: const EdgeInsets.symmetric(vertical: 8),
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildOrderHeader(order),
              const Divider(),
              _buildOrderInfoRow(Icons.attach_money, 'Giá tiền:', '${order['totalPrice']} VNĐ'),
              _buildOrderInfoRow(Icons.payment, 'Thanh toán:', order['paymentMethod'] ?? 'Chưa xác định'),
              _buildOrderStatus(),
            ],
          ),
        ),
      ),
    );
  }

  // Header hiển thị mã đơn hàng đẹp hơn
  Widget _buildOrderHeader(Map<String, dynamic> order) {
    return Row(
      children: [
        const Icon(Icons.receipt_long, size: 20, color: Colors.green),
        const SizedBox(width: 8),
        Expanded(
          child: Text(
            'Mã đơn: ${order['orderId']}',
            style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            overflow: TextOverflow.ellipsis,
          ),
        ),
        IconButton(
          icon: const Icon(Icons.copy, size: 18, color: Colors.grey),
          onPressed: () {
            _copyToClipboard(order['orderId']);
          },
        ),
      ],
    );
  }

  // Widget hiển thị dòng thông tin có icon
  Widget _buildOrderInfoRow(IconData icon, String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        children: [
          Icon(icon, size: 18, color: Colors.blueGrey),
          const SizedBox(width: 8),
          Text(label, style: const TextStyle(fontWeight: FontWeight.bold)),
          const SizedBox(width: 4),
          Expanded(
            child: Text(
              value,
              overflow: TextOverflow.ellipsis,
              maxLines: 1,
              style: const TextStyle(fontSize: 14),
            ),
          ),
        ],
      ),
    );
  }

  // Widget hiển thị trạng thái hoàn thành với icon xanh lá
  Widget _buildOrderStatus() {
    return Container(
      margin: const EdgeInsets.only(top: 8),
      padding: const EdgeInsets.symmetric(vertical: 6, horizontal: 12),
      decoration: BoxDecoration(
        color: Colors.green.withOpacity(0.2),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: const [
          Icon(Icons.check_circle, size: 16, color: Colors.green),
          SizedBox(width: 6),
          Text(
            'Đã giao thành công',
            style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Colors.green),
          ),
        ],
      ),
    );
  }

  // Hàm copy mã đơn vào clipboard
  void _copyToClipboard(String text) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Đã sao chép mã đơn: $text'),
        duration: const Duration(seconds: 2),
        backgroundColor: Colors.green,
      ),
    );
  }
}
