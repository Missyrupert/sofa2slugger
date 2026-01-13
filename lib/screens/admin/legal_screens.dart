import 'package:flutter/material.dart';

class SimpleTextScreen extends StatelessWidget {
  final String title;
  final String content;

  const SimpleTextScreen({
    super.key,
    required this.title,
    required this.content,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(title.toUpperCase(), style: const TextStyle(fontWeight: FontWeight.bold, letterSpacing: 1.5)),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Text(
          content,
          style: const TextStyle(
            color: Colors.white70,
            fontSize: 16,
            height: 1.6,
          ),
        ),
      ),
    );
  }
}

class AboutScreen extends StatelessWidget {
  const AboutScreen({super.key});
  @override
  Widget build(BuildContext context) => const SimpleTextScreen(
    title: "About",
    content: "Sofa2Slugger is a premium audio-guided boxing program designed to take you from zero to fighter competence.\n\nBuilt on the philosophy of 'Structure over Chaos', we focus on biomechanics, rhythm, and mental fortitude.\n\nNo fluff. Just the work.",
  );
}

class ContactScreen extends StatelessWidget {
  const ContactScreen({super.key});
  @override
  Widget build(BuildContext context) => const SimpleTextScreen(
    title: "Contact",
    content: "For support, inquiries, or feedback:\n\nEmail: support@sofa2slugger.com\nWeb: www.sofa2slugger.com",
  );
}

class SafetyScreen extends StatelessWidget {
  const SafetyScreen({super.key});
  @override
  Widget build(BuildContext context) => const SimpleTextScreen(
    title: "Safety",
    content: "Consult your physician before starting this or any exercise program.\n\nBoxing involves physical exertion. Listen to your body. If you feel pain, dizziness, or shortness of breath, stop immediately.\n\nEnsure you have enough space to move safely without hitting objects or people.",
  );
}

class PrivacyScreen extends StatelessWidget {
  const PrivacyScreen({super.key});
  @override
  Widget build(BuildContext context) => const SimpleTextScreen(
    title: "Privacy Policy",
    content: "We respect your privacy.\n\n1. Data Collection: We only store your local progress on your device.\n2. Analytics: We do not track your location or personal data.\n3. Third Parties: We do not sell your data.\n\nFor full details, visit our website.",
  );
}

class TermsScreen extends StatelessWidget {
  const TermsScreen({super.key});
  @override
  Widget build(BuildContext context) => const SimpleTextScreen(
    title: "Terms & Conditions",
    content: "By using Sofa2Slugger, you agree to our terms.\n\n1. Usage: Personal use only.\n2. Liability: Sofa2Slugger is not liable for injuries sustained during training.\n3. Refunds: See our Refund Policy.\n\nPlay nice. Train hard.",
  );
}

class RefundScreen extends StatelessWidget {
  const RefundScreen({super.key});
  @override
  Widget build(BuildContext context) => const SimpleTextScreen(
    title: "Refund Policy",
    content: "We offer a 14-day money-back guarantee for the Premium Unlock if you are not satisfied with the program.\n\nTo request a refund, please contact support@sofa2slugger.com with your purchase reference.",
  );
}
