import 'package:app_shipper/screens/login/login_screen.dart';
import 'package:app_shipper/screens/profile/edit_profile.dart';
import 'package:flutter/material.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Hồ sơ Shipper'),
        centerTitle: true,
        backgroundColor: Colors.blueAccent,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            _buildAvatar(),
            const SizedBox(height: 16),
            _buildProfileInfo(),
            const SizedBox(height: 160),
            _buildEditButton(context),
            const SizedBox(height: 5),
            _buildLogoutButton(context),
          ],
        ),
      ),
    );
  }

  // Widget hiển thị ảnh đại diện Shipper
  Widget _buildAvatar() {
    return CircleAvatar(
      radius: 50,
      backgroundImage: AssetImage('assets/images/avatar.jpg'), // Đổi thành ảnh thật của shipper
      backgroundColor: Colors.grey[200],
    );
  }

  // Widget hiển thị thông tin cá nhân
  Widget _buildProfileInfo() {
    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      elevation: 4,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            _buildInfoRow(Icons.person, 'Họ và tên', 'Nguyễn Văn A'),
            const Divider(),
            _buildInfoRow(Icons.phone, 'Số điện thoại', '0987 654 321'),
            const Divider(),
            _buildInfoRow(Icons.email, 'Email', 'shipper@gmail.com'),
            const Divider(),
            _buildInfoRow(Icons.location_on, 'Khu vực hoạt động', 'Hồ Chí Minh'),
          ],
        ),
      ),
    );
  }

  // Widget hiển thị dòng thông tin với icon
  Widget _buildInfoRow(IconData icon, String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        children: [
          Icon(icon, size: 20, color: Colors.blueGrey),
          const SizedBox(width: 10),
          Text(label, style: const TextStyle(fontWeight: FontWeight.bold)),
          const Spacer(),
          Text(value, style: const TextStyle(fontSize: 14)),
        ],
      ),
    );
  }

  // Widget hiển thị nút chỉnh sửa hồ sơ
  Widget _buildEditButton(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      child: ElevatedButton.icon(
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => EditProfileScreen(),
            ),
          );
        },

        icon: const Icon(Icons.edit),
        label: const Text('Chỉnh sửa hồ sơ'),
        style: ElevatedButton.styleFrom(
          backgroundColor: Colors.blueAccent,
          foregroundColor: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          padding: const EdgeInsets.symmetric(vertical: 12),
        ),
      ),
    );
  }

  // Widget hiển thị nút đăng xuất
  Widget _buildLogoutButton(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      child: ElevatedButton.icon(
        onPressed: () {
          _logout(context);
        },
        icon: const Icon(Icons.logout),
        label: const Text('Đăng xuất'),
        style: ElevatedButton.styleFrom(
          backgroundColor: Colors.redAccent, // Màu đỏ cho nút đăng xuất
          foregroundColor: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          padding: const EdgeInsets.symmetric(vertical: 12),
        ),
      ),
    );
  }

// Hàm xử lý đăng xuất
  void _logout(BuildContext context) {
    // Hiển thị thông báo xác nhận đăng xuất
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Xác nhận'),
          content: const Text('Bạn có chắc chắn muốn đăng xuất không?'),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop(); // Đóng hộp thoại
              },
              child: const Text('Hủy'),
            ),
            TextButton(
              onPressed: () {
                Navigator.of(context).pop(); // Đóng hộp thoại trước
                _performLogout(context);
              },
              child: const Text('Đăng xuất', style: TextStyle(color: Colors.red)),
            ),
          ],
        );
      },
    );
  }

// Xử lý đăng xuất thực tế
  void _performLogout(BuildContext context) {
    // TODO: Thêm logic xóa token hoặc thông tin đăng nhập tại đây

    // Quay về màn hình đăng nhập
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => LoginScreen(),
      ),
    );
  }


}
