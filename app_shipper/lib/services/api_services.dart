import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  static const String baseUrl = 'http://192.168.0.102:4000';

  // Hàm lấy danh sách đơn hàng theo trạng thái
  static Future<List<Map<String, dynamic>>> getOrdersByStatus(String status) async {
    try {
      final response = await http.get   (Uri.parse('$baseUrl/orders/status/$status'));

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

  static Future<bool> updateOrderStatus(String orderId, String newStatus) async {
    try {
      final response = await http.put(
        Uri.parse('$baseUrl/orders/status/$orderId'),
        headers: {"Content-Type": "application/json"},
        body: json.encode({"status": newStatus}),
      );

      if (response.statusCode == 200) {
        return true;
      } else {
        print('Lỗi cập nhật trạng thái: ${response.statusCode}');
        return false;
      }
    } catch (error) {
      print('Lỗi kết nối API: $error');
      return false;
    }
  }


  // Register function
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

  // Login function
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