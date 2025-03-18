import 'package:app_shipper/screens/login/login_screen.dart';
import 'package:app_shipper/screens/profile/edit_profile.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:app_shipper/services/api_services.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({Key? key}) : super(key: key);

  @override
  _ProfileScreenState createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  Map<String, dynamic>? userData;
  bool _isLoading = true;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _fetchUserProfile();
  }

  // Hàm lấy thông tin người dùng từ API
  Future<void> _fetchUserProfile() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final prefs = await SharedPreferences.getInstance();
      String? userId = prefs.getString('user_id'); // 🔥 Đúng: lấy 'user_id' thay vì 'token'

      if (userId != null) {
        final response = await ApiService.getUserById(userId);

        if (response != null && response.isNotEmpty) {
          setState(() {
            userData = response;
            _isLoading = false;
          });
        } else {
          setState(() {
            _errorMessage = 'Không tìm thấy thông tin người dùng';
            _isLoading = false;
          });
        }
      } else {
        setState(() {
          _errorMessage = 'Không tìm thấy userId';
          _isLoading = false;
        });
      }
    } catch (error) {
      setState(() {
        _errorMessage = 'Lỗi khi tải thông tin người dùng';
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Hồ sơ Shipper'),
        centerTitle: true,
        backgroundColor: Colors.blueAccent,
        elevation: 0,
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator()) // Hiển thị loading
          : _errorMessage != null
          ? Center(child: Text(_errorMessage!)) // Hiển thị lỗi
          : userData == null
          ? const Center(child: Text("Không có dữ liệu người dùng")) // Kiểm tra userData
          : _buildProfileUI(),
    );
  }

  // Hiển thị thông tin cá nhân từ API
  Widget _buildProfileUI() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          CircleAvatar(
            radius: 50,
            backgroundImage: userData?['avatarUrl'] != null
                ? NetworkImage(userData!['avatarUrl']) // Ảnh từ API
                : const AssetImage('assets/images/avatar.jpg') as ImageProvider,
            backgroundColor: Colors.grey[200],
          ),
          const SizedBox(height: 16),
          Card(
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            elevation: 4,
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start, // Căn trái thông tin
                children: [
                  _buildInfoRow(Icons.person, 'Họ và tên', userData?['name'] ?? 'Chưa có dữ liệu'),
                  const Divider(),
                  _buildInfoRow(Icons.phone, 'Số điện thoại', userData?['phone'] ?? 'Chưa có dữ liệu'),
                  const Divider(),
                  _buildInfoRow(Icons.email, 'Email', userData?['email'] ?? 'Chưa có dữ liệu'),
                  const Divider(),
                  _buildInfoRow(Icons.location_on, 'Khu vực hoạt động', userData?['address'] ?? 'Chưa có dữ liệu'),
                ],
              ),
            ),
          ),
          const SizedBox(height: 20),
          _buildEditButton(),
          const SizedBox(height: 10),
          _buildLogoutButton(),
        ],
      ),
    );
  }


  // Widget hiển thị dòng thông tin với icon
  Widget _buildInfoRow(IconData icon, String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start, // Căn text về phía trên để canh chỉnh đẹp hơn
        children: [
          Icon(icon, size: 20, color: Colors.blueGrey),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(label, style: const TextStyle(fontWeight: FontWeight.bold)),
                const SizedBox(height: 4),
                Text(
                  value,
                  style: const TextStyle(fontSize: 14, color: Colors.black87),
                  softWrap: true, // Cho phép xuống dòng
                  overflow: TextOverflow.visible, // Hiển thị toàn bộ nội dung
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }


  // Nút chỉnh sửa hồ sơ
  Widget _buildEditButton() {
    return SizedBox(
      width: double.infinity,
      child: ElevatedButton.icon(
        onPressed: () async {
          final result = await Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => EditProfileScreen()),
          );
          // Nếu cập nhật thành công, làm mới dữ liệu hồ sơ
          if (result == true) {
            _fetchUserProfile();
          }
        },
        icon: const Icon(Icons.edit),
        label: const Text('Chỉnh sửa hồ sơ'),
        style: ElevatedButton.styleFrom(
          backgroundColor: Colors.blueAccent,
          foregroundColor: Colors.white,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          padding: const EdgeInsets.symmetric(vertical: 12),
        ),
      ),
    );
  }

  // Nút đăng xuất
  Widget _buildLogoutButton() {
    return SizedBox(
      width: double.infinity,
      child: ElevatedButton.icon(
        onPressed: () => _logout(),
        icon: const Icon(Icons.logout),
        label: const Text('Đăng xuất'),
        style: ElevatedButton.styleFrom(
          backgroundColor: Colors.redAccent,
          foregroundColor: Colors.white,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          padding: const EdgeInsets.symmetric(vertical: 12),
        ),
      ),
    );
  }

  // Hàm xử lý đăng xuất
  void _logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('auth_token'); // Xóa token
    await prefs.remove('user_id'); // Xóa userId

    // Điều hướng về màn hình đăng nhập
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(
        builder: (context) => LoginScreen(),
      ),
    );
  }

}
