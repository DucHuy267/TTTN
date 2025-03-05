import 'package:flutter/material.dart';
import 'package:app_shipper/screens/completed/completed_screen.dart';
import 'package:app_shipper/screens/profile/profile_screen.dart';
import 'package:app_shipper/screens/working/working_screen.dart';
import 'package:app_shipper/screens/order/order_screen.dart';

class MainScreen extends StatefulWidget {
  const MainScreen({Key? key}) : super(key: key);

  @override
  _MainScreenState createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  int _selectedIndex = 0;
  final List<Widget> _screens = [
    const OrderScreen(),
    const WorkingScreen(),
    const CompletedScreen(),
    const ProfileScreen(),
  ];

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // appBar: AppBar(
      //   title: const Text('Trang chủ'),
      // ),
      body: _screens[_selectedIndex],
      bottomNavigationBar: BottomNavigationBar(
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.local_shipping),
            label: 'Đơn hàng',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.list_alt),
            label: 'Đang làm',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.check_circle),
            label: 'Đã hoàn thành',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person),
            label: 'Thông tin',
          ),
        ],
        currentIndex: _selectedIndex,
        selectedItemColor: Colors.amber[800], // Màu khi được chọn
        unselectedItemColor: Colors.grey, // Màu xám cho icon chưa được chọn
        onTap: _onItemTapped,
      ),
    );
  }
}
