import 'package:app_shipper/screens/orderdetail/order_detail_screen.dart';
import 'package:flutter/material.dart';
import 'package:app_shipper/services/api_services.dart';

class WorkingScreen extends StatefulWidget {
  const WorkingScreen({super.key});

  @override
  _WorkingScreenState createState() => _WorkingScreenState();
}

class _WorkingScreenState extends State<WorkingScreen> {
  List<Map<String, dynamic>> orders = [];
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    fetchOrders();
  }

  Future<void> fetchOrders() async {
    try {
      List<Map<String, dynamic>> data = await ApiService.getOrdersByStatus("delivered");
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
        title: const Text('Đơn hàng đang làm'),
        centerTitle: true,
        backgroundColor: Colors.deepPurpleAccent,
        elevation: 0,
      ),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : orders.isEmpty
          ? const Center(child: Text('Không có đơn hàng nào đang làm'))
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

  // Widget tạo Card hiển thị đơn hàng
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
              _buildOrderStatus(order['status']),
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
        const Icon(Icons.receipt_long, size: 20, color: Colors.deepPurple),
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

  // Widget hiển thị trạng thái đơn hàng với màu sắc nổi bật
  Widget _buildOrderStatus(String status) {
    String statusText = getOrderStatus(status);
    Color statusColor = getStatusColor(status);

    return Container(
      margin: const EdgeInsets.only(top: 8),
      padding: const EdgeInsets.symmetric(vertical: 6, horizontal: 12),
      decoration: BoxDecoration(
        color: statusColor.withOpacity(0.2),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(Icons.local_shipping, size: 16, color: statusColor),
          const SizedBox(width: 6),
          Text(
            statusText,
            style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: statusColor),
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

  // Chuyển đổi trạng thái đơn hàng sang tiếng Việt
  String getOrderStatus(String status) {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'Chờ xác nhận';
      case 'processing':
        return 'Đang xử lý';
      case 'delivered':
        return 'Đang giao hàng';
      case 'success':
        return 'Đã giao thành công';
      default:
        return 'Không xác định';
    }
  }

  // Màu sắc cho từng trạng thái
  Color getStatusColor(String status) {
    switch (status.toLowerCase()) {
      case 'pending':
        return Colors.orange;
      case 'processing':
        return Colors.blue;
      case 'delivered':
        return Colors.purple;
      case 'success':
        return Colors.green;
      default:
        return Colors.grey;
    }
  }
}
