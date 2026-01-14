import 'dart:html' as html;
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:sofa2slugger/services/storage.dart';

class LandingScreen extends StatefulWidget {
  const LandingScreen({super.key});

  @override
  State<LandingScreen> createState() => _LandingScreenState();
}

class _LandingScreenState extends State<LandingScreen> {
  bool _isLoading = false;

  Future<void> _handleBuy() async {
    // Smart Entry: If user has already paid, go straight to gym
    if (StorageService.isPremium) {
      context.go('/gym');
      return;
    }

    setState(() => _isLoading = true);

    try {
      final response = await html.HttpRequest.request(
        '/.netlify/functions/create-checkout',
        method: 'POST',
        requestHeaders: {'Content-Type': 'application/json'},
      );

      if (response.status == 200) {
        final data = json.decode(response.responseText ?? '{}');
        final url = data['url'];
        if (url != null) {
          html.window.location.href = url;
        }
      } else {
        throw Exception('Failed to create checkout');
      }
    } catch (e) {
      setState(() => _isLoading = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Unable to start checkout. Please try again.')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      backgroundColor: const Color(0xFF0B0B0B),
      body: SingleChildScrollView(
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 860),
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 48),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Kicker
                  Text(
                    'SOFA2SLUGGER',
                    style: TextStyle(
                      color: Colors.grey[600],
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 1.5,
                    ),
                  ),
                  const SizedBox(height: 10),

                  // Headline
                  Text(
                    'This is not a workout.\nIt\'s a practice.',
                    style: theme.textTheme.headlineLarge?.copyWith(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      height: 1.05,
                    ),
                  ),
                  const SizedBox(height: 10),

                  // Subhead
                  Text(
                    'Ten guided boxing sessions designed to bring structure, focus, and physical clarity — without noise, hype, or pressure.',
                    style: theme.textTheme.titleMedium?.copyWith(
                      color: const Color(0xFFCFCFCF),
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  const SizedBox(height: 26),

                  // Primary CTA - Buy
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: _isLoading ? null : _handleBuy,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF16A34A),
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: Text(
                        _isLoading ? 'Redirecting...' : 'Unlock All Sessions — £19.99',
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                      ),
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'One-time payment • Instant access • No subscription',
                    style: TextStyle(color: Colors.grey[500], fontSize: 12),
                  ),

                  const SizedBox(height: 32),

                  // Card: The problem
                  _buildCard(
                    'THE PROBLEM',
                    'You\'ve got energy, but nowhere clean to put it. Gyms are loud. Fitness content is performative. Motivation fades. Consistency slips.\n\nYou don\'t need more advice. You need structure.',
                  ),

                  // Card: What it is
                  _buildCard(
                    'WHAT IT IS',
                    'Sofa2Slugger is a calm, audio-led boxing practice you can do anywhere.\n\nYou follow one voice. You move deliberately. You finish something.\n\nNo screens to watch. No metrics to chase. No hype to endure. Just clear instruction and focused movement.',
                  ),

                  // Card: How it works
                  _buildCardWithList(
                    'HOW IT WORKS',
                    [
                      'Orientation — sets the rules.',
                      'Session 1 — learn the base.',
                      'Sessions 2–10 — one structured progression.',
                      '10–15 minutes per session',
                    ],
                  ),

                  // Card: Pricing
                  Container(
                    margin: const EdgeInsets.only(bottom: 18),
                    padding: const EdgeInsets.all(18),
                    decoration: BoxDecoration(
                      border: Border.all(color: const Color(0xFF242424)),
                      borderRadius: BorderRadius.circular(16),
                      color: Colors.white.withOpacity(0.02),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'PRICING',
                          style: TextStyle(
                            color: Colors.grey[600],
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 1.5,
                          ),
                        ),
                        const SizedBox(height: 12),
                        const Text(
                          '£19.99 — one-time payment',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 20,
                            fontWeight: FontWeight.w800,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'Pay once to unlock all 10 sessions. No tiers. No upsells. No subscription.',
                          style: TextStyle(color: Colors.grey[400]),
                        ),
                        const SizedBox(height: 16),
                        SizedBox(
                          width: double.infinity,
                          child: ElevatedButton(
                            onPressed: _isLoading ? null : _handleBuy,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFF16A34A),
                              foregroundColor: Colors.white,
                              padding: const EdgeInsets.symmetric(vertical: 14),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12),
                              ),
                            ),
                            child: Text(
                              _isLoading ? 'Redirecting...' : 'Unlock All Sessions — £19.99',
                              style: const TextStyle(fontWeight: FontWeight.bold),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 32),

                  // Footer
                  Center(
                    child: Text(
                      'Sofa2Slugger',
                      style: TextStyle(color: Colors.grey[700], fontSize: 12),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildCard(String title, String content) {
    return Container(
      margin: const EdgeInsets.only(bottom: 18),
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        border: Border.all(color: const Color(0xFF242424)),
        borderRadius: BorderRadius.circular(16),
        color: Colors.white.withOpacity(0.02),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: TextStyle(
              color: Colors.grey[600],
              fontSize: 12,
              fontWeight: FontWeight.bold,
              letterSpacing: 1.5,
            ),
          ),
          const SizedBox(height: 12),
          Text(
            content,
            style: TextStyle(color: Colors.grey[300], height: 1.5),
          ),
        ],
      ),
    );
  }

  Widget _buildCardWithList(String title, List<String> items) {
    return Container(
      margin: const EdgeInsets.only(bottom: 18),
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        border: Border.all(color: const Color(0xFF242424)),
        borderRadius: BorderRadius.circular(16),
        color: Colors.white.withOpacity(0.02),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: TextStyle(
              color: Colors.grey[600],
              fontSize: 12,
              fontWeight: FontWeight.bold,
              letterSpacing: 1.5,
            ),
          ),
          const SizedBox(height: 12),
          ...items.map((item) => Padding(
            padding: const EdgeInsets.only(bottom: 6),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('• ', style: TextStyle(color: Colors.grey[400])),
                Expanded(
                  child: Text(
                    item,
                    style: TextStyle(color: Colors.grey[300]),
                  ),
                ),
              ],
            ),
          )),
        ],
      ),
    );
  }
}
