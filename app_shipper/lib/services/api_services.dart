import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  static const String baseUrl = 'http://192.168.0.119:4000';

  // Hàm lấy danh sách đơn hàng theo trạng thái
  static Future<List<Map<String, dynamic>>> getOrdersByStatus(String status) async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/orders/status/$status'));

      if (response.statusCode == 200) {
        return List<Map<String, dynamic>>.from(json.decode(response.body));
      } else {
        throw Exception('Lỗi khi lấy danh sách đơn hàng: ${response.statusCode}');
      }
    } catch (error) {
      throw Exception('Lỗi kết nối API: $error');
    }
  }

  // Hàm lấy danh sách đơn hàng theo trạng thái và IdShipper
  static Future<List<Map<String, dynamic>>> getOrdersByStatusAndShipper(String status, String shipperId) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/orders/getOrdersByStatusAndShipperId/$status/$shipperId'),
        headers: {"Content-Type": "application/json"},
      );

      if (response.statusCode == 200) {
        return List<Map<String, dynamic>>.from(json.decode(response.body));
      } else {
        throw Exception('Lỗi khi lấy danh sách đơn hàng: ${response.statusCode}');
      }
    } catch (error) {
      throw Exception('Lỗi kết nối API: $error');
    }
  }


  // Lấy chi tiết đơn hàng theo ID
  static Future<Map<String, dynamic>> getOrderById(String orderId) async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/orders/getOrderById/$orderId'));

      if (response.statusCode == 200) {
        return json.decode(response.body)['data'];
      } else {
        throw Exception('Lỗi khi lấy chi tiết đơn hàng: ${response.statusCode}');
      }
    } catch (error) {
      throw Exception('Lỗi kết nối API: $error');
    }
  }

  // hàm cập nhật trạng thái
  // static Future<bool> updateOrderStatus(String orderId, String newStatus) async {
  //   try {
  //     final response = await http.put(
  //       Uri.parse('$baseUrl/orders/status/$orderId'),
  //       headers: {"Content-Type": "application/json"},
  //       body: json.encode({"status": newStatus}),
  //     );
  //
  //     if (response.statusCode == 200) {
  //       return true;
  //     } else {
  //       print('Lỗi cập nhật trạng thái: ${response.statusCode}');
  //       return false;
  //     }
  //   } catch (error) {
  //     print('Lỗi kết nối API: $error');
  //     return false;
  //   }
  // }

  // Hàm shipper xác nhận đang giao hàng
  static Future<bool> confirmShipment(String orderId, String shipperId) async {
    try {
      final response = await http.put(
        Uri.parse('$baseUrl/orders/confirmShipment/$orderId/$shipperId'),
        headers: {"Content-Type": "application/json"},
      );

      if (response.statusCode == 200) {
        return true;
      } else {
        print('Lỗi xác nhận giao hàng: ${response.statusCode}');
        return false;
      }
    } catch (error) {
      print('Lỗi kết nối API: $error');
      return false;
    }
  }

  // Hàm shipper xác nhận đã giao hàng
  static Future<bool> confirmDelivery(String orderId, String shipperId) async {
    try {
      final response = await http.put(
        Uri.parse('$baseUrl/orders/confirmDelivery/$orderId/$shipperId'),
        headers: {"Content-Type": "application/json"},
      );

      if (response.statusCode == 200) {
        return true;
      } else {
        print('Lỗi xác nhận đơn hàng đã giao: ${response.statusCode}');
        return false;
      }
    } catch (error) {
      print('Lỗi kết nối API: $error');
      return false;
    }
  }


  //register
  Future<Map<String, dynamic>> register(String name, String email, String password, String phone, String address) async {
    final response = await http.post(
      Uri.parse('$baseUrl/users/register'),
      headers: {"Content-Type": "application/json"},
      body: jsonEncode({
        "name": name,
        "email": email,
        "password": password,
        "phone": phone,
        "address": address,
      }),
    );
    return jsonDecode(response.body);
  }

  /// Đăng nhập shipper
  static Future<Map<String, dynamic>> login(String email, String password) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/users/login-shipper'),
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({"email": email, "password": password}),
      );

      if (response.statusCode == 200) {
        final responseData = jsonDecode(response.body);
        if (responseData['token'] != null) {
          return {'token': responseData['token'], 'user': responseData['user']};
        } else {
          return {'error': 'Token không hợp lệ'};
        }
      } else {
        return {'error': 'Email hoặc mật khẩu không đúng'};
      }
    } catch (e) {
      return {'error': 'Lỗi kết nối API: $e'};
    }
  }

  // profile
 // Hàm lấy thông tin người dùng
  static Future<Map<String, dynamic>> getUserById(String userId) async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/users/$userId'));

      if (response.statusCode == 200) {
        return json.decode(response.body);
      } else {
        throw Exception('Lỗi khi lấy thông tin người dùng: ${response.statusCode}');
      }
    } catch (error) {
      throw Exception('Lỗi kết nối API: $error');
    }
  }


  // Hàm cập nhật thông tin người dùng
  static Future<bool> updateUser(String userId, Map<String, dynamic> userData) async {
    try {
    final response = await http.put(
      Uri.parse('$baseUrl/users/$userId'),
      headers: {"Content-Type": "application/json"},
      body: jsonEncode(userData),
  );

    if (response.statusCode == 200) {
        return true; // Cập nhật thành công
      } else {
  print('Lỗi cập nhật người dùng: ${response.statusCode}');
  return false;
  }
  } catch (error) {
  print('Lỗi kết nối API: $error');
  return false;
  }
  }




}